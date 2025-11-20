import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import restaurantsRouter from '../restaurants.js'

// Mock the models
const mockRestaurant = {
  find: jest.fn()
}

const mockMenuItem = {
  find: jest.fn()
}

const mockStore = {
  listRestaurants: jest.fn(),
  addRestaurant: jest.fn(),
  getMenu: jest.fn(),
  addMenuItem: jest.fn()
}

jest.unstable_mockModule('../models/Restaurant.js', () => ({
  default: mockRestaurant
}))

jest.unstable_mockModule('../models/MenuItem.js', () => ({
  default: mockMenuItem
}))

jest.unstable_mockModule('../store/dataStore.js', () => ({
  store: mockStore
}))

const app = express()
app.use(express.json())
app.use('/restaurants', restaurantsRouter)

describe('Restaurants Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    globalThis.__db_ready = true
  })

  describe('GET /restaurants', () => {
    it('should return list of restaurants from database when db is ready', async () => {
      const mockRestaurants = [
        { _id: 'r1', name: 'Restaurant 1', cuisine: 'Italian', rating: 4.5 },
        { _id: 'r2', name: 'Restaurant 2', cuisine: 'Chinese', rating: 4.3 }
      ]

      mockRestaurant.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockRestaurants)
      })

      const response = await request(app)
        .get('/restaurants')
        .expect(200)

      expect(response.body).toEqual(mockRestaurants)
      expect(mockRestaurant.find).toHaveBeenCalledWith()
      expect(mockRestaurant.find().sort).toHaveBeenCalledWith({ rating: -1 })
    })

    it('should return default restaurants when database is empty', async () => {
      mockRestaurant.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      })

      const response = await request(app)
        .get('/restaurants')
        .expect(200)

      const expectedDefaults = [
        { _id: 'r1', name: 'Bombay Spice', cuisine: 'North Indian', rating: 4.6, etaMins: 32, deliveryFee: 15 },
        { _id: 'r2', name: 'Coconut Leaf', cuisine: 'South Indian', rating: 4.7, etaMins: 28, deliveryFee: 10 },
        { _id: 'r3', name: 'Biryani House', cuisine: 'Biryani', rating: 4.5, etaMins: 35, deliveryFee: 20 }
      ]

      expect(response.body).toEqual(expectedDefaults)
    })

    it('should use store when database is not ready', async () => {
      globalThis.__db_ready = false
      const mockStoreRestaurants = [
        { _id: 'r1', name: 'Store Restaurant', cuisine: 'Test' }
      ]

      mockStore.listRestaurants.mockResolvedValue(mockStoreRestaurants)

      const response = await request(app)
        .get('/restaurants')
        .expect(200)

      expect(response.body).toEqual(mockStoreRestaurants)
      expect(mockStore.listRestaurants).toHaveBeenCalledTimes(1)
      expect(mockRestaurant.find).not.toHaveBeenCalled()
    })

    it('should seed default restaurants in store when empty', async () => {
      globalThis.__db_ready = false
      const emptyList = []
      const seededList = [
        { _id: 'r1', name: 'Bombay Spice', cuisine: 'North Indian', rating: 4.6, etaMins: 32, deliveryFee: 15 },
        { _id: 'r2', name: 'Coconut Leaf', cuisine: 'South Indian', rating: 4.7, etaMins: 28, deliveryFee: 10 },
        { _id: 'r3', name: 'Biryani House', cuisine: 'Biryani', rating: 4.5, etaMins: 35, deliveryFee: 20 }
      ]

      mockStore.listRestaurants
        .mockResolvedValueOnce(emptyList)
        .mockResolvedValueOnce(seededList)

      const response = await request(app)
        .get('/restaurants')
        .expect(200)

      expect(response.body).toEqual(seededList)
      expect(mockStore.addRestaurant).toHaveBeenCalledTimes(3)
      expect(mockStore.addRestaurant).toHaveBeenCalledWith({ _id: 'r1', name: 'Bombay Spice', cuisine: 'North Indian', rating: 4.6, etaMins: 32, deliveryFee: 15 })
      expect(mockStore.addRestaurant).toHaveBeenCalledWith({ _id: 'r2', name: 'Coconut Leaf', cuisine: 'South Indian', rating: 4.7, etaMins: 28, deliveryFee: 10 })
      expect(mockStore.addRestaurant).toHaveBeenCalledWith({ _id: 'r3', name: 'Biryani House', cuisine: 'Biryani', rating: 4.5, etaMins: 35, deliveryFee: 20 })
    })

    it('should handle database errors gracefully', async () => {
      mockRestaurant.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      })

      const response = await request(app)
        .get('/restaurants')
        .expect(500)

      expect(response.body.message).toBe('Failed to load restaurants')
    })
  })

  describe('GET /restaurants/:id/menu', () => {
    it('should return menu items from database when db is ready', async () => {
      const mockMenuItems = [
        { _id: 'm1', restaurantId: 'r1', name: 'Pizza', category: 'Main', price: 15 },
        { _id: 'm2', restaurantId: 'r1', name: 'Salad', category: 'Starter', price: 8 }
      ]

      mockMenuItem.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMenuItems)
      })

      const response = await request(app)
        .get('/restaurants/r1/menu')
        .expect(200)

      expect(response.body).toEqual(mockMenuItems)
      expect(mockMenuItem.find).toHaveBeenCalledWith({ restaurantId: 'r1' })
      expect(mockMenuItem.find().sort).toHaveBeenCalledWith({ category: 1, name: 1 })
    })

    it('should use store when database is not ready', async () => {
      globalThis.__db_ready = false
      const mockMenuItems = [
        { _id: 'm1', restaurantId: 'r1', name: 'Curry', price: 12 }
      ]

      mockStore.getMenu.mockResolvedValue(mockMenuItems)

      const response = await request(app)
        .get('/restaurants/r1/menu')
        .expect(200)

      expect(response.body).toEqual(mockMenuItems)
      expect(mockStore.getMenu).toHaveBeenCalledWith('r1')
      expect(mockMenuItem.find).not.toHaveBeenCalled()
    })

    it('should seed menu items for r1 when store is empty', async () => {
      globalThis.__db_ready = false
      const emptyMenu = []
      const seededMenu = [
        { _id: 'm1', restaurantId: 'r1', name: 'Paneer Butter Masala', price: 180 },
        { _id: 'm2', restaurantId: 'r1', name: 'Butter Naan', price: 40 }
      ]

      mockStore.getMenu
        .mockResolvedValueOnce(emptyMenu)
        .mockResolvedValueOnce(seededMenu)

      const response = await request(app)
        .get('/restaurants/r1/menu')
        .expect(200)

      expect(response.body).toEqual(seededMenu)
      expect(mockStore.addMenuItem).toHaveBeenCalledTimes(2)
      expect(mockStore.addMenuItem).toHaveBeenCalledWith('r1', {
        name: 'Paneer Butter Masala',
        price: 180,
        category: 'Curry',
        veg: true,
        ingredients: ['Paneer', 'Tomato', 'Butter', 'Cream', 'Spices'],
        allergens: ['Dairy']
      })
      expect(mockStore.addMenuItem).toHaveBeenCalledWith('r1', {
        name: 'Butter Naan',
        price: 40,
        category: 'Bread',
        veg: true,
        ingredients: ['Wheat', 'Butter', 'Yeast'],
        allergens: ['Gluten', 'Dairy']
      })
    })

    it('should seed menu items for r2 when store is empty', async () => {
      globalThis.__db_ready = false
      const emptyMenu = []
      const seededMenu = [
        { _id: 'm1', restaurantId: 'r2', name: 'Masala Dosa', price: 120 },
        { _id: 'm2', restaurantId: 'r2', name: 'Idli Sambar', price: 90 }
      ]

      mockStore.getMenu
        .mockResolvedValueOnce(emptyMenu)
        .mockResolvedValueOnce(seededMenu)

      const response = await request(app)
        .get('/restaurants/r2/menu')
        .expect(200)

      expect(response.body).toEqual(seededMenu)
      expect(mockStore.addMenuItem).toHaveBeenCalledTimes(2)
      expect(mockStore.addMenuItem).toHaveBeenCalledWith('r2', {
        name: 'Masala Dosa',
        price: 120,
        category: 'Tiffin',
        veg: true,
        ingredients: ['Rice', 'Urad dal', 'Potato', 'Spices'],
        allergens: []
      })
    })

    it('should seed menu items for r3 when store is empty', async () => {
      globalThis.__db_ready = false
      const emptyMenu = []
      const seededMenu = [
        { _id: 'm1', restaurantId: 'r3', name: 'Chicken Biryani', price: 220 },
        { _id: 'm2', restaurantId: 'r3', name: 'Veg Biryani', price: 180 }
      ]

      mockStore.getMenu
        .mockResolvedValueOnce(emptyMenu)
        .mockResolvedValueOnce(seededMenu)

      const response = await request(app)
        .get('/restaurants/r3/menu')
        .expect(200)

      expect(response.body).toEqual(seededMenu)
      expect(mockStore.addMenuItem).toHaveBeenCalledTimes(2)
      expect(mockStore.addMenuItem).toHaveBeenCalledWith('r3', {
        name: 'Chicken Biryani',
        price: 220,
        category: 'Biryani',
        veg: false,
        ingredients: ['Basmati', 'Chicken', 'Spices', 'Ghee'],
        allergens: ['Dairy']
      })
      expect(mockStore.addMenuItem).toHaveBeenCalledWith('r3', {
        name: 'Veg Biryani',
        price: 180,
        category: 'Biryani',
        veg: true,
        ingredients: ['Basmati', 'Vegetables', 'Spices', 'Ghee'],
        allergens: ['Dairy']
      })
    })

    it('should not seed menu items for unknown restaurant', async () => {
      globalThis.__db_ready = false
      const emptyMenu = []

      mockStore.getMenu.mockResolvedValue(emptyMenu)

      const response = await request(app)
        .get('/restaurants/unknown/menu')
        .expect(200)

      expect(response.body).toEqual(emptyMenu)
      expect(mockStore.addMenuItem).not.toHaveBeenCalled()
    })

    it('should handle database errors gracefully', async () => {
      mockMenuItem.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      })

      const response = await request(app)
        .get('/restaurants/r1/menu')
        .expect(500)

      expect(response.body.message).toBe('Failed to load menu')
    })

    it('should handle store errors gracefully', async () => {
      globalThis.__db_ready = false
      mockStore.getMenu.mockRejectedValue(new Error('Store error'))

      const response = await request(app)
        .get('/restaurants/r1/menu')
        .expect(500)

      expect(response.body.message).toBe('Failed to load menu')
    })
  })
})