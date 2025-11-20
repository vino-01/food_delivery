import { Router } from 'express'
import Rating from '../models/Rating.js'
import { store } from '../store/dataStore.js'

const router = Router()

router.get('/summary', async (req, res) => {
  try {
    const { restaurantId } = req.query
    if (!globalThis.__db_ready) {
      const s = await store.ratingSummary(restaurantId || '')
      return res.json({ avg: s.avg, count: s.count })
    }
    const pipeline = []
    if (restaurantId) pipeline.push({ $match: { restaurantId } })
    pipeline.push({ $group: { _id: null, avg: { $avg: '$value' }, count: { $sum: 1 } } })
    const result = await Rating.aggregate(pipeline)
    const { avg = 0, count = 0 } = result[0] || {}
    res.json({ avg: Math.round(avg * 10) / 10, count })
  } catch (_err) {
    res.status(500).json({ message: 'Failed to load ratings' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { value, userEmail, restaurantId } = req.body
    if (!value) return res.status(400).json({ message: 'Rating required' })
    if (!globalThis.__db_ready) {
      await store.addRating({ value, userEmail, restaurantId })
      return res.status(201).json({ ok: true })
    }
    await Rating.create({ value: Number(value), userEmail: userEmail || '', restaurantId: restaurantId || '' })
    res.status(201).json({ ok: true })
  } catch (_err) {
    res.status(500).json({ message: 'Failed to save rating' })
  }
})

export default router


