import mongoose from 'mongoose'

const participantSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  amount: { type: Number, required: true },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentId: { type: String },
  paidAt: { type: Date }
})

const groupOrderSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  organizerPhone: { type: String },
  totalAmount: { type: Number, required: true },
  splitType: { 
    type: String, 
    enum: ['equal', 'itemwise', 'custom'], 
    required: true 
  },
  participants: [participantSchema],
  deliveryAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'partial', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentDeadline: { type: Date },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    assignedTo: [{ type: String }] // Array of participant userIds
  }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Update the updatedAt field before saving
groupOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Calculate payment status based on participants
groupOrderSchema.methods.calculateStatus = function() {
  const totalParticipants = this.participants.length
  const paidParticipants = this.participants.filter(p => p.paymentStatus === 'paid').length
  
  if (paidParticipants === 0) {
    this.status = 'pending'
  } else if (paidParticipants === totalParticipants) {
    this.status = 'completed'
  } else {
    this.status = 'partial'
  }
}

// Get payment summary
groupOrderSchema.methods.getPaymentSummary = function() {
  const totalParticipants = this.participants.length
  const paidParticipants = this.participants.filter(p => p.paymentStatus === 'paid').length
  const pendingParticipants = this.participants.filter(p => p.paymentStatus === 'pending').length
  const totalPaid = this.participants
    .filter(p => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
  const totalPending = this.participants
    .filter(p => p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  return {
    totalParticipants,
    paidParticipants,
    pendingParticipants,
    totalPaid,
    totalPending,
    completionPercentage: Math.round((paidParticipants / totalParticipants) * 100)
  }
}

export default mongoose.model('GroupOrder', groupOrderSchema)