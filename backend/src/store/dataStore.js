import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.resolve(process.cwd(), 'backend', 'data')
const dataFile = path.join(dataDir, 'data.json')

async function ensureFile() {
  try { await fs.mkdir(dataDir, { recursive: true }) } catch {}
  try { await fs.access(dataFile) }
  catch { await fs.writeFile(dataFile, JSON.stringify({ restaurants: [], menuItems: [], ratings: [], orders: [], users: [] }, null, 2)) }
}

async function readData() {
  await ensureFile()
  const txt = await fs.readFile(dataFile, 'utf-8')
  try { return JSON.parse(txt || '{}') } catch { return { restaurants: [], menuItems: [], ratings: [], orders: [], users: [] } }
}

async function writeData(data) {
  await ensureFile()
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
}

function genId(prefix='id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`
}

export const store = {
  async listRestaurants() {
    const db = await readData()
    return db.restaurants
  },
  async updateOrderStatus(orderId, status) {
    const db = await readData()
    let updated = null
    db.orders = db.orders.map(o => {
      if (o._id === orderId) {
        updated = { ...o, status }
        return updated
      }
      return o
    })
    await writeData(db)
    return updated
  },
  async deleteOrder(orderId) {
    const db = await readData()
    const before = db.orders.length
    db.orders = db.orders.filter(o => o._id !== orderId)
    await writeData(db)
    return before !== db.orders.length
  },
  async addRestaurant(r) {
    const db = await readData()
    const _id = r._id || genId('r')
    const doc = { _id, name: r.name, cuisine: r.cuisine||'', rating: r.rating||4.5, etaMins: r.etaMins||30, deliveryFee: r.deliveryFee||0, image: r.image||'', address: r.address||'' }
    db.restaurants.push(doc)
    await writeData(db)
    return doc
  },
  async getMenu(restaurantId) {
    const db = await readData()
    return db.menuItems.filter(m => m.restaurantId === restaurantId)
  },
  async addMenuItem(restaurantId, item) {
    const db = await readData()
    const doc = { _id: genId('m'), restaurantId, name: item.name, description: item.description||'', price: Number(item.price)||0, category: item.category||'General', veg: !!item.veg, image: item.image||'', ingredients: item.ingredients||[], allergens: item.allergens||[] }
    db.menuItems.push(doc)
    await writeData(db)
    return doc
  },
  async addRating({ value, userEmail='', restaurantId='' }) {
    const db = await readData()
    db.ratings.push({ value: Number(value), userEmail, restaurantId, createdAt: Date.now() })
    await writeData(db)
    return true
  },
  async ratingSummary(restaurantId='') {
    const db = await readData()
    const arr = db.ratings.filter(r => !restaurantId || r.restaurantId === restaurantId).map(r => r.value)
    const count = arr.length
    const avg = count ? Math.round((arr.reduce((a,b)=>a+b,0)/count)*10)/10 : 0
    return { avg, count }
  },
  async addOrder(o) {
    const db = await readData()
    const doc = { _id: genId('o'), ...o, createdAt: o.createdAt || Date.now(), status: o.status || 'pending' }
    db.orders.push(doc)
    await writeData(db)
    return doc
  },

  async autoConfirmOrders() {
    const db = await readData()
    const sevenMinsAgo = Date.now() - 7 * 60 * 1000
    db.orders = db.orders.map(order => {
      if (order.status === 'pending' && order.createdAt < sevenMinsAgo) {
        return { ...order, status: 'confirmed' }
      }
      return order
    })
    await writeData(db)
    return db.orders
  },
  async getOrdersByUserEmail(userEmail='') {
    const db = await readData()
    if (!userEmail) return []
    // Auto-confirm aging pending orders first for consistency
    const sevenMinsAgo = Date.now() - 7 * 60 * 1000
    db.orders = db.orders.map(order => {
      if (order.status === 'pending' && order.createdAt < sevenMinsAgo) {
        return { ...order, status: 'confirmed' }
      }
      return order
    })
    await writeData(db)
    return db.orders.filter(o => o.userEmail === userEmail).sort((a,b)=>b.createdAt - a.createdAt)
  },
  async stats() {
    const db = await readData()
    const delivered = db.orders.length
    const arr = db.ratings.map(r => r.value)
    const avgRating = arr.length ? Math.round((arr.reduce((a,b)=>a+b,0)/arr.length)*10)/10 : 0
    const userCount = Array.isArray(db.users) ? db.users.length : 0
    return { delivered, avgRating, userCount, restaurants: db.restaurants.length }
  }
  ,async getOrderById(orderId='') {
    if (!orderId) return null
    const db = await readData()
    // Auto-confirm aging pending order inline
    const sevenMinsAgo = Date.now() - 7 * 60 * 1000
    let order = db.orders.find(o => o._id === orderId)
    if (order && order.status === 'pending' && order.createdAt < sevenMinsAgo) {
      order = { ...order, status: 'confirmed' }
      db.orders = db.orders.map(o => o._id === orderId ? order : o)
      await writeData(db)
    }
    return order
  }
}


