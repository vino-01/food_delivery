import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNotifications } from '../NotificationSystem/NotificationSystem'
import './GroupPayment.css'

const GroupPaymentTracker = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { notifyPaymentReceived, showSuccess, showError } = useNotifications()
  const [groupOrder, setGroupOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '')

  useEffect(() => {
    fetchGroupOrder()
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchGroupOrder, 10000)
    return () => clearInterval(interval)
  }, [groupId])

  const fetchGroupOrder = async () => {
    try {
      const response = await fetch(`/api/group-orders/${groupId}`)
      const data = await response.json()
      
      if (data.success) {
        setGroupOrder(data.groupOrder)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to load group order details')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (participantId) => {
    try {
      // Mock payment processing
      const paymentId = `PAY_${Date.now()}`
      
      const response = await fetch(`/api/group-orders/${groupId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: participantId,
          paymentId,
          paymentStatus: 'paid'
        })
      })

      const data = await response.json()
      if (data.success) {
        setGroupOrder(data.groupOrder)
        showSuccess('Payment successful!')
        notifyPaymentReceived(groupId, 'You', data.groupOrder.participants.find(p => p.userId === participantId)?.amount)
      } else {
        showError('Payment failed. Please try again.')
      }
    } catch (err) {
      showError('Payment failed. Please try again.')
    }
  }

  const sendReminders = async () => {
    try {
      const response = await fetch(`/api/group-orders/${groupId}/remind`, {
        method: 'POST'
      })
      
      const data = await response.json()
      if (data.success) {
        showSuccess(data.message)
      }
    } catch (err) {
      showError('Failed to send reminders')
    }
  }

  const generateLinks = async () => {
    try {
      const res = await fetch(`/api/group-orders/${groupId}/generate-links`, { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        setGroupOrder({ ...groupOrder, paymentLinks: json.links })
        showSuccess('Payment links generated')
      }
    } catch (err) {
      showError('Failed to generate payment links')
    }
  }

  const isOrganizer = groupOrder && groupOrder.organizerEmail === userEmail
  const currentUser = groupOrder?.participants.find(p => p.email === userEmail)

  if (loading) {
    return (
      <div className="group-payment-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error || !groupOrder) {
    return (
      <div className="group-payment-container">
        <div className="error-state">
          <h2>Group Order Not Found</h2>
          <p>{error || 'The group order you\'re looking for doesn\'t exist.'}</p>
          <button onClick={() => navigate('/')} className="btn primary">
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const { paymentSummary } = groupOrder
  const timeRemaining = new Date(groupOrder.paymentDeadline) - new Date()
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))

  return (
    <div className="group-payment-container">
      <div className="group-payment-header">
        <h1>Group Order: {groupOrder.groupId}</h1>
        <div className="order-status">
          <span className={`status-badge ${groupOrder.status}`}>
            {groupOrder.status.charAt(0).toUpperCase() + groupOrder.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="payment-summary-card">
        <h2>Payment Summary</h2>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-value">₹{groupOrder.totalAmount}</span>
            <span className="stat-label">Total Amount</span>
          </div>
          <div className="stat">
            <span className="stat-value">₹{paymentSummary.totalPaid}</span>
            <span className="stat-label">Paid</span>
          </div>
          <div className="stat">
            <span className="stat-value">₹{paymentSummary.totalPending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-value">{paymentSummary.completionPercentage}%</span>
            <span className="stat-label">Complete</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${paymentSummary.completionPercentage}%` }}
          ></div>
        </div>

        <div className="deadline-info">
          <span className="deadline">
            ⏰ {hoursRemaining > 0 ? `${hoursRemaining} hours remaining` : 'Payment deadline passed'}
          </span>
        </div>
      </div>

      {/* Organizer Info */}
      <div className="organizer-info">
        <h3>👤 Organized by {groupOrder.organizerName}</h3>
        <p>📧 {groupOrder.organizerEmail}</p>
        <p>📍 Delivery to: {groupOrder.deliveryAddress}</p>
        {groupOrder.notes && (
          <p className="order-notes">📝 {groupOrder.notes}</p>
        )}
      </div>

      {/* Split Details */}
      <div className="split-details">
        <h3>Split Details ({groupOrder.splitType})</h3>
        <div className="participants-list">
          {groupOrder.participants.map((participant, index) => (
            <div key={index} className={`participant-card ${participant.paymentStatus}`}>
              <div className="participant-info">
                <div className="participant-name">
                  {participant.name}
                  {participant.email === userEmail && (
                    <span className="you-badge">You</span>
                  )}
                </div>
                <div className="participant-email">{participant.email}</div>
                <div className="participant-amount">₹{participant.amount}</div>
              </div>

              <div className="payment-status">
                {participant.paymentStatus === 'paid' ? (
                  <div className="paid-status">
                    <span className="status-icon">✅</span>
                    <span>Paid</span>
                    {participant.paidAt && (
                      <div className="paid-time">
                        {new Date(participant.paidAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : participant.paymentStatus === 'failed' ? (
                  <div className="failed-status">
                    <span className="status-icon">❌</span>
                    <span>Failed</span>
                  </div>
                ) : (
                  <div className="pending-status">
                    <span className="status-icon">⏳</span>
                    <span>Pending</span>
                    {participant.email === userEmail && (
                      <button 
                        className="btn primary pay-now"
                        onClick={() => handlePayment(participant.userId)}
                        disabled={hoursRemaining <= 0}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Show items for itemwise split */}
              {groupOrder.splitType === 'itemwise' && participant.items && (
                <div className="participant-items">
                  <h4>Items:</h4>
                  {participant.items.map((item, idx) => (
                    <div key={idx} className="item">
                      {item.name} x{item.quantity} - ₹{item.price * item.quantity}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="order-items">
        <h3>Order Items</h3>
        <div className="items-list">
          {groupOrder.items.map((item, index) => (
            <div key={index} className="item-card">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organizer Actions */}
      {isOrganizer && (
        <div className="organizer-actions">
          <h3>Organizer Actions</h3>
          <div className="actions-grid">
            <button 
              className="btn secondary"
              onClick={sendReminders}
              disabled={paymentSummary.pendingParticipants === 0}
            >
              Send Reminders ({paymentSummary.pendingParticipants})
            </button>
            <button className="btn secondary" onClick={generateLinks}>
              Generate Payment Links
            </button>
            <button className="btn primary" onClick={() => navigate('/group-orders/create')}>
              Create New Group Order
            </button>
          </div>
          {groupOrder.paymentLinks && (
            <div className="links-list" style={{ marginTop: 16 }}>
              {groupOrder.paymentLinks.map((l, i) => (
                <div key={i} className="participant-review">
                  <span>{l.name}</span>
                  <a href={l.link} target="_blank" rel="noreferrer" className="btn primary" style={{ marginLeft: 8 }}>Pay ₹{l.amount}</a>
                  <span style={{ marginLeft: 8 }}>Code: {l.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current User Payment Status */}
      {currentUser && (
        <div className="user-payment-card">
          <h3>Your Payment</h3>
          <div className="user-payment-info">
            <span className="amount">Amount: ₹{currentUser.amount}</span>
            <span className={`status ${currentUser.paymentStatus}`}>
              Status: {currentUser.paymentStatus.charAt(0).toUpperCase() + currentUser.paymentStatus.slice(1)}
            </span>
            {currentUser.paymentStatus === 'pending' && hoursRemaining > 0 && (
              <button 
                className="btn primary large"
                onClick={() => handlePayment(currentUser.userId)}
              >
                Pay Your Share - ₹{currentUser.amount}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupPaymentTracker