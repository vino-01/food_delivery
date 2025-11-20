import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authRouter from '../auth.js'

// Mock the User model
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn()
}

jest.unstable_mockModule('../models/User.js', () => ({
  default: mockUser
}))

// Mock bcryptjs
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn()
  }
}))

// Mock jsonwebtoken
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn()
  }
}))

const app = express()
app.use(express.json())
app.use('/auth', authRouter)

describe('Auth Routes', () => {
  const JWT_SECRET = 'devsecret'
  
  beforeEach(() => {
    jest.clearAllMocks()
    globalThis.__db_ready = true
  })

  describe('POST /auth/signup', () => {
    const signupData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    it('should successfully create a new user', async () => {
      const hashedPassword = 'hashedPassword123'
      const userId = 'user123'
      const token = 'jwt-token'

      mockUser.findOne.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue(hashedPassword)
      mockUser.create.mockResolvedValue({
        _id: userId,
        name: signupData.name,
        email: signupData.email,
        passwordHash: hashedPassword
      })
      jwt.sign.mockReturnValue(token)

      const response = await request(app)
        .post('/auth/signup')
        .send(signupData)
        .expect(201)

      expect(response.body).toEqual({
        token,
        user: {
          id: userId,
          name: signupData.name,
          email: signupData.email
        }
      })

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: signupData.email })
      expect(bcrypt.hash).toHaveBeenCalledWith(signupData.password, 10)
      expect(mockUser.create).toHaveBeenCalledWith({
        name: signupData.name,
        email: signupData.email,
        passwordHash: hashedPassword
      })
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId, email: signupData.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
    })

    it('should return error when required fields are missing', async () => {
      const testCases = [
        { name: 'John', email: '', password: 'pass' },
        { name: '', email: 'john@example.com', password: 'pass' },
        { name: 'John', email: 'john@example.com', password: '' },
        { email: 'john@example.com', password: 'pass' }, // missing name
        { name: 'John', password: 'pass' }, // missing email
        { name: 'John', email: 'john@example.com' } // missing password
      ]

      for (const testData of testCases) {
        const response = await request(app)
          .post('/auth/signup')
          .send(testData)
          .expect(400)

        expect(response.body.message).toBe('All fields required')
      }
    })

    it('should return error when email already exists', async () => {
      mockUser.findOne.mockResolvedValue({ email: signupData.email })

      const response = await request(app)
        .post('/auth/signup')
        .send(signupData)
        .expect(409)

      expect(response.body.message).toBe('Email already registered')
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: signupData.email })
    })

    it('should handle database errors gracefully', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/auth/signup')
        .send(signupData)
        .expect(500)

      expect(response.body.message).toBe('Signup failed')
    })

    it('should return temp user when database is not ready', async () => {
      globalThis.__db_ready = false
      const token = 'temp-token'
      jwt.sign.mockReturnValue(token)

      const response = await request(app)
        .post('/auth/signup')
        .send(signupData)
        .expect(201)

      expect(response.body).toEqual({
        token,
        user: {
          id: 'temp',
          name: signupData.name,
          email: signupData.email
        }
      })

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'temp', email: signupData.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      expect(mockUser.findOne).not.toHaveBeenCalled()
    })

    it('should handle bcrypt hashing errors', async () => {
      mockUser.findOne.mockResolvedValue(null)
      bcrypt.hash.mockRejectedValue(new Error('Hashing failed'))

      const response = await request(app)
        .post('/auth/signup')
        .send(signupData)
        .expect(500)

      expect(response.body.message).toBe('Signup failed')
    })

    it('should handle user creation errors', async () => {
      mockUser.findOne.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('hashedPassword')
      mockUser.create.mockRejectedValue(new Error('Creation failed'))

      const response = await request(app)
        .post('/auth/signup')
        .send(signupData)
        .expect(500)

      expect(response.body.message).toBe('Signup failed')
    })
  })

  describe('POST /auth/login', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123'
    }

    it('should successfully login existing user', async () => {
      const user = {
        _id: 'user123',
        name: 'John Doe',
        email: loginData.email,
        passwordHash: 'hashedPassword123'
      }
      const token = 'jwt-token'

      mockUser.findOne.mockResolvedValue(user)
      bcrypt.compare.mockResolvedValue(true)
      jwt.sign.mockReturnValue(token)

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toEqual({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      })

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: loginData.email })
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, user.passwordHash)
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
    })

    it('should return error when required fields are missing', async () => {
      const testCases = [
        { email: '', password: 'password' },
        { email: 'john@example.com', password: '' },
        { password: 'password' }, // missing email
        { email: 'john@example.com' } // missing password
      ]

      for (const testData of testCases) {
        const response = await request(app)
          .post('/auth/login')
          .send(testData)
          .expect(400)

        expect(response.body.message).toBe('Email and password required')
      }
    })

    it('should return error when user does not exist', async () => {
      mockUser.findOne.mockResolvedValue(null)

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.message).toBe('Invalid credentials')
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: loginData.email })
    })

    it('should return error when password is incorrect', async () => {
      const user = {
        _id: 'user123',
        email: loginData.email,
        passwordHash: 'hashedPassword123'
      }

      mockUser.findOne.mockResolvedValue(user)
      bcrypt.compare.mockResolvedValue(false)

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.message).toBe('Invalid credentials')
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, user.passwordHash)
    })

    it('should handle database errors gracefully', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(500)

      expect(response.body.message).toBe('Login failed')
    })

    it('should return temp user when database is not ready', async () => {
      globalThis.__db_ready = false
      const token = 'temp-token'
      jwt.sign.mockReturnValue(token)

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toEqual({
        token,
        user: {
          id: 'temp',
          name: 'Guest',
          email: loginData.email
        }
      })

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'temp', email: loginData.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      expect(mockUser.findOne).not.toHaveBeenCalled()
    })

    it('should handle bcrypt comparison errors', async () => {
      const user = { _id: 'user123', email: loginData.email, passwordHash: 'hash' }
      
      mockUser.findOne.mockResolvedValue(user)
      bcrypt.compare.mockRejectedValue(new Error('Comparison failed'))

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(500)

      expect(response.body.message).toBe('Login failed')
    })
  })
})