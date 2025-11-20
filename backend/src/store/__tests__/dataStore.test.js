import { jest } from '@jest/globals'
import { promises as fs } from 'fs'
import path from 'path'
import { store } from '../dataStore.js'

// Mock fs promises
jest.unstable_mockModule('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    access: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn()
  }
}))

const mockFs = fs

describe('dataStore', () => {
  const mockDataDir = path.resolve(process.cwd(), 'backend', 'data')
  const mockDataFile = path.join(mockDataDir, 'data.json')

  beforeEach(() => {
    jest.clearAllMocks()
    // Default successful file operations
    mockFs.mkdir.mockResolvedValue(undefined)
    mockFs.access.mockResolvedValue(undefined)
    mockFs.writeFile.mockResolvedValue(undefined)
  })

  describe('restaurant operations', () => {
    it('should list restaurants from empty database', async () => {
      const mockData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const restaurants = await store.listRestaurants()

      expect(restaurants).toEqual([])
      expect(mockFs.readFile).toHaveBeenCalledWith(mockDataFile, 'utf-8')
    })

    it('should list existing restaurants', async () => {
      const mockRestaurants = [
        { _id: 'r1', name: 'Pizza Palace', cuisine: 'Italian' },
        { _id: 'r2', name: 'Burger King', cuisine: 'American' }
      ]
      const mockData = { restaurants: mockRestaurants, menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const restaurants = await store.listRestaurants()

      expect(restaurants).toEqual(mockRestaurants)
    })

    it('should add new restaurant with generated ID', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const newRestaurant = {
        name: 'Taco Bell',
        cuisine: 'Mexican',
        rating: 4.0,
        etaMins: 25,
        deliveryFee: 2.5
      }

      const result = await store.addRestaurant(newRestaurant)

      expect(result._id).toMatch(/^r_/)
      expect(result.name).toBe('Taco Bell')
      expect(result.cuisine).toBe('Mexican')
      expect(result.rating).toBe(4.0)
      expect(result.etaMins).toBe(25)
      expect(result.deliveryFee).toBe(2.5)

      const expectedData = {
        restaurants: [result],
        menuItems: [],
        ratings: [],
        orders: []
      }
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        mockDataFile,
        JSON.stringify(expectedData, null, 2)
      )
    })

    it('should add restaurant with provided ID', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const newRestaurant = {
        _id: 'custom-id',
        name: 'Custom Restaurant'
      }

      const result = await store.addRestaurant(newRestaurant)

      expect(result._id).toBe('custom-id')
      expect(result.name).toBe('Custom Restaurant')
    })

    it('should add restaurant with default values', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const newRestaurant = { name: 'Simple Restaurant' }

      const result = await store.addRestaurant(newRestaurant)

      expect(result.name).toBe('Simple Restaurant')
      expect(result.cuisine).toBe('')
      expect(result.rating).toBe(4.5)
      expect(result.etaMins).toBe(30)
      expect(result.deliveryFee).toBe(0)
      expect(result.image).toBe('')
      expect(result.address).toBe('')
    })
  })

  describe('menu operations', () => {
    it('should get menu items for specific restaurant', async () => {
      const mockMenuItems = [
        { _id: 'm1', restaurantId: 'r1', name: 'Pizza Margherita', price: 12 },
        { _id: 'm2', restaurantId: 'r2', name: 'Cheeseburger', price: 8 },
        { _id: 'm3', restaurantId: 'r1', name: 'Caesar Salad', price: 9 }
      ]
      const mockData = { restaurants: [], menuItems: mockMenuItems, ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const menu = await store.getMenu('r1')

      expect(menu).toHaveLength(2)
      expect(menu[0]).toEqual(mockMenuItems[0])
      expect(menu[1]).toEqual(mockMenuItems[2])
    })

    it('should return empty array for restaurant with no menu', async () => {
      const mockData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const menu = await store.getMenu('nonexistent')

      expect(menu).toEqual([])
    })

    it('should add new menu item', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const newItem = {
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta',
        price: 15,
        category: 'Main',
        veg: false
      }

      const result = await store.addMenuItem('r1', newItem)

      expect(result._id).toMatch(/^m_/)
      expect(result.restaurantId).toBe('r1')
      expect(result.name).toBe('Spaghetti Carbonara')
      expect(result.description).toBe('Classic Italian pasta')
      expect(result.price).toBe(15)
      expect(result.category).toBe('Main')
      expect(result.veg).toBe(false)
      expect(result.image).toBe('')
      expect(result.ingredients).toEqual([])
      expect(result.allergens).toEqual([])
    })

    it('should add menu item with default values', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const newItem = { name: 'Simple Item' }

      const result = await store.addMenuItem('r1', newItem)

      expect(result.name).toBe('Simple Item')
      expect(result.description).toBe('')
      expect(result.price).toBe(0)
      expect(result.category).toBe('General')
      expect(result.veg).toBe(false)
    })

    it('should handle string price conversion', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const newItem = { name: 'Item', price: '12.50' }

      const result = await store.addMenuItem('r1', newItem)

      expect(result.price).toBe(12.5)
    })
  })

  describe('rating operations', () => {
    it('should add new rating', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const rating = {
        value: 4.5,
        userEmail: 'user@test.com',
        restaurantId: 'r1'
      }

      const result = await store.addRating(rating)

      expect(result).toBe(true)

      // Verify the data was written correctly
      const writeCall = mockFs.writeFile.mock.calls[0]
      const writtenData = JSON.parse(writeCall[1])
      
      expect(writtenData.ratings).toHaveLength(1)
      expect(writtenData.ratings[0].value).toBe(4.5)
      expect(writtenData.ratings[0].userEmail).toBe('user@test.com')
      expect(writtenData.ratings[0].restaurantId).toBe('r1')
      expect(writtenData.ratings[0].createdAt).toBeDefined()
    })

    it('should handle string value conversion in rating', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const result = await store.addRating({ value: '3.5' })

      expect(result).toBe(true)
      const writeCall = mockFs.writeFile.mock.calls[0]
      const writtenData = JSON.parse(writeCall[1])
      expect(writtenData.ratings[0].value).toBe(3.5)
    })

    it('should calculate rating summary for all restaurants', async () => {
      const mockRatings = [
        { value: 4.0, restaurantId: 'r1' },
        { value: 5.0, restaurantId: 'r1' },
        { value: 3.0, restaurantId: 'r2' },
        { value: 4.5, restaurantId: 'r1' }
      ]
      const mockData = { restaurants: [], menuItems: [], ratings: mockRatings, orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const summary = await store.ratingSummary()

      expect(summary.count).toBe(4)
      expect(summary.avg).toBe(4.1) // (4.0 + 5.0 + 3.0 + 4.5) / 4 = 4.125, rounded to 4.1
    })

    it('should calculate rating summary for specific restaurant', async () => {
      const mockRatings = [
        { value: 4.0, restaurantId: 'r1' },
        { value: 5.0, restaurantId: 'r1' },
        { value: 3.0, restaurantId: 'r2' }
      ]
      const mockData = { restaurants: [], menuItems: [], ratings: mockRatings, orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const summary = await store.ratingSummary('r1')

      expect(summary.count).toBe(2)
      expect(summary.avg).toBe(4.5) // (4.0 + 5.0) / 2
    })

    it('should return zero average for no ratings', async () => {
      const mockData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const summary = await store.ratingSummary()

      expect(summary.count).toBe(0)
      expect(summary.avg).toBe(0)
    })
  })

  describe('order operations', () => {
    it('should add new order', async () => {
      const existingData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingData))

      const order = {
        userId: 'u1',
        restaurantId: 'r1',
        items: [{ name: 'Pizza', quantity: 2, price: 10 }],
        total: 20
      }

      const result = await store.addOrder(order)

      expect(result).toBe(true)

      const writeCall = mockFs.writeFile.mock.calls[0]
      const writtenData = JSON.parse(writeCall[1])
      
      expect(writtenData.orders).toHaveLength(1)
      expect(writtenData.orders[0].userId).toBe('u1')
      expect(writtenData.orders[0].restaurantId).toBe('r1')
      expect(writtenData.orders[0].total).toBe(20)
      expect(writtenData.orders[0].createdAt).toBeDefined()
    })
  })

  describe('stats operations', () => {
    it('should calculate comprehensive stats', async () => {
      const mockData = {
        restaurants: [{ _id: 'r1' }, { _id: 'r2' }],
        menuItems: [],
        ratings: [
          { value: 4.0 },
          { value: 5.0 },
          { value: 3.0 }
        ],
        orders: [
          { _id: 'o1' },
          { _id: 'o2' },
          { _id: 'o3' }
        ]
      }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const stats = await store.stats()

      expect(stats.delivered).toBe(3)
      expect(stats.avgRating).toBe(4.0) // (4.0 + 5.0 + 3.0) / 3
      expect(stats.restaurants).toBe(2)
    })

    it('should handle empty stats', async () => {
      const mockData = { restaurants: [], menuItems: [], ratings: [], orders: [] }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData))

      const stats = await store.stats()

      expect(stats.delivered).toBe(0)
      expect(stats.avgRating).toBe(0)
      expect(stats.restaurants).toBe(0)
    })
  })

  describe('file operations', () => {
    it('should create data directory and file if they do not exist', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found'))
      mockFs.readFile.mockResolvedValue('{"restaurants":[],"menuItems":[],"ratings":[],"orders":[]}')

      await store.listRestaurants()

      expect(mockFs.mkdir).toHaveBeenCalledWith(mockDataDir, { recursive: true })
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        mockDataFile,
        JSON.stringify({ restaurants: [], menuItems: [], ratings: [], orders: [] }, null, 2)
      )
    })

    it('should handle corrupted JSON file', async () => {
      mockFs.readFile.mockResolvedValue('invalid json {')

      const restaurants = await store.listRestaurants()

      expect(restaurants).toEqual([])
    })

    it('should handle empty file', async () => {
      mockFs.readFile.mockResolvedValue('')

      const restaurants = await store.listRestaurants()

      expect(restaurants).toEqual([])
    })
  })
})