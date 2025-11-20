import React, { useState, useEffect } from 'react';
import './DeliveryTracker.css';

const DeliveryTracker = ({ orderId, onStatusUpdate }) => {
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (orderId) {
      startTracking();
    }
  }, [orderId]);

  const startTracking = () => {
    setIsTracking(true);
    
    // Simulate real-time tracking updates
    const trackingInterval = setInterval(() => {
      updateDeliveryStatus();
    }, 10000); // Update every 10 seconds

    // Initial status
    updateDeliveryStatus();

    return () => clearInterval(trackingInterval);
  };

  const updateDeliveryStatus = () => {
    // Mock delivery status updates
    const statuses = [
      {
        status: 'preparing',
        message: 'Restaurant is preparing your order',
        estimatedTime: '25-30 mins',
        progress: 20
      },
      {
        status: 'ready',
        message: 'Your order is ready for pickup',
        estimatedTime: '20-25 mins',
        progress: 40
      },
      {
        status: 'picked_up',
        message: 'Order picked up, on the way',
        estimatedTime: '15-20 mins',
        progress: 60,
        deliveryPerson: {
          name: 'Rajesh Kumar',
          phone: '+91 9876543211',
          rating: 4.8,
          vehicle: 'Bike'
        }
      },
      {
        status: 'out_for_delivery',
        message: 'Your order is out for delivery',
        estimatedTime: '10-15 mins',
        progress: 80,
        currentLocation: {
          lat: 11.2750,
          lng: 77.5900,
          address: 'Near Perundurai Bus Stand'
        }
      },
      {
        status: 'nearby',
        message: 'Delivery person is nearby',
        estimatedTime: '5 mins',
        progress: 95,
        currentLocation: {
          lat: 11.2800,
          lng: 77.5950,
          address: '500m away from your location'
        }
      },
      {
        status: 'delivered',
        message: 'Order delivered successfully!',
        estimatedTime: 'Delivered',
        progress: 100
      }
    ];

    // Simulate random status progression
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    setDeliveryStatus(randomStatus);
    setEstimatedTime(randomStatus.estimatedTime);
    
    if (randomStatus.deliveryPerson) {
      setDeliveryPerson(randomStatus.deliveryPerson);
    }
    
    if (randomStatus.currentLocation) {
      setCurrentLocation(randomStatus.currentLocation);
    }

    // Notify parent component
    if (onStatusUpdate) {
      onStatusUpdate(randomStatus);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'preparing': '👨‍🍳',
      'ready': '🍽️',
      'picked_up': '📦',
      'out_for_delivery': '🛵',
      'nearby': '📍',
      'delivered': '✅'
    };
    return icons[status] || '📦';
  };

  const getStatusColor = (status) => {
    const colors = {
      'preparing': '#f59e0b',
      'ready': '#10b981',
      'picked_up': '#3b82f6',
      'out_for_delivery': '#8b5cf6',
      'nearby': '#ec4899',
      'delivered': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  if (!isTracking) {
    return (
      <div className="delivery-tracker">
        <div className="tracker-placeholder">
          <div className="placeholder-icon">📦</div>
          <p>Start tracking your delivery</p>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-tracker">
      <div className="tracker-header">
        <h3>Delivery Tracking</h3>
        <div className="order-id">Order #{orderId}</div>
      </div>

      {deliveryStatus && (
        <>
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${deliveryStatus.progress}%`,
                  backgroundColor: getStatusColor(deliveryStatus.status)
                }}
              />
            </div>
            <div className="progress-text">
              {deliveryStatus.progress}% Complete
            </div>
          </div>

          {/* Current Status */}
          <div className="current-status">
            <div className="status-icon">
              {getStatusIcon(deliveryStatus.status)}
            </div>
            <div className="status-info">
              <h4>{deliveryStatus.message}</h4>
              <p className="estimated-time">
                <span className="time-icon">⏱️</span>
                ETA: {estimatedTime}
              </p>
            </div>
          </div>

          {/* Delivery Person Info */}
          {deliveryPerson && (
            <div className="delivery-person">
              <h4>Your Delivery Partner</h4>
              <div className="person-info">
                <div className="person-avatar">
                  <span>👨‍💼</span>
                </div>
                <div className="person-details">
                  <h5>{deliveryPerson.name}</h5>
                  <div className="person-meta">
                    <span className="rating">
                      <span className="stars">⭐</span>
                      {deliveryPerson.rating}
                    </span>
                    <span className="vehicle">
                      <span>🛵</span>
                      {deliveryPerson.vehicle}
                    </span>
                  </div>
                  <a 
                    href={`tel:${deliveryPerson.phone}`}
                    className="call-btn"
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Current Location */}
          {currentLocation && (
            <div className="current-location">
              <h4>Current Location</h4>
              <div className="location-info">
                <div className="location-icon">📍</div>
                <div className="location-details">
                  <p>{currentLocation.address}</p>
                  <button className="view-map-btn">
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="tracker-actions">
            <button className="action-btn secondary">
              📞 Contact Restaurant
            </button>
            <button className="action-btn primary">
              📍 Live Tracking
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryTracker;
