import { Router } from 'express'
import MenuItem from '../models/MenuItem.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    if (globalThis.__db_ready) {
      const items = await MenuItem.find().sort({ category: 1, name: 1 })
      return res.json(items)
    }
    // Fallback in-memory menu
    return res.json([
      { name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato', price: 120, category: 'South Indian', veg: true },
      { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', price: 90, category: 'South Indian', veg: true },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato gravy', price: 180, category: 'North Indian', veg: true },
      { name: 'Butter Naan', description: 'Soft leavened flatbread with butter', price: 40, category: 'North Indian', veg: true }
    ])
  } catch (_err) {
    res.status(500).json({ message: 'Failed to load menu' })
  }
})

export default router


