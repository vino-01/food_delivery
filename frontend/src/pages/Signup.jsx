import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { apiRequest } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const sendOtp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await apiRequest('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile: formData.mobile })
      });

      if (data.success) {
        setStep(2);
        if (data.demo && data.otp) {
          // Demo mode - show OTP in alert
          alert(`Demo OTP sent to ${formData.mobile}: ${data.otp}`);
          setGeneratedOtp(data.otp);
        } else {
          alert(`OTP sent to ${formData.mobile} via SMS`);
        }
      } else {
        setErrors({ mobile: data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({ mobile: error.message || 'Failed to send OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setErrors({ otp: 'Please enter OTP' });
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiRequest('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile: formData.mobile, otp, name: formData.name })
      });

      if (data.success) {
        // Store user data and token
        const userData = {
          ...data.user,
          address: '', // Empty by default - user must add address
          joinDate: new Date().toISOString(),
          favoriteRestaurants: [],
          totalOrders: 0,
          totalSpent: 0
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', 'customer');
        localStorage.setItem('authToken', data.token);

        // Dispatch login event
        window.dispatchEvent(new CustomEvent('userLoggedIn'));

        // Navigate to home to see login status change
        navigate('/');
      } else {
        setErrors({ otp: data.message || 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrors({ otp: error.message || 'Invalid OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);

    try {
      const data = await apiRequest('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile: formData.mobile })
      });

      if (data.success) {
        if (data.demo && data.otp) {
          alert(`New OTP sent to ${formData.mobile}: ${data.otp}`);
          setGeneratedOtp(data.otp);
        } else {
          alert(`New OTP sent to ${formData.mobile} via SMS`);
        }
        setOtp(''); // Clear current OTP input
        setErrors({}); // Clear any errors
      } else {
        alert(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      alert(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            {step === 1 ? 'Create Account' : 'Verify Mobile Number'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            {step === 1
              ? 'Join YummyBites to start ordering delicious food'
              : `Enter the OTP sent to ${formData.mobile}`
            }
          </p>
        </div>

        {step === 1 ? (
          /* Step 1: User Details */
          <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
            {/* Name Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem'
                }}>
                  👤
                </span>
                <input
                  type='text'
                  placeholder='Enter your full name'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {errors.name && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Mobile Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem'
                }}>
                  📱
                </span>
                <input
                  type='tel'
                  placeholder='Enter 10-digit mobile number'
                  value={formData.mobile}
                  onChange={e => handleInputChange('mobile', e.target.value)}
                  maxLength="10"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: `1px solid ${errors.mobile ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {errors.mobile && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem'
                }}>
                  🔒
                </span>
                <input
                  type='password'
                  placeholder='Create a password'
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem'
                }}>
                  🔒
                </span>
                <input
                  type='password'
                  placeholder='Confirm your password'
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {errors.confirmPassword && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#0ea5e9',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}
            >
              {isLoading ? (
                <>
                  <span>⏳</span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <span>📱</span>
                  Send OTP
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Enter OTP
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem'
                }}>
                  🔢
                </span>
                <input
                  type='text'
                  placeholder='Enter 6-digit OTP'
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength="6"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: `1px solid ${errors.otp ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    letterSpacing: '0.5rem'
                  }}
                />
              </div>
              {errors.otp && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                  {errors.otp}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              {isLoading ? (
                <>
                  <span>⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>✅</span>
                  Verify & Create Account
                </>
              )}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type='button'
                onClick={resendOtp}
                style={{
                  backgroundColor: 'transparent',
                  color: '#0ea5e9',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#0ea5e9',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;