import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CustomerProfile.css'
import './pages.css' // Import general page styles
import { showToast } from '../utils/toast' // Assuming showToast is available for notifications

const CustomerProfile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const role = localStorage.getItem('userRole')
    
    if (!userData.id || role !== 'customer') {
      navigate('/login')
      return
    }

    setUser(userData)
    setEditForm({
      name: userData.name || '',
      email: userData.email || '',
      mobile: userData.mobile || '',
      address: userData.address || ''
    })
    
    // Load user's rating from localStorage
    const savedRating = localStorage.getItem(`userRating_${userData.id}`)
    if (savedRating) {
      setUserRating(parseFloat(savedRating))
    }
    
    // Load real orders from localStorage (from cart context or orders)
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const realOrders = JSON.parse(localStorage.getItem(`userOrders_${userData.id}`) || '[]')
    
    // Combine real orders with some sample data for demonstration
    const allOrders = [
      ...realOrders,
      ...(cartItems.length > 0 ? [{
        id: `CART_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        restaurant: 'Current Cart',
        items: cartItems.map(item => item.name),
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'In Cart',
        rating: 0
      }] : [])
    ]
    
    setOrders(allOrders)
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    localStorage.removeItem('authToken')
    window.dispatchEvent(new CustomEvent('userLoggedOut'))
    navigate('/')
    showToast('Logged out successfully!', 'info')
  }

  const handleEditProfile = () => {
    setEditingProfile(true)
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      address: user.address || ''
    })
  }

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...editForm }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setEditingProfile(false)
    setEditForm({})
    showToast('Profile updated successfully!', 'success')
  }

  const handleCancelEdit = () => {
    setEditingProfile(false)
    setEditForm({})
    showToast('Profile edit cancelled.', 'info')
  }

  const handleRatingChange = (newRating) => {
    setUserRating(newRating)
    // Save rating to localStorage
    localStorage.setItem(`userRating_${user.id}`, newRating.toString())
    setShowRatingModal(false)
    showToast(`You rated ${newRating} stars!`, 'success')
  }

  const formatJoinDate = (joinDate) => {
    if (!joinDate) return 'Recently joined'
    
    try {
      const date = new Date(joinDate)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 30) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} month${months > 1 ? 's' : ''} ago`
      } else {
        const years = Math.floor(diffDays / 365)
        return `${years} year${years > 1 ? 's' : ''} ago`
      }
    } catch {
      return 'Recently joined'
    }
  }

  const getRealOrderCount = () => {
    // Count actual orders (excluding cart items)
    return orders.filter(order => order.status !== 'In Cart').length
  }

  if (loading) {
    return (
      <div className="page loading-state">
        <span className="loading-spinner">🔄</span>
        <h2>Loading Your Profile...</h2>
        <p>Please wait while we load your personal data.</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page error-state">
        <h2>Profile Not Available</h2>
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-icon">👤</span>
              </div>
              <div className="profile-info">
                <h1>{user.name || 'Customer'}</h1>
                <p className="profile-email">{user.email || 'No email provided'}</p>
                <p className="profile-phone">📱 {user.mobile || 'No phone provided'}</p>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{getRealOrderCount()}</span>
                    <span className="stat-label">Orders</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number" style={{ cursor: 'pointer' }} onClick={() => setShowRatingModal(true)}>
                      {userRating > 0 ? `${userRating}★` : 'Set Rating'}
                    </span>
                    <span className="stat-label">Your Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{formatJoinDate(user.joinDate)}</span>
                    <span className="stat-label">Member Since</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <div className="container tabs-container">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
              👤 Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
              📋 Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
              ❤️ Favorites
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
              ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div className="container">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-card card">
                <div className="card-header">
                  <h2>Personal Information</h2>
                  <button onClick={handleEditProfile} className="btn btn-secondary edit-btn">
                    ✏️ Edit
                  </button>
                </div>
                {editingProfile ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        value={editForm.mobile}
                        onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                    <div className="form-actions">
                      <button onClick={handleSaveProfile} className="btn btn-primary save-btn">
                        💾 Save Changes
                      </button>
                      <button onClick={handleCancelEdit} className="btn btn-secondary cancel-btn">
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid">
                    <div className="info-item">
                      <label className="text-muted">Full Name</label>
                      <span>{user.name || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label className="text-muted">Email</label>
                      <span>{user.email || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label className="text-muted">Phone</label>
                      <span>{user.mobile || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label className="text-muted">Address</label>
                      <span>{user.address || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label className="text-muted">Member Since</label>
                      <span>{formatJoinDate(user.joinDate)}</span>
                    </div>
                    <div className="info-item">
                      <label className="text-muted">Total Orders</label>
                      <span>{getRealOrderCount()} orders</span>
                    </div>
                    <div className="info-item">
                      <label className="text-muted">Your Rating</label>
                      <span style={{ cursor: 'pointer' }} onClick={() => setShowRatingModal(true)}>
                        {userRating > 0 ? `${userRating}★` : 'Click to set rating'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-card card">
                <div className="card-header">
                  <h2>Account Actions</h2>
                </div>
                <div className="action-buttons">
                  <button className="btn btn-primary action-btn" onClick={() => setShowRatingModal(true)}>
                    ⭐ Set Your Rating
                  </button>
                  <button className="btn btn-secondary action-btn">
                    📱 Update Phone
                  </button>
                  <button className="btn btn-danger action-btn" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="orders-header page-header">
                <h2>Order History</h2>
                <p>Track your past orders and reorder your favorites</p>
              </div>
              
              {orders.length === 0 ? (
                <div className="no-orders card">
                  <div className="no-orders-icon">📋</div>
                  <h3>No orders yet</h3>
                  <p>Start ordering delicious food to see your order history here</p>
                  <button onClick={() => navigate('/restaurants')} className="btn btn-primary browse-btn">
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card card">
                      <div className="order-header">
                        <div className="order-id">#{order.id}</div>
                        <div className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '.')}`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="order-restaurant">
                        <span className="restaurant-icon">🏪</span>
                        {order.restaurant}
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <span key={index} className="order-item">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="order-footer">
                        <div className="order-date text-muted">{order.date}</div>
                        <div className="order-total">₹{order.total.toFixed(2)}</div>
                      </div>
                      <div className="order-actions">
                        <button className="btn btn-primary reorder-btn">🔄 Reorder</button>
                        <button className="btn btn-secondary rate-btn">⭐ Rate</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="favorites-tab">
              <div className="favorites-header page-header">
                <h2>Favorite Restaurants</h2>
                <p>Quick access to your most-loved dining spots</p>
              </div>
              
              <div className="no-favorites card">
                <div className="no-favorites-icon">❤️</div>
                <h3>No favorites yet</h3>
                <p>Start exploring restaurants and add your favorites for quick access</p>
                <button onClick={() => navigate('/restaurants')} className="btn btn-primary browse-btn">
                  Explore Restaurants
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-header page-header">
                <h2>Account Settings</h2>
                <p>Customize your YummyBites experience</p>
              </div>
              
              <div className="settings-grid">
                <div className="setting-item card">
                  <div className="setting-info">
                    <h3>🔔 Push Notifications</h3>
                    <p>Get updates about your orders and offers</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="setting-item card">
                  <div className="setting-info">
                    <h3>📧 Email Notifications</h3>
                    <p>Receive order confirmations and updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="setting-item card">
                  <div className="setting-info">
                    <h3>🌍 Language</h3>
                    <p>Choose your preferred language</p>
                  </div>
                  <select className="setting-select form-select">
                    <option>English</option>
                    <option>Tamil</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlay">
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⭐ Set Your Rating</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRatingModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="text-muted">How would you rate your experience with YummyBites?</p>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${star <= userRating ? 'active' : ''}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    {star <= userRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <p className="rating-text text-muted">
                {userRating > 0 ? `You rated: ${userRating} star${userRating > 1 ? 's' : ''}` : 'Click a star to rate'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerProfile
