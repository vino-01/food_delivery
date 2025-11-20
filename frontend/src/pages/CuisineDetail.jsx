import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCuisineById, cuisines, dietaryFilters } from '../data/cuisinesData'
import { showToast } from '../utils/toast'
import './pages.css'

const CuisineDetail = () => {
  const { id } = useParams()
  const [cuisine, setCuisine] = useState(null)
  const [selectedDish, setSelectedDish] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dishes') // dishes, restaurants, about
  const [sortBy, setSortBy] = useState('rating')
  const [priceFilter, setPriceFilter] = useState('all')

  useEffect(() => {
    const cuisineData = getCuisineById(id)
    if (cuisineData) {
      setCuisine(cuisineData)
      // Simulate loading restaurants
      setTimeout(() => {
        setRestaurants(generateMockRestaurants(cuisineData))
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [id])

  const generateMockRestaurants = (cuisineData) => {
    const restaurantNames = [
      'Spice Garden', 'Royal Kitchen', 'Food Paradise', 'Taste Buds', 'Flavor Junction',
      'Golden Spoon', 'Curry House', 'Delicious Bites', 'Food Corner', 'Tasty Treats',
      'Spice Route', 'Kitchen King', 'Food Factory', 'Taste Palace', 'Flavor Street'
    ]
    
    return Array.from({ length: Math.min(15, cuisineData.restaurants) }, (_, i) => ({
      id: `${cuisineData.id}-restaurant-${i}`,
      name: restaurantNames[i % restaurantNames.length] + (i > 14 ? ` ${Math.floor(i/15) + 1}` : ''),
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      deliveryTime: `${20 + Math.floor(Math.random() * 20)}-${30 + Math.floor(Math.random() * 20)} min`,
      deliveryFee: Math.floor(Math.random() * 50) + 20,
      minOrder: Math.floor(Math.random() * 200) + 100,
      distance: (Math.random() * 5 + 0.5).toFixed(1),
      image: cuisineData.emoji,
      specialties: cuisineData.specialties.slice(0, 3),
      offers: Math.random() > 0.5 ? [`${Math.floor(Math.random() * 30) + 10}% OFF`] : [],
      isOpen: Math.random() > 0.2
    }))
  }

  const addToCart = (dish) => {
    showToast(`${dish.name} added to cart!`)
    // Here you would typically add to cart logic
  }

  const sortedDishes = cuisine ? [...cuisine.topDishes].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  }) : []

  const filteredDishes = sortedDishes.filter(dish => {
    if (priceFilter === 'all') return true
    if (priceFilter === 'budget') return dish.price <= 150
    if (priceFilter === 'moderate') return dish.price > 150 && dish.price <= 300
    if (priceFilter === 'premium') return dish.price > 300
    return true
  })

  if (loading) {
    return (
      <div className='page cuisine-detail-page loading'>
        <div className='loading-spinner'>
          <div className='spinner'></div>
          <p>Loading delicious details...</p>
        </div>
      </div>
    )
  }

  if (!cuisine) {
    return (
      <div className='page cuisine-detail-page not-found'>
        <div className='not-found-content'>
          <div className='not-found-icon'>😔</div>
          <h2>Cuisine not found</h2>
          <p>The cuisine you're looking for doesn't exist or has been removed.</p>
          <Link to='/cuisines' className='btn primary'>
            Browse All Cuisines
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='page cuisine-detail-page'>
      {/* Hero Section */}
      <div className='cuisine-hero' style={{ '--cuisine-color': cuisine.color }}>
        <div className='hero-background'></div>
        <div className='hero-content'>
          <div className='cuisine-main-info'>
            <div className='cuisine-emoji-hero'>{cuisine.emoji}</div>
            <div className='cuisine-details'>
              <h1>{cuisine.name}</h1>
              <p className='cuisine-description'>{cuisine.description}</p>
              
              <div className='cuisine-quick-stats'>
                <div className='quick-stat'>
                  <span className='stat-icon'>🏪</span>
                  <div>
                    <strong>{cuisine.restaurants}</strong>
                    <span>Restaurants</span>
                  </div>
                </div>
                <div className='quick-stat'>
                  <span className='stat-icon'>⚡</span>
                  <div>
                    <strong>{cuisine.deliveryTime}</strong>
                    <span>Delivery</span>
                  </div>
                </div>
                <div className='quick-stat'>
                  <span className='stat-icon'>💰</span>
                  <div>
                    <strong>₹{cuisine.avgPrice}</strong>
                    <span>Average</span>
                  </div>
                </div>
                <div className='quick-stat'>
                  <span className='stat-icon'>🔥</span>
                  <div>
                    <strong>{cuisine.popularity}%</strong>
                    <span>Popular</span>
                  </div>
                </div>
              </div>

              <div className='cuisine-dietary-info'>
                {cuisine.dietary.map((diet, idx) => {
                  const dietInfo = dietaryFilters.find(d => d.id === diet)
                  return dietInfo ? (
                    <span key={idx} className='dietary-badge' style={{ '--diet-color': dietInfo.color }}>
                      {dietInfo.emoji} {dietInfo.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='cuisine-nav'>
        <div className='nav-tabs'>
          <button
            className={`nav-tab ${activeTab === 'dishes' ? 'active' : ''}`}
            onClick={() => setActiveTab('dishes')}
          >
Popular Dishes
          </button>
          <button
            className={`nav-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurants')}
          >
            🏪 Restaurants ({restaurants.length})
          </button>
          <button
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ About
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className='cuisine-content'>
        {activeTab === 'dishes' && (
          <div className='dishes-section'>
            <div className='section-header'>
              <h2>Popular {cuisine.name} Dishes</h2>
              <div className='dishes-controls'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='sort-select'
                >
                  <option value='rating'>⭐ Highest Rated</option>
                  <option value='price-low'>💰 Price: Low to High</option>
                  <option value='price-high'>💎 Price: High to Low</option>
                  <option value='name'>🔤 Name A-Z</option>
                </select>
                
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className='price-select'
                >
                  <option value='all'>All Prices</option>
                  <option value='budget'>💰 Budget (≤₹150)</option>
                  <option value='moderate'>💳 Moderate (₹150-300)</option>
                  <option value='premium'>💎 Premium (&gt;₹300)</option>
                </select>
              </div>
            </div>

            <div className='dishes-grid'>
              {filteredDishes.map((dish, idx) => (
                <div key={idx} className='dish-card'>
                  <div className='dish-image'>
                    <span className='dish-emoji'>{dish.image}</span>
                    <div className='dish-rating'>
                      <span>⭐ {dish.rating}</span>
                    </div>
                  </div>
                  
                  <div className='dish-info'>
                    <h3>{dish.name}</h3>
                    <p className='dish-price'>₹{dish.price}</p>
                    
                    <div className='dish-actions'>
                      <button
                        className='btn primary'
                        onClick={() => addToCart(dish)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className='btn secondary'
                        onClick={() => setSelectedDish(dish)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDishes.length === 0 && (
              <div className='no-dishes'>
                <div className='no-dishes-icon'>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#d1d5db"/>
                  </svg>
                </div>
                <h3>No dishes found</h3>
                <p>Try adjusting your price filter</p>
                <button className='btn primary' onClick={() => setPriceFilter('all')}>
                  Show All Dishes
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className='restaurants-section'>
            <div className='section-header'>
              <h2>{cuisine.name} Restaurants Near You</h2>
              <p>Discover the best places serving authentic {cuisine.name.toLowerCase()} cuisine</p>
            </div>

            <div className='restaurants-grid'>
              {restaurants.map(restaurant => (
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.id}`}
                  className={`restaurant-card ${!restaurant.isOpen ? 'closed' : ''}`}
                >
                  <div className='restaurant-header'>
                    <div className='restaurant-image'>
                      <span className='restaurant-emoji'>{restaurant.image}</span>
                      {!restaurant.isOpen && (
                        <div className='closed-overlay'>
                          <span>Closed</span>
                        </div>
                      )}
                    </div>
                    
                    <div className='restaurant-info'>
                      <h3>{restaurant.name}</h3>
                      <div className='restaurant-meta'>
                        <span className='rating'>⭐ {restaurant.rating}</span>
                        <span className='delivery-time'>⚡ {restaurant.deliveryTime}</span>
                        <span className='distance'>📍 {restaurant.distance} km</span>
                      </div>
                    </div>
                  </div>

                  <div className='restaurant-specialties'>
                    {restaurant.specialties.map((specialty, idx) => (
                      <span key={idx} className='specialty-tag'>
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className='restaurant-footer'>
                    <div className='delivery-info'>
                      <span>₹{restaurant.deliveryFee} delivery</span>
                      <span>₹{restaurant.minOrder} minimum</span>
                    </div>
                    
                    {restaurant.offers.length > 0 && (
                      <div className='offers'>
                        {restaurant.offers.map((offer, idx) => (
                          <span key={idx} className='offer-tag'>
                            {offer}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className='about-section'>
            <div className='about-content'>
              <h2>About {cuisine.name} Cuisine</h2>
              
              <div className='about-grid'>
                <div className='about-card'>
                  <h3>Signature Dishes</h3>
                  <div className='specialties-detailed'>
                    {cuisine.specialties.map((specialty, idx) => (
                      <div key={idx} className='specialty-item'>
                        <span className='specialty-name'>{specialty}</span>
                        <span className='specialty-description'>
                          Traditional {specialty.toLowerCase()} prepared with authentic spices and techniques
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='about-card'>
                  <h3>📊 Cuisine Statistics</h3>
                  <div className='stats-detailed'>
                    <div className='stat-item'>
                      <span className='stat-label'>Popularity Ranking</span>
                      <div className='stat-bar'>
                        <div 
                          className='stat-fill' 
                          style={{ width: `${cuisine.popularity}%`, backgroundColor: cuisine.color }}
                        ></div>
                      </div>
                      <span className='stat-value'>{cuisine.popularity}%</span>
                    </div>
                    
                    <div className='stat-item'>
                      <span className='stat-label'>Average Price Range</span>
                      <span className='stat-value'>₹{Math.floor(cuisine.avgPrice * 0.7)} - ₹{Math.floor(cuisine.avgPrice * 1.3)}</span>
                    </div>
                    
                    <div className='stat-item'>
                      <span className='stat-label'>Available Restaurants</span>
                      <span className='stat-value'>{cuisine.restaurants} locations</span>
                    </div>
                    
                    <div className='stat-item'>
                      <span className='stat-label'>Average Delivery Time</span>
                      <span className='stat-value'>{cuisine.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                <div className='about-card'>
                  <h3>🥗 Dietary Information</h3>
                  <div className='dietary-detailed'>
                    {cuisine.dietary.map((diet, idx) => {
                      const dietInfo = dietaryFilters.find(d => d.id === diet)
                      return dietInfo ? (
                        <div key={idx} className='dietary-item'>
                          <span className='dietary-emoji'>{dietInfo.emoji}</span>
                          <div className='dietary-info'>
                            <span className='dietary-name'>{dietInfo.name}</span>
                            <span className='dietary-description'>
                              {diet === 'vegetarian' && 'Plant-based options available'}
                              {diet === 'vegan' && 'Completely plant-based dishes'}
                              {diet === 'non-vegetarian' && 'Meat and poultry dishes'}
                              {diet === 'keto' && 'Low-carb, high-fat options'}
                              {diet === 'gluten-free' && 'Wheat-free alternatives'}
                              {diet === 'vegan-friendly' && 'Easily customizable for vegans'}
                            </span>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dish Detail Modal */}
      {selectedDish && (
        <div className='dish-modal-overlay' onClick={() => setSelectedDish(null)}>
          <div className='dish-modal' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={() => setSelectedDish(null)}>
              ✕
            </button>
            
            <div className='modal-content'>
              <div className='dish-modal-image'>
                <span className='dish-emoji-large'>{selectedDish.image}</span>
              </div>
              
              <div className='dish-modal-info'>
                <h2>{selectedDish.name}</h2>
                <div className='dish-modal-meta'>
                  <span className='dish-modal-price'>₹{selectedDish.price}</span>
                  <span className='dish-modal-rating'>⭐ {selectedDish.rating}</span>
                </div>
                
                <p className='dish-modal-description'>
                  Authentic {selectedDish.name.toLowerCase()} prepared with traditional spices and cooking methods. 
                  A perfect representation of {cuisine.name.toLowerCase()} cuisine.
                </p>
                
                <div className='dish-modal-actions'>
                  <button
                    className='btn primary large'
                    onClick={() => {
                      addToCart(selectedDish)
                      setSelectedDish(null)
                    }}
                  >
                    Add to Cart - ₹{selectedDish.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CuisineDetail