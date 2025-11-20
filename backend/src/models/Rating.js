import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema(
  {
    userEmail: { type: String, trim: true },
    value: { type: Number, required: true, min: 1, max: 5 },
    restaurantId: { type: String, default: '' }
  },
  { timestamps: true }
)

export default mongoose.model('Rating', ratingSchema)


