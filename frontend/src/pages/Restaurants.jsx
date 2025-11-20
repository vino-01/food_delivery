import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { peruduriRestaurants } from '../data/peruduriRestaurants'
import './Restaurants.css' // Import the new CSS file
import '../App.css'

const Restaurants = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('rating') // rating, delivery_time, name
  const [filterBy, setFilterBy] = useState('all') // all, veg, non-veg

  useEffect(() => {
    // Use the new restaurant data
    setList(peruduriRestaurants)
    setLoading(false)
  }, [])

  // Function to get restaurant images based on cuisine
  const getRestaurantImage = (restaurant) => {
    const cuisineImages = {
      'South Indian': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
      'Tamil Non-Veg': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      'Pure Vegetarian': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      'Multi-Cuisine': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      'Biryani Specialist': 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop',
      'Quick Tiffins': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'Sweets & Snacks': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    };

    return cuisineImages[restaurant.cuisine] || 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop';
  }

  // Filter and sort restaurants
  const getFilteredAndSortedRestaurants = () => {
    let filtered = [...list];

    // Filter by type
    if (filterBy === 'veg') {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine === 'Pure Vegetarian' || 
        restaurant.cuisine === 'South Indian' ||
        restaurant.cuisine === 'Sweets & Snacks'
      );
    } else if (filterBy === 'non-veg') {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine === 'Tamil Non-Veg' || 
        restaurant.cuisine === 'Biryani Specialist'
      );
    }

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'delivery_time':
          const timeA = parseInt(a.deliveryTime.split('-')[0]);
          const timeB = parseInt(b.deliveryTime.split('-')[0]);
          return timeA - timeB;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredRestaurants = getFilteredAndSortedRestaurants();

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="restaurants-page">
      <div className="container">
        {/* Header */}
        <div className="restaurants-header">
          <h1>🍽️ Restaurants in Perudurai</h1>
          <p>
            Discover the best local restaurants serving delicious food from traditional South Indian to modern multi-cuisine delights
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="filters-sort-bar">
          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button
              onClick={() => setFilterBy('all')}
              className={`btn ${filterBy === 'all' ? 'active' : ''}`}
            >
              🍽️ All Cuisines
            </button>
            <button
              onClick={() => setFilterBy('veg')}
              className={`btn ${filterBy === 'veg' ? 'active' : ''}`}
            >
              🥬 Vegetarian
            </button>
            <button
              onClick={() => setFilterBy('non-veg')}
              className={`btn ${filterBy === 'non-veg' ? 'active' : ''}`}
            >
              🍗 Non-Vegetarian
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="rating">⭐ Sort by Rating</option>
            <option value="delivery_time">🕒 Sort by Delivery Time</option>
            <option value="name">📝 Sort by Name</option>
          </select>
        </div>

        {/* Restaurant Grid */}
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurants/${restaurant._id}`}
              className="restaurant-card"
            >
              <div
                className="restaurant-image-wrapper"
                style={{
                  backgroundImage: `url(${getRestaurantImage(restaurant)})`,
                }}
              >
                {/* Cuisine Badge */}
                <div className="cuisine-badge">
                  {restaurant.cuisine}
                </div>
                
                {/* Rating Badge */}
                <div className="rating-badge">
                  ⭐ {restaurant.rating}
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="restaurant-info-content">
                {/* Name and Cuisine */}
                <div>
                  <h3>{restaurant.name}</h3>
                  <p className="restaurant-meta-details">
                    {restaurant.cuisine} • {restaurant.deliveryTime}
                  </p>
                </div>
                
                {/* Description */}
                <p className="restaurant-description">
                  {restaurant.description}
                </p>

                {/* Restaurant Details */}
                <div className="restaurant-details-footer">
                  <div className="delivery-min-order">
                    <span>🕒 {restaurant.deliveryTime}</span>
                    <span>💰 Min. ₹{restaurant.minOrder}</span>
                  </div>
                  <span className="view-menu-btn" aria-hidden="true">
                    👀 View Menu
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No restaurants found */}
        {filteredRestaurants.length === 0 && !loading && (
          <div className="no-restaurants-found">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
            <h3>No restaurants found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Restaurants


