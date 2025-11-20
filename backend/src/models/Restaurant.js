import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    etaMins: { type: Number, default: 30 },
    deliveryFee: { type: Number, default: 0 },
    image: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  { timestamps: true }
)

export default mongoose.model('Restaurant', restaurantSchema)


