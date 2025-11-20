import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'
import { apiRequest } from '../services/api'

const Login = () => {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState('customer')
  const [checkingLogin, setCheckingLogin] = useState(true)
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const checkExistingLogin = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userRole = localStorage.getItem('userRole')

      if (user.id && userRole) {
        if (userRole === 'customer') {
          navigate('/')
          return
        } else if (userRole === 'restaurant_admin' && user.restaurantId) {
          navigate(`/restaurant/${user.restaurantId}/dashboard`)
          return
        }
      }

      setCheckingLogin(false)
    }

    setTimeout(checkExistingLogin, 100)
  }, [navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (loginType === 'restaurant') {
        // Restaurant admin login - Perundarai restaurants only (IDs match peruduriRestaurants)
        const restaurantCredentials = {
          '9876543210': { password: '1234', restaurantId: 'pr001', name: 'Annapoorna Restaurant' },
          '9876543211': { password: '1234', restaurantId: 'pr002', name: 'Hotel Selvam' },
          '9876543212': { password: '1234', restaurantId: 'pr003', name: 'Sri Lakshmi Vilas' },
          '9876543213': { password: '1234', restaurantId: 'pr004', name: 'Modern Cafe' },
          '9876543214': { password: '1234', restaurantId: 'pr005', name: 'Thalappakatti Biryani' },
          '9876543215': { password: '1234', restaurantId: 'pr006', name: 'Quick Tiffin Center' },
          '9876543216': { password: '1234', restaurantId: 'pr007', name: 'Royal Sweets & Snacks' }
        };

        if (restaurantCredentials[mobile] && restaurantCredentials[mobile].password === password) {
          const restaurantUser = {
            id: `restaurant_admin_${restaurantCredentials[mobile].restaurantId}`,
            name: `${restaurantCredentials[mobile].name} Admin`,
            mobile: mobile,
            role: 'restaurant_admin',
            restaurantId: restaurantCredentials[mobile].restaurantId
          }
          localStorage.setItem('user', JSON.stringify(restaurantUser))
          localStorage.setItem('userRole', 'restaurant_admin')
          window.dispatchEvent(new CustomEvent('userLoggedIn'));
          navigate(`/restaurant/${restaurantCredentials[mobile].restaurantId}/dashboard`)
        } else {
          throw new Error('Invalid restaurant credentials')
        }
      } else {
        // Customer login
        if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
          throw new Error('Please enter a valid 10-digit mobile number')
        }

        if (!mobile) throw new Error('Please enter your mobile number')
        try {
          const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ mobile, password })
          })

          if (!data.success) throw new Error(data.message || 'Invalid credentials')

          const userData = {
            id: data.user._id || data.user.id || `user_${Date.now()}`,
            name: data.user.name || data.user.mobile,
            mobile: data.user.mobile,
            email: data.user.email || `${data.user.mobile}@yummybites.com`,
            address: data.user.address || '',
            joinDate: data.user.createdAt || new Date().toISOString(),
            favoriteRestaurants: data.user.favoriteRestaurants || [],
            totalOrders: data.user.totalOrders || 0,
            totalSpent: data.user.totalSpent || 0
          }

          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('userRole', 'customer')
          localStorage.setItem('authToken', data.token)
          window.dispatchEvent(new CustomEvent('userLoggedIn'))
          navigate('/')
        } catch (fetchError) {
          // Only allow demo fallback if server entirely unreachable (network TypeError)
          if (fetchError.message.includes('Failed to fetch')) {
            setError('Server unreachable. Please try again later or sign up first.')
          } else if (/HTTP 401|not registered|Invalid password|Invalid credentials/i.test(fetchError.message)) {
            setError('User does not exist or credentials invalid. Please signup with OTP first.')
          } else {
            setError(fetchError.message)
          }
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingLogin) {
    return (
      <div className="login-loading">
        <div className="loading-spinner">🔄</div>
        <p>Checking login status...</p>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <Link to='/' className="logo-link">
            <div className="logo-icon">🍽️</div>
            <span className="logo-text">YummyBites</span>
          </Link>

          {/* Login Type Toggle */}
          <div className="login-type-toggle">
            <button
              type="button"
              onClick={() => setLoginType('customer')}
              className={`toggle-btn ${loginType === 'customer' ? 'active' : ''}`}
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => setLoginType('restaurant')}
              className={`toggle-btn ${loginType === 'restaurant' ? 'active' : ''}`}
            >
              🏪 Restaurant
            </button>
          </div>

          <div className="header-text">
            <h1>{loginType === 'restaurant' ? 'Restaurant Login' : 'Welcome Back'}</h1>
            <p>{loginType === 'restaurant'
              ? 'Access your restaurant dashboard to manage orders'
              : 'Sign in to your account to continue'
            }</p>
          </div>
        </div>

        {/* Demo Credentials Info */}
        {loginType === 'restaurant' && (
          <div className="demo-credentials restaurant">
            <h3>🏪 Demo Restaurant Credentials:</h3>
            <div className="credential-list">
              <div>Annapoorna Restaurant (pr001): 9876543210 / 1234</div>
              <div>Hotel Selvam (pr002): 9876543211 / 1234</div>
              <div>Sri Lakshmi Vilas (pr003): 9876543212 / 1234</div>
              <div>Modern Cafe (pr004): 9876543213 / 1234</div>
              <div>Thalappakatti Biryani (pr005): 9876543214 / 1234</div>
              <div>Quick Tiffin Center (pr006): 9876543215 / 1234</div>
              <div>Royal Sweets & Snacks (pr007): 9876543216 / 1234</div>
            </div>
          </div>
        )}

        {loginType === 'customer' && (
          <div className="demo-credentials customer">
            <h3>👤 Customer Login:</h3>
            <p>Enter your registered mobile number. Password is optional for OTP-verified accounts.</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor='mobile'>Mobile Number</label>
            <div className="input-wrapper">
              <input
                id='mobile'
                type='tel'
                placeholder={loginType === 'restaurant' ? '9876543210' : 'Enter 10-digit mobile number'}
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                required
                maxLength="10"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor='password'>
              Password {loginType === 'customer' ? '(Optional for OTP users)' : ''}
            </label>
            <div className="input-wrapper">
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder={loginType === 'restaurant' ? 'restaurant password' : 'Enter password (optional for OTP users)'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required={loginType === 'restaurant'}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <span>⏳</span>
                Signing In...
              </>
            ) : (
              <>
                <span>{loginType === 'restaurant' ? '🏪' : '👤'}</span>
                {loginType === 'restaurant' ? 'Restaurant Sign In' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        {loginType === 'customer' && (
          <div className="login-footer">
            <p>New to YummyBites?{' '}
              <Link to='/signup' className="signup-link">
                Create account with mobile OTP
              </Link>
            </p>
            <small>📱 New users must signup first with mobile number verification</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login