import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './pages.css' // Using general page styles
import './AdminDashboard.css'
import { peruduriRestaurants } from '../data/peruduriRestaurants'
import { getOrders, updateOrderStatus as apiUpdateOrderStatus } from '../services/api'
import { showToast } from '../utils/toast' // Assuming showToast is available for notifications

const AdminDashboard = () => {
  const { restaurantId } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [newOrders, setNewOrders] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call for restaurant data
    setTimeout(() => {
      const foundRestaurant = peruduriRestaurants.find(r => r._id === restaurantId)
      if (foundRestaurant) {
        setRestaurant(foundRestaurant)
        loadRestaurantData(restaurantId)
      } else {
        showToast('Restaurant not found!', 'error')
      }
      setLoading(false)
    }, 1000)
  }, [restaurantId])


  const loadRestaurantData = async (restId) => {
    // Load orders from backend filtered by restaurant
    try {
      const data = await getOrders(restId)
      const normalized = (Array.isArray(data) ? data : []).map(o => ({
        ...o,
        id: o.id || o._id || o.orderId
      }))
      setOrders(normalized)
    } catch {
      setOrders([])
    }
    
    // Calculate analytics
    const totalOrders = restaurantOrders.length
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + Number(order.total || 0), 0)
    
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderTime)
      const today = new Date()
      return orderDate.toDateString() === today.toDateString()
    })

    setAnalytics({
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2),
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
    })
    
    // Get new orders (pending/confirmed)
    const pending = orders.filter(order => 
      ['pending', 'confirmed'].includes(order.status)
    )
    setNewOrders(pending)

    // Mock customer messages
    setMessages([
      {
        id: 1,
        orderId: 'ORD001',
        customer: 'Raj Kumar',
        message: 'Please make the biryani less spicy, thank you!',
        time: '2 mins ago',
        type: 'special_request'
      },
      {
        id: 2,
        orderId: 'ORD002',
        customer: 'Priya S',
        message: 'Can you add extra sambar with the meals?',
        time: '5 mins ago',
        type: 'modification'
      },
      {
        id: 3,
        orderId: 'ORD003',
        customer: 'Karthik M',
        message: 'Thank you for the delicious food! Will order again.',
        time: '1 hour ago',
        type: 'feedback'
      }
    ])
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiUpdateOrderStatus(orderId, newStatus)
      await loadRestaurantData(restaurantId)
      if (newStatus === 'confirmed') {
        showToast(`Order #${orderId} confirmed!`, 'success')
      }
    } catch (e) {
      showToast('Failed to update order status', 'error')
    }
  }

  // Inline notification function (using showToast from utils)
  // const showNotification = (message, type) => {
  //   showToast(message, type)
  // }

  if (loading) {
    return (
      <div className="page loading-state">
        <span className="loading-spinner">⚙️</span>
        <h2>Loading Admin Dashboard...</h2>
        <p>Please wait while we load your restaurant data</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="page error-state">
        <h2>Restaurant Not Found</h2>
        <p>The requested restaurant dashboard could not be loaded.</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="restaurant-info">
            <h1>🏪 {restaurant.name} - Admin Dashboard</h1>
            <div className="restaurant-quick-info">
              <span className="badge">{restaurant.cuisine}</span>
              <span className="badge rating">⭐ {restaurant.rating}</span>
              <span className="badge status">🟢 Open</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn btn-secondary refresh-btn" onClick={() => loadRestaurantData(restaurantId)}>
              🔄 Refresh Data
            </button>
            <button className="btn btn-danger logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-body">
        {/* Stats Section */}
        <div className="stats-section container">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div className="stat-content">
              <h3>{analytics.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-content">
              <h3>₹{analytics.totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📈</span>
            <div className="stat-content">
              <h3>₹{analytics.avgOrderValue}</h3>
              <p>Avg. Order Value</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🚀</span>
            <div className="stat-content">
              <h3>{analytics.todayOrders}</h3>
              <p>Today's Orders</p>
            </div>
          </div>
        </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
        <div className="container tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders ({newOrders.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            💬 Messages ({messages.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
        </div>
        </div>

        {/* Tab Content */}
        <div className="admin-content container">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="section-header">
              <h2>Order Management</h2>
              <div className="order-filters">
                <button className="btn btn-secondary">All Orders</button>
                <button className="btn btn-secondary active">Pending ({newOrders.length})</button>
                <button className="btn btn-secondary">Preparing</button>
                <button className="btn btn-secondary">Ready</button>
              </div>
            </div>

            <div className="orders-grid">
              {orders.map(order => (
                <div key={order.id} className={`order-card card ${order.status}`}>
                  <div className="order-header">
                    <div className="order-id">#{order.id}</div>
                    <div className={`order-status ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="order-customer">
                    <span className="customer-icon">👤</span>
                    <div>
                      <h4>{order.customerName}</h4>
                      <p>📞 {order.phone || 'N/A'}</p>
                      <p>📍 {order.address || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="order-items">
                    <h5 className="text-muted">Order Items:</h5>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="order-instructions card">
                      <h5 className="text-muted">📝 Special Instructions:</h5>
                      <p>"{order.specialInstructions}"</p>
                    </div>
                  )}

                  <div className="order-footer">
                    <div className="order-total">
                      Total: ₹{order.total.toFixed(2)}
                    </div>
                    <div className="order-time">
                      🕐 {new Date(order.orderTime).toLocaleString()}
                    </div>
                  </div>

                  <div className="order-actions">
                    {order.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-success"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        >
                          ✅ Accept Order
                        </button>
                        <button className="btn btn-danger">❌ Decline</button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                      >
                        👨‍🍳 Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                      >
                          Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                      >
                        🚚 Out for Delivery
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="messages-section">
            <div className="section-header">
              <h2>Customer Messages</h2>
            </div>

            <div className="messages-list">
              {messages.map(message => (
                <div key={message.id} className={`message-card card ${message.type}`}>
                  <div className="message-header">
                    <div className="customer-info">
                      <h4>👤 {message.customer}</h4>
                      <span className="order-ref">Order #{message.orderId}</span>
                    </div>
                    <div className="message-time text-muted">{message.time}</div>
                  </div>
                  
                  <div className="message-content">
                    <p>"{message.message}"</p>
                  </div>

                  <div className="message-actions">
                    <button className="btn btn-primary btn-sm">💬 Reply</button>
                    <button className="btn btn-secondary btn-sm">✅ Mark Read</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h2>Restaurant Analytics</h2>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card card">
                <h3>📈 Revenue Overview</h3>
                <div className="big-stat">₹{analytics.totalRevenue}</div>
                <p className="text-muted">Total Revenue</p>
                <div className="sub-stats text-muted">
                  <div>Today: ₹{analytics.todayRevenue}</div>
                  <div>Avg Order: ₹{analytics.avgOrderValue}</div>
                </div>
              </div>

              <div className="analytics-card card">
                <h3>📦 Order Statistics</h3>
                <div className="big-stat">{analytics.totalOrders}</div>
                <p className="text-muted">Total Orders</p>
                <div className="sub-stats text-muted">
                  <div>Today: {analytics.todayOrders}</div>
                  <div>Pending: {newOrders.length}</div>
                </div>
              </div>

              <div className="analytics-card card">
                <h3>⭐ Performance</h3>
                <div className="big-stat">{restaurant.rating}</div>
                <p className="text-muted">Customer Rating</p>
                <div className="sub-stats text-muted">
                  <div>Reviews: 45+</div>
                  <div>Response Rate: 98%</div>
                </div>
              </div>

              <div className="analytics-card card">
                <h3>🕐 Operating Hours</h3>
                <div className="big-stat">16</div>
                <p className="text-muted">Hours Open Daily</p>
                <div className="sub-stats text-muted">
                  <div>Opens: 6:00 AM</div>
                  <div>Closes: 10:00 PM</div>
                </div>
              </div>
            </div>

            {/* Popular Items */}
            <div className="popular-items card">
              <h3>🔥 Most Popular Items</h3>
              <div className="items-list">
                {restaurant.menu?.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="popular-item">
                    <div className="rank text-muted">#{index + 1}</div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="text-muted">₹{item.price} • Sold: {Math.floor(Math.random() * 50) + 10} times</p>
                    </div>
                    <div className="item-revenue">₹{(item.price * (Math.floor(Math.random() * 50) + 10)).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div className="menu-management-section">
            <div className="section-header">
              <h2>Menu Management</h2>
              <button className="btn btn-primary">➕ Add New Item</button>
            </div>

            <div className="menu-items-admin">
              {restaurant.menu?.map(item => (
                <div key={item.id} className="menu-item-admin card">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="text-muted">{item.description}</p>
                    <div className="item-details">
                      <span className="price">₹{item.price.toFixed(2)}</span>
                      <span className={`availability ${item.available !== false ? 'available' : 'unavailable'}`}>
                        {item.available !== false ? '✅ Available' : '❌ Unavailable'}
                      </span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-secondary btn-sm">✏️ Edit</button>
                    <button className="btn btn-warning btn-sm">
                      {item.available !== false ? '🚫 Mark Unavailable' : '✅ Mark Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard