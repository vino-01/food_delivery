import { Router } from 'express'
import Order from '../models/Order.js'
import { store } from '../store/dataStore.js'

// Helper to decide DB vs memory
function usingDb() { return !!globalThis.__db_ready }

const router = Router()

// Summary: totals, revenue, pending, customers (distinct emails), delivered today/week/month
router.get('/:restaurantId/summary', async (req, res) => {
  const { restaurantId } = req.params
  try {
    if (!restaurantId) return res.status(400).json({ error: 'missing_restaurantId' })
    let orders = []
    if (usingDb()) {
      orders = await Order.find({ restaurantId }).lean()
    } else {
      const memOrders = await store.autoConfirmOrders()
      orders = memOrders.filter(o => o.restaurantId === restaurantId)
    }
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfDay); startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    let revenue = 0, pending = 0, deliveredDay = 0, deliveredWeek = 0, deliveredMonth = 0
    const statuses = { pending: 0, confirmed: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 }
    const customerSet = new Set()
    orders.forEach(o => {
      revenue += !['pending','cancelled'].includes(o.status) ? Number(o.total||0) : 0
      if (o.status === 'pending') pending++
      if (statuses[o.status] !== undefined) statuses[o.status]++
      if (o.userEmail) customerSet.add(o.userEmail)
      const created = new Date(o.createdAt)
      if (o.status === 'delivered') {
        if (created >= startOfDay) deliveredDay++
        if (created >= startOfWeek) deliveredWeek++
        if (created >= startOfMonth) deliveredMonth++
      }
    })
    res.json({
      totalOrders: orders.length,
      revenue,
      pending,
      statusBreakdown: statuses,
      distinctCustomers: customerSet.size,
      delivered: { day: deliveredDay, week: deliveredWeek, month: deliveredMonth }
    })
  } catch (e) {
    console.error('[ANALYTICS] summary error', e.message)
    res.status(500).json({ error: 'summary_failed', message: e.message })
  }
})

// Best selling items (top 10 by quantity) over optional range (?range=7d|30d)
router.get('/:restaurantId/best-items', async (req, res) => {
  const { restaurantId } = req.params
  const { range = '30d' } = req.query
  const days = range === '7d' ? 7 : 30
  const since = new Date(Date.now() - days*24*60*60*1000)
  try {
    let orders = []
    if (usingDb()) {
      orders = await Order.find({ restaurantId, createdAt: { $gte: since } }).lean()
    } else {
      const memOrders = await store.autoConfirmOrders()
      orders = memOrders.filter(o => o.restaurantId === restaurantId && new Date(o.createdAt) >= since)
    }
    const counts = {}
    orders.forEach(o => o.items.forEach(it => {
      counts[it.name] = (counts[it.name] || 0) + Number(it.quantity||1)
    }))
    const list = Object.entries(counts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a,b)=> b.qty - a.qty)
      .slice(0,10)
    res.json({ range: days, items: list })
  } catch (e) {
    console.error('[ANALYTICS] best-items error', e.message)
    res.status(500).json({ error: 'best_items_failed', message: e.message })
  }
})

// Order status breakdown over last N days (default 30)
router.get('/:restaurantId/status-breakdown', async (req, res) => {
  const { restaurantId } = req.params
  const { range = 30 } = req.query
  const since = new Date(Date.now() - Number(range)*24*60*60*1000)
  try {
    let orders = []
    if (usingDb()) {
      orders = await Order.find({ restaurantId, createdAt: { $gte: since } }).lean()
    } else {
      const memOrders = await store.autoConfirmOrders()
      orders = memOrders.filter(o => o.restaurantId === restaurantId && new Date(o.createdAt) >= since)
    }
    const statuses = { pending: 0, confirmed: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 }
    orders.forEach(o => { if (statuses[o.status] !== undefined) statuses[o.status]++ })
    res.json({ range: Number(range), statuses })
  } catch (e) {
    res.status(500).json({ error: 'status_breakdown_failed', message: e.message })
  }
})

// Peak hours (counts by hour for last 7 days)
router.get('/:restaurantId/peak-hours', async (req, res) => {
  const { restaurantId } = req.params
  const since = new Date(Date.now() - 7*24*60*60*1000)
  try {
    let orders = []
    if (usingDb()) {
      orders = await Order.find({ restaurantId, createdAt: { $gte: since } }).lean()
    } else {
      const memOrders = await store.autoConfirmOrders()
      orders = memOrders.filter(o => o.restaurantId === restaurantId && new Date(o.createdAt) >= since)
    }
    const hours = Array.from({ length: 24 }, (_,h)=>({ hour: h, count:0 }))
    orders.forEach(o => { const h = new Date(o.createdAt).getHours(); hours[h].count++ })
    res.json({ hours })
  } catch (e) {
    res.status(500).json({ error: 'peak_hours_failed', message: e.message })
  }
})

// Revenue trend (daily revenue last 30 days)
router.get('/:restaurantId/revenue-trend', async (req, res) => {
  const { restaurantId } = req.params
  const days = 30
  const since = new Date(Date.now() - days*24*60*60*1000)
  try {
    let orders = []
    if (usingDb()) {
      orders = await Order.find({ restaurantId, createdAt: { $gte: since } }).lean()
    } else {
      const memOrders = await store.autoConfirmOrders()
      orders = memOrders.filter(o => o.restaurantId === restaurantId && new Date(o.createdAt) >= since)
    }
    const map = {}
    orders.forEach(o => {
      if (['pending','cancelled'].includes(o.status)) return
      const key = new Date(o.createdAt).toISOString().slice(0,10)
      map[key] = (map[key] || 0) + Number(o.total||0)
    })
    // fill missing days
    const out = []
    for (let i = days-1; i>=0; i--) {
      const d = new Date(Date.now() - i*24*60*60*1000).toISOString().slice(0,10)
      out.push({ date: d, revenue: map[d] || 0 })
    }
    res.json({ days, trend: out })
  } catch (e) {
    res.status(500).json({ error: 'revenue_trend_failed', message: e.message })
  }
})

// Top customers (by delivered order count)
router.get('/:restaurantId/top-customers', async (req, res) => {
  const { restaurantId } = req.params
  try {
    let orders = []
    if (usingDb()) {
      orders = await Order.find({ restaurantId, status: 'delivered' }).lean()
    } else {
      const memOrders = await store.autoConfirmOrders()
      orders = memOrders.filter(o => o.restaurantId === restaurantId && o.status === 'delivered')
    }
    const tally = {}
    orders.forEach(o => {
      const key = o.userEmail || 'unknown'
      tally[key] = tally[key] || { email: key, count: 0, spend: 0 }
      tally[key].count++
      tally[key].spend += Number(o.total||0)
    })
    const list = Object.values(tally).sort((a,b)=> b.count - a.count).slice(0,10)
    res.json({ customers: list })
  } catch (e) {
    res.status(500).json({ error: 'top_customers_failed', message: e.message })
  }
})

export default router
