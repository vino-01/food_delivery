import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderTracking.css';
import { getOrder } from '../services/api';
import { showInfoToast } from '../utils/toast';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const orderSteps = [
    { id: 0, title: 'Waiting to Accept', description: 'Restaurant will accept shortly', icon: '🕓' },
    { id: 1, title: 'Accepted', description: 'Restaurant accepted your order', icon: '✅' },
    { id: 2, title: 'Preparing', description: 'Food is being prepared', icon: '👨‍🍳' },
    { id: 3, title: 'Ready', description: 'Food ready for handoff', icon: '🍽️' },
    { id: 4, title: 'Delivered', description: 'Enjoy your meal!', icon: '🎉' }
  ];
  const prevStatusRef = useRef(null)

  useEffect(() => {
    const statusToStep = {
      'pending': 0,
      'confirmed': 1,
      'preparing': 2,
      'ready': 3,
      'delivered': 4,
      'cancelled': 4
    }
    let interval
    const fetchOrderLive = async () => {
      try {
        const data = await getOrder(orderId)
        const normalized = {
          id: data._id || data.id || orderId,
          items: data.items || [],
          total: data.total || 0,
          status: data.status,
          orderTime: data.createdAt,
          restaurant: { name: data.restaurantId || 'Restaurant', address: 'Perundurai', phone: '' },
          deliveryFee: 0,
          grandTotal: data.total || 0,
          deliveryAddress: 'Your saved address'
        }
        setOrder(normalized)
        setCurrentStep(statusToStep[normalized.status] || 0)
        if (prevStatusRef.current && prevStatusRef.current !== normalized.status) {
          showInfoToast(`Order status: ${normalized.status}`)
        }
        prevStatusRef.current = normalized.status
      } catch (e) {
        console.warn('Failed to fetch order', e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrderLive()
    interval = setInterval(fetchOrderLive, 5000)
    return () => interval && clearInterval(interval)
  }, [orderId])

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-tracking-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-container">
        <div className="error-state">
          <h2>Order not found</h2>
          <p>The order you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-container">
      <div className="order-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <h1>Order Tracking</h1>
        <div className="order-id">Order #{order.id}</div>
      </div>

      <div className="tracking-content">
        {/* Order Status */}
        <div className="order-status-card">
          <div className="status-header">
            <h2>Order Status</h2>
            <div className="estimated-time">
              <span className="time-icon">⏱️</span>
              <span>Estimated delivery: {order.estimatedDelivery}</span>
            </div>
          </div>
          
          <div className="progress-steps">
            {orderSteps.map((step, index) => (
              <div key={step.id} className={`step ${getStepStatus(step.id)}`}>
                <div className="step-icon">
                  <span className="icon">{step.icon}</span>
                  {getStepStatus(step.id) === 'completed' && (
                    <span className="checkmark">✓</span>
                  )}
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < orderSteps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Person Info */}
        {order.deliveryPerson && (
          <div className="delivery-person-card">
            <h3>Your Delivery Partner</h3>
            <div className="delivery-person-info">
              <div className="person-avatar">
                <span>👨‍💼</span>
              </div>
              <div className="person-details">
                <h4>{order.deliveryPerson.name}</h4>
                <div className="person-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating">{order.deliveryPerson.rating}</span>
                </div>
                <a href={`tel:${order.deliveryPerson.phone}`} className="call-btn">
                  📞 Call
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="order-details-card">
          <h3>Order Details</h3>
          
          <div className="restaurant-info">
            <h4>{order.restaurant.name}</h4>
            <p>{order.restaurant.address}</p>
            <a href={`tel:${order.restaurant.phone}`} className="call-btn">
              📞 Call Restaurant
            </a>
          </div>

          <div className="order-items">
            <h4>Items Ordered</h4>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{order.total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{order.grandTotal}</span>
            </div>
          </div>

          <div className="delivery-address">
            <h4>Delivery Address</h4>
            <p>{order.deliveryAddress}</p>
          </div>

          <div className="order-time">
            <p>Order placed at: {formatTime(order.orderTime)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => navigate('/my-orders')}>
            View All Orders
          </button>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Order Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
