import React, { useState, useEffect, useMemo, useRef } from 'react'
import { 
  getOrders, 
  updateOrderStatus as apiUpdateOrderStatus,
  getAnalyticsSummary,
  getAnalyticsBestItems,
  getAnalyticsStatusBreakdown,
  getAnalyticsPeakHours,
  getAnalyticsRevenueTrend,
  getAnalyticsTopCustomers
} from '../services/api'
import { useRestaurant } from '../context/RestaurantContext.jsx'
import { useParams, useNavigate } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../utils/toast.js'
import './RestaurantDashboard.css'

const RestaurantDashboard = () => {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const restaurantCtx = useRestaurant(restaurantId)
  const [editContact, setEditContact] = useState(false)
  const [contactDraft, setContactDraft] = useState({ phone: '', email: '' })
  const [savingContact, setSavingContact] = useState(false)
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [rating, setRating] = useState({ avg: 0, count: 0 })
  const seenOrdersRef = useRef(new Set())
  const [analytics, setAnalytics] = useState({
    summary: null,
    bestItems: [],
    statusBreakdown: null,
    peakHours: [],
    revenueTrend: [],
    topCustomers: []
  })
  const analyticsIntervalRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in as restaurant
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const role = localStorage.getItem('userRole')
    
    // Accept the role stored during restaurant login
    if (!userData.id || role !== 'restaurant_admin' || userData.restaurantId !== restaurantId) {
      navigate('/login')
      return
    }

    // Load restaurant data from context
    if (restaurantCtx) {
      const restaurantData = {
        id: restaurantId,
        name: restaurantCtx.name || 'Restaurant',
        cuisine: restaurantCtx.cuisine || 'Cuisine',
        address: restaurantCtx.address || 'Perundurai, Tamil Nadu',
        color: restaurantCtx.color,
        icon: restaurantCtx.icon,
        description: restaurantCtx.description,
        phone: restaurantCtx.contact?.phone || '+91 00000 00000',
        email: restaurantCtx.contact?.email || 'contact@yummybites.com'
      }
      setRestaurant(restaurantData)
      setContactDraft({ phone: restaurantData.phone, email: restaurantData.email })
    }
    loadOrders()
    loadMenuItems()
    loadRatings()
    setLoading(false)
    
    // Set up real-time updates
    const interval = setInterval(() => { loadOrders() }, 5000)
    return () => { clearInterval(interval); analyticsIntervalRef.current && clearInterval(analyticsIntervalRef.current) }
  }, [restaurantId, navigate])

  // Dynamically set CSS offset for fixed header height (handles different content lengths)
  useEffect(() => {
    if (headerRef.current) {
      const h = headerRef.current.getBoundingClientRect().height
      document.documentElement.style.setProperty('--rd-header-offset', `${Math.round(h)}px`)
    }
  }, [restaurant, editContact])

  // Recalculate header offset on window resize to prevent shift
  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().height
        document.documentElement.style.setProperty('--rd-header-offset', `${Math.round(h)}px`)
      }
    }
    window.addEventListener('resize', handleResize)
    // Initial call in case fonts/styles load after first effect
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // Load analytics when tab switches to analytics
  useEffect(() => {
    if (activeTab !== 'analytics' || !restaurantId) {
      if (analyticsIntervalRef.current) { clearInterval(analyticsIntervalRef.current); analyticsIntervalRef.current = null }
      return
    }
    const loadAll = async () => {
      const baseDebug = import.meta.env.VITE_API_BASE_URL || 'https://food-delivery-84az.onrender.com'
      console.log('[Analytics] Refresh start', { restaurantId, baseDebug })
      const next = { summary: null, bestItems: [], statusBreakdown: null, peakHours: [], revenueTrend: [], topCustomers: [] }
      let hadError = false
      try {
        next.summary = await getAnalyticsSummary(restaurantId)
      } catch (e) {
        hadError = true
        console.warn('[Analytics] summary failed', e.message)
      }
      try {
        const bi = await getAnalyticsBestItems(restaurantId, '30d')
        next.bestItems = bi.items || []
      } catch (e) { hadError = true; console.warn('[Analytics] best-items failed', e.message) }
      try {
        const sb = await getAnalyticsStatusBreakdown(restaurantId, 30)
        next.statusBreakdown = sb.statuses || {}
      } catch (e) { hadError = true; console.warn('[Analytics] status-breakdown failed', e.message) }
      try {
        const ph = await getAnalyticsPeakHours(restaurantId)
        next.peakHours = ph.hours || []
      } catch (e) { hadError = true; console.warn('[Analytics] peak-hours failed', e.message) }
      try {
        const rt = await getAnalyticsRevenueTrend(restaurantId)
        next.revenueTrend = rt.trend || []
      } catch (e) { hadError = true; console.warn('[Analytics] revenue-trend failed', e.message) }
      try {
        const tc = await getAnalyticsTopCustomers(restaurantId)
        next.topCustomers = tc.customers || []
      } catch (e) { hadError = true; console.warn('[Analytics] top-customers failed', e.message) }
      setAnalytics(next)
      if (hadError) {
        // Surface minimal info for user via console; UI will still render available pieces
        console.log('[Analytics] Completed with partial errors')
      }
    }
    loadAll()
    analyticsIntervalRef.current = setInterval(loadAll, 30000) // refresh every 30s
    return () => analyticsIntervalRef.current && clearInterval(analyticsIntervalRef.current)
  }, [activeTab, restaurantId])

  const maxRevenue = useMemo(() => Math.max(0, ...analytics.revenueTrend.map(d => d.revenue)), [analytics.revenueTrend])
  const peakHourMax = useMemo(() => Math.max(0, ...analytics.peakHours.map(h => h.count)), [analytics.peakHours])

  // remove old loadRestaurantData (hooks cannot be called inside)

  const loadOrders = async () => {
    // Prefer backend; fall back to localStorage for demo/offline
    try {
      const data = await getOrders(restaurantId)
      const normalized = (Array.isArray(data) ? data : []).map(o => ({
        ...o,
        id: o.id || o._id || o.orderId || `ORD_${(o.createdAt || Date.now())}`
      }))
      // Detect new pending orders for notifications
      const newOnes = normalized.filter(o => o.status === 'pending' && !seenOrdersRef.current.has(o.id))
      if (newOnes.length) {
        newOnes.forEach(o => addNotification(`New order #${o.id} received!`, 'order'))
      }
      // Update seen set
      normalized.forEach(o => seenOrdersRef.current.add(o.id))
      setOrders(normalized)
    } catch {
      const storedOrders = JSON.parse(localStorage.getItem(`restaurant_orders_${restaurantId}`) || '[]')
      const normalized = storedOrders.map(o => ({ ...o, id: o.id || o._id }))
      const newOnes = normalized.filter(o => o.status === 'pending' && !seenOrdersRef.current.has(o.id))
      if (newOnes.length) newOnes.forEach(o => addNotification(`New order #${o.id} received!`, 'order'))
      normalized.forEach(o => seenOrdersRef.current.add(o.id))
      setOrders(normalized)
    }
  }

  const loadMenuItems = () => {
    // Load menu items (in real app, this would be API)
    const menuData = [
      {
        id: 'item1',
        name: 'Masala Dosa',
        category: 'Breakfast',
        price: 80,
        ingredients: ['Rice', 'Lentils', 'Potatoes', 'Onions', 'Spices'],
        allergens: ['Gluten'],
        customizable: true,
        available: true
      },
      {
        id: 'item2',
        name: 'Idli Sambar',
        category: 'Breakfast',
        price: 60,
        ingredients: ['Rice', 'Lentils', 'Vegetables', 'Spices'],
        allergens: [],
        customizable: true,
        available: true
      }
    ]
    setMenuItems(menuData)
  }

  const loadRatings = async () => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'https://food-delivery-84az.onrender.com'
      const res = await fetch(`${base}/api/ratings/summary?restaurantId=${encodeURIComponent(restaurantId)}`)
      if (!res.ok) throw new Error('Failed to fetch ratings')
      const data = await res.json()
      setRating({ avg: Number(data.avg) || 0, count: Number(data.count) || 0 })
    } catch (e) {
      console.warn('[Ratings] summary failed', e.message)
      setRating({ avg: 0, count: 0 })
    }
  }

  // checkNewOrders removed; handled within loadOrders

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [notification, ...prev])
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiUpdateOrderStatus(orderId, newStatus)
      await loadOrders()
    } catch {
      // Fallback to local-only update if API is unavailable
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      localStorage.setItem(`restaurant_orders_${restaurantId}`, JSON.stringify(updatedOrders))
      setOrders(updatedOrders)
    }
    addNotification(`Order #${orderId} status updated to ${newStatus}`, 'status')
  }

  useEffect(() => {
  function adjustOffset() {
    const header = document.querySelector(".dashboard-header");
    if (header) {
      const height = header.offsetHeight;
      document.documentElement.style.setProperty("--rd-header-offset", `${height}px`);
    }
  }

  // Run once
  adjustOffset();

  // Adjust on window resize
  window.addEventListener("resize", adjustOffset);

  return () => window.removeEventListener("resize", adjustOffset);
}, []);


  const revenue = useMemo(() => {
    // Treat non-pending, non-cancelled as realized revenue for now
    const realized = orders.filter(o => o.status && !['pending', 'cancelled'].includes(o.status))
    return realized.reduce((sum, o) => sum + Number(o.total || 0), 0)
  }, [orders])

  const formatCurrency = (amt) => `₹${Number(amt || 0).toLocaleString('en-IN')}`

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    localStorage.removeItem('authToken')
    window.dispatchEvent(new CustomEvent('userLoggedOut'))
    navigate('/')
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading restaurant dashboard...</p>
      </div>
    )
  }

  if (!restaurant) {
    return null
  }

  const pendingOrders = orders.filter(order => order.status === 'pending')
  const preparingOrders = orders.filter(order => order.status === 'preparing')
  const readyOrders = orders.filter(order => order.status === 'ready')

  return (
    <div className="restaurant-dashboard">
      {/* Header */}
      <div ref={headerRef} className="dashboard-header" style={{ '--rd-accent': restaurant?.color }}>
        <div className="container">
          <div className="header-content">
            <div className="restaurant-info">
              <h1>{restaurant.icon || '🏪'} {restaurant.name}</h1>
              <p>{restaurant.cuisine} • {restaurant.address}</p>
              {restaurant.description && <p className="rd-desc">{restaurant.description}</p>}
              <p className="rd-contact">☎ {restaurant.phone} • ✉ {restaurant.email}</p>
              {editContact && (
                <div className="rd-contact-edit">
                  <input
                    type="text"
                    value={contactDraft.phone}
                    onChange={e => setContactDraft(d => ({ ...d, phone: e.target.value }))}
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    value={contactDraft.email}
                    onChange={e => setContactDraft(d => ({ ...d, email: e.target.value }))}
                    placeholder="Email"
                  />
                  <button
                    className="refresh-btn"
                    disabled={savingContact}
                    onClick={async () => {
                      if (savingContact) return
                      // Basic validation
                      const digits = contactDraft.phone.replace(/\D/g,'')
                      if (digits.length !== 10) {
                        showErrorToast('Phone must be 10 digits')
                        return
                      }
                      if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(contactDraft.email)) {
                        showErrorToast('Invalid email format')
                        return
                      }
                      setSavingContact(true)
                      try {
                        // Simulate async persistence to allow future backend call
                        await new Promise(res => setTimeout(res, 250))
                        restaurantCtx.updateRestaurantContact(restaurantId, { phone: `+91 ${digits}`, email: contactDraft.email })
                        setRestaurant(r => ({ ...r, phone: `+91 ${digits}`, email: contactDraft.email }))
                        setEditContact(false)
                        showSuccessToast('Contact saved')
                      } catch (e) {
                        showErrorToast('Failed to save contact')
                      } finally {
                        setSavingContact(false)
                      }
                    }}
                  >{savingContact ? '⏳ Saving...' : '💾 Save'}</button>
                  <button className="logout-btn" onClick={() => { setEditContact(false); setContactDraft({ phone: restaurant.phone, email: restaurant.email }) }}>✖ Cancel</button>
                </div>
              )}
            </div>
            <div className="header-actions">
              <button className="refresh-btn" onClick={loadOrders}>
                🔄 Refresh
              </button>
              <button className="refresh-btn" onClick={() => setEditContact(e => !e)}>
                {editContact ? '🔧 Close Edit' : '✏️ Edit Contact'}
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{orders.length}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{pendingOrders.length}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🍳</div>
              <div className="stat-content">
                <h3>{preparingOrders.length}</h3>
                <p>Preparing</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{readyOrders.length}</h3>
                <p>Ready</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>{formatCurrency(revenue)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{rating.count ? rating.avg : '—'}</h3>
                <p>Rating{rating.count ? ` (${rating.count})` : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <div className="container">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 Orders ({orders.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              🍽️ Menu Management
            </button>
            <button
              className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications ({notifications.filter(n => !n.read).length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div className="container">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="orders-header">
                <h2>Order Management</h2>
                <p>Manage incoming orders and update their status</p>
              </div>
              
              {orders.length === 0 ? (
                <div className="no-orders">
                  <div className="no-orders-icon">📋</div>
                  <h3>No orders yet</h3>
                  <p>Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">#{order.id}</div>
                        <div className={`order-status ${order.status}`}>
                          {order.status}
                        </div>
                      </div>
                      
                      <div className="order-customer">
                        <span className="customer-icon">👤</span>
                        {order.customerName} • {order.customerMobile}
                      </div>
                      
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">×{item.quantity}</span>
                            <span className="item-price">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      {order.customizations && (
                        <div className="order-customizations">
                          <h4>Customizations:</h4>
                          <p>{order.customizations.specialInstructions || 'No special instructions'}</p>
                          {order.customizations.itemAllergens && order.customizations.itemAllergens.length > 0 && (
                            <div className="allergen-warning">
                              ⚠️ Contains: {order.customizations.itemAllergens.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="order-footer">
                        <div className="order-total">Total: ₹{order.total}</div>
                        <div className="order-time">{new Date(order.orderTime || order.createdAt || Date.now()).toLocaleTimeString()}</div>
                      </div>
                      
                      <div className="order-actions">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="action-btn secondary"
                            >
                              ✅ Accept Order
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="action-btn danger"
                            >
                              ❌ Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="action-btn primary"
                          >
                            👨‍🍳 Start Preparing
                          </button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="action-btn success"
                          >
                            ✅ Mark Ready
                          </button>
                        )}
                        
                        {order.status === 'ready' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="action-btn secondary"
                          >
                            🚚 Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="menu-tab">
              <div className="menu-header">
                <h2>Menu Management</h2>
                <p>Manage your menu items, ingredients, and allergens</p>
                <button className="add-item-btn">
                  ➕ Add New Item
                </button>
              </div>
              
              <div className="menu-grid">
                {menuItems.map((item) => (
                  <div key={item.id} className="menu-item-card">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      <div className="item-status">
                        <span className={`status-dot ${item.available ? 'available' : 'unavailable'}`}></span>
                        {item.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                    
                    <div className="item-details">
                      <p className="item-category">{item.category}</p>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                    
                    <div className="item-ingredients">
                      <h4>Ingredients:</h4>
                      <div className="ingredients-list">
                        {item.ingredients.map((ingredient, index) => (
                          <span key={index} className="ingredient-tag">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {item.allergens.length > 0 && (
                      <div className="item-allergens">
                        <h4>⚠️ Allergens:</h4>
                        <div className="allergens-list">
                          {item.allergens.map((allergen, index) => (
                            <span key={index} className="allergen-tag">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="item-actions">
                      <button className="edit-btn">✏️ Edit</button>
                      <button className="toggle-btn">
                        {item.available ? '🔄 Disable' : '✅ Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="notifications-tab">
              <div className="notifications-header">
                <h2>Notifications</h2>
                <p>Stay updated with order updates and important alerts</p>
              </div>
              
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <div className="no-notifications-icon">🔔</div>
                  <h3>No notifications yet</h3>
                  <p>Notifications will appear here for new orders and updates</p>
                </div>
              ) : (
                <div className="rd-notifications-list">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`rd-notification-item ${notification.read ? 'read' : 'unread'}`}>
                      <div className="rd-notification-icon">
                        {notification.type === 'order' ? '📋' : 'ℹ️'}
                      </div>
                      <div className="rd-notification-content">
                        <p className="rd-notification-message">{notification.message}</p>
                        <span className="rd-notification-time">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <button 
                        className="rd-mark-read-btn"
                        onClick={() => {
                          setNotifications(prev => 
                            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                          )
                        }}
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <div className="analytics-header">
                <h2>Analytics & Insights</h2>
                <p>Track your restaurant's performance and customer preferences</p>
              </div>
              {!analytics.summary ? (
                <div className="no-orders">
                  <h3>Loading analytics...</h3>
                  <p>If this takes long, check browser console for errors.</p>
                </div>
              ) : analytics.summary.totalOrders === 0 ? (
                <div className="no-orders">
                  <h3>No analytics data yet</h3>
                  <p>Place some orders for {restaurant.name} to generate insights (revenue trend, peak hours, best sellers).</p>
                </div>
              ) : (
                <>
                  <div className="stats-grid" style={{ marginBottom: 30 }}>
                    <div className="stat-card"><div className="stat-icon">🧮</div><div className="stat-content"><h3>{analytics.summary.totalOrders}</h3><p>Total Orders (All Time)</p></div></div>
                    <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-content"><h3>{formatCurrency(analytics.summary.revenue)}</h3><p>Realized Revenue</p></div></div>
                    <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-content"><h3>{analytics.summary.distinctCustomers}</h3><p>Customers</p></div></div>
                    <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-content"><h3>{analytics.summary.pending}</h3><p>Pending Now</p></div></div>
                  </div>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h3>📦 Order Status Breakdown</h3>
                      <p>Distribution (last 30 days)</p>
                      <div className="chart-placeholder">
                        {Object.entries(analytics.statusBreakdown || {}).map(([k,v]) => (
                          <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                            <span>{k}</span>
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h3>🍽️ Best Selling Items</h3>
                      <p>Top 10 (30 days)</p>
                      <div className="chart-placeholder" style={{ display:'grid', gap:6 }}>
                        {analytics.bestItems.length === 0 ? 'No orders yet' : analytics.bestItems.map(it => (
                          <div key={it.name} style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ flex:1 }}>{it.name}</span>
                            <div style={{ background:'var(--brand-primary)', height:6, borderRadius:4, width:`${(it.qty / analytics.bestItems[0].qty)*60}%` }}></div>
                            <span style={{ fontSize:12, minWidth:30, textAlign:'right' }}>{it.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h3>⏰ Peak Order Hours</h3>
                      <p>Last 7 days</p>
                      <div className="chart-placeholder" style={{ display:'flex', alignItems:'flex-end', gap:4, height:100 }}>
                        {analytics.peakHours.map(h => (
                          <div key={h.hour} style={{ flex:1, background:'var(--brand-primary)', height: peakHourMax? (h.count/peakHourMax)*100:0, borderRadius:3, position:'relative' }} title={`${h.hour}:00 - ${h.count} orders`}></div>
                        ))}
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h3>💵 Revenue Trend</h3>
                      <p>Last 30 days</p>
                      <div className="chart-placeholder" style={{ height:120, display:'flex', alignItems:'flex-end', gap:3 }}>
                        {analytics.revenueTrend.map(d => (
                          <div key={d.date} style={{ flex:1, background:'var(--brand-primary)', height: maxRevenue? (d.revenue/maxRevenue)*100:0, borderRadius:3 }} title={`${d.date}: ₹${d.revenue}`}></div>
                        ))}
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h3>🏅 Top Customers</h3>
                      <p>Most delivered orders</p>
                      <div className="chart-placeholder" style={{ display:'grid', gap:6 }}>
                        {analytics.topCustomers.length === 0 ? 'No delivered orders yet' : analytics.topCustomers.map(c => (
                          <div key={c.email} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                            <span style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis' }}>{c.email}</span>
                            <span>{c.count} orders • {formatCurrency(c.spend)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantDashboard