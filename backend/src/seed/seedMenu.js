import MenuItem from '../models/MenuItem.js'

export async function seedMenuIfEmpty() {
  const count = await MenuItem.countDocuments()
  if (count > 0) return

  const items = [
    { 
      name: 'Masala Dosa', 
      description: 'Crispy rice crepe with spiced potato', 
      price: 120, 
      category: 'South Indian', 
      veg: true,
      ingredients: ['Rice', 'Urad Dal', 'Potato', 'Onion', 'Mustard Seeds', 'Curry Leaves', 'Turmeric', 'Green Chili'],
      allergens: ['Gluten (if served with wheat-based chutney)']
    },
    { 
      name: 'Idli Sambar', 
      description: 'Steamed rice cakes with lentil stew', 
      price: 90, 
      category: 'South Indian', 
      veg: true,
      ingredients: ['Rice', 'Urad Dal', 'Toor Dal', 'Tamarind', 'Tomato', 'Drumstick', 'Okra', 'Turmeric', 'Sambar Powder'],
      allergens: []
    },
    { 
      name: 'Paneer Butter Masala', 
      description: 'Cottage cheese in creamy tomato gravy', 
      price: 180, 
      category: 'North Indian', 
      veg: true,
      ingredients: ['Paneer', 'Tomato', 'Onion', 'Cashews', 'Cream', 'Butter', 'Ginger-Garlic', 'Garam Masala', 'Fenugreek Leaves'],
      allergens: ['Dairy', 'Nuts (Cashews)']
    },
    { 
      name: 'Butter Naan', 
      description: 'Soft leavened flatbread with butter', 
      price: 40, 
      category: 'North Indian', 
      veg: true,
      ingredients: ['All-purpose Flour', 'Yogurt', 'Baking Powder', 'Salt', 'Sugar', 'Butter', 'Milk'],
      allergens: ['Gluten', 'Dairy']
    },
    { 
      name: 'Chicken Biryani', 
      description: 'Aromatic basmati rice with chicken and spices', 
      price: 220, 
      category: 'Biryani', 
      veg: false,
      ingredients: ['Basmati Rice', 'Chicken', 'Onion', 'Yogurt', 'Ginger-Garlic', 'Saffron', 'Mint', 'Coriander', 'Biryani Masala', 'Ghee'],
      allergens: ['Dairy']
    },
    { 
      name: 'Veg Biryani', 
      description: 'Aromatic basmati rice with mixed vegetables', 
      price: 180, 
      category: 'Biryani', 
      veg: true,
      ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Onion', 'Yogurt', 'Saffron', 'Mint', 'Coriander', 'Biryani Masala', 'Ghee'],
      allergens: ['Dairy']
    },
    { 
      name: 'Vada Pav', 
      description: 'Mumbai style potato fritter bun', 
      price: 35, 
      category: 'Snacks', 
      veg: true,
      ingredients: ['Potato', 'Gram Flour', 'Bread Bun', 'Green Chili', 'Ginger', 'Mustard Seeds', 'Turmeric', 'Oil'],
      allergens: ['Gluten']
    },
    { 
      name: 'Chole Bhature', 
      description: 'Spicy chickpeas with fried bread', 
      price: 150, 
      category: 'North Indian', 
      veg: true,
      ingredients: ['Chickpeas', 'All-purpose Flour', 'Yogurt', 'Tomato', 'Onion', 'Ginger-Garlic', 'Chole Masala', 'Oil'],
      allergens: ['Gluten', 'Dairy']
    },
    { 
      name: 'Gulab Jamun', 
      description: 'Milk-solid dumplings in sugar syrup', 
      price: 80, 
      category: 'Dessert', 
      veg: true,
      ingredients: ['Milk Powder', 'All-purpose Flour', 'Sugar', 'Cardamom', 'Rose Water', 'Ghee', 'Oil'],
      allergens: ['Gluten', 'Dairy']
    }
  ]

  await MenuItem.insertMany(items)
}


