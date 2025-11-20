import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const CustomerOnly = ({ children }) => {
  const location = useLocation()
  const userRole = localStorage.getItem('userRole')
  if (userRole === 'customer') return children
  // If admin logged in, send to its dashboard
  if (userRole === 'restaurant_admin') {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user?.restaurantId) {
      return <Navigate to={`/restaurant/${user.restaurantId}/dashboard`} replace />
    }
    return <Navigate to="/login" replace />
  }
  // Not logged in
  return <Navigate to="/login" state={{ from: location }} replace />
}

export default CustomerOnly
