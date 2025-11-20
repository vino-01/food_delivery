import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './pages.css'
import { peruduriRestaurants, peruduriAreaInfo } from '../data/peruduriRestaurants'
import { RestaurantBannerImage } from '../components/FoodImages/FoodImage'

const NearbyRestaurants = () => {
  const [location, setLocation] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('distance')

  // Convert restaurant data to the format expected by the component
  const sampleRestaurants = peruduriRestaurants.map(restaurant => ({
    id: restaurant._id,
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    rating: restaurant.rating,
    deliveryTime: `${restaurant.etaMins}-${restaurant.etaMins + 10} min`,
    deliveryFee: restaurant.deliveryFee,
    restaurantId: restaurant._id,
    coordinates: restaurant.location.coordinates,
    address: restaurant.location.address,
    phone: restaurant.phone,
    openHours: restaurant.openHours,
    specialties: restaurant.specialties,
    isVeg: restaurant.isVeg
  }))



  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setLocation(userLocation)
        calculateDistances(userLocation)
      },
      (error) => {
        console.error('Error getting location:', error)
        // Fallback to Perudurai coordinates
        const fallbackLocation = peruduriAreaInfo.mainLocation.coordinates
        setLocation(fallbackLocation)
        calculateDistances(fallbackLocation)
        setError('Using Perudurai location. Enable GPS for precise results.')
      }
    )
  }

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const calculateDistances = (userLocation) => {
    const restaurantsWithDistance = sampleRestaurants.map(restaurant => ({
      ...restaurant,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        restaurant.coordinates.lat,
        restaurant.coordinates.lng
      )
    }))

    setRestaurants(restaurantsWithDistance)
    setLoading(false)
  }

  const sortRestaurants = (restaurants, sortBy) => {
    return [...restaurants].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance
        case 'rating':
          return b.rating - a.rating
        case 'deliveryTime':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
        case 'deliveryFee':
          return a.deliveryFee - b.deliveryFee
        default:
          return 0
      }
    })
  }

  const sortedRestaurants = sortRestaurants(restaurants, sortBy)

  if (loading) {
    return (
      <div className='page'>
        <div className='loading-location'>
          <div className='location-icon'>📍</div>
          <h3>Finding restaurants near you...</h3>
          <p>Please allow location access for better results</p>
        </div>
      </div>
    )
  }

  return (
    <div className='page'>
      <div className='nearby-header'>
        <h2>Restaurants in Perudurai</h2>
        <p className='location-subtitle'>Authentic Tamil cuisine and more, delivered fresh to your door</p>
        {error && <p className='location-error'>{error}</p>}
        {location && (
          <div className='location-info'>
            📍 Serving: {peruduriAreaInfo.deliveryAreas.slice(0, 3).join(', ')} and more areas
          </div>
        )}
        <div className='area-highlights'>
          <span className='highlight'>🚚 Free delivery above ₹200</span>
          <span className='highlight'>⏰ Most deliver in 15-35 mins</span>
          <span className='highlight'>📞 Direct restaurant contact</span>
        </div>
      </div>

      <div className='nearby-controls'>
        <div className='sort-controls'>
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className='sort-select'
          >
            <option value='distance'>Distance</option>
            <option value='rating'>Rating</option>
            <option value='deliveryTime'>Delivery Time</option>
            <option value='deliveryFee'>Delivery Fee</option>
          </select>
        </div>

        <button onClick={getCurrentLocation} className='btn-secondary'>
          📍 Refresh Location
        </button>
      </div>

      <div className='restaurants-grid'>
        {sortedRestaurants.map((restaurant) => (
          <Link 
            key={restaurant.id} 
            to={`/restaurants/${restaurant.id}`}
            className='nearby-restaurant-card'
          >
            <div className='restaurant-image'>
              <RestaurantBannerImage restaurant={restaurant.restaurantId} className="restaurant-banner" />
              {restaurant.isVeg && <span className='veg-indicator'>🟢</span>}
              {!restaurant.isVeg && <span className='non-veg-indicator'>🔴</span>}
            </div>
            
            <div className='restaurant-info'>
              <div className='restaurant-header'>
                <h3>{restaurant.name}</h3>
                <div className='restaurant-status'>
                  <span className='status-dot open'></span>
                  <span>Open</span>
                </div>
              </div>
              <p className='cuisine-type'>{restaurant.cuisine}</p>
              
              {restaurant.specialties && (
                <div className='specialties'>
                  {restaurant.specialties.slice(0, 3).map((specialty, index) => (
                    <span key={index} className='specialty-tag'>{specialty}</span>
                  ))}
                </div>
              )}
              
              <div className='restaurant-stats'>
                <div className='stat'>
                  <span className='stat-icon'>⭐</span>
                  <span>{restaurant.rating}</span>
                </div>
                <div className='stat'>
                  <span className='stat-icon'>🕒</span>
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className='stat'>
                  <span className='stat-icon'>📍</span>
                  <span>{restaurant.distance.toFixed(1)} km</span>
                </div>
              </div>
              
              <div className='restaurant-footer'>
                <div className='footer-row'>
                  <span className='delivery-fee'>₹{restaurant.deliveryFee} delivery</span>
                  <span className='phone-number'>📞 {restaurant.phone}</span>
                </div>
                <div className='footer-row'>
                  <span className='open-hours'>⏰ {restaurant.openHours}</span>
                </div>
                <span className='restaurant-address'>{restaurant.address}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NearbyRestaurants