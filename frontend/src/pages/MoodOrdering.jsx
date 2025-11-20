import React, { useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { showToast } from '../utils/toast'
import './pages.css'

const MOODS = [
  { key: 'TIRED', label: "I'm Tired", emoji: '😴', color: '#64748b' },
  { key: 'CELEBRATING', label: "I'm Celebrating", emoji: '🎉', color: '#f59e0b' },
  { key: 'HEALTHY', label: 'I Want Healthy', emoji: '🥗', color: '#10b981' },
  { key: 'SPICY', label: 'I Want Spicy', emoji: '🌶️', color: '#ef4444' }
]

const SuggestionCard = ({ item, onAdd }) => (
  <div className='menu-item-card enhanced'>
    <div className='menu-item-header'>
      <h3>{item?.name}</h3>
      <span className='item-price'>₹{item?.price}</span>
    </div>
    {item?.description && <p className='item-description'>{item.description}</p>}
    <button className='btn primary add-to-cart-btn' onClick={() => onAdd(item)}>Add to Cart</button>
  </div>
)

const MoodOrdering = () => {
  const [mood, setMood] = useState('TIRED')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { addToCart } = useCart()

  const userEmail = useMemo(() => localStorage.getItem('userEmail') || '', [])

  const fetchSuggestions = async (selectedMood) => {
    setLoading(true)
    try {
      const res = await fetch('/api/recommendations/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, userEmail })
      })
      const json = await res.json()
      if (json.success) setData(json)
    } catch (_e) {
    } finally {
      setLoading(false)
    }
  }

  const addItem = (item) => {
    if (!item) return
    addToCart({
      name: item.name,
      price: item.price,
      restaurantId: item.restaurantId || 'mood',
      restaurantName: item.restaurantName || 'Mood Picks'
    })
    showToast(`${item.name} added to cart!`, 'success')
  }

  return (
    <div className='menu-page'>
      <div className='menu-page-header'>
        <h1>Order by Mood</h1>
        <p>Tell us how you feel. We’ll do the rest.</p>
      </div>

      <div className='category-filter' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
        {MOODS.map(m => (
          <button
            key={m.key}
            className={`filter-btn ${mood === m.key ? 'active' : ''}`}
            onClick={() => setMood(m.key)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span style={{ fontSize: 20 }}>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button className='btn primary' onClick={() => fetchSuggestions(mood)} disabled={loading}>
          {loading ? 'Finding your picks…' : 'Show Suggestions'}
        </button>
      </div>

      {data && (
        <div className='menu-items-grid' style={{ marginTop: 16 }}>
          <div className='menu-item-card enhanced'>
            <div className='menu-item-header'>
              <h3>⭐ Your Comfort Pick</h3>
            </div>
            {data.suggestions?.comfortPick ? (
              <SuggestionCard item={data.suggestions.comfortPick} onAdd={addItem} />
            ) : (
              <p>No comfort pick found.</p>
            )}
          </div>

          <div className='menu-item-card enhanced'>
            <div className='menu-item-header'>
              <h3>🔥 Trending Now</h3>
            </div>
            <div className='menu-items-grid'>
              {(data.suggestions?.trendingNow || []).map((it, idx) => (
                <SuggestionCard key={idx} item={it} onAdd={addItem} />
              ))}
            </div>
          </div>

          <div className='menu-item-card enhanced'>
            <div className='menu-item-header'>
              <h3>🎁 AI Surprise</h3>
            </div>
            {data.suggestions?.aiSurprise ? (
              <SuggestionCard item={data.suggestions.aiSurprise} onAdd={addItem} />
            ) : (
              <p>No surprise pick available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MoodOrdering


