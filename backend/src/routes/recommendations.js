import { Router } from 'express'
import MenuItem from '../models/MenuItem.js'
import Order from '../models/Order.js'
import Restaurant from '../models/Restaurant.js'
import { store } from '../store/dataStore.js'

const router = Router()

const MOODS = {
  TIRED: [ 'Curd Rice', 'Idli Sambar', 'South Indian Meals', 'Buttermilk' ],
  CELEBRATING: [ 'Chicken Biryani', 'Vegetable Biryani', 'Paneer Butter Masala', 'Chocolate Brownie' ],
  HEALTHY: [ 'Caesar Salad', 'Vegetable Fried Rice', 'Fresh Fruit Juice', 'Buttermilk' ],
  SPICY: [ 'Chicken 65', 'Gobi Manchurian', 'Sambar Rice', 'Pasta Arrabiata' ]
}

function getTimeOfDay(now = new Date()) {
  const h = now.getHours()
  if (h < 11) return 'breakfast'
  if (h < 16) return 'lunch'
  if (h < 22) return 'dinner'
  return 'late'
}

function rankItemsForMood(allItems, moodKey) {
  const moodList = MOODS[moodKey] || []
  return allItems
    .map(item => {
      const nameMatch = moodList.some(m => item.name.toLowerCase().includes(m.toLowerCase()))
      const spicyBoost = moodKey === 'SPICY' && /spicy|arrabiata|65|manchurian|podi/i.test(item.name)
      const healthyBoost = moodKey === 'HEALTHY' && /salad|juice|buttermilk|veg/i.test(item.name)
      let score = 0
      if (nameMatch) score += 3
      if (spicyBoost) score += 2
      if (healthyBoost) score += 2
      // Light preference to lower prep time if available in description
      if (/mins/i.test(item.description || '')) score += 0.5
      return { item, score }
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.item)
}

// POST /api/recommendations/mood { mood: 'TIRED'|'CELEBRATING'|'HEALTHY'|'SPICY', userEmail?: string, city?: string }
router.post('/mood', async (req, res) => {
  try {
    const { mood, userEmail } = req.body || {}
    const moodKey = (mood || '').toUpperCase()
    const timeOfDay = getTimeOfDay()

    let menuItems = []
    if (globalThis.__db_ready) {
      menuItems = await MenuItem.find().limit(200)
    } else {
      // Fallback minimal items when DB is not available
      menuItems = [
        { name: 'Masala Dosa', price: 120, category: 'Breakfast', description: 'Crispy rice crepe', veg: true },
        { name: 'Idli Sambar', price: 90, category: 'Breakfast', description: 'Steamed rice cakes', veg: true },
        { name: 'Curd Rice', price: 80, category: 'Main', description: 'Comfort bowl', veg: true },
        { name: 'Sambar Rice', price: 90, category: 'Main', description: 'Spiced lentil rice', veg: true },
        { name: 'Paneer Butter Masala', price: 180, category: 'Main', description: 'Rich tomato gravy', veg: true },
        { name: 'Chicken 65', price: 160, category: 'Starters', description: 'Spicy fried chicken', veg: false },
        { name: 'Chicken Biryani', price: 220, category: 'Main', description: 'Aromatic rice', veg: false },
        { name: 'Vegetable Biryani', price: 150, category: 'Main', description: 'Veg biryani', veg: true },
        { name: 'Caesar Salad', price: 150, category: 'Salad', description: 'Greens + protein', veg: true },
        { name: 'Fresh Fruit Juice', price: 60, category: 'Beverages', description: 'Seasonal fruits', veg: true }
      ]
    }

    // Comfort pick: from user past orders if any
    let comfortCandidates = []
    if (globalThis.__db_ready && userEmail) {
      const pastOrders = await Order.find({ userEmail }).sort({ createdAt: -1 }).limit(50)
      const countMap = new Map()
      pastOrders.forEach(o => {
        (o.items || []).forEach(it => {
          const key = `${it.name}`
          countMap.set(key, (countMap.get(key) || 0) + it.quantity)
        })
      })
      comfortCandidates = menuItems.filter(mi => countMap.has(mi.name))
      comfortCandidates.sort((a, b) => (countMap.get(b.name) || 0) - (countMap.get(a.name) || 0))
    }
    if (comfortCandidates.length === 0) {
      comfortCandidates = rankItemsForMood(menuItems, moodKey)
    }

    // Trending: popular among others recently (or heuristic fallback)
    let trending = []
    if (globalThis.__db_ready) {
      const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      const agg = await Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.name', totalQty: { $sum: '$items.quantity' } } },
        { $sort: { totalQty: -1 } },
        { $limit: 20 }
      ])
      const names = new Set(agg.map(a => a._id))
      trending = menuItems.filter(mi => names.has(mi.name))
    }
    if (trending.length === 0) {
      trending = rankItemsForMood(menuItems, moodKey).slice(0, 5)
    }

    // AI Surprise: similar to taste profile but not ordered before (simple heuristic)
    const rankedForMood = rankItemsForMood(menuItems, moodKey)
    const surprise = rankedForMood.find(it => !comfortCandidates.some(c => c.name === it.name)) || rankedForMood[0]

    const pick = (arr, n = 3) => arr.slice(0, Math.max(1, Math.min(n, arr.length)))

    return res.json({
      success: true,
      meta: { timeOfDay },
      suggestions: {
        comfortPick: comfortCandidates[0] || rankedForMood[0],
        trendingNow: pick(trending, 3),
        aiSurprise: surprise
      }
    })
  } catch (err) {
    console.error('mood recommendations failed', err)
    res.status(500).json({ success: false, message: 'Failed to generate recommendations' })
  }
})

