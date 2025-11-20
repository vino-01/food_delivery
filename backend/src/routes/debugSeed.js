import { Router } from 'express'
import Order from '../models/Order.js'
import { store } from '../store/dataStore.js'

const router = Router()

// Simple protected seed route to generate demo orders for analytics.
// Usage: GET /api/debug/seed-orders?restaurantId=pr007&count=50&secret=YOUR_SECRET&clear=true
router.get('/seed-orders', async (req, res) => {
  const { restaurantId = '', count = '40', secret = '', clear = 'false' } = req.query
  if (!process.env.SEED_SECRET) return res.status(500).json({ error: 'seed_secret_missing' })
  if (secret !== process.env.SEED_SECRET) return res.status(403).json({ error: 'forbidden' })
  if (!restaurantId) return res.status(400).json({ error: 'restaurantId_required' })
  const n = Math.min(200, Math.max(1, Number(count) || 1))
  const ITEMS = [
    { name: 'Chicken 65', price: 180 },
    { name: 'Veg Biryani', price: 140 },
    { name: 'Mutton Biryani', price: 350 },
    { name: 'Idli Sambar', price: 60 },
    { name: 'Masala Dosa', price: 80 },
    { name: 'Vada', price: 40 }
  ]
  const STATUS_POOL = ['pending','confirmed','preparing','ready','delivered','delivered','delivered','cancelled']
  try {
    let seeded = 0
    if (globalThis.__db_ready) {
      if (clear === 'true') await Order.deleteMany({ restaurantId })
      for (let i=0;i<n;i++) {
        const dayOffset = Math.floor(Math.random()*30)
        const hour = Math.floor(Math.random()*24)
        const minute = Math.floor(Math.random()*60)
        const createdAt = new Date(Date.now() - dayOffset*24*60*60*1000)
        createdAt.setHours(hour, minute, Math.floor(Math.random()*60), 0)
        const itemCount = 1 + Math.floor(Math.random()*3)
        const items = []
        for (let j=0;j<itemCount;j++) {
          const base = ITEMS[Math.floor(Math.random()*ITEMS.length)]
          items.push({ name: base.name, price: base.price, quantity: 1 + Math.floor(Math.random()*3) })
        }
        const total = items.reduce((s,it)=> s + it.price*it.quantity, 0)
        const status = STATUS_POOL[Math.floor(Math.random()*STATUS_POOL.length)]
        await Order.create({ restaurantId, items, total, userName: 'Seed User', userEmail: `seed${i}@example.com`, status, createdAt })
        seeded++
      }
    } else {
      // Memory mode
      const data = await store.autoConfirmOrders()
      if (clear === 'true') {
        const remaining = data.filter(o => o.restaurantId !== restaurantId)
        // Write filtered orders back
        const fs = await import('fs/promises')
        const path = await import('path')
        const dataDir = path.resolve(process.cwd(), 'backend', 'data')
        const dataFile = path.join(dataDir, 'data.json')
        let json
        try { json = JSON.parse(await fs.readFile(dataFile,'utf-8')) } catch { json = { restaurants: [], menuItems: [], ratings: [], orders: [], users: [] } }
        json.orders = remaining
        await fs.writeFile(dataFile, JSON.stringify(json, null, 2))
      }
      for (let i=0;i<n;i++) {
        const dayOffset = Math.floor(Math.random()*30)
        const hour = Math.floor(Math.random()*24)
        const minute = Math.floor(Math.random()*60)
        const createdAt = new Date(Date.now() - dayOffset*24*60*60*1000)
        createdAt.setHours(hour, minute, Math.floor(Math.random()*60), 0)
        const itemCount = 1 + Math.floor(Math.random()*3)
        const items = []
        for (let j=0;j<itemCount;j++) {
          const base = ITEMS[Math.floor(Math.random()*ITEMS.length)]
          items.push({ name: base.name, price: base.price, quantity: 1 + Math.floor(Math.random()*3) })
        }
        const total = items.reduce((s,it)=> s + it.price*it.quantity, 0)
        const status = STATUS_POOL[Math.floor(Math.random()*STATUS_POOL.length)]
        await store.addOrder({ restaurantId, items, total, userName: 'Seed User', userEmail: `seed${i}@example.com`, status, createdAt: createdAt.getTime() })
        seeded++
      }
    }
    return res.json({ ok: true, seeded, restaurantId })
  } catch (e) {
    console.error('[SEED] Failed:', e)
    return res.status(500).json({ error: 'seed_failed', message: e.message })
  }
})

export default router