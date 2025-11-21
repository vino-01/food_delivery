import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/api'
import './Payment.css'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentDetails, setPaymentDetails] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [user, setUser] = useState(null)

  const orderDetails = location.state?.orderDetails

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (!userData.id) {
      navigate('/login')
      return
    }
    setUser(userData)

    // Check if order details exist
    if (!orderDetails) {
      navigate('/cart')
      return
    }
  }, [navigate, orderDetails])

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method)
    setPaymentDetails({})
  }

  const handleInputChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validatePaymentDetails = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method')
      return false
    }

    if (selectedPaymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        alert('Please fill in all card details')
        return false
      }
    } else if (selectedPaymentMethod === 'upi') {
      if (!paymentDetails.upiId) {
        alert('Please enter UPI ID')
        return false
      }
    } else if (selectedPaymentMethod === 'netbanking') {
      if (!paymentDetails.bankName) {
        alert('Please select a bank')
        return false
      }
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validatePaymentDetails()) return

    setIsProcessing(true)

    try {
      // Simulate payment processing UI
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Group items by restaurant for per-restaurant orders
      const itemsByRestaurant = orderDetails.items.reduce((acc, it) => {
        const rid = it.restaurantId || 'unknown'
        acc[rid] = acc[rid] || []
        acc[rid].push(it)
        return acc
      }, {})

      const summaries = []
      for (const [rid, ridItems] of Object.entries(itemsByRestaurant)) {
        const subtotalGroup = ridItems.reduce((s, i) => s + i.price * i.quantity, 0)
        const deliveryFeeGroup = ridItems.length > 0 ? 40 : 0
        const taxesGroup = subtotalGroup * 0.05
        const totalGroup = subtotalGroup + deliveryFeeGroup + taxesGroup
        let backendOk = false
        try {
          await createOrder({
            restaurantId: rid,
            items: ridItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
            userName: user.name,
            userEmail: user.email
          })
          backendOk = true
        } catch (apiErr) {
          console.warn(`Order API failed for ${rid}; using local fallback`, apiErr)
        }

        const orderLocal = {
          id: `ORD${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
          restaurantId: rid,
          customerId: user.id,
          customerName: user.name,
          customerMobile: user.mobile,
          customerEmail: user.email,
          items: ridItems,
          subtotal: subtotalGroup,
          deliveryFee: deliveryFeeGroup,
          taxes: taxesGroup,
          total: totalGroup,
          paymentMethod: selectedPaymentMethod,
          paymentDetails: paymentDetails,
          status: 'pending',
          orderTime: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
          backendPersisted: backendOk
        }
        const lsKey = `restaurant_orders_${rid}`
        const existing = JSON.parse(localStorage.getItem(lsKey) || '[]')
        existing.push(orderLocal)
        localStorage.setItem(lsKey, JSON.stringify(existing))
        summaries.push(orderLocal)
        window.dispatchEvent(new CustomEvent('orderPlaced', { detail: orderLocal }))
      }

      // Clear cart after all orders created
      clearCart()
      setOrderPlaced(true)
      localStorage.setItem('lastOrderSummaries', JSON.stringify(summaries))

    } catch (error) {
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackToCart = () => {
    navigate('/cart')
  }

  const handleViewOrders = () => {
    navigate('/profile')
  }

  if (!orderDetails || !user) {
    return null
  }

  if (orderPlaced) {
    return (
      <div className="payment-success">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been confirmed and is being prepared</p>
          
          <div className="order-summary">
            <h3>Order Details</h3>
            <div className="summary-item">
              <span>Order ID:</span>
              <span>Multiple restaurants order</span>
            </div>
            <div className="summary-item">
              <span>Total Amount:</span>
              <span>₹{orderDetails.total.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Payment Method:</span>
              <span>{selectedPaymentMethod.toUpperCase()}</span>
            </div>
            <div className="summary-item">
              <span>Estimated Delivery:</span>
              <span>45 minutes</span>
            </div>
          </div>

          <div className="success-actions">
            <button onClick={handleViewOrders} className="view-orders-btn">
              📋 View My Orders
            </button>
            <button onClick={() => navigate('/restaurants')} className="order-more-btn">
              Order More Food
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <div className="container">
          <button onClick={handleBackToCart} className="back-btn">
            ← Back to Cart
          </button>
          <h1>Complete Your Order</h1>
          <p>Choose your preferred payment method and complete the order</p>
        </div>
      </div>

      <div className="container">
        <div className="payment-content">
          <div className="payment-section">
            <div className="section-header">
              <h2>💳 Payment Method</h2>
              <p>Select how you'd like to pay for your order</p>
            </div>

            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => handlePaymentMethodChange('card')}
                />
                <label htmlFor="card" className="method-label">
                  <div className="method-icon">💳</div>
                  <div className="method-info">
                    <h3>Credit/Debit Card</h3>
                    <p>Pay with Visa, MasterCard, or RuPay</p>
                  </div>
                </label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={() => handlePaymentMethodChange('upi')}
                />
                <label htmlFor="upi" className="method-label">
                  <div className="method-icon">📱</div>
                  <div className="method-info">
                    <h3>UPI</h3>
                    <p>Pay with any UPI app (GPay, PhonePe, etc.)</p>
                  </div>
                </label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="netbanking"
                  name="paymentMethod"
                  value="netbanking"
                  checked={selectedPaymentMethod === 'netbanking'}
                  onChange={() => handlePaymentMethodChange('netbanking')}
                />
                <label htmlFor="netbanking" className="method-label">
                  <div className="method-icon">🏦</div>
                  <div className="method-info">
                    <h3>Net Banking</h3>
                    <p>Pay directly from your bank account</p>
                  </div>
                </label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={selectedPaymentMethod === 'cod'}
                  onChange={() => handlePaymentMethodChange('cod')}
                />
                <label htmlFor="cod" className="method-label">
                  <div className="method-icon">💰</div>
                  <div className="method-info">
                    <h3>Cash on Delivery</h3>
                    <p>Pay when your food arrives</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Details Forms */}
            {selectedPaymentMethod === 'card' && (
              <div className="payment-details">
                <h3>Card Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      value={paymentDetails.cardNumber || ''}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={paymentDetails.expiryDate || ''}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength="4"
                      value={paymentDetails.cvv || ''}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentDetails.cardholderName || ''}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'upi' && (
              <div className="payment-details">
                <h3>UPI Details</h3>
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="username@upi"
                    value={paymentDetails.upiId || ''}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'netbanking' && (
              <div className="payment-details">
                <h3>Bank Details</h3>
                <div className="form-group">
                  <label>Select Bank</label>
                  <select
                    value={paymentDetails.bankName || ''}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                  >
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="yes">Yes Bank</option>
                  </select>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'cod' && (
              <div className="payment-details">
                <h3>Cash on Delivery</h3>
                <p className="cod-info">
                  💡 Cash on Delivery selected. Payment split per restaurant will be collected by each delivery.
                </p>
              </div>
            )}
          </div>

          <div className="order-summary-section">
            <div className="summary-header">
              <h2>📋 Order Summary</h2>
            </div>
            
            <div className="summary-content">
              <div className="restaurant-info">
                <h3>🏪 {orderDetails.items[0]?.restaurantName || 'Restaurant'}</h3>
                <p>{orderDetails.totalItems} items</p>
              </div>

              <div className="items-list">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span className="item-name">{item.name} × {item.quantity}</span>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{orderDetails.subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>₹{orderDetails.deliveryFee}</span>
                </div>
                <div className="summary-row">
                  <span>Taxes (5%)</span>
                  <span>₹{orderDetails.taxes.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{orderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedPaymentMethod}
                className="place-order-btn"
              >
                {isProcessing ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Place Order - ₹{orderDetails.total.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
