import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';
import './pages.css';
import { getUserOrders } from '../services/api';
import { showInfoToast } from '../utils/toast';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevStatusesRef = useRef({});
  const pollingRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userEmail = user.email;
    if (!userEmail) {
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(userEmail);
        const normalized = (Array.isArray(data) ? data : []).map(o => ({
          id: o._id || o.id || `ORD_${o.createdAt}`,
          restaurant: { name: o.restaurantName || o.restaurantId, image: '' },
          items: o.items || [],
            total: o.total || 0,
            status: o.status,
            orderDate: o.createdAt,
            deliveryDate: o.status === 'delivered' ? o.updatedAt : null
        }));
        // Detect status changes
        normalized.forEach(ord => {
          const prev = prevStatusesRef.current[ord.id];
          if (prev && prev !== ord.status) {
            showInfoToast(`Order #${ord.id} status updated: ${getStatusText(ord.status)}`);
          }
          prevStatusesRef.current[ord.id] = ord.status;
        });
        setOrders(normalized);
      } catch (e) {
        console.warn('Falling back to local orders', e.message);
        const local = [];
        setOrders(local);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    pollingRef.current = setInterval(fetchOrders, 5000);
    return () => pollingRef.current && clearInterval(pollingRef.current);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'var(--brand-primary)',
      'confirmed': '#f59e0b',
      'preparing': '#f59e0b',
      'ready': 'var(--brand-accent)',
      'delivered': 'var(--brand-accent)',
      'cancelled': 'var(--brand-danger)'
    };
    return colors[status] || 'var(--text-muted)';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Waiting to Accept',
      'confirmed': 'Accepted',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  // Segment orders into active vs past for clearer presentation
  const activeStatuses = ['pending', 'confirmed', 'preparing', 'ready'];
  const activeOrders = orders
    .filter(o => activeStatuses.includes(o.status))
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  const pastOrders = orders
    .filter(o => ['delivered', 'cancelled'].includes(o.status))
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const handleTrackOrder = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

  const handleReorder = (order) => {
    showInfoToast(`Adding ${order.items.length} items from Order #${order.id} to cart`);
    navigate('/cart');
  };

  const handleRateOrder = (orderId) => {
    showInfoToast(`Opening rating for order #${orderId}`);
  };

  if (loading) {
    return (
      <div className="page loading-state">
        <span className="loading-spinner">📦</span>
        <h2>Loading Your Orders...</h2>
        <p>Please wait while we fetch your order history.</p>
      </div>
    );
  }

  return (
    <div className="orders-container container">
      <div className="orders-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
          ← Back
        </button>
        <h1>My Orders</h1>
      </div>

      <div className="orders-content">
        <div className="orders-section">
          <h2 className="section-title">Active Orders ({activeOrders.length})</h2>
          <div className="orders-list">
            {activeOrders.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">🕒</div>
                <h3>No active orders</h3>
                <p>You have no orders currently in progress.</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                  Order Now
                </button>
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="order-card card">
                  <div className="order-header">
                    <div className="restaurant-info">
                      <div className="restaurant-image">{order.restaurant.image}</div>
                      <div className="restaurant-details">
                        <h3>{order.restaurant.name}</h3>
                        <p className="text-muted">Order #{order.id}</p>
                      </div>
                    </div>
                    <div className="order-status">
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="order-time">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total: ₹{order.total.toFixed(2)}</span>
                      {order.estimatedDelivery && <span className="delivery-time">ETA: {order.estimatedDelivery}</span>}
                    </div>
                    <div className="order-actions">
                      <button className="btn action-btn track-btn" onClick={() => handleTrackOrder(order.id)}>
                        📍 Track Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="orders-section">
          <h2 className="section-title">Past Orders ({pastOrders.length})</h2>
          <div className="orders-list">
            {pastOrders.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">📦</div>
                <h3>No past orders</h3>
                <p>You haven't completed any orders yet.</p>
              </div>
            ) : (
              pastOrders.map(order => (
                <div key={order.id} className="order-card card">
                  <div className="order-header">
                    <div className="restaurant-info">
                      <div className="restaurant-image">{order.restaurant.image}</div>
                      <div className="restaurant-details">
                        <h3>{order.restaurant.name}</h3>
                        <p className="text-muted">Order #{order.id}</p>
                      </div>
                    </div>
                    <div className="order-status">
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="order-time">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total: ₹{order.total.toFixed(2)}</span>
                    </div>
                    <div className="order-actions">
                      {order.status === 'delivered' && (
                        <>
                          {!order.rating && (
                            <button className="btn action-btn rate-btn" onClick={() => handleRateOrder(order.id)}>
                              ⭐ Rate
                            </button>
                          )}
                          <button className="btn action-btn reorder-btn" onClick={() => handleReorder(order)}>
                            🔄 Reorder
                          </button>
                        </>
                      )}
                      {order.status === 'cancelled' && (
                        <button className="btn action-btn reorder-btn" onClick={() => handleReorder(order)}>
                          🔄 Reorder
                        </button>
                      )}
                    </div>
                  </div>
                  {order.cancelReason && (
                    <div className="cancel-reason card">
                      <p className="text-muted"><strong>Cancellation Reason:</strong> {order.cancelReason}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
