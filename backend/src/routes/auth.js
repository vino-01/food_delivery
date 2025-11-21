import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import twilio from 'twilio'
import NodeCache from 'node-cache'
import User from '../models/User.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

// Initialize Twilio client (optional - for production)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

// Cache for storing OTPs (expires in 5 minutes)
const otpCache = new NodeCache({ stdTTL: 300 })

// Helper function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Helper function to send OTP (demo version)
const sendOTP = async (mobile, otp) => {
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await twilioClient.messages.create({
        body: `Your YummyBites verification code is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${mobile}`
      })
      return { success: true }
    } catch (error) {
      console.error('Twilio SMS error:', error)
      return { success: false, error: error.message }
    }
  } else {
    // No Twilio config - fail
    return { success: false, error: 'Twilio is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.' }
  }
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body
    if (!name || !email || !mobile || !password) return res.status(400).json({ message: 'All fields required' })

    if (!globalThis.__db_ready) {
      const token = jwt.sign({ userId: 'temp', email }, JWT_SECRET, { expiresIn: '7d' })
      return res.status(201).json({ token, user: { id: 'temp', name, email, mobile } })
    }

    // Check for existing user by email or mobile
    const existing = await User.findOne({ $or: [ { email }, { mobile } ] })
    if (existing) {
      if (existing.email === email) {
        return res.status(409).json({ message: 'Email already registered' })
      } else {
        return res.status(409).json({ message: 'Mobile number already registered' })
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, mobile, passwordHash })
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } })
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' })
  }
})

// Legacy email/password login (keeping for compatibility)
router.post('/login-email', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    if (!globalThis.__db_ready) {
      const token = jwt.sign({ userId: 'temp', email }, JWT_SECRET, { expiresIn: '7d' })
      return res.json({ token, user: { id: 'temp', name: 'Guest', email } })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Login failed' })
  }
})

// Send OTP for mobile verification
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body

    // Validate mobile number
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      })
    }

    // Generate OTP
    const otp = generateOTP()

    // Store OTP in cache with mobile as key
    otpCache.set(mobile, otp)

    // Send OTP via SMS
    const smsResult = await sendOTP(mobile, otp)

    if (smsResult.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully',
        demo: smsResult.demo,
        ...(smsResult.demo && { otp }) // Include OTP in response for demo
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      })
    }
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})


// Login with mobile (and optional password)
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body

    // Validate input
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      })
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      })
    }

    if (!password) {
      return res.status(401).json({
        success: false,
        message: 'Password is required for all users.'
      })
    }

    if (globalThis.__db_ready) {
      // Check if user exists in database
      const user = await User.findOne({ mobile })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Mobile number not registered. Please sign up first.'
        })
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your mobile number first by completing signup.'
        })
      }


      // Enforce password for all users
      if (!user.passwordHash) {
        console.log(`[LOGIN DEBUG] User found but no passwordHash. Mobile: ${mobile}`);
        return res.status(401).json({
          success: false,
          message: 'Password not set for this account. Please reset your password or contact support.'
        })
      }

      // Debug logging for password check
      console.log(`[LOGIN DEBUG] Attempt login for mobile: ${mobile}`);
      console.log(`[LOGIN DEBUG] Provided password: ${password}`);
      console.log(`[LOGIN DEBUG] Stored passwordHash: ${user.passwordHash}`);
      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      console.log(`[LOGIN DEBUG] bcrypt.compare result: ${isValidPassword}`);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password. Try again or reset your password.'
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          mobile: user.mobile,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          address: user.address,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      })
    } else {
      // Demo mode - allow any login
      res.status(401).json({
        success: false,
        message: 'Database not connected. Please use signup with OTP.'
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)

    const { name, address, totalOrders, totalSpent } = req.body

    if (globalThis.__db_ready) {
      const user = await User.findById(decoded.userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Update user fields
      if (name) user.name = name
      if (address !== undefined) user.address = address
      if (totalOrders !== undefined) user.totalOrders = totalOrders
      if (totalSpent !== undefined) user.totalSpent = totalSpent

      await user.save()

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          address: user.address,
          role: user.role,
          isVerified: user.isVerified,
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent,
          createdAt: user.createdAt
        }
      })
    } else {
      res.json({
        success: true,
        message: 'Profile updated (demo mode)',
        user: {
          id: decoded.userId,
          name: name || 'Demo User',
          mobile: decoded.mobile,
          email: decoded.email,
          address: address || '',
          totalOrders: totalOrders || 0,
          totalSpent: totalSpent || 0
        }
      })
    }
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Debug endpoint to list all users (development only)
router.get('/debug/users', async (req, res) => {
  try {
    if (globalThis.__db_ready) {
      const users = await User.find({}, { passwordHash: 0 }).limit(10)
      res.json({
        success: true,
        count: users.length,
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          isVerified: user.isVerified,
          address: user.address,
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent,
          createdAt: user.createdAt
        }))
      })
    } else {
      res.json({
        success: false,
        message: 'Database not connected'
      })
    }
  } catch (error) {
    console.error('Debug users error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router


