import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './GroupPayment.css'

const GroupPaymentCreator = () => {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [organizerInfo, setOrganizerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    notes: ''
  })
  const [splitType, setSplitType] = useState('equal')
  const [customMode, setCustomMode] = useState('amount') // 'amount' | 'percent'
  const [participants, setParticipants] = useState([])
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)

  const totalAmount = getTotalPrice()

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      const participant = {
        ...newParticipant,
        userId: Date.now().toString(),
        items: splitType === 'itemwise' ? [] : items,
        amount: splitType === 'equal' ? totalAmount / (participants.length + 1) : 0,
        percent: splitType === 'custom' ? 0 : undefined
      }
      setParticipants([...participants, participant])
      setNewParticipant({ name: '', email: '', phone: '' })
    }
  }

  const removeParticipant = (index) => {
    const newParticipants = participants.filter((_, i) => i !== index)
    setParticipants(newParticipants)
  }

  const updateParticipantAmount = (index, amount) => {
    const newParticipants = [...participants]
    newParticipants[index].amount = parseFloat(amount) || 0
    setParticipants(newParticipants)
  }

  const updateParticipantItems = (participantIndex, itemIndex, quantity) => {
    const newParticipants = [...participants]
    if (!newParticipants[participantIndex].items[itemIndex]) {
      newParticipants[participantIndex].items[itemIndex] = { ...items[itemIndex], quantity: 0 }
    }
    newParticipants[participantIndex].items[itemIndex].quantity = parseInt(quantity) || 0
    
    // Recalculate amount for itemwise split
    if (splitType === 'itemwise') {
      const amount = newParticipants[participantIndex].items.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)
      newParticipants[participantIndex].amount = amount
    }
    
    setParticipants(newParticipants)
  }

  const recalculateEqualSplit = () => {
    if (splitType === 'equal' && participants.length > 0) {
      const amountPerPerson = totalAmount / participants.length
      const newParticipants = participants.map(p => ({
        ...p,
        amount: Math.round(amountPerPerson * 100) / 100
      }))
      setParticipants(newParticipants)
    }
  }

  const recalcCustomPercentages = () => {
    if (splitType !== 'custom' || participants.length === 0) return
    const totalPercent = participants.reduce((s, p) => s + (Number(p.percent) || 0), 0)
    const totalAssigned = participants.reduce((s, p) => s + (Number(p.amount) || 0), 0)
    const remainingByPercent = Math.max(0, 100 - totalPercent)
    const remainingByAmount = Math.max(0, totalAmount - totalAssigned)
    const others = participants.filter(p => !(Number(p.percent) > 0 || Number(p.amount) > 0))
    const updated = participants.map(p => {
      if (Number(p.percent) > 0) {
        return { ...p, amount: Math.round((totalAmount * (Number(p.percent) / 100)) * 100) / 100 }
      }
      return p
    })
    if (others.length > 0) {
      const share = customMode === 'percent'
        ? Math.round(((remainingByPercent / others.length) / 100 * totalAmount) * 100) / 100
        : Math.round((remainingByAmount / others.length) * 100) / 100
      others.forEach(o => {
        const idx = updated.findIndex(p => p.userId === o.userId)
        if (idx >= 0) updated[idx] = { ...updated[idx], amount: share }
      })
    }
    setParticipants(updated)
  }

  const createGroupOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/group-orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `ORD_${Date.now()}`,
          restaurantId: items[0]?.restaurantId || 'default',
          organizerName: organizerInfo.name,
          organizerEmail: organizerInfo.email,
          organizerPhone: organizerInfo.phone,
          totalAmount,
          splitType,
          participants,
          deliveryAddress: organizerInfo.deliveryAddress,
          items,
          notes: organizerInfo.notes,
          paymentDeadlineHours: 24
        })
      })

      const data = await response.json()
      if (data.success) {
        clearCart()
        navigate(`/group-payment/${data.groupOrder.groupId}`)
      } else {
        alert('Failed to create group order. Please try again.')
      }
    } catch (err) {
      alert('Failed to create group order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalParticipantAmount = participants.reduce((sum, p) => sum + p.amount, 0)
  const isAmountValid = Math.abs(totalParticipantAmount - totalAmount) < 0.01

  if (items.length === 0) {
    return (
      <div className="group-payment-container">
        <div className="empty-cart">
          <h2>No Items in Cart</h2>
          <p>Add items to your cart before creating a group order.</p>
          <button onClick={() => navigate('/restaurants')} className="btn primary">
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group-payment-container">
      <div className="group-payment-header">
        <h1>Create Group Order</h1>
        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Organizer Info</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Split Type</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Add Participants</div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Review & Create</div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="items-list">
          {items.map((item, index) => (
            <div key={index} className="item">
              <span>{item.name} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="total">
          <strong>Total: ₹{totalAmount}</strong>
        </div>
      </div>

      {/* Step 1: Organizer Info */}
      {step === 1 && (
        <div className="step-content step-center-wrap">
          <h2>Organizer Information</h2>
          <div className="form-fields-center">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={organizerInfo.name}
                onChange={(e) => setOrganizerInfo({...organizerInfo, name: e.target.value})}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={organizerInfo.email}
                onChange={(e) => setOrganizerInfo({...organizerInfo, email: e.target.value})}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={organizerInfo.phone}
                onChange={(e) => setOrganizerInfo({...organizerInfo, phone: e.target.value})}
                placeholder="Your phone number"
              />
            </div>
            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea
                value={organizerInfo.deliveryAddress}
                onChange={(e) => setOrganizerInfo({...organizerInfo, deliveryAddress: e.target.value})}
                placeholder="Full delivery address"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={organizerInfo.notes}
                onChange={(e) => setOrganizerInfo({...organizerInfo, notes: e.target.value})}
                placeholder="Any special instructions or notes for the group"
                rows="2"
              />
            </div>
            <button 
              className="btn primary next"
              onClick={() => setStep(2)}
              disabled={!organizerInfo.name || !organizerInfo.email || !organizerInfo.deliveryAddress}
            >
              Next: Choose Split Type
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Split Type */}
      {step === 2 && (
        <div className="step-content">
          <h2>How would you like to split the bill?</h2>
          <div className="split-options">
            <div 
              className={`split-option ${splitType === 'equal' ? 'selected' : ''}`}
              onClick={() => setSplitType('equal')}
            >
              <div className="option-icon">⚖️</div>
              <h3>Split Equally</h3>
              <p>Divide the total amount equally among all participants</p>
              <div className="example">₹{(totalAmount / Math.max(1, participants.length + 1)).toFixed(2)} per person</div>
            </div>
            
            <div 
              className={`split-option ${splitType === 'itemwise' ? 'selected' : ''}`}
              onClick={() => setSplitType('itemwise')}
            >
              <div className="option-icon">🍽️</div>
              <h3>Split by Items</h3>
              <p>Each person pays only for items they want</p>
              <div className="example">Assign items to each participant</div>
            </div>
            
            <div 
              className={`split-option ${splitType === 'custom' ? 'selected' : ''}`}
              onClick={() => setSplitType('custom')}
            >
              <div className="option-icon">✏️</div>
              <h3>Custom Split</h3>
              <p>Manually set how much each person should pay</p>
              <div className="example">Set custom amounts</div>
            </div>
          </div>
          {splitType === 'custom' && (
            <div className="custom-mode">
              <label style={{ marginRight: 12 }}>Custom by:</label>
              <button className={`btn ${customMode === 'amount' ? 'primary' : 'secondary'}`} onClick={() => setCustomMode('amount')}>Amount</button>
              <button className={`btn ${customMode === 'percent' ? 'primary' : 'secondary'}`} style={{ marginLeft: 8 }} onClick={() => setCustomMode('percent')}>Percentage</button>
            </div>
          )}
          
          <div className="step-navigation">
            <button className="btn secondary" onClick={() => setStep(1)}>
              Previous
            </button>
            <button className="btn primary" onClick={() => setStep(3)}>
              Next: Add Participants
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Add Participants */}
      {step === 3 && (
        <div className="step-content">
          <h2>Add Participants</h2>
          
          {/* Add New Participant */}
          <div className="add-participant">
            <h3>Add New Participant</h3>
            <div className="participant-form">
              <input
                type="text"
                placeholder="Name"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                value={newParticipant.email}
                onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={newParticipant.phone}
                onChange={(e) => setNewParticipant({...newParticipant, phone: e.target.value})}
              />
              <button 
                className="btn primary add-btn"
                onClick={addParticipant}
                disabled={!newParticipant.name || !newParticipant.email}
              >
                Add Participant
              </button>
            </div>
          </div>

          {/* Participants List */}
          {participants.length > 0 && (
            <div className="participants-list">
              <h3>Participants ({participants.length})</h3>
              {participants.map((participant, index) => (
                <div key={index} className="participant-item">
                  <div className="participant-info">
                    <h4>{participant.name}</h4>
                    <p>{participant.email}</p>
                  </div>
                  
                  {splitType === 'custom' && (
                    <div className="amount-input">
                      {customMode === 'amount' ? (
                        <>
                          <label>Amount: ₹</label>
                          <input
                            type="number"
                            step="0.01"
                            value={participant.amount}
                            onChange={(e) => updateParticipantAmount(index, e.target.value)}
                          />
                        </>
                      ) : (
                        <>
                          <label>Percent: %</label>
                          <input
                            type="number"
                            step="1"
                            value={participant.percent || 0}
                            onChange={(e) => {
                              const newParticipants = [...participants]
                              newParticipants[index].percent = parseFloat(e.target.value) || 0
                              setParticipants(newParticipants)
                              recalcCustomPercentages()
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                  
                  {splitType === 'itemwise' && (
                    <div className="item-assignment">
                      <h5>Assign Items:</h5>
                      {items.map((item, itemIndex) => (
                        <div key={itemIndex} className="item-assignment-row">
                          <span>{item.name} (₹{item.price})</span>
                          <input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={participant.items[itemIndex]?.quantity || 0}
                            onChange={(e) => updateParticipantItems(index, itemIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="participant-amount">
                    Amount: ₹{participant.amount.toFixed(2)}
                  </div>
                  
                  <button 
                    className="btn danger remove-btn"
                    onClick={() => removeParticipant(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              {splitType === 'equal' && (
                <button className="btn secondary" onClick={recalculateEqualSplit}>
                  Recalculate Equal Split
                </button>
              )}
              {splitType === 'custom' && (
                <button className="btn secondary" onClick={recalcCustomPercentages}>
                  Recalculate Custom Split
                </button>
              )}
            </div>
          )}

          <div className="step-navigation">
            <button className="btn secondary" onClick={() => setStep(2)}>
              Previous
            </button>
            <button 
              className="btn primary" 
              onClick={() => setStep(4)}
              disabled={participants.length === 0}
            >
              Next: Review & Create
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Create */}
      {step === 4 && (
        <div className="step-content">
          <h2>Review Group Order</h2>
          
          <div className="review-summary">
            <div className="organizer-review">
              <h3>Organizer</h3>
              <p><strong>{organizerInfo.name}</strong></p>
              <p>{organizerInfo.email}</p>
              <p>📍 {organizerInfo.deliveryAddress}</p>
            </div>
            
            <div className="split-review">
              <h3>Split Details</h3>
              <p><strong>Type:</strong> {splitType.charAt(0).toUpperCase() + splitType.slice(1)}</p>
              <p><strong>Participants:</strong> {participants.length}</p>
              <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
              <p><strong>Participant Total:</strong> ₹{totalParticipantAmount.toFixed(2)}</p>
              {!isAmountValid && (
                <p className="error">⚠️ Participant amounts don't match total!</p>
              )}
            </div>
            
            <div className="participants-review">
              <h3>Participants</h3>
              {participants.map((participant, index) => (
                <div key={index} className="participant-review">
                  <span>{participant.name}</span>
                  <span>₹{participant.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="step-navigation">
            <button className="btn secondary" onClick={() => setStep(3)}>
              Previous
            </button>
            <button 
              className="btn primary large"
              onClick={createGroupOrder}
              disabled={!isAmountValid || loading}
            >
              {loading ? 'Creating...' : 'Create Group Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupPaymentCreator