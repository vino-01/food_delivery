// ===== COMPREHENSIVE CUISINES & CRAVINGS DATA =====

export const cuisines = [
  {
    id: 'north-indian',
    name: 'North Indian',
    emoji: '🍛',
    description: 'Rich, creamy curries and aromatic biryanis',
    color: '#0891b2',
    popularity: 95,
    avgPrice: 250,
    deliveryTime: '25-35 min',
    dietary: ['vegetarian', 'non-vegetarian'],
    specialties: ['Biryani', 'Butter Chicken', 'Dal Makhani', 'Naan'],
    restaurants: 156,
    topDishes: [
      { name: 'Chicken Biryani', price: 280, rating: 4.8, image: '🍛' },
      { name: 'Butter Chicken', price: 320, rating: 4.7, image: '🍗' },
      { name: 'Dal Makhani', price: 180, rating: 4.6, image: '🍲' },
      { name: 'Garlic Naan', price: 60, rating: 4.5, image: '🫓' }
    ]
  },
  {
    id: 'south-indian',
    name: 'South Indian',
    emoji: '🥞',
    description: 'Crispy dosas, fluffy idlis, and coconut-based curries',
    color: '#38a169',
    popularity: 88,
    avgPrice: 180,
    deliveryTime: '20-30 min',
    dietary: ['vegetarian', 'vegan-friendly'],
    specialties: ['Dosa', 'Idli', 'Sambar', 'Rasam'],
    restaurants: 134,
    topDishes: [
      { name: 'Masala Dosa', price: 120, rating: 4.9, image: '🥞' },
      { name: 'Idli Sambar', price: 80, rating: 4.7, image: '⚪' },
      { name: 'Uttapam', price: 100, rating: 4.6, image: '🥞' },
      { name: 'Filter Coffee', price: 40, rating: 4.8, image: '☕' }
    ]
  },
  {
    id: 'chinese',
    name: 'Chinese',
    emoji: '🥡',
    description: 'Indo-Chinese fusion with bold flavors and spices',
    color: '#d69e2e',
    popularity: 92,
    avgPrice: 220,
    deliveryTime: '30-40 min',
    dietary: ['vegetarian', 'non-vegetarian'],
    specialties: ['Fried Rice', 'Noodles', 'Manchurian', 'Spring Rolls'],
    restaurants: 189,
    topDishes: [
      { name: 'Chicken Fried Rice', price: 180, rating: 4.6, image: '🍚' },
      { name: 'Veg Hakka Noodles', price: 160, rating: 4.5, image: '🍜' },
      { name: 'Chilli Chicken', price: 240, rating: 4.7, image: '🌶️' },
      { name: 'Veg Spring Rolls', price: 120, rating: 4.4, image: '🥢' }
    ]
  },
  {
    id: 'italian',
    name: 'Italian',
    emoji: '🍝',
    description: 'Authentic pastas, pizzas, and Mediterranean flavors',
    color: '#48bb78',
    popularity: 85,
    avgPrice: 350,
    deliveryTime: '35-45 min',
    dietary: ['vegetarian', 'non-vegetarian'],
    specialties: ['Pizza', 'Pasta', 'Risotto', 'Lasagna'],
    restaurants: 98,
    topDishes: [
      { name: 'Margherita Pizza', price: 280, rating: 4.6, image: '🍕' },
      { name: 'Chicken Alfredo', price: 380, rating: 4.7, image: '🍝' },
      { name: 'Penne Arrabbiata', price: 320, rating: 4.5, image: '🍝' },
      { name: 'Garlic Bread', price: 120, rating: 4.4, image: '🥖' }
    ]
  },
  {
    id: 'continental',
    name: 'Continental',
    emoji: '🥗',
    description: 'International dishes with modern presentation',
    color: '#805ad5',
    popularity: 78,
    avgPrice: 400,
    deliveryTime: '40-50 min',
    dietary: ['vegetarian', 'non-vegetarian', 'vegan'],
    specialties: ['Steaks', 'Salads', 'Sandwiches', 'Soups'],
    restaurants: 76,
    topDishes: [
      { name: 'Grilled Chicken Salad', price: 320, rating: 4.5, image: '🥗' },
      { name: 'Club Sandwich', price: 280, rating: 4.4, image: '🥪' },
      { name: 'Mushroom Soup', price: 180, rating: 4.6, image: '🍲' },
      { name: 'Caesar Salad', price: 250, rating: 4.3, image: '🥬' }
    ]
  },
  {
    id: 'street-food',
    name: 'Street Food',
    emoji: '🌮',
    description: 'Spicy chaats, crispy snacks, and local favorites',
    color: '#ed8936',
    popularity: 90,
    avgPrice: 120,
    deliveryTime: '15-25 min',
    dietary: ['vegetarian', 'vegan-friendly'],
    specialties: ['Chaat', 'Pani Puri', 'Vada Pav', 'Samosa'],
    restaurants: 203,
    topDishes: [
      { name: 'Pani Puri', price: 60, rating: 4.8, image: '🫧' },
      { name: 'Bhel Puri', price: 80, rating: 4.7, image: '🥗' },
      { name: 'Vada Pav', price: 40, rating: 4.6, image: '🍔' },
      { name: 'Samosa', price: 30, rating: 4.5, image: '🥟' }
    ]
  },
  {
    id: 'healthy-bowls',
    name: 'Healthy Bowls',
    emoji: '🥙',
    description: 'Nutritious, balanced meals for health-conscious foodies',
    color: '#26C6DA',
    popularity: 72,
    avgPrice: 280,
    deliveryTime: '25-35 min',
    dietary: ['vegetarian', 'vegan', 'keto', 'gluten-free'],
    specialties: ['Buddha Bowls', 'Quinoa Salads', 'Smoothie Bowls', 'Protein Bowls'],
    restaurants: 67,
    topDishes: [
      { name: 'Buddha Bowl', price: 320, rating: 4.6, image: '🍲' },
      { name: 'Quinoa Salad', price: 280, rating: 4.5, image: '🥗' },
      { name: 'Acai Bowl', price: 250, rating: 4.7, image: '🍇' },
      { name: 'Protein Smoothie', price: 180, rating: 4.4, image: '🥤' }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    emoji: '🍰',
    description: 'Sweet treats, cakes, and traditional Indian sweets',
    color: '#FF7675',
    popularity: 83,
    avgPrice: 150,
    deliveryTime: '20-30 min',
    dietary: ['vegetarian', 'vegan-options'],
    specialties: ['Cakes', 'Ice Cream', 'Gulab Jamun', 'Pastries'],
    restaurants: 145,
    topDishes: [
      { name: 'Chocolate Cake', price: 180, rating: 4.8, image: '🍰' },
      { name: 'Gulab Jamun', price: 80, rating: 4.7, image: '🍯' },
      { name: 'Vanilla Ice Cream', price: 120, rating: 4.6, image: '🍦' },
      { name: 'Cheesecake', price: 220, rating: 4.5, image: '🍰' }
    ]
  },
  {
    id: 'beverages',
    name: 'Beverages',
    emoji: '🥤',
    description: 'Refreshing drinks, juices, and specialty beverages',
    color: '#00B894',
    popularity: 76,
    avgPrice: 80,
    deliveryTime: '15-20 min',
    dietary: ['vegetarian', 'vegan'],
    specialties: ['Fresh Juices', 'Smoothies', 'Lassi', 'Coffee'],
    restaurants: 234,
    topDishes: [
      { name: 'Mango Lassi', price: 60, rating: 4.7, image: '🥭' },
      { name: 'Fresh Orange Juice', price: 80, rating: 4.6, image: '🍊' },
      { name: 'Cold Coffee', price: 100, rating: 4.5, image: '☕' },
      { name: 'Green Smoothie', price: 120, rating: 4.4, image: '🥬' }
    ]
  },
  {
    id: 'fast-food',
    name: 'Fast Food',
    emoji: '🍔',
    description: 'Quick bites, burgers, and comfort food favorites',
    color: '#E17055',
    popularity: 87,
    avgPrice: 200,
    deliveryTime: '20-30 min',
    dietary: ['vegetarian', 'non-vegetarian'],
    specialties: ['Burgers', 'Fries', 'Wraps', 'Sandwiches'],
    restaurants: 167,
    topDishes: [
      { name: 'Chicken Burger', price: 180, rating: 4.5, image: '🍔' },
      { name: 'French Fries', price: 80, rating: 4.4, image: '🍟' },
      { name: 'Chicken Wrap', price: 160, rating: 4.6, image: '🌯' },
      { name: 'Onion Rings', price: 100, rating: 4.3, image: '🧅' }
    ]
  }
];

export const cravings = [
  {
    id: 'spicy',
    name: 'Spicy & Hot',
    emoji: '🌶️',
    description: 'For those who love the heat',
    color: '#FF4757',
    matchingCuisines: ['north-indian', 'south-indian', 'chinese', 'street-food'],
    popularDishes: ['Chicken 65', 'Spicy Biryani', 'Chilli Paneer', 'Hot Wings'],
    intensity: 'high'
  },
  {
    id: 'comfort',
    name: 'Comfort Food',
    emoji: '🤗',
    description: 'Soul-warming, hearty meals',
    color: '#FFA726',
    matchingCuisines: ['north-indian', 'italian', 'continental', 'fast-food'],
    popularDishes: ['Mac & Cheese', 'Dal Rice', 'Pizza', 'Chicken Soup'],
    intensity: 'medium'
  },
  {
    id: 'healthy',
    name: 'Healthy & Fresh',
    emoji: '🥗',
    description: 'Nutritious and guilt-free options',
    color: '#26C6DA',
    matchingCuisines: ['healthy-bowls', 'continental', 'south-indian'],
    popularDishes: ['Quinoa Bowl', 'Greek Salad', 'Grilled Fish', 'Smoothie Bowl'],
    intensity: 'low'
  },
  {
    id: 'sweet',
    name: 'Sweet Tooth',
    emoji: '🍰',
    description: 'Satisfy your dessert cravings',
    color: '#FF7675',
    matchingCuisines: ['desserts', 'beverages'],
    popularDishes: ['Chocolate Cake', 'Ice Cream', 'Gulab Jamun', 'Milkshake'],
    intensity: 'high'
  },
  {
    id: 'quick-bites',
    name: 'Quick Bites',
    emoji: '⚡',
    description: 'Fast and satisfying snacks',
    color: '#00B894',
    matchingCuisines: ['street-food', 'fast-food', 'chinese'],
    popularDishes: ['Samosa', 'Spring Rolls', 'Burger', 'Momos'],
    intensity: 'medium'
  },
  {
    id: 'exotic',
    name: 'Exotic Flavors',
    emoji: '🌍',
    description: 'International and fusion cuisines',
    color: '#A55EEA',
    matchingCuisines: ['italian', 'continental', 'chinese'],
    popularDishes: ['Sushi', 'Thai Curry', 'Mexican Tacos', 'Lebanese Hummus'],
    intensity: 'medium'
  },
  {
    id: 'traditional',
    name: 'Traditional',
    emoji: '🏛️',
    description: 'Authentic, time-tested recipes',
    color: '#FDCB6E',
    matchingCuisines: ['north-indian', 'south-indian'],
    popularDishes: ['Thali', 'Biryani', 'Dosa', 'Rajma Rice'],
    intensity: 'medium'
  },
  {
    id: 'party-food',
    name: 'Party Food',
    emoji: '🎉',
    description: 'Perfect for sharing and celebrations',
    color: '#E84393',
    matchingCuisines: ['chinese', 'fast-food', 'italian', 'street-food'],
    popularDishes: ['Pizza', 'Fried Rice', 'Nachos', 'Chicken Wings'],
    intensity: 'high'
  }
];

export const dietaryFilters = [
  { id: 'vegetarian', name: 'Vegetarian', emoji: '🥬', color: '#26C6DA' },
  { id: 'vegan', name: 'Vegan', emoji: '🌱', color: '#00B894' },
  { id: 'non-vegetarian', name: 'Non-Vegetarian', emoji: '🍗', color: '#FF6B35' },
  { id: 'keto', name: 'Keto', emoji: '🥑', color: '#A55EEA' },
  { id: 'gluten-free', name: 'Gluten Free', emoji: '🌾', color: '#FDCB6E' },
  { id: 'dairy-free', name: 'Dairy Free', emoji: '🥛', color: '#FF7675' }
];

export const priceRanges = [
  { id: 'budget', name: 'Budget Friendly', range: [0, 150], emoji: '💰', color: '#00B894' },
  { id: 'moderate', name: 'Moderate', range: [150, 300], emoji: '💳', color: '#FDCB6E' },
  { id: 'premium', name: 'Premium', range: [300, 500], emoji: '💎', color: '#A55EEA' },
  { id: 'luxury', name: 'Luxury', range: [500, 1000], emoji: '👑', color: '#FF6B35' }
];

// Helper functions
export const getCuisineById = (id) => cuisines.find(c => c.id === id);
export const getCravingById = (id) => cravings.find(c => c.id === id);
export const getPopularCuisines = () => cuisines.sort((a, b) => b.popularity - a.popularity).slice(0, 6);
export const getCuisinesByCraving = (cravingId) => {
  const craving = getCravingById(cravingId);
  return craving ? cuisines.filter(c => craving.matchingCuisines.includes(c.id)) : [];
};