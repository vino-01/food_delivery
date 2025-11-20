import { Router } from 'express'
import Restaurant from '../models/Restaurant.js'
import MenuItem from '../models/MenuItem.js'
import { store } from '../store/dataStore.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    if (!globalThis.__db_ready) {
      const list = await store.listRestaurants()
      if (!list.length) {
        await store.addRestaurant({ _id: 'r1', name: 'Bombay Spice', cuisine: 'North Indian', rating: 4.6, etaMins: 32, deliveryFee: 15 })
        await store.addRestaurant({ _id: 'r2', name: 'Coconut Leaf', cuisine: 'South Indian', rating: 4.7, etaMins: 28, deliveryFee: 10 })
        await store.addRestaurant({ _id: 'r3', name: 'Biryani House', cuisine: 'Biryani', rating: 4.5, etaMins: 35, deliveryFee: 20 })
      }
      return res.json(await store.listRestaurants())
    }
    const list = await Restaurant.find().sort({ rating: -1 })
    if (!list.length) {
      return res.json([
        { _id: 'r1', name: 'Bombay Spice', cuisine: 'North Indian', rating: 4.6, etaMins: 32, deliveryFee: 15 },
        { _id: 'r2', name: 'Coconut Leaf', cuisine: 'South Indian', rating: 4.7, etaMins: 28, deliveryFee: 10 },
        { _id: 'r3', name: 'Biryani House', cuisine: 'Biryani', rating: 4.5, etaMins: 35, deliveryFee: 20 }
      ])
    }
    res.json(list)
  } catch (err) {
    console.error('[REST] /api/restaurants error:', err.message)
    res.status(500).json({ message: 'Failed to load restaurants' })
  }
})

// Contacts endpoint (generated demo contacts)
router.get('/contacts', async (_req, res) => {
  try {
    let list
    if (!globalThis.__db_ready) {
      list = await store.listRestaurants()
      if (!list.length) list = []
    } else {
      list = await Restaurant.find().select('_id name').sort({ name: 1 })
    }
    const contacts = list.map((r, idx) => {
      const basePhone = `98765${String(4310 + idx).padStart(4,'0')}`.slice(0,10)
      const emailSlug = (r.name || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'restaurant'
      return { _id: r._id, phone: `+91 ${basePhone}`, email: `${emailSlug}@yummybites.com` }
    })
    res.json(contacts)
  } catch (err) {
    console.error('[REST] /api/restaurants/contacts error:', err.message)
    res.status(500).json({ message: 'Failed to load restaurant contacts' })
  }
})

router.get('/:id/menu', async (req, res) => {
  try {
    const { id } = req.params
    if (!globalThis.__db_ready) {
      let items = await store.getMenu(id)
      if (!items.length) {
        if (id === 'r1') {
          await store.addMenuItem('r1', { name: 'Paneer Butter Masala', price: 180, category: 'Curry', veg: true, ingredients: ['Paneer','Tomato','Butter','Cream','Spices'], allergens: ['Dairy'] })
          await store.addMenuItem('r1', { name: 'Butter Naan', price: 40, category: 'Bread', veg: true, ingredients: ['Wheat','Butter','Yeast'], allergens: ['Gluten','Dairy'] })
        }
        if (id === 'r2') {
          await store.addMenuItem('r2', { name: 'Masala Dosa', price: 120, category: 'Tiffin', veg: true, ingredients: ['Rice','Urad dal','Potato','Spices'], allergens: [] })
          await store.addMenuItem('r2', { name: 'Idli Sambar', price: 90, category: 'Tiffin', veg: true, ingredients: ['Rice','Urad dal','Lentils','Vegetables'], allergens: [] })
        }
        if (id === 'r3') {
          await store.addMenuItem('r3', { name: 'Chicken Biryani', price: 220, category: 'Biryani', veg: false, ingredients: ['Basmati','Chicken','Spices','Ghee'], allergens: ['Dairy'] })
          await store.addMenuItem('r3', { name: 'Veg Biryani', price: 180, category: 'Biryani', veg: true, ingredients: ['Basmati','Vegetables','Spices','Ghee'], allergens: ['Dairy'] })
        }
        items = await store.getMenu(id)
      }
      return res.json(items)
    }
    const items = await MenuItem.find({ restaurantId: id }).sort({ category: 1, name: 1 })
    res.json(items)
  } catch (err) {
    console.error('[REST] /api/restaurants/:id/menu error:', err.message)
    res.status(500).json({ message: 'Failed to load menu' })
  }
})

export default router