// GET /api/recommendations/quick-reorder?userEmail=foo@bar.com
// Heuristic: time-of-day slot + frequency + recency + favourite restaurants
router.get('/quick-reorder', async (req, res) => {
  try {
    const { userEmail } = req.query
    if (!userEmail) return res.status(400).json({ success:false, message:'userEmail required' })
    const now = new Date()
    const h = now.getHours()
    const slot = h < 5 ? 'late-night'
      : h < 11 ? 'breakfast'
      : h < 16 ? 'lunch'
      : h < 19 ? 'snack'
      : h < 23 ? 'dinner' : 'late-night'

    // Load past orders (DB or memory)
    let pastOrders = []
    if (globalThis.__db_ready) {
      pastOrders = await Order.find({ userEmail }).sort({ createdAt:-1 }).limit(200)
    } else {
      pastOrders = await store.getOrdersByUserEmail(userEmail)
    }
    if (!pastOrders.length) {
      return res.json({ success:true, suggestion:null, reason:'No past orders found' })
    }

    // Build stats per item
    const itemStats = new Map()
    const restaurantFreq = new Map()
    pastOrders.forEach(o => {
      restaurantFreq.set(o.restaurantId, (restaurantFreq.get(o.restaurantId)||0)+1)
      const orderedHour = new Date(o.createdAt || o.orderTime || Date.now()).getHours()
      const orderedSlot = orderedHour < 5 ? 'late-night'
        : orderedHour < 11 ? 'breakfast'
        : orderedHour < 16 ? 'lunch'
        : orderedHour < 19 ? 'snack'
        : orderedHour < 23 ? 'dinner' : 'late-night'
      ;(o.items||[]).forEach(it => {
        const key = it.name
        const stat = itemStats.get(key) || {
          name: it.name,
          totalQty:0,
          orders:0,
          lastOrderedAt:0,
          restaurantId:o.restaurantId,
          slotMatches:0,
          anySlot: new Set()
        }
        stat.totalQty += it.quantity || 1
        stat.orders += 1
        stat.lastOrderedAt = Math.max(stat.lastOrderedAt, new Date(o.createdAt || Date.now()).getTime())
        stat.anySlot.add(orderedSlot)
        if (orderedSlot === slot) stat.slotMatches += 1
        // Prefer most frequent restaurant for item
        if (stat.restaurantId !== o.restaurantId) {
          const currentCount = restaurantFreq.get(stat.restaurantId) || 0
          const newCount = restaurantFreq.get(o.restaurantId) || 0
          if (newCount > currentCount) stat.restaurantId = o.restaurantId
        }
        itemStats.set(key, stat)
      })
    })

    const nowTs = Date.now()
    let best = null
    let bestScore = -Infinity
    for (const stat of itemStats.values()) {
      const daysSince = (nowTs - stat.lastOrderedAt)/(1000*60*60*24)
      const recencyBoost = daysSince <= 7 ? 3 : daysSince <= 30 ? 1 : 0
      const slotBoost = stat.slotMatches > 0 ? 2 : 0
      const freqBoost = stat.orders + stat.totalQty * 0.5
      const restBoost = (restaurantFreq.get(stat.restaurantId)||0) * 0.3
      const diversityPenalty = stat.anySlot.size > 3 ? -0.5 : 0 // penalize overly generic items
      const score = recencyBoost + slotBoost + freqBoost + restBoost + diversityPenalty
      if (score > bestScore) {
        bestScore = score
        best = stat
      }
    }

    if (!best) return res.json({ success:true, suggestion:null, reason:'No candidate computed' })

    // Get latest order containing that item to reuse item pricing
    const latestOrderWithItem = pastOrders.find(o => (o.items||[]).some(it => it.name === best.name))
    const itemDetail = latestOrderWithItem.items.find(it => it.name === best.name)

    // Estimate price / total
    const suggestedItems = [ { name: itemDetail.name, price: itemDetail.price, quantity: 1 } ]
    const totalEstimate = itemDetail.price

    // Restaurant name
    let restaurantName = best.restaurantId
    if (globalThis.__db_ready) {
      const rDoc = await Restaurant.findOne({ _id: best.restaurantId })
      if (rDoc) restaurantName = rDoc.name
    }

    const reasonParts = []
    reasonParts.push(`Ordered ${best.orders} times (${best.totalQty} total portions) previously`)
    if (best.slotMatches) reasonParts.push(`Matches current ${slot} pattern`)
    if (bestScore > 6) reasonParts.push('High confidence pick')

    return res.json({
      success:true,
      suggestion:{
        slot,
        restaurantId: best.restaurantId,
        restaurantName,
        items: suggestedItems,
        totalEstimate,
        lastOrderedAt: new Date(best.lastOrderedAt).toISOString(),
        reason: reasonParts.join('; ')
      }
    })
  } catch (err) {
    console.error('quick-reorder failed', err)
    res.status(500).json({ success:false, message:'Failed to build quick reorder suggestion' })
  }
})

export default router


