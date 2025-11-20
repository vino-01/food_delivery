import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    veg: { type: Boolean, default: true },
    image: { type: String, default: '' },
    ingredients: { type: [String], default: [] },
    allergens: { type: [String], default: [] }
  },
  { timestamps: true }
)

export default mongoose.model('MenuItem', menuItemSchema)


