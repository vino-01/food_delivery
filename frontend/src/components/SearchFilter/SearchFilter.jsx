import React, { useState, useEffect } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ 
  onSearch, 
  onFilterChange, 
  onSortChange, 
  placeholder = "Search restaurants, cuisines, or dishes...",
  showFilters = true 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: '',
    rating: '',
    priceRange: '',
    deliveryTime: '',
    offers: false,
    vegOnly: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const cuisines = [
    'All Cuisines', 'Indian', 'Chinese', 'Italian', 'Mexican', 
    'Thai', 'Japanese', 'Continental', 'South Indian', 'North Indian'
  ];

  const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: '₹0-200', value: '0-200' },
    { label: '₹200-500', value: '200-500' },
    { label: '₹500-1000', value: '500-1000' },
    { label: '₹1000+', value: '1000+' }
  ];

  const deliveryTimes = [
    { label: 'Any Time', value: '' },
    { label: 'Under 30 mins', value: '30' },
    { label: '30-45 mins', value: '30-45' },
    { label: '45+ mins', value: '45+' }
  ];

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Rating (High to Low)', value: 'rating_desc' },
    { label: 'Rating (Low to High)', value: 'rating_asc' },
    { label: 'Delivery Time', value: 'delivery_time' },
    { label: 'Price (Low to High)', value: 'price_asc' },
    { label: 'Price (High to Low)', value: 'price_desc' },
    { label: 'Distance', value: 'distance' }
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  useEffect(() => {
    onSortChange(sortBy);
  }, [sortBy, onSortChange]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleToggleFilter = (filterType) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      cuisine: '',
      rating: '',
      priceRange: '',
      deliveryTime: '',
      offers: false,
      vegOnly: false
    });
    setSearchQuery('');
    setSortBy('relevance');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.cuisine) count++;
    if (selectedFilters.rating) count++;
    if (selectedFilters.priceRange) count++;
    if (selectedFilters.deliveryTime) count++;
    if (selectedFilters.offers) count++;
    if (selectedFilters.vegOnly) count++;
    return count;
  };

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>
        <button className="search-btn">
          Search
        </button>
      </div>

      {/* Quick Filters */}
      {showFilters && (
        <div className="quick-filters">
          <div className="filter-section">
            <h4>Cuisine</h4>
            <div className="filter-chips">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  className={`filter-chip ${selectedFilters.cuisine === cuisine ? 'active' : ''}`}
                  onClick={() => handleFilterChange('cuisine', cuisine === 'All Cuisines' ? '' : cuisine)}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Rating</h4>
            <div className="rating-filters">
              {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                <button
                  key={rating}
                  className={`rating-filter ${selectedFilters.rating === rating.toString() ? 'active' : ''}`}
                  onClick={() => handleFilterChange('rating', selectedFilters.rating === rating.toString() ? '' : rating.toString())}
                >
                  <span className="stars">⭐</span>
                  <span>{rating}+</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Quick Options</h4>
            <div className="quick-options">
              <button
                className={`quick-option ${selectedFilters.offers ? 'active' : ''}`}
                onClick={() => handleToggleFilter('offers')}
              >
                🎉 Offers
              </button>
              <button
                className={`quick-option ${selectedFilters.vegOnly ? 'active' : ''}`}
                onClick={() => handleToggleFilter('vegOnly')}
              >
                🥬 Veg Only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Toggle */}
      {showFilters && (
        <div className="advanced-filters-toggle">
          <button
            className="toggle-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <span>🔧</span>
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <span className="filter-count">{getActiveFiltersCount()}</span>
            )}
          </button>
          <button
            className="clear-filters-btn"
            onClick={clearFilters}
            disabled={getActiveFiltersCount() === 0}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Price Range</label>
              <select
                value={selectedFilters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="filter-select"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Delivery Time</label>
              <select
                value={selectedFilters.deliveryTime}
                onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
                className="filter-select"
              >
                {deliveryTimes.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      {showFilters && (
        <div className="sort-section">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="active-filters">
          <h4>Active Filters:</h4>
          <div className="active-filter-chips">
            {selectedFilters.cuisine && (
              <span className="active-filter-chip">
                Cuisine: {selectedFilters.cuisine}
                <button onClick={() => handleFilterChange('cuisine', '')}>✕</button>
              </span>
            )}
            {selectedFilters.rating && (
              <span className="active-filter-chip">
                Rating: {selectedFilters.rating}+
                <button onClick={() => handleFilterChange('rating', '')}>✕</button>
              </span>
            )}
            {selectedFilters.priceRange && (
              <span className="active-filter-chip">
                Price: ₹{selectedFilters.priceRange}
                <button onClick={() => handleFilterChange('priceRange', '')}>✕</button>
              </span>
            )}
            {selectedFilters.deliveryTime && (
              <span className="active-filter-chip">
                Delivery: {selectedFilters.deliveryTime} mins
                <button onClick={() => handleFilterChange('deliveryTime', '')}>✕</button>
              </span>
            )}
            {selectedFilters.offers && (
              <span className="active-filter-chip">
                Offers
                <button onClick={() => handleToggleFilter('offers')}>✕</button>
              </span>
            )}
            {selectedFilters.vegOnly && (
              <span className="active-filter-chip">
                Veg Only
                <button onClick={() => handleToggleFilter('vegOnly')}>✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
