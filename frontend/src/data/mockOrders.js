// Mock orders data for demonstration
export const mockOrders = [
  // Annapoorna Restaurant Orders (pr001)
  {
    id: 'ORD001',
    restaurantId: 'pr001',
    customerName: 'Raj Kumar',
    phone: '+91 98765 12345',
    address: 'Plot 15, Gandhi Nagar, Perudurai - 638052',
    orderTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: 'pending',
    items: [
      { name: 'Traditional South Indian Meals', quantity: 2, price: 120 },
      { name: 'Masala Dosa', quantity: 1, price: 80 }
    ],
    specialInstructions: 'Please make meals less spicy and add extra sambar',
    total: 320,
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'ORD002',
    restaurantId: 'pr001',
    customerName: 'Priya Subramanian',
    phone: '+91 87654 32109',
    address: 'Door No 42, Temple Street, Perudurai - 638052',
    orderTime: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    status: 'confirmed',
    items: [
      { name: 'Idli Sambar', quantity: 3, price: 60 },
      { name: 'Filter Coffee', quantity: 2, price: 25 }
    ],
    specialInstructions: 'Extra sambar please, make coffee strong',
    total: 230,
    paymentMethod: 'UPI'
  },
  {
    id: 'ORD003',
    restaurantId: 'pr001',
    customerName: 'Karthik Murugan',
    phone: '+91 99887 76543',
    address: 'Flat 8B, Annamalai Apartments, Perudurai - 638052',
    orderTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'delivered',
    items: [
      { name: 'Curd Rice', quantity: 1, price: 70 },
      { name: 'Vada', quantity: 4, price: 15 }
    ],
    total: 130,
    paymentMethod: 'Card'
  },

  // Hotel Selvam Orders (pr002)
  {
    id: 'ORD004',
    restaurantId: 'pr002',
    customerName: 'Lakshmi Devi',
    phone: '+91 96543 21087',
    address: 'House No 23, Market Street, Perudurai - 638052',
    orderTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    status: 'pending',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 180 },
      { name: 'Mutton Curry', quantity: 1, price: 220 }
    ],
    specialInstructions: 'Make biryani medium spicy, extra raita needed',
    total: 580,
    paymentMethod: 'UPI'
  },
  {
    id: 'ORD005',
    restaurantId: 'pr002',
    customerName: 'Senthil Kumar',
    phone: '+91 94321 65478',
    address: 'Plot 7, Bharathi Nagar, Perudurai - 638052',
    orderTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    status: 'preparing',
    items: [
      { name: 'Fish Curry', quantity: 1, price: 200 },
      { name: 'Chicken 65', quantity: 1, price: 160 },
      { name: 'Naan', quantity: 3, price: 45 }
    ],
    total: 495,
    paymentMethod: 'Cash on Delivery'
  },

  // Sri Lakshmi Vilas Orders (pr003)
  {
    id: 'ORD006',
    restaurantId: 'pr003',
    customerName: 'Meera Rajesh',
    phone: '+91 98123 45670',
    address: 'Door No 18, Kamala Street, Perudurai - 638052',
    orderTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'confirmed',
    items: [
      { name: 'Vegetable Biryani', quantity: 2, price: 140 },
      { name: 'Paneer Butter Masala', quantity: 1, price: 180 }
    ],
    specialInstructions: 'No onions in biryani, extra butter in paneer',
    total: 460,
    paymentMethod: 'UPI'
  },

  // Modern Cafe Orders (pr004)  
  {
    id: 'ORD007',
    restaurantId: 'pr004',
    customerName: 'Arjun Prakash',
    phone: '+91 91234 56789',
    address: 'Flat 12C, Green Valley Apartments, Perudurai - 638052',
    orderTime: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    status: 'pending',
    items: [
      { name: 'Pasta Arabbiata', quantity: 1, price: 200 },
      { name: 'Caesar Salad', quantity: 1, price: 150 },
      { name: 'Fresh Lime Soda', quantity: 2, price: 50 }
    ],
    total: 450,
    paymentMethod: 'Card'
  },

  // Thalappakatti Biryani Orders (pr005)
  {
    id: 'ORD008',
    restaurantId: 'pr005',
    customerName: 'Ravi Chandran',
    phone: '+91 99876 54321',
    address: 'Plot 25, River View Colony, Perudurai - 638052',
    orderTime: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    status: 'pending',
    items: [
      { name: 'Dindigul Mutton Biryani', quantity: 1, price: 250 },
      { name: 'Chicken Biryani', quantity: 1, price: 220 }
    ],
    specialInstructions: 'Extra spicy, add boiled eggs',
    total: 470,
    paymentMethod: 'UPI'
  },
  {
    id: 'ORD009',
    restaurantId: 'pr005',
    customerName: 'Divya Krishnan',
    phone: '+91 87654 09876',
    address: 'House No 34, Lotus Gardens, Perudurai - 638052',
    orderTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'delivered',
    items: [
      { name: 'Chicken Biryani', quantity: 3, price: 220 },
      { name: 'Raita', quantity: 3, price: 40 }
    ],
    total: 780,
    paymentMethod: 'Cash on Delivery'
  },

  // Saravana Bhavan Orders (pr006)
  {
    id: 'ORD010',
    restaurantId: 'pr006',
    customerName: 'Subash Chandra',
    phone: '+91 95432 10987',
    address: 'Door No 56, Teachers Colony, Perudurai - 638052',
    orderTime: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    status: 'confirmed',
    items: [
      { name: 'Rava Dosa', quantity: 2, price: 90 },
      { name: 'Pongal', quantity: 1, price: 80 },
      { name: 'Filter Coffee', quantity: 3, price: 25 }
    ],
    total: 335,
    paymentMethod: 'UPI'
  },

  // Royal Sweets Orders (pr007)
  {
    id: 'ORD011',
    restaurantId: 'pr007',
    customerName: 'Kamala Devi',
    phone: '+91 98765 43219',
    address: 'Plot 9, Rajaji Road, Perudurai - 638052',
    orderTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: 'ready',
    items: [
      { name: 'Mysore Pak', quantity: 500, price: 400 }, // 500g
      { name: 'Adhirasam', quantity: 12, price: 120 },
      { name: 'Badusha', quantity: 6, price: 90 }
    ],
    specialInstructions: 'Pack in gift boxes, its for festival',
    total: 610,
    paymentMethod: 'Cash on Delivery'
  }
]

// Additional analytics data
export const orderAnalytics = {
  todayStats: {
    totalOrders: 8,
    totalRevenue: 2850,
    avgOrderValue: 356
  },
  weeklyStats: {
    totalOrders: 47,
    totalRevenue: 16780,
    avgOrderValue: 357
  },
  monthlyStats: {
    totalOrders: 189,
    totalRevenue: 67320,
    avgOrderValue: 356
  }
}