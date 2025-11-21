import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, restaurants, dishes

  useEffect(() => {
    // Simulate fetching wishlist data
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        // Mock wishlist data
        const mockWishlist = [
          {
            id: 'wish_001',
            type: 'restaurant',
            item: {
              id: 'tn_pr_001',
              name: 'Annapoorna Restaurant',
              image: '',
              cuisine: 'South Indian',
              rating: 4.5,
              deliveryTime: '25-30 mins',
              deliveryFee: 30,
              minOrder: 200,
              location: 'Perundurai, Erode',
              isOpen: true,
              offers: ['20% off on orders above ₹300']
            },
            addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'wish_002',
            type: 'restaurant',
            item: {
              id: 'tn_pr_002',
              name: 'Saravana Bhavan',
              image: '🍛',
              cuisine: 'South Indian',
              rating: 4.3,
              deliveryTime: '20-25 mins',
              deliveryFee: 25,
              minOrder: 150,
              location: 'Perundurai, Erode',
              isOpen: true,
              offers: ['Free delivery on orders above ₹250']
            },
            addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'wish_003',
            type: 'dish',
            item: {
              id: 'dish_001',
              name: 'Chicken Biryani',
              image: '🍗',
              restaurant: 'Annapoorna Restaurant',
              restaurantId: 'tn_pr_001',
              price: 180,
              rating: 4.7,
              cuisine: 'Indian',
              description: 'Aromatic basmati rice with tender chicken pieces',
              isAvailable: true,
              prepTime: '20 mins'
            },
            addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'wish_004',
            type: 'dish',
            item: {
              id: 'dish_002',
              name: 'Masala Dosa',
              image: '🥞',
              restaurant: 'Saravana Bhavan',
              restaurantId: 'tn_pr_002',
              price: 80,
              rating: 4.4,
              cuisine: 'South Indian',
              description: 'Crispy dosa with spiced potato filling',
              isAvailable: true,
              prepTime: '15 mins'
            },
            addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setWishlist(mockWishlist);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = (itemId) => {
    setWishlist(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (item) => {
    if (item.type === 'dish') {
      // Add dish to cart
      alert(`Added ${item.item.name} to cart`);
      navigate('/cart');
    } else {
      // Navigate to restaurant
      navigate(`/restaurants/${item.item.id}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
    
    if (diffInDays < 1) {
      return 'Added today';
    } else if (diffInDays < 7) {
      return `Added ${Math.floor(diffInDays)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredWishlist = wishlist.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getFilterCount = (type) => {
    if (type === 'all') return wishlist.length;
    return wishlist.filter(item => item.type === type).length;
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <h1>My Wishlist</h1>
        <div className="wishlist-count">{wishlist.length} items</div>
      </div>

      <div className="wishlist-content">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({getFilterCount('all')})
          </button>
          <button
            className={`filter-tab ${filter === 'restaurant' ? 'active' : ''}`}
            onClick={() => setFilter('restaurant')}
          >
            Restaurants ({getFilterCount('restaurant')})
          </button>
          <button
            className={`filter-tab ${filter === 'dish' ? 'active' : ''}`}
            onClick={() => setFilter('dish')}
          >
            Dishes ({getFilterCount('dish')})
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="wishlist-items">
          {filteredWishlist.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💝</div>
              <h3>Your wishlist is empty</h3>
              <p>
                {filter === 'all' 
                  ? "Start adding restaurants and dishes you love to your wishlist!"
                  : `No ${filter}s in your wishlist yet.`
                }
              </p>
              <button onClick={() => navigate('/')} className="btn-primary">
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {filteredWishlist.map((wishlistItem) => (
                <div key={wishlistItem.id} className="wishlist-card">
                  <div className="card-header">
                    <div className="item-image">
                      {wishlistItem.item.image}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromWishlist(wishlistItem.id)}
                      title="Remove from wishlist"
                    >
                      ❤️
                    </button>
                  </div>

                  <div className="card-content">
                    <h3 className="item-name">{wishlistItem.item.name}</h3>
                    
                    {wishlistItem.type === 'restaurant' ? (
                      <>
                        <p className="item-cuisine">{wishlistItem.item.cuisine}</p>
                        <div className="restaurant-details">
                          <div className="rating">
                            <span className="stars">⭐</span>
                            <span>{wishlistItem.item.rating}</span>
                          </div>
                          <div className="delivery-time">
                            <span>🕐</span>
                            <span>{wishlistItem.item.deliveryTime}</span>
                          </div>
                          <div className="delivery-fee">
                            <span>₹{wishlistItem.item.deliveryFee} delivery</span>
                          </div>
                        </div>
                        <div className="location">
                          <span>📍</span>
                          <span>{wishlistItem.item.location}</span>
                        </div>
                        {wishlistItem.item.offers && wishlistItem.item.offers.length > 0 && (
                          <div className="offers">
                            <span className="offer-tag">🎉 {wishlistItem.item.offers[0]}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="item-restaurant">from {wishlistItem.item.restaurant}</p>
                        <div className="dish-details">
                          <div className="rating">
                            <span className="stars">⭐</span>
                            <span>{wishlistItem.item.rating}</span>
                          </div>
                          <div className="price">
                            <span>₹{wishlistItem.item.price}</span>
                          </div>
                          <div className="prep-time">
                            <span>⏱️</span>
                            <span>{wishlistItem.item.prepTime}</span>
                          </div>
                        </div>
                        <p className="dish-description">{wishlistItem.item.description}</p>
                      </>
                    )}

                    <div className="added-date">
                      {formatDate(wishlistItem.addedDate)}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="action-btn secondary"
                      onClick={() => addToCart(wishlistItem)}
                    >
                      {wishlistItem.type === 'restaurant' ? 'View Menu' : 'Add to Cart'}
                    </button>
                    <button
                      className="action-btn primary"
                      onClick={() => addToCart(wishlistItem)}
                    >
                      {wishlistItem.type === 'restaurant' ? 'Order Now' : 'Order Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
