import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String }, // Optional for OTP-based auth
    isVerified: { type: Boolean, default: false },
    address: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'restaurant', 'admin'], default: 'customer' },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteRestaurants: [{ type: String }]
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)


