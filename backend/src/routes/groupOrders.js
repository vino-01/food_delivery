import express from 'express'
import GroupOrder from '../models/GroupOrder.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// Create a new group order
router.post('/create', async (req, res) => {
  try {
    const {
      orderId,
      restaurantId,
      organizerName,
      organizerEmail,
      organizerPhone,
      totalAmount,
      splitType,
      participants,
      deliveryAddress,
      items,
      notes,
      paymentDeadlineHours = 24
    } = req.body

    // Generate unique group ID
    const groupId = uuidv4().substring(0, 8).toUpperCase()
    
    // Set payment deadline
    const paymentDeadline = new Date()
    paymentDeadline.setHours(paymentDeadline.getHours() + paymentDeadlineHours)

    // Calculate split amounts based on split type
    let processedParticipants = []
    
    if (splitType === 'equal') {
      const amountPerPerson = totalAmount / participants.length
      processedParticipants = participants.map(participant => ({
        ...participant,
        amount: Math.round(amountPerPerson * 100) / 100,
        items: items // All items shared equally
      }))
    } else if (splitType === 'itemwise') {
      processedParticipants = participants.map(participant => {
        const participantAmount = participant.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity)
        }, 0)
        return {
          ...participant,
          amount: Math.round(participantAmount * 100) / 100
        }
      })
    } else if (splitType === 'custom') {
      processedParticipants = participants
    }

    const groupOrder = new GroupOrder({
      groupId,
      orderId,
      restaurantId,
      organizerName,
      organizerEmail,
      organizerPhone,
      totalAmount,
      splitType,
      participants: processedParticipants,
      deliveryAddress,
      items,
      notes,
      paymentDeadline
    })

    await groupOrder.save()

    res.status(201).json({
      success: true,
      groupOrder: {
        groupId: groupOrder.groupId,
        totalAmount: groupOrder.totalAmount,
        participants: groupOrder.participants,
        paymentDeadline: groupOrder.paymentDeadline,
        paymentSummary: groupOrder.getPaymentSummary()
      }
    })
  } catch (error) {
    console.error('Error creating group order:', error)
    res.status(500).json({ success: false, message: 'Failed to create group order' })
  }
})

// Get group order details
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params
    const groupOrder = await GroupOrder.findOne({ groupId })

    if (!groupOrder) {
      return res.status(404).json({ success: false, message: 'Group order not found' })
    }

    // Update status based on current payments
    groupOrder.calculateStatus()
    await groupOrder.save()

    res.json({
      success: true,
      groupOrder: {
        ...groupOrder.toObject(),
        paymentSummary: groupOrder.getPaymentSummary()
      }
    })
  } catch (error) {
    console.error('Error fetching group order:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch group order' })
  }
})

// Update participant payment status
router.post('/:groupId/payment', async (req, res) => {
  try {
    const { groupId } = req.params
    const { userId, paymentId, paymentStatus } = req.body

    const groupOrder = await GroupOrder.findOne({ groupId })
    if (!groupOrder) {
      return res.status(404).json({ success: false, message: 'Group order not found' })
    }

    // Find participant
    const participant = groupOrder.participants.find(p => p.userId === userId)
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' })
    }

    // Update payment status
    participant.paymentStatus = paymentStatus
    participant.paymentId = paymentId
    if (paymentStatus === 'paid') {
      participant.paidAt = new Date()
    }

    // Update overall order status
    groupOrder.calculateStatus()
    await groupOrder.save()

    res.json({
      success: true,
      paymentSummary: groupOrder.getPaymentSummary(),
      groupOrder: groupOrder.toObject()
    })
  } catch (error) {
    console.error('Error updating payment:', error)
    res.status(500).json({ success: false, message: 'Failed to update payment' })
  }
})

// Generate payment links for each participant (mock UPI/code)
router.post('/:groupId/generate-links', async (req, res) => {
  try {
    const { groupId } = req.params
    const groupOrder = await GroupOrder.findOne({ groupId })
    if (!groupOrder) {
      return res.status(404).json({ success: false, message: 'Group order not found' })
    }

    const base = `upi://pay?pa=merchant@ybl&pn=Group%20Order%20${encodeURIComponent(groupId)}&cu=INR&am=`
    const links = groupOrder.participants.map(p => ({
      userId: p.userId,
      name: p.name,
      email: p.email,
      amount: p.amount,
      link: `${base}${p.amount}&tn=${encodeURIComponent('Group share for ' + p.name)}`,
      code: `GPAY-${groupId}-${p.userId.slice(-4)}`
    }))

    res.json({ success: true, links })
  } catch (error) {
    console.error('Error generating links:', error)
    res.status(500).json({ success: false, message: 'Failed to generate payment links' })
  }
})

// Send payment reminders
router.post('/:groupId/remind', async (req, res) => {
  try {
    const { groupId } = req.params
    const groupOrder = await GroupOrder.findOne({ groupId })

    if (!groupOrder) {
      return res.status(404).json({ success: false, message: 'Group order not found' })
    }

    const pendingParticipants = groupOrder.participants.filter(p => p.paymentStatus === 'pending')
    
    // Here you would implement your notification system
    // For now, we'll just return the list of participants to remind
    
    res.json({
      success: true,
      message: `Reminders sent to ${pendingParticipants.length} participants`,
      pendingParticipants: pendingParticipants.map(p => ({
        name: p.name,
        email: p.email,
        amount: p.amount
      }))
    })
  } catch (error) {
    console.error('Error sending reminders:', error)
    res.status(500).json({ success: false, message: 'Failed to send reminders' })
  }
})

// Get all group orders for a user (as organizer or participant)
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params
    
    const groupOrders = await GroupOrder.find({
      $or: [
        { organizerEmail: email },
        { 'participants.email': email }
      ]
    }).sort({ createdAt: -1 })

    const ordersWithSummary = groupOrders.map(order => ({
      ...order.toObject(),
      paymentSummary: order.getPaymentSummary()
    }))

    res.json({
      success: true,
      groupOrders: ordersWithSummary
    })
  } catch (error) {
    console.error('Error fetching user group orders:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch group orders' })
  }
})

// Cancel group order
router.post('/:groupId/cancel', async (req, res) => {
  try {
    const { groupId } = req.params
    const { organizerEmail } = req.body

    const groupOrder = await GroupOrder.findOne({ groupId })
    if (!groupOrder) {
      return res.status(404).json({ success: false, message: 'Group order not found' })
    }

    // Only organizer can cancel
    if (groupOrder.organizerEmail !== organizerEmail) {
      return res.status(403).json({ success: false, message: 'Only organizer can cancel the group order' })
    }

    groupOrder.status = 'cancelled'
    await groupOrder.save()

    res.json({
      success: true,
      message: 'Group order cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling group order:', error)
    res.status(500).json({ success: false, message: 'Failed to cancel group order' })
  }
})

export default router