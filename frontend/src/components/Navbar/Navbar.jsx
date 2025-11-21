
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useRestaurantData } from '../../context/RestaurantContext.jsx';
import { getOrders } from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // State for login status
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  const checkLoginStatus = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const role = localStorage.getItem('userRole');

    setUser(userData);
    setUserRole(role);
    setIsLoggedIn(userData.id && role);
  };

  useEffect(() => {
    // Check initial login status
    checkLoginStatus();

    // Listen for login/logout events
    const handleLoginEvent = () => {
      setTimeout(checkLoginStatus, 100);
    };

    window.addEventListener('userLoggedIn', handleLoginEvent);
    window.addEventListener('userLoggedOut', handleLoginEvent);
    window.addEventListener('storage', handleLoginEvent);

    // Cleanup
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
      window.removeEventListener('userLoggedOut', handleLoginEvent);
      window.removeEventListener('storage', handleLoginEvent);
    };
  }, []);

  // Pending orders count for admin
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let interval;
    const fetchPending = async () => {
      if (userRole === 'restaurant_admin' && user?.restaurantId) {
        try {
          const data = await getOrders(user.restaurantId);
          const normalized = Array.isArray(data) ? data : [];
          const count = normalized.filter(o => o.status === 'pending').length;
          setPendingCount(count);
        } catch {
          // fallback to localStorage
          const stored = JSON.parse(localStorage.getItem(`restaurant_orders_${user.restaurantId}`) || '[]');
          const count = stored.filter(o => o.status === 'pending').length;
          setPendingCount(count);
        }
      }
    };
    fetchPending();
    if (userRole === 'restaurant_admin' && user?.restaurantId) {
      interval = setInterval(fetchPending, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [userRole, user?.restaurantId]);

  // Access restaurant map unconditionally (no conditional hooks)
  const { byId } = useRestaurantData();
  const adminRestaurant = (userRole === 'restaurant_admin' && user?.restaurantId) ? byId[user.restaurantId] : null;
  const adminColor = adminRestaurant?.color;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">YummyBites</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          {/* Customer/Visitor navigation */}
          {(!isLoggedIn || userRole === 'customer') && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/restaurants" className="nav-link">Restaurants</Link>
              {/* Removed duplicate 'Orders' link; keeping single 'My Orders' entry below */}
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>
            </>
          )}
          {/* Restaurant admin navigation */}
          {isLoggedIn && userRole === 'restaurant_admin' && user?.restaurantId && (
            <Link to={`/restaurant/${user.restaurantId}/dashboard`} className="nav-link">
              Dashboard{pendingCount > 0 && (
                <span className="dashboard-pending-count" title={`${pendingCount} pending orders`}>{pendingCount}</span>
              )}
            </Link>
          )}
          {isLoggedIn && userRole === 'customer' && (
            <Link to="/my-orders" className="nav-link">My Orders</Link>
          )}
        </div>

        {/* User Section */}
        <div className="user-section">
          {isLoggedIn ? (
            <div className="user-menu">
              {userRole === 'customer' ? (
                <Link to="/profile" className="user-profile">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user.name || 'Profile'}</span>
                </Link>
              ) : (
                <Link to={`/restaurant/${user.restaurantId}/dashboard`} className="user-profile" style={{ '--admin-color': adminColor }}>
                  <span className="user-avatar">🏪</span>
                  <span className="user-name">{user.name}</span>
                  <span className="admin-badge">Admin</span>
                </Link>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Hey, Login! 👋
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;