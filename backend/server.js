import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.js'
import menuRoutes from './src/routes/menu.js'
import ratingRoutes from './src/routes/ratings.js'
import feedbackRoutes from './src/routes/feedback.js'
import restaurantRoutes from './src/routes/restaurants.js'
import statsRoutes from './src/routes/stats.js'
import analyticsRoutes from './src/routes/analytics.js'
import debugSeedRoutes from './src/routes/debugSeed.js'
import ordersRoutes from './src/routes/orders.js'
import groupOrdersRoutes from './src/routes/groupOrders.js'
import recommendationsRoutes from './src/routes/recommendations.js'
import { seedMenuIfEmpty } from './src/seed/seedMenu.js'
import Order from './src/models/Order.js'
import Restaurant from './src/models/Restaurant.js'
import { store } from './src/store/dataStore.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/ratings', ratingRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/analytics', analyticsRoutes)
console.log('[BOOT] Mounted analytics routes under /api/analytics')
app.use('/api/debug', debugSeedRoutes)
console.log('[BOOT] Mounted debug seed routes under /api/debug')
app.use('/api/orders', ordersRoutes)
app.use('/api/group-orders', groupOrdersRoutes)
app.use('/api/recommendations', recommendationsRoutes)

let MONGO_URI = process.env.MONGO_URI || ''
// Ensure a database name is present; append /food_del if missing
if (MONGO_URI && !/\/[A-Za-z0-9_-]+\?/.test(MONGO_URI) && !MONGO_URI.match(/\/[A-Za-z0-9_-]+$/)) {
  // If no explicit db name segment before query params, add one
  const parts = MONGO_URI.split('?')
  if (!parts[0].match(/\/[A-Za-z0-9_-]+$/)) {
    parts[0] = parts[0].replace(/\/?$/, '/food_del')
  }
  MONGO_URI = parts.join('?')
}
const PORT = process.env.PORT || 5000

async function start() {
  globalThis.__db_ready = false
  console.log('[BOOT] Starting server...')
  if (!MONGO_URI) {
    console.warn('[BOOT] MONGO_URI missing; running in in-memory DEMO mode.')
  }
  try {
    if (MONGO_URI) {
      console.log('[DB] Attempting connection to MongoDB Atlas...')
      const startTs = Date.now()
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 })
      globalThis.__db_ready = true
      console.log(`[DB] Connected successfully in ${Date.now() - startTs}ms`)
      try {
        const db = mongoose.connection.db
        const dbName = db.databaseName
        const collections = await db.listCollections().toArray()
        console.log(`[DB] Database: '${dbName}' Collections: ${collections.map(c => c.name).join(', ') || '(none)'}`)
      } catch (listErr) {
        console.warn('[DB] Failed to list collections:', listErr.message)
      }
      try {
        await seedMenuIfEmpty()
        console.log('[SEED] Menu seed check complete')
      } catch (seedErr) {
        console.warn('[SEED] Failed to run seed routine:', seedErr.message)
      }
    }
  } catch (err) {
    console.error('[DB] Connection error:', err.message)
    if (err.code) console.error('[DB] Error code:', err.code)
    if (err.reason) console.error('[DB] Reason:', err.reason)
    console.warn('[DB] Falling back to in-memory mode.')
  }

  // Mongoose connection diagnostics
  mongoose.connection.on('error', e => console.error('[DB] Mongoose error:', e.message))
  mongoose.connection.on('disconnected', () => console.warn('[DB] Mongoose disconnected'))
  mongoose.connection.on('reconnected', () => console.log('[DB] Mongoose reconnected'))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', dbReady: !!globalThis.__db_ready })
  })

  app.get('/api/health/deep', async (_req, res) => {
    const dbReady = !!globalThis.__db_ready
    const payload = { dbReady, uptimeMs: Math.round(process.uptime() * 1000), orders: 0, restaurants: 0 }
    try {
      if (dbReady) {
        payload.orders = await Order.countDocuments()
        payload.restaurants = await Restaurant.countDocuments()
      } else {
        const orders = await store.autoConfirmOrders()
        const restaurants = await store.listRestaurants()
        payload.orders = orders.length
        payload.restaurants = restaurants.length
      }
      res.json(payload)
    } catch (e) {
      res.status(500).json({ error: 'deep_health_failed', message: e.message, ...payload })
    }
  })

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BOOT] Server listening on http://localhost:${PORT} (dbReady=${globalThis.__db_ready})`)
  })
}

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Promise rejection:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.message)
  console.error(err.stack)
})

start()


