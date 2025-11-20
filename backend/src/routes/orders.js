import express from 'express';
import Order from '../models/Order.js'
import { store } from '../store/dataStore.js'
const router = express.Router();

// Delete order only if within 7 minutes and still pending
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id
    if (!globalThis.__db_ready) {
      // In-memory mode
      const orders = await store.autoConfirmOrders()
      const order = orders.find(o => o._id === orderId)
      if (!order) return res.status(404).json({ message: 'Order not found' })
      if (order.status !== 'pending') return res.status(400).json({ message: 'Order cannot be deleted after confirmation' })
      if (Date.now() - order.createdAt > 7 * 60 * 1000) return res.status(400).json({ message: 'Order can only be deleted within 7 minutes' })
      // Remove order
      await store.deleteOrder(orderId)
      return res.json({ ok: true })
    }
    // DB mode
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.status !== 'pending') return res.status(400).json({ message: 'Order cannot be deleted after confirmation' })
    if (Date.now() - new Date(order.createdAt).getTime() > 7 * 60 * 1000) return res.status(400).json({ message: 'Order can only be deleted within 7 minutes' })
    await Order.deleteOne({ _id: orderId })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Failed to delete order' })
  }
})
// Auto-confirm pending orders older than 7 minutes when fetching orders
router.get('/', async (req, res) => {
  try {
    const { restaurantId } = req.query
    if (!restaurantId) {
      return res.status(400).json({ message: 'restaurantId required' })
    }
    if (!globalThis.__db_ready) {
      const orders = await store.autoConfirmOrders()
      const filtered = orders.filter(o => o.restaurantId === restaurantId)
      return res.json(filtered)
    }
    // For DB mode, you would use a query to update and fetch
    const sevenMinsAgo = new Date(Date.now() - 7 * 60 * 1000)
    await Order.updateMany({ status: 'pending', createdAt: { $lt: sevenMinsAgo } }, { status: 'confirmed' })
    const orders = await Order.find({ restaurantId })
    res.json(orders)
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})
// Get orders by user email across restaurants
router.get('/user', async (req, res) => {
  try {
    const { userEmail } = req.query
    if (!userEmail) return res.status(400).json({ message: 'userEmail required' })
    if (!globalThis.__db_ready) {
      const orders = await store.getOrdersByUserEmail(userEmail)
      return res.json(orders)
    }
    const sevenMinsAgo = new Date(Date.now() - 7 * 60 * 1000)
    await Order.updateMany({ status: 'pending', createdAt: { $lt: sevenMinsAgo } }, { status: 'confirmed' })
    const orders = await Order.find({ userEmail }).sort({ createdAt: -1 })
    res.json(orders)
  } catch {
    res.status(500).json({ message: 'Failed to fetch user orders' })
  }
})
// (imports moved to top)

router.post('/', async (req, res) => {
  try {
    const { restaurantId, items = [], userName = '', userEmail = '' } = req.body
    if (!restaurantId || !items.length) return res.status(400).json({ message: 'Restaurant and items required' })
    const total = items.reduce((sum, it) => sum + (Number(it.price) * (it.quantity || 1)), 0)
    if (!globalThis.__db_ready) {
      await store.addOrder({ restaurantId, items, total, userName, userEmail, status: 'pending' })
      return res.status(201).json({ ok: true, total })
    }
    await Order.create({ restaurantId, items, total, userName, userEmail, status: 'pending' })
    res.status(201).json({ ok: true, total })
  } catch {
    res.status(500).json({ message: 'Failed to place order' })
  }
})

// Update order status (e.g., pending -> preparing -> ready -> delivered)
router.patch('/:id', async (req, res) => {
  try {
    const orderId = req.params.id
    const { status } = req.body || {}
    if (!status) return res.status(400).json({ message: 'Status required' })

    if (!globalThis.__db_ready) {
      const updated = await store.updateOrderStatus(orderId, status)
      if (!updated) return res.status(404).json({ message: 'Order not found' })
      return res.json(updated)
    }

    const allowed = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Order not found' })
    res.json(updated)
  } catch (e) {
    res.status(500).json({ message: 'Failed to update order status' })
  }
})

// Get single order by id
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id
    if (!orderId) return res.status(400).json({ message: 'id required' })
    if (!globalThis.__db_ready) {
      const order = await store.getOrderById(orderId)
      if (!order) return res.status(404).json({ message: 'Order not found' })
      return res.json(order)
    }
    const sevenMinsAgo = new Date(Date.now() - 7 * 60 * 1000)
    await Order.updateMany({ status: 'pending', createdAt: { $lt: sevenMinsAgo } }, { status: 'confirmed' })
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch {
    res.status(500).json({ message: 'Failed to fetch order' })
  }
})

export default router


