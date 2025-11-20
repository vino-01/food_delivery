import React, { useEffect, useState } from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { showToast } from '../utils/toast'
import AllergenManager from '../components/AllergenManager/AllergenManager'

const Menu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { addToCart } = useCart()
  const [showCustomization, setShowCustomization] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [customizations, setCustomizations] = useState({})

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/menu')
        if (!res.ok) throw new Error('Failed to load menu')
        const data = await res.json()
        setMenuItems(data)
      } catch (e) {
        setError('Could not load menu')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className='page loading-state'>
      <span className="loading-spinner">🍽️</span>
      <h2>Loading Menu...</h2>
      <p>Fetching delicious items for you!</p>
    </div>
  )
  if (error) return (
    <div className='page error-state'>
      <h2>Error Loading Menu</h2>
      <p>{error}. Please try again later.</p>
    </div>
  )

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))]
  
  // Filter items by category
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const handleAddToCart = (item, itemCustomizations = {}) => {
    addToCart({
      name: item.name,
      price: item.price,
      restaurantId: item.restaurantId || '1',
      restaurantName: item.restaurantName || 'YummyBites Kitchen',
      customizations: itemCustomizations,
      allergyNote: itemCustomizations?.specialInstructions || null,
      allergenInfo: {
        allergens: item.allergens || [],
        userAllergens: itemCustomizations.allergens || [],
        warnings: item.allergens?.filter(a => itemCustomizations.allergens?.includes(a)) || []
      }
    })

    showToast(itemCustomizations?.specialInstructions 
      ? `${item.name} added with instructions`
      : `${item.name} added to cart!`, 'success')

    setShowCustomization(false)
    setSelectedItem(null)
    setCustomizations({})
  }

  const openCustomization = (item) => {
    setSelectedItem(item)
    setShowCustomization(true)
    setCustomizations({})
  }

  return (
    <div className='menu-page'>
      <div className='menu-page-header'>
        <h1>Our Complete Menu</h1>
        <p>Explore all our delicious dishes with detailed ingredients</p>
      </div>

      {/* Category Filter */}
      <div className='category-filter container'>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className='menu-items-grid'>
        {filteredItems.map(item => (
          <div key={item._id || item.name} className='menu-item-card enhanced'>
            <div className='menu-item-header'>
              <div className='item-indicators'>
                <span className={item.veg ? 'veg' : 'nonveg'} />
                {item.allergens && item.allergens.length > 0 && (
                  <span className='allergen-indicator' title={`Contains: ${item.allergens.join(', ')}`}>
                    ⚠️
                  </span>
                )}
              </div>
              <h3>{item.name}</h3>
              <span className='item-price'>₹{item.price}</span>
            </div>
            
            <p className='item-description'>{item.description}</p>
            
            {item.ingredients && item.ingredients.length > 0 && (
              <div className='item-ingredients'>
                <strong>Ingredients:</strong>
                <div className='ingredients-list'>
                  {item.ingredients.map((ingredient, index) => (
                    <span key={index} className='ingredient-tag'>{ingredient}</span>
                  ))}
                </div>
              </div>
            )}
            
            {item.allergens && item.allergens.length > 0 && (
              <div className='item-allergens'>
                <strong>Allergens:</strong> {item.allergens.join(', ')}
              </div>
            )}
            
            <button 
              className='btn primary add-to-cart-btn'
              onClick={() => openCustomization(item)}
            >
              Customize & Add
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className='no-items'>
          <p>No items found in this category.</p>
        </div>
      )}

      {showCustomization && selectedItem && (
        <div className='customization-modal' onClick={(e) => {
          if (e.target.className === 'customization-modal') setShowCustomization(false)
        }}>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Customize: {selectedItem.name}</h2>
              <button className='close-btn' onClick={() => setShowCustomization(false)}>×</button>
            </div>

            <div className='modal-body'>
              <AllergenManager
                menuItem={selectedItem}
                customizations={customizations}
                onCustomizationChange={setCustomizations}
              />
            </div>

            <div className='modal-footer'>
              <div className='price-summary'>
                <span className='final-price'>₹{selectedItem.price}</span>
                {customizations.portion && customizations.portion !== 'Regular' && (
                  <span className='portion-note'>({customizations.portion} portion)</span>
                )}
              </div>
              <div className='modal-actions'>
                <button className='btn btn-secondary' onClick={() => setShowCustomization(false)}>Cancel</button>
                <button className='btn btn-primary' onClick={() => handleAddToCart(selectedItem, customizations)}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu


