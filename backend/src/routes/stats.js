import { Router } from 'express'
import Order from '../models/Order.js'
import Rating from '../models/Rating.js'
import { store } from '../store/dataStore.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    let delivered, avgRating, userCount;
    if (!globalThis.__db_ready) {
      const s = await store.stats();
      userCount = typeof s.userCount !== 'undefined' ? s.userCount : 0;
      delivered = s.delivered ?? 0;
      avgRating = s.avgRating ?? 0;
      return res.json({ delivered, avgRating, userCount });
    }
    const [deliveredCount, ratingAgg, userCountDb] = await Promise.all([
      Order.countDocuments(),
      Rating.aggregate([{ $group: { _id: null, avg: { $avg: '$value' } } }]),
      (await import('../models/User.js')).default.countDocuments()
    ]);
    delivered = deliveredCount;
    avgRating = ratingAgg[0]?.avg ? Math.round(ratingAgg[0].avg * 10) / 10 : 0;
    userCount = userCountDb;
    res.json({ delivered, avgRating, userCount });
  } catch (err) {
    console.error('[REST] /api/stats error:', err.message)
    res.status(500).json({ message: 'Failed to load stats' });
  }
})

export default router


