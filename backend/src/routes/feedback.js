import { Router } from 'express'
import Feedback from '../models/Feedback.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    if (!globalThis.__db_ready) {
      return res.json([
        { name: 'Aditi', message: 'Super fast delivery and delicious biryani!', createdAt: new Date() },
        { name: 'Rahul', message: 'Paneer butter masala was amazing.', createdAt: new Date() }
      ])
    }
    const list = await Feedback.find().sort({ createdAt: -1 }).limit(10)
    res.json(list)
  } catch (_err) {
    res.status(500).json({ message: 'Failed to load feedback' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name = 'Guest', email = '', message } = req.body
    if (!message) return res.status(400).json({ message: 'Message is required' })
    if (!globalThis.__db_ready) return res.status(201).json({ ok: true })
    await Feedback.create({ name, email, message })
    res.status(201).json({ ok: true })
  } catch (_err) {
    res.status(500).json({ message: 'Failed to submit feedback' })
  }
})

export default router


