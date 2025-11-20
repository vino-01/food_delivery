import React, { useState, useEffect, createContext, useContext } from 'react';
import './NotificationSystem.css';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Predefined notification types
  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'Success',
      message,
      icon: '✅',
      ...options
    });
  };

  const showError = (message, options = {}) => {
    return addNotification({
      type: 'error',
      title: 'Error',
      message,
      icon: '❌',
      duration: 7000,
      ...options
    });
  };

  const showWarning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      icon: '⚠️',
      duration: 6000,
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Info',
      message,
      icon: 'ℹ️',
      ...options
    });
  };

  const showOrderUpdate = (orderId, status, options = {}) => {
    const statusMessages = {
      'placed': 'Your order has been placed successfully!',
      'confirmed': 'Restaurant has confirmed your order',
      'preparing': 'Your food is being prepared',
      'ready': 'Your food is ready for pickup',
      'out_for_delivery': 'Your order is out for delivery',
      'delivered': 'Order delivered successfully!',
      'cancelled': 'Your order has been cancelled'
    };

    return addNotification({
      type: 'order',
      title: 'Order Update',
      message: statusMessages[status] || 'Order status updated',
      icon: '📦',
      orderId,
      status,
      duration: 8000,
      ...options
    });
  };

  const showPromotion = (title, message, options = {}) => {
    return addNotification({
      type: 'promotion',
      title,
      message,
      icon: '🎉',
      duration: 10000,
      ...options
    });
  };

  // Group payment specific notifications
  const notifyPaymentReceived = (groupId, participantName, amount) => {
    return addNotification({
      type: 'payment_received',
      title: 'Payment Received! 💰',
      message: `${participantName} has paid ₹${amount} for group order ${groupId}`,
      icon: '✅',
      duration: 6000
    });
  };

  const notifyPaymentReminder = (groupId, amount, deadline) => {
    return addNotification({
      type: 'payment_reminder',
      title: 'Payment Reminder ⏰',
      message: `Don't forget to pay ₹${amount} for group order ${groupId}. Deadline: ${deadline}`,
      icon: '💳',
      autoRemove: false
    });
  };

  const notifyGroupOrderCreated = (groupId, organizerName) => {
    return addNotification({
      type: 'group_order_created',
      title: 'Group Order Created! 🎉',
      message: `${organizerName} has created a group order ${groupId}. Check your payment details.`,
      icon: '👥',
      duration: 8000
    });
  };

  const notifyOrderCompleted = (groupId) => {
    return addNotification({
      type: 'order_completed',
      title: 'Order Complete! 🍽️',
      message: `All participants have paid for group order ${groupId}. Your food is on the way!`,
      icon: '🚚',
      duration: 8000
    });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showOrderUpdate,
    showPromotion,
    notifyPaymentReceived,
    notifyPaymentReminder,
    notifyGroupOrderCreated,
    notifyOrderCompleted
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const handleAction = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    if (action.closeOnClick !== false) {
      handleRemove();
    }
  };

  return (
    <div
      className={`notification-item ${notification.type} ${isVisible ? 'visible' : ''} ${isLeaving ? 'leaving' : ''}`}
      onClick={notification.clickToClose ? handleRemove : undefined}
    >
      <div className="notification-content">
        <div className="notification-icon">
          {notification.icon}
        </div>
        
        <div className="notification-body">
          <div className="notification-header">
            <h4 className="notification-title">{notification.title}</h4>
            <button
              className="notification-close"
              onClick={handleRemove}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
          
          <p className="notification-message">{notification.message}</p>
          
          {notification.orderId && (
            <div className="notification-order-info">
              <span className="order-id">Order #{notification.orderId}</span>
              <span className="order-status">{notification.status}</span>
            </div>
          )}
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="notification-actions">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  className={`notification-action ${action.type || 'secondary'}`}
                  onClick={() => handleAction(action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {notification.duration > 0 && (
        <div className="notification-progress">
          <div
            className="progress-bar"
            style={{
              animationDuration: `${notification.duration}ms`
            }}
          />
        </div>
      )}
    </div>
  );
};

// Hook for easy notification usage
export const useNotificationActions = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showOrderUpdate,
    showPromotion
  } = useNotifications();

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showOrderUpdate,
    showPromotion
  };
};

// Backward-compat default export alias
const NotificationSystem = NotificationProvider;
export default NotificationSystem;
