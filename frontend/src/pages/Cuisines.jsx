import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cuisines, cravings, dietaryFilters, priceRanges, getPopularCuisines } from '../data/cuisinesData'
import './pages.css'

const Cuisines = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDietary, setSelectedDietary] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [filteredCuisines, setFilteredCuisines] = useState(cuisines)
  const [selectedCraving, setSelectedCraving] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list

  useEffect(() => {
    let filtered = [...cuisines]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cuisine => 
        cuisine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuisine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuisine.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Dietary filter
    if (selectedDietary.length > 0) {
      filtered = filtered.filter(cuisine =>
        selectedDietary.some(diet => cuisine.dietary.includes(diet))
      )
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = priceRanges.find(p => p.id === selectedPriceRange)
      if (range) {
        filtered = filtered.filter(cuisine =>
          cuisine.avgPrice >= range.range[0] && cuisine.avgPrice <= range.range[1]
        )
      }
    }

    // Craving filter
    if (selectedCraving) {
      const craving = cravings.find(c => c.id === selectedCraving)
      if (craving) {
        filtered = filtered.filter(cuisine =>
          craving.matchingCuisines.includes(cuisine.id)
        )
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity
        case 'price-low':
          return a.avgPrice - b.avgPrice
        case 'price-high':
          return b.avgPrice - a.avgPrice
        case 'delivery-time':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
        case 'restaurants':
          return b.restaurants - a.restaurants
        default:
          return 0
      }
    })

    setFilteredCuisines(filtered)
  }, [searchTerm, selectedDietary, selectedPriceRange, sortBy, selectedCraving])

  const toggleDietary = (dietId) => {
    setSelectedDietary(prev =>
      prev.includes(dietId)
        ? prev.filter(d => d !== dietId)
        : [...prev, dietId]
    )
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedDietary([])
    setSelectedPriceRange('')
    setSelectedCraving('')
    setSortBy('popularity')
  }

  const popularCuisines = getPopularCuisines()

  return (
    <div className='page cuisines-page'>
      {/* Hero Section */}
      <div className='cuisines-hero'>
        <div className='hero-content'>
          <h1>Explore All Cuisines</h1>
          <p>Discover flavors from around the world, delivered to your doorstep</p>
          <div className='hero-stats'>
            <div className='stat'>
              <span className='stat-number'>{cuisines.length}</span>
              <span className='stat-label'>Cuisines</span>
            </div>
            <div className='stat'>
              <span className='stat-number'>{cuisines.reduce((sum, c) => sum + c.restaurants, 0)}</span>
              <span className='stat-label'>Restaurants</span>
            </div>
            <div className='stat'>
              <span className='stat-number'>30 min</span>
              <span className='stat-label'>Avg Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Cuisines Quick Access */}
      <section className='popular-cuisines-section'>
        <h2>🔥 Trending Now</h2>
        <div className='popular-cuisines-grid'>
          {popularCuisines.map(cuisine => (
            <Link 
              key={cuisine.id} 
              to={`/cuisine/${cuisine.id}`}
              className='popular-cuisine-card'
              style={{ '--cuisine-color': cuisine.color }}
            >
              <div className='cuisine-emoji'>{cuisine.emoji}</div>
              <div className='cuisine-info'>
                <h3>{cuisine.name}</h3>
                <p>{cuisine.restaurants} restaurants</p>
                <div className='popularity-bar'>
                  <div 
                    className='popularity-fill' 
                    style={{ width: `${cuisine.popularity}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cravings Section */}
      <section className='cravings-section'>
        <h2>🎯 What are you craving?</h2>
        <div className='cravings-grid'>
          {cravings.map(craving => (
            <button
              key={craving.id}
              className={`craving-card ${selectedCraving === craving.id ? 'active' : ''}`}
              style={{ '--craving-color': craving.color }}
              onClick={() => setSelectedCraving(selectedCraving === craving.id ? '' : craving.id)}
            >
              <div className='craving-emoji'>{craving.emoji}</div>
              <div className='craving-info'>
                <h3>{craving.name}</h3>
                <p>{craving.description}</p>
                <div className='craving-intensity'>
                  <span className={`intensity-badge ${craving.intensity}`}>
                    {craving.intensity} intensity
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Filters and Search */}
      <div className='filters-section'>
        <div className='search-bar'>
          <div className='search-input-wrapper'>
            <span className='search-icon'>🔍</span>
            <input
              type='text'
              placeholder='Search cuisines, dishes, or restaurants...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='search-input'
            />
            {searchTerm && (
              <button 
                className='clear-search'
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className='filters-row'>
          <div className='filter-group'>
            <label>Dietary Preferences:</label>
            <div className='dietary-filters'>
              {dietaryFilters.map(diet => (
                <button
                  key={diet.id}
                  className={`dietary-filter ${selectedDietary.includes(diet.id) ? 'active' : ''}`}
                  style={{ '--diet-color': diet.color }}
                  onClick={() => toggleDietary(diet.id)}
                >
                  <span className='diet-emoji'>{diet.emoji}</span>
                  {diet.name}
                </button>
              ))}
            </div>
          </div>

          <div className='filter-group'>
            <label>Price Range:</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className='price-filter'
            >
              <option value=''>All Prices</option>
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.emoji} {range.name} (₹{range.range[0]}-₹{range.range[1]})
                </option>
              ))}
            </select>
          </div>

          <div className='filter-group'>
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='sort-filter'
            >
              <option value='popularity'>🔥 Popularity</option>
              <option value='price-low'>💰 Price: Low to High</option>
              <option value='price-high'>💎 Price: High to Low</option>
              <option value='delivery-time'>⚡ Fastest Delivery</option>
              <option value='restaurants'>🏪 Most Restaurants</option>
            </select>
          </div>

          <div className='view-controls'>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>

        {(selectedDietary.length > 0 || selectedPriceRange || selectedCraving || searchTerm) && (
          <div className='active-filters'>
            <span>Active filters:</span>
            {selectedDietary.map(dietId => {
              const diet = dietaryFilters.find(d => d.id === dietId)
              return (
                <span key={dietId} className='filter-tag'>
                  {diet.emoji} {diet.name}
                  <button onClick={() => toggleDietary(dietId)}>✕</button>
                </span>
              )
            })}
            {selectedPriceRange && (
              <span className='filter-tag'>
                {priceRanges.find(p => p.id === selectedPriceRange)?.emoji} 
                {priceRanges.find(p => p.id === selectedPriceRange)?.name}
                <button onClick={() => setSelectedPriceRange('')}>✕</button>
              </span>
            )}
            {selectedCraving && (
              <span className='filter-tag'>
                {cravings.find(c => c.id === selectedCraving)?.emoji} 
                {cravings.find(c => c.id === selectedCraving)?.name}
                <button onClick={() => setSelectedCraving('')}>✕</button>
              </span>
            )}
            {searchTerm && (
              <span className='filter-tag'>
                🔍 "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>✕</button>
              </span>
            )}
            <button className='clear-all-filters' onClick={clearAllFilters}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className='results-section'>
        <div className='results-header'>
          <h2>
            {filteredCuisines.length} Cuisine{filteredCuisines.length !== 1 ? 's' : ''} Found
          </h2>
          <p>Showing results {filteredCuisines.length > 0 ? '1' : '0'}-{filteredCuisines.length} of {filteredCuisines.length}</p>
        </div>

        {filteredCuisines.length === 0 ? (
          <div className='no-results'>
            <div className='no-results-icon'>😔</div>
            <h3>No cuisines found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className='btn primary' onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`cuisines-grid ${viewMode}`}>
            {filteredCuisines.map(cuisine => (
              <Link
                key={cuisine.id}
                to={`/cuisine/${cuisine.id}`}
                className='cuisine-card'
                style={{ '--cuisine-color': cuisine.color }}
              >
                <div className='cuisine-header'>
                  <div className='cuisine-emoji-large'>{cuisine.emoji}</div>
                  <div className='cuisine-meta'>
                    <h3>{cuisine.name}</h3>
                    <p className='cuisine-description'>{cuisine.description}</p>
                    <div className='cuisine-stats'>
                      <span className='stat'>
                        <span className='stat-icon'>🏪</span>
                        {cuisine.restaurants} restaurants
                      </span>
                      <span className='stat'>
                        <span className='stat-icon'>⚡</span>
                        {cuisine.deliveryTime}
                      </span>
                      <span className='stat'>
                        <span className='stat-icon'>💰</span>
                        ₹{cuisine.avgPrice} avg
                      </span>
                    </div>
                  </div>
                </div>

                <div className='cuisine-specialties'>
                  <h4>Popular dishes:</h4>
                  <div className='specialties-list'>
                    {cuisine.specialties.slice(0, 4).map((specialty, idx) => (
                      <span key={idx} className='specialty-tag'>
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='cuisine-dishes'>
                  <div className='top-dishes'>
                    {cuisine.topDishes.slice(0, 3).map((dish, idx) => (
                      <div key={idx} className='dish-preview'>
                        <span className='dish-emoji'>{dish.image}</span>
                        <div className='dish-info'>
                          <span className='dish-name'>{dish.name}</span>
                          <span className='dish-price'>₹{dish.price}</span>
                          <span className='dish-rating'>⭐ {dish.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='cuisine-footer'>
                  <div className='popularity-indicator'>
                    <span className='popularity-label'>Popularity</span>
                    <div className='popularity-bar'>
                      <div 
                        className='popularity-fill' 
                        style={{ width: `${cuisine.popularity}%` }}
                      ></div>
                    </div>
                    <span className='popularity-score'>{cuisine.popularity}%</span>
                  </div>
                  
                  <div className='dietary-badges'>
                    {cuisine.dietary.slice(0, 2).map((diet, idx) => {
                      const dietInfo = dietaryFilters.find(d => d.id === diet)
                      return dietInfo ? (
                        <span key={idx} className='dietary-badge' style={{ '--diet-color': dietInfo.color }}>
                          {dietInfo.emoji}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cuisines