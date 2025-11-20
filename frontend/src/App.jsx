
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import CustomerOnly from './components/RouteGuards/CustomerOnly.jsx'
import AdminOnly from './components/RouteGuards/AdminOnly.jsx'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import RestaurantDetail from './pages/RestaurantDetail'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CustomerProfile from './pages/CustomerProfile'
import RestaurantDashboard from './pages/RestaurantDashboard'
// AdminDashboard removed from routing (legacy path will redirect)
import NearbyRestaurants from './pages/NearbyRestaurants'
import Cuisines from './pages/Cuisines'
import CuisineDetail from './pages/CuisineDetail'
import Cravings from './pages/Cravings'
import Payment from './pages/Payment'
import OrderTracking from './pages/OrderTracking'
import Orders from './pages/Orders'
import MoodOrdering from './pages/MoodOrdering'
import GroupPaymentCreator from './components/GroupPayment/GroupPaymentCreator'
import GroupPaymentTracker from './components/GroupPayment/GroupPaymentTracker'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './components/NotificationSystem/NotificationSystem'
import './App.css'

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<CustomerOnly><Cart /></CustomerOnly>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<CustomerOnly><CustomerProfile /></CustomerOnly>} />
            <Route path="/payment" element={<CustomerOnly><Payment /></CustomerOnly>} />
            <Route path="/group-orders/create" element={<GroupPaymentCreator />} />
            <Route path="/group-payment/:groupId" element={<GroupPaymentTracker />} />
            <Route path="/restaurant/:restaurantId/dashboard" element={<AdminOnly><RestaurantDashboard /></AdminOnly>} />
            {/* Legacy admin route redirect to new dashboard */}
            <Route path="/admin/:restaurantId" element={<Navigate to="/restaurant/:restaurantId/dashboard" replace />} />
            <Route path="/nearby" element={<NearbyRestaurants />} />
            <Route path="/cuisines" element={<Cuisines />} />
            <Route path="/cuisine/:id" element={<CuisineDetail />} />
            <Route path="/cravings" element={<Cravings />} />
            <Route path="/mood" element={<MoodOrdering />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/my-orders" element={<CustomerOnly><Orders /></CustomerOnly>} />
            <Route path="/orders" element={<Navigate to="/my-orders" replace />} />
          </Routes>
            <Footer />
        </div>
      </Router>
    </CartProvider>
    </NotificationProvider>
  )
}

export default App
