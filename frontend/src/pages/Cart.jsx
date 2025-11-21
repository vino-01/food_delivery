import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [orderTimer, setOrderTimer] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [orderConfirmed, setOrderConfirmed] = useState(false)

  useEffect(() => {
    // Check login status
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const role = localStorage.getItem('userRole')
    
    setUser(userData)
    setIsLoggedIn(userData.id && role)

    // Check for existing order timer
    const savedTimer = localStorage.getItem('orderTimer')
    if (savedTimer && items.length > 0) {
      const timerData = JSON.parse(savedTimer)
      const elapsed = Math.floor((Date.now() - timerData.startTime) / 1000)
      const remaining = Math.max(0, 420 - elapsed) // 7 minutes = 420 seconds
      
      if (remaining > 0) {
        setTimeRemaining(remaining)
        startOrderTimer(remaining)
      } else {
        // Timer expired, confirm order
        setOrderConfirmed(true)
        localStorage.removeItem('orderTimer')
      }
    }
  }, [items.length])

  const startOrderTimer = (initialTime = 420) => {
    setTimeRemaining(initialTime)
    setOrderConfirmed(false)
    
    // Save timer to localStorage
    localStorage.setItem('orderTimer', JSON.stringify({
      startTime: Date.now() - (420 - initialTime) * 1000
    }))
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer expired, confirm order
          setOrderConfirmed(true)
          localStorage.removeItem('orderTimer')
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    setOrderTimer(timer)
  }

  const cancelOrder = () => {
    if (orderTimer) {
      clearInterval(orderTimer)
      setOrderTimer(null)
    }
    setTimeRemaining(0)
    setOrderConfirmed(false)
    localStorage.removeItem('orderTimer')
    clearCart()
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = totalItems > 0 ? 40 : 0
  const taxes = subtotal * 0.05
  const total = subtotal + deliveryFee + taxes

  const handleCheckout = () => {
    if (totalItems === 0) return
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }
    
    // Start the 7-minute timer when user proceeds to checkout
    if (!orderTimer && !orderConfirmed) {
      startOrderTimer()
    }
    
    // Proceed to payment
    navigate('/payment', { 
      state: { 
        orderDetails: {
          items,
          subtotal,
          deliveryFee,
          taxes,
          total,
          totalItems
        }
      }
    })
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  const handleSignupRedirect = () => {
    navigate('/signup')
  }

  const groupedItems = items.reduce((groups, item) => {
    const restaurant = item.restaurantName || 'Unknown Restaurant'
    if (!groups[restaurant]) {
      groups[restaurant] = []
    }
    groups[restaurant].push(item)
    return groups
  }, {})

  if (totalItems === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-content">
          <div className="empty-icon">🛒</div>
          <h1>Oops! Your cart is empty 😅</h1>
          <p>Looks like you haven't added any delicious food to your cart yet. Let's fix that!</p>
          <button onClick={() => navigate('/restaurants')} className="browse-btn">
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div className="container">
          <h1>Your Cart 🛒</h1>
          <p>{totalItems} delicious item{totalItems !== 1 ? 's' : ''} from {Object.keys(groupedItems).length} awesome restaurant{Object.keys(groupedItems).length !== 1 ? 's' : ''}</p>
          
          {/* Order Timer */}
          {timeRemaining > 0 && !orderConfirmed && (
            <div className="order-timer">
              <div className="timer-content">
                <span className="timer-icon">⏰</span>
                <div className="timer-info">
                  <h3>Quick! You can still cancel! ⏰</h3>
                  <p>Change your mind? You've got:</p>
                  <div className="timer-display">
                    <span className="timer-time">{formatTime(timeRemaining)}</span>
                  </div>
                  <button onClick={cancelOrder} className="cancel-order-btn">
                    ❌ Cancel Order
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {orderConfirmed && (
            <div className="order-confirmed">
              <div className="confirmed-content">
                <span className="confirmed-icon">✅</span>
                <div className="confirmed-info">
                  <h3>All set! 🎉</h3>
                  <p>Your order is locked in and on its way to you!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="cart-content">
          <div className="cart-items">
            {Object.entries(groupedItems).map(([restaurantName, restaurantItems]) => (
              <div key={restaurantName} className="restaurant-group">
                <div className="restaurant-header">
                  <h3>🏪 {restaurantName}</h3>
                </div>
                
                {restaurantItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <span className="item-icon"></span>
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-description">
                        {item.customizations?.specialInstructions && (
                          <span className="special-instructions">
                            📝 {item.customizations.specialInstructions}
                          </span>
                        )}
                        {item.customizations?.itemAllergens && item.customizations.itemAllergens.length > 0 && (
                          <span className="allergen-info">
                            ⚠️ Contains: {item.customizations.itemAllergens.join(', ')}
                          </span>
                        )}
                      </p>
                      <div className="item-price">₹{item.price}</div>
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="order-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-row">
                <span>Taxes (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            {!isLoggedIn && (
              <div className="login-required">
                <div className="login-prompt">
                  <span className="lock-icon">🔒</span>
                  <p>Hey! You need to login first 😊</p>
                </div>
                <div className="auth-buttons">
                  <button onClick={handleLoginRedirect} className="login-btn">
                    Let's Login! 🚀
                  </button>
                  <button onClick={handleSignupRedirect} className="signup-btn">
                    New here? Join us! ✨
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || totalItems === 0}
              className="checkout-btn"
            >
              {isCheckingOut ? (
                <>
                  <span className="loading-spinner">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span>💳</span>
                  {isLoggedIn ? 'Let\'s Pay & Eat! 💳' : 'Login to Order'}
                </>
              )}
            </button>
            
            <button
              onClick={() => navigate('/group-orders/create')}
              disabled={totalItems === 0}
              className="group-order-btn"
            >
              <span>👥</span>
              Create Group Order
            </button>
            
            <button
              onClick={clearCart}
              className="clear-cart-btn"
            >
              🗑️ Empty Cart
            </button>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔒 Login Required</h3>
              <button 
                className="modal-close"
                onClick={() => setShowLoginPrompt(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>You need to be logged in to place an order.</p>
              <div className="modal-actions">
                <button onClick={handleLoginRedirect} className="modal-btn primary">
                  🚀 Login
                </button>
                <button onClick={handleSignupRedirect} className="modal-btn secondary">
                  ✨ Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart