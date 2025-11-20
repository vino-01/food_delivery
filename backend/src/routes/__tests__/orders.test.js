import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import ordersRouter from '../orders.js'

// Mock the Order model
const mockOrder = {
  create: jest.fn()
}

const mockStore = {
  addOrder: jest.fn()
}

jest.unstable_mockModule('../models/Order.js', () => ({
  default: mockOrder
}))

jest.unstable_mockModule('../store/dataStore.js', () => ({
  store: mockStore
}))

const app = express()
app.use(express.json())
app.use('/orders', ordersRouter)

describe('Orders Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    globalThis.__db_ready = true
  })

  describe('POST /orders', () => {
    const validOrderData = {
      restaurantId: 'r1',
      items: [
        { name: 'Pizza', price: 250, quantity: 2 },
        { name: 'Coke', price: 50, quantity: 1 }
      ],
      userName: 'John Doe',
      userEmail: 'john@example.com'
    }

    it('should successfully create order with database', async () => {
      mockOrder.create.mockResolvedValue({
        id: 'order123',
        ...validOrderData,
        total: 550
      })

      const response = await request(app)
        .post('/orders')
        .send(validOrderData)
        .expect(201)

      expect(response.body).toEqual({
        ok: true,
        total: 550 // (250 * 2) + (50 * 1)
      })

      expect(mockOrder.create).toHaveBeenCalledWith({
        restaurantId: 'r1',
        items: validOrderData.items,
        total: 550,
        userName: 'John Doe',
        userEmail: 'john@example.com'
      })
    })

    it('should use store when database is not ready', async () => {
      globalThis.__db_ready = false

      const response = await request(app)
        .post('/orders')
        .send(validOrderData)
        .expect(201)

      expect(response.body).toEqual({
        ok: true,
        total: 550
      })

      expect(mockStore.addOrder).toHaveBeenCalledWith({
        restaurantId: 'r1',
        items: validOrderData.items,
        total: 550,
        userName: 'John Doe',
        userEmail: 'john@example.com'
      })

      expect(mockOrder.create).not.toHaveBeenCalled()
    })

    it('should handle missing restaurantId', async () => {
      const invalidData = {
        items: [{ name: 'Pizza', price: 250, quantity: 1 }]
      }

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400)

      expect(response.body.message).toBe('Restaurant and items required')
      expect(mockOrder.create).not.toHaveBeenCalled()
      expect(mockStore.addOrder).not.toHaveBeenCalled()
    })

    it('should handle missing items', async () => {
      const invalidData = {
        restaurantId: 'r1',
        items: []
      }

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400)

      expect(response.body.message).toBe('Restaurant and items required')
      expect(mockOrder.create).not.toHaveBeenCalled()
    })

    it('should handle missing items property', async () => {
      const invalidData = {
        restaurantId: 'r1'
        // no items property
      }

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400)

      expect(response.body.message).toBe('Restaurant and items required')
      expect(mockOrder.create).not.toHaveBeenCalled()
    })

    it('should calculate total correctly with different quantities', async () => {
      const orderData = {
        restaurantId: 'r1',
        items: [
          { name: 'Pizza', price: 250, quantity: 3 },
          { name: 'Burger', price: 180, quantity: 2 },
          { name: 'Fries', price: 80, quantity: 1 }
        ]
      }

      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(201)

      // Total: (250 * 3) + (180 * 2) + (80 * 1) = 750 + 360 + 80 = 1190
      expect(response.body.total).toBe(1190)

      expect(mockOrder.create).toHaveBeenCalledWith(expect.objectContaining({
        total: 1190
      }))
    })

    it('should handle items without quantity (defaults to 1)', async () => {
      const orderData = {
        restaurantId: 'r1',
        items: [
          { name: 'Pizza', price: 250 }, // no quantity
          { name: 'Coke', price: 50, quantity: 2 }
        ]
      }

      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(201)

      // Total: (250 * 1) + (50 * 2) = 250 + 100 = 350
      expect(response.body.total).toBe(350)
    })

    it('should handle string prices correctly', async () => {
      const orderData = {
        restaurantId: 'r1',
        items: [
          { name: 'Pizza', price: '250.50', quantity: 2 },
          { name: 'Drink', price: '45', quantity: 1 }
        ]
      }

      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(201)

      // Total: (250.5 * 2) + (45 * 1) = 501 + 45 = 546
      expect(response.body.total).toBe(546)
    })

    it('should use default values for optional fields', async () => {
      const minimalOrderData = {
        restaurantId: 'r1',
        items: [{ name: 'Pizza', price: 250, quantity: 1 }]
        // no userName or userEmail
      }

      await request(app)
        .post('/orders')
        .send(minimalOrderData)
        .expect(201)

      expect(mockOrder.create).toHaveBeenCalledWith({
        restaurantId: 'r1',
        items: minimalOrderData.items,
        total: 250,
        userName: '',
        userEmail: ''
      })
    })

    it('should handle database errors gracefully', async () => {
      mockOrder.create.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/orders')
        .send(validOrderData)
        .expect(500)

      expect(response.body.message).toBe('Failed to place order')
    })

    it('should handle store errors gracefully', async () => {
      globalThis.__db_ready = false
      mockStore.addOrder.mockRejectedValue(new Error('Store error'))

      const response = await request(app)
        .post('/orders')
        .send(validOrderData)
        .expect(500)

      expect(response.body.message).toBe('Failed to place order')
    })

    it('should handle zero quantity items', async () => {
      const orderData = {
        restaurantId: 'r1',
        items: [
          { name: 'Pizza', price: 250, quantity: 0 },
          { name: 'Burger', price: 180, quantity: 1 }
        ]
      }

      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(201)

      // Total: (250 * 0) + (180 * 1) = 0 + 180 = 180
      expect(response.body.total).toBe(180)
    })

    it('should handle negative quantities', async () => {
      const orderData = {
        restaurantId: 'r1',
        items: [
          { name: 'Pizza', price: 250, quantity: -1 },
          { name: 'Burger', price: 180, quantity: 2 }
        ]
      }

      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(201)

      // Total: (250 * -1) + (180 * 2) = -250 + 360 = 110
      expect(response.body.total).toBe(110)
    })

    it('should handle complex order with all fields', async () => {
      const complexOrderData = {
        restaurantId: 'r123',
        items: [
          { name: 'Margherita Pizza', price: 299.99, quantity: 2 },
          { name: 'Caesar Salad', price: 149.50, quantity: 1 },
          { name: 'Garlic Bread', price: 89, quantity: 3 },
          { name: 'Coke', price: 45.25, quantity: 2 }
        ],
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com'
      }

      const response = await request(app)
        .post('/orders')
        .send(complexOrderData)
        .expect(201)

      // Total calculation:
      // (299.99 * 2) + (149.50 * 1) + (89 * 3) + (45.25 * 2)
      // = 599.98 + 149.50 + 267 + 90.50
      // = 1106.98
      expect(response.body.total).toBe(1106.98)

      expect(mockOrder.create).toHaveBeenCalledWith({
        restaurantId: 'r123',
        items: complexOrderData.items,
        total: 1106.98,
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com'
      })
    })
  })
})