import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

const AdminOnly = ({ children }) => {
  const userRole = localStorage.getItem('userRole')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (userRole === 'restaurant_admin' && user?.restaurantId) {
    return children
  }
  // Customers or unauthenticated redirect home
  return <Navigate to="/" replace />
}

export default AdminOnly
