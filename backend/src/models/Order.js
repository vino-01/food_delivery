import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    allergyNote: { type: String, default: null }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    items: { type: [orderItemSchema], default: [] },
    total: { type: Number, required: true },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)


