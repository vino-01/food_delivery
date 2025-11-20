import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { showToast } from '../utils/toast'
import { peruduriRestaurants } from '../data/peruduriRestaurants'
import './RestaurantDetail.css'

const RestaurantDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [restaurant, setRestaurant] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find restaurant by ID
    const foundRestaurant = peruduriRestaurants.find(r => r._id === id)
    if (foundRestaurant) {
      setRestaurant(foundRestaurant)
    } else {
      showToast('Restaurant not found', 'error')
      navigate('/restaurants')
    }
    setLoading(false)
  }, [id, navigate])

  const handleAddToCart = (item) => {
    // Check if item has allergens or customizations
    if (item.allergens && item.allergens.length > 0) {
      // Show customization modal for items with allergens
      const customizations = {
        specialInstructions: '',
        itemAllergens: item.allergens,
        cooking: 'Medium',
        temperature: 'Hot'
      }
      
      addToCart({
        ...item,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        customizations
      })
      
      showToast(`${item.name} added to cart with allergen info`, 'success')
    } else {
      // Add directly to cart
      addToCart({
        ...item,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        customizations: {
          specialInstructions: '',
          itemAllergens: [],
          cooking: 'Medium',
          temperature: 'Hot'
        }
      })
      
      showToast(`${item.name} added to cart`, 'success')
    }
  }

  const getCategories = () => {
    if (!restaurant?.menu) return []
    
    const categories = ['all']
    restaurant.menu.forEach(item => {
      if (item.category && !categories.includes(item.category)) {
        categories.push(item.category)
      }
    })
    return categories
  }

  const getFilteredMenu = () => {
    if (!restaurant?.menu) return []
    
    let filtered = restaurant.menu
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  }

  if (loading) {
    return (
      <div className="restaurant-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading restaurant...</p>
      </div>
    )
  }

  if (!restaurant) {
    return null
  }

  const categories = getCategories()
  const filteredMenu = getFilteredMenu()

  return (
    <div className="restaurant-detail">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="restaurant-info">
              <div className="restaurant-logo">
                <span className="logo-icon">{restaurant.icon || '🍽️'}</span>
              </div>
              <div className="restaurant-details">
                <h1>{restaurant.name}</h1>
                <p className="cuisine-type">{restaurant.cuisine}</p>
                <div className="restaurant-meta">
                  <span className="rating">⭐ {restaurant.rating || '4.5'}</span>
                  <span className="delivery-time">🕒 {restaurant.deliveryTime || '25-30 min'}</span>
                  <span className="min-order">💰 Min. ₹{restaurant.minOrder || '100'}</span>
                </div>
                <p className="restaurant-description">
                  {restaurant.description || 'Delicious food delivered fresh to your doorstep'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="menu-controls">
        <div className="container">
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search in menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="categories-section">
            <div className="categories-scroll">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                >
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <div className="container">
          <div className="menu-header">
            <h2>Menu</h2>
            <p>{filteredMenu.length} items available</p>
          </div>
          
          {filteredMenu.length === 0 ? (
            <div className="no-items">
              <div className="no-items-icon">🔍</div>
              <h3>No items found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="menu-grid">
              {filteredMenu.map((item) => (
                <div key={item._id} className="menu-item">
                  <div className="item-image" >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="menu-item-img" />
                    ) : (
                      <span className="item-icon">🍽️</span>
                    )}
                  </div>
                  
                  <div className="item-content">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                    
                    <p className="item-description">
                      {item.description || 'Delicious food item'}
                    </p>
                    
                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="item-ingredients">
                        <span className="ingredients-label">Ingredients:</span>
                        <div className="ingredients-list">
                          {item.ingredients.map((ingredient, idx) => (
                            <span key={idx} className="ingredient-tag">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="item-allergens">
                        <span className="allergen-warning">⚠️ Contains: {item.allergens.join(', ')}</span>
                      </div>
                    )}
                    
                    <div className="item-actions">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="add-to-cart-btn"
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetail

const getCategoryIcon = (category) => {
  switch (category) {
    case 'all': return '🍽️';
    case 'breakfast': return '🍳';
    case 'starters': return '🥗';
    case 'main-course': return '🍛';
    case 'rice': return '🍚';
    case 'breads': return '🍞';
    case 'curries': return '🥘';
    case 'desserts': return '🍰';
    case 'beverages': return '🥤';
    case 'snacks': return '🥨';
    case 'soups': return '🍜';
    default: return '🍽️';
  }
};