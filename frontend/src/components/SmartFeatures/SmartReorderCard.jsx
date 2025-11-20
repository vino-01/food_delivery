import React, { useEffect, useState } from 'react'
import { getQuickReorderSuggestion } from '../../services/api'
import { useCart } from '../../context/CartContext.jsx'
import './SmartReorderCard.css'

export default function SmartReorderCard() {
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')||'{}')
    const email = user.email || user.userEmail || user.user_email
    if (!email) {
      setLoading(false)
      setError('Login to see smart reorder suggestions')
      return
    }
    async function load() {
      try {
        const data = await getQuickReorderSuggestion(email)
        setSuggestion(data.suggestion || null)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="smart-reorder-card loading">⏳ Predicting your next bite...</div>
  if (error && !suggestion) return <div className="smart-reorder-card disabled">🤖 {error}</div>
  if (!suggestion) return <div className="smart-reorder-card disabled">🤖 No reorder history yet. Start ordering to enable predictions!</div>

  const handleReorder = () => {
    suggestion.items.forEach(it => addToCart({ ...it, restaurantId: suggestion.restaurantId }))
  }

  return (
    <div className="smart-reorder-card">
      <div className="sr-header">🍽️ Smart Reorder</div>
      <div className="sr-body">
        <h4>Your {suggestion.slot} pick:</h4>
        <p className="sr-title">{suggestion.items[0].name} <span className="sr-price">₹{suggestion.items[0].price}</span></p>
        <p className="sr-meta">{suggestion.restaurantName} • Last ordered {new Date(suggestion.lastOrderedAt).toLocaleDateString()}</p>
        <p className="sr-reason">{suggestion.reason}</p>
        <button className="sr-btn" onClick={handleReorder}>🔁 Quick Reorder</button>
      </div>
    </div>
  )
}
