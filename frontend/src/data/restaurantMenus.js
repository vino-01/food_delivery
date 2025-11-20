// Restaurant-specific menus with unique images and pricing
export const restaurantMenus = {
  // Annapoorna Restaurant - South Indian Vegetarian
  'tn_pr_001': {
    restaurantName: 'Annapoorna Restaurant',
    cuisine: 'South Indian Vegetarian',
    categories: [
      {
        name: 'Breakfast',
        items: [
          {
            id: 'ann_001',
            name: 'Masala Dosa',
            price: 80,
            description: 'Crispy rice crepe with spiced potato filling',
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.5,
            prepTime: '15 mins'
          },
          {
            id: 'ann_002',
            name: 'Idli Sambar',
            price: 60,
            description: 'Steamed rice cakes with lentil curry',
            image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.3,
            prepTime: '10 mins'
          },
          {
            id: 'ann_003',
            name: 'Medu Vada',
            price: 50,
            description: 'Crispy lentil donuts with coconut chutney',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.2,
            prepTime: '12 mins'
          }
        ]
      },
      {
        name: 'Main Course',
        items: [
          {
            id: 'ann_004',
            name: 'South Indian Meals',
            price: 120,
            description: 'Traditional banana leaf meal with rice, sambar, rasam, vegetables',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.6,
            prepTime: '20 mins'
          },
          {
            id: 'ann_005',
            name: 'Curd Rice',
            price: 80,
            description: 'Comfort food with yogurt, rice, and traditional tempering',
            image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '10 mins'
          },
          {
            id: 'ann_006',
            name: 'Sambar Rice',
            price: 90,
            description: 'Steamed rice with spicy lentil curry and vegetables',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.3,
            prepTime: '15 mins'
          },
          {
            id: 'ann_007',
            name: 'Vegetable Biryani',
            price: 150,
            description: 'Fragrant basmati rice with mixed vegetables and aromatic spices',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '25 mins'
          }
        ]
      },
      {
        name: 'Snacks & Appetizers',
        items: [
          {
            id: 'ann_008',
            name: 'Masala Puri',
            price: 70,
            description: 'Crispy puris topped with spiced potatoes, chutneys, and sev',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.2,
            prepTime: '8 mins'
          },
          {
            id: 'ann_009',
            name: 'Bhel Puri',
            price: 60,
            description: 'Mumbai street food with puffed rice, vegetables, and tangy chutneys',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.1,
            prepTime: '5 mins'
          },
          {
            id: 'ann_010',
            name: 'Paneer Pakoda',
            price: 110,
            description: 'Crispy cottage cheese fritters with mint chutney',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.4,
            prepTime: '12 mins'
          }
        ]
      },
      {
        name: 'Beverages',
        items: [
          {
            id: 'ann_011',
            name: 'Filter Coffee',
            price: 30,
            description: 'Authentic South Indian filter coffee with fresh milk',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.7,
            prepTime: '5 mins'
          },
          {
            id: 'ann_012',
            name: 'Masala Chai',
            price: 25,
            description: 'Spiced tea with cardamom, ginger, and aromatic herbs',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.3,
            prepTime: '5 mins'
          },
          {
            id: 'ann_013',
            name: 'Fresh Lime Soda',
            price: 40,
            description: 'Refreshing lime juice with soda and mint',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.2,
            prepTime: '3 mins'
          },
          {
            id: 'ann_014',
            name: 'Buttermilk',
            price: 35,
            description: 'Traditional spiced yogurt drink with curry leaves',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.1,
            prepTime: '3 mins'
          }
        ]
      },
      {
        name: 'Desserts',
        items: [
          {
            id: 'ann_015',
            name: 'Payasam',
            price: 60,
            description: 'Traditional South Indian sweet pudding with jaggery and coconut',
            image: 'https://images.unsplash.com/photo-1571197119282-7c4e2b2b7b4e?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.5,
            prepTime: '5 mins'
          },
          {
            id: 'ann_016',
            name: 'Mysore Pak',
            price: 80,
            description: 'Rich and sweet confection made with ghee, sugar, and gram flour',
            image: 'https://images.unsplash.com/photo-1571197119282-7c4e2b2b7b4e?w=400&h=300&fit=crop&auto=format&q=80',
            isVeg: true,
            rating: 4.4,
            prepTime: '2 mins'
          }
        ]
      }
    ]
  },

  // Saravana Bhavan - Premium South Indian
  'tn_pr_002': {
    restaurantName: 'Saravana Bhavan',
    cuisine: 'Premium South Indian',
    categories: [
      {
        name: 'Signature Dosas',
        items: [
          {
            id: 'sb_001',
            name: 'Rava Masala Dosa',
            price: 120,
            description: 'Crispy semolina crepe with spiced potato filling and ghee',
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.6,
            prepTime: '18 mins'
          },
          {
            id: 'sb_002',
            name: 'Cheese Dosa',
            price: 140,
            description: 'Crispy dosa filled with melted cheese and vegetables',
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '20 mins'
          },
          {
            id: 'sb_003',
            name: 'Podi Dosa',
            price: 100,
            description: 'Dosa sprinkled with spicy lentil powder and ghee',
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '15 mins'
          }
        ]
      },
      {
        name: 'Traditional Meals',
        items: [
          {
            id: 'sb_004',
            name: 'Saravana Special Meals',
            price: 180,
            description: 'Premium banana leaf meal with 12 varieties including sweets',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.8,
            prepTime: '25 mins'
          },
          {
            id: 'sb_005',
            name: 'Mini Meals',
            price: 120,
            description: 'Compact version of traditional meals with essential items',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '15 mins'
          }
        ]
      },
      {
        name: 'North Indian',
        items: [
          {
            id: 'sb_006',
            name: 'Paneer Butter Masala',
            price: 160,
            description: 'Cottage cheese in rich tomato and butter gravy',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.6,
            prepTime: '20 mins'
          },
          {
            id: 'sb_007',
            name: 'Dal Makhani',
            price: 140,
            description: 'Creamy black lentils slow-cooked with butter and cream',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '25 mins'
          },
          {
            id: 'sb_008',
            name: 'Naan & Roti',
            price: 40,
            description: 'Freshly baked Indian bread varieties',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.3,
            prepTime: '10 mins'
          }
        ]
      },
      {
        name: 'Chinese',
        items: [
          {
            id: 'sb_009',
            name: 'Vegetable Fried Rice',
            price: 120,
            description: 'Wok-tossed rice with fresh vegetables and soy sauce',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '15 mins'
          },
          {
            id: 'sb_010',
            name: 'Gobi Manchurian',
            price: 130,
            description: 'Crispy cauliflower in spicy Indo-Chinese sauce',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '18 mins'
          },
          {
            id: 'sb_011',
            name: 'Hakka Noodles',
            price: 110,
            description: 'Stir-fried noodles with vegetables and aromatic spices',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.3,
            prepTime: '12 mins'
          }
        ]
      },
      {
        name: 'Beverages & Desserts',
        items: [
          {
            id: 'sb_012',
            name: 'Fresh Fruit Juice',
            price: 60,
            description: 'Seasonal fresh fruit juices - Orange, Apple, Pomegranate',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '5 mins'
          },
          {
            id: 'sb_013',
            name: 'Kulfi',
            price: 50,
            description: 'Traditional Indian ice cream with cardamom and pistachios',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.6,
            prepTime: '2 mins'
          }
        ]
      }
    ]
  },

  // Hotel Tamil Nadu - Mixed Cuisine
  'tn_pr_003': {
    restaurantName: 'Hotel Tamil Nadu',
    cuisine: 'Multi-Cuisine',
    categories: [
      {
        name: 'Non-Vegetarian Specials',
        items: [
          {
            id: 'tn_001',
            name: 'Chicken Biryani',
            price: 180,
            description: 'Aromatic basmati rice with tender chicken and traditional spices',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.7,
            prepTime: '30 mins'
          },
          {
            id: 'tn_002',
            name: 'Mutton Curry',
            price: 220,
            description: 'Spicy mutton curry with traditional Tamil Nadu spices',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.6,
            prepTime: '35 mins'
          },
          {
            id: 'tn_003',
            name: 'Fish Curry',
            price: 200,
            description: 'Fresh fish cooked in coconut-based curry with curry leaves',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.5,
            prepTime: '25 mins'
          },
          {
            id: 'tn_004',
            name: 'Chicken 65',
            price: 160,
            description: 'Spicy deep-fried chicken appetizer with curry leaves',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.4,
            prepTime: '20 mins'
          }
        ]
      },
      {
        name: 'Vegetarian Delights',
        items: [
          {
            id: 'tn_005',
            name: 'Vegetable Biryani',
            price: 140,
            description: 'Fragrant rice with mixed vegetables and aromatic spices',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.3,
            prepTime: '25 mins'
          },
          {
            id: 'tn_006',
            name: 'Paneer Tikka',
            price: 150,
            description: 'Grilled cottage cheese with bell peppers and onions',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '18 mins'
          }
        ]
      },
      {
        name: 'Tandoor Items',
        items: [
          {
            id: 'tn_007',
            name: 'Tandoori Chicken',
            price: 190,
            description: 'Clay oven roasted chicken with yogurt and spice marinade',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.6,
            prepTime: '25 mins'
          },
          {
            id: 'tn_008',
            name: 'Tandoori Roti',
            price: 30,
            description: 'Whole wheat bread baked in clay oven',
            image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.2,
            prepTime: '8 mins'
          }
        ]
      }
    ]
  },

  // Cafe Coffee Day - Continental & Beverages
  'ka_bl_001': {
    restaurantName: 'Cafe Coffee Day',
    cuisine: 'Continental & Beverages',
    categories: [
      {
        name: 'Coffee & Hot Beverages',
        items: [
          {
            id: 'ccd_001',
            name: 'Cappuccino',
            price: 120,
            description: 'Rich espresso with steamed milk and foam art',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '5 mins'
          },
          {
            id: 'ccd_002',
            name: 'Cafe Latte',
            price: 130,
            description: 'Smooth espresso with steamed milk and light foam',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '5 mins'
          },
          {
            id: 'ccd_003',
            name: 'Mocha',
            price: 140,
            description: 'Espresso with chocolate syrup and steamed milk',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.6,
            prepTime: '6 mins'
          },
          {
            id: 'ccd_004',
            name: 'Hot Chocolate',
            price: 110,
            description: 'Rich chocolate drink with whipped cream',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.3,
            prepTime: '5 mins'
          }
        ]
      },
      {
        name: 'Cold Beverages',
        items: [
          {
            id: 'ccd_005',
            name: 'Iced Coffee',
            price: 130,
            description: 'Chilled coffee with ice and milk',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '4 mins'
          },
          {
            id: 'ccd_006',
            name: 'Frappe',
            price: 150,
            description: 'Blended iced coffee with whipped cream',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '6 mins'
          },
          {
            id: 'ccd_007',
            name: 'Fresh Lime Water',
            price: 60,
            description: 'Refreshing lime juice with mint and soda',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.2,
            prepTime: '3 mins'
          }
        ]
      },
      {
        name: 'Snacks & Light Bites',
        items: [
          {
            id: 'ccd_008',
            name: 'Chicken Sandwich',
            price: 140,
            description: 'Grilled chicken with vegetables in toasted bread',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.3,
            prepTime: '12 mins'
          },
          {
            id: 'ccd_009',
            name: 'Veg Club Sandwich',
            price: 120,
            description: 'Multi-layered sandwich with fresh vegetables and cheese',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.2,
            prepTime: '10 mins'
          },
          {
            id: 'ccd_010',
            name: 'Pasta Arrabiata',
            price: 160,
            description: 'Penne pasta in spicy tomato sauce with herbs',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '15 mins'
          },
          {
            id: 'ccd_011',
            name: 'Garlic Bread',
            price: 80,
            description: 'Toasted bread with garlic butter and herbs',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.1,
            prepTime: '8 mins'
          }
        ]
      },
      {
        name: 'Desserts',
        items: [
          {
            id: 'ccd_012',
            name: 'Chocolate Brownie',
            price: 90,
            description: 'Warm chocolate brownie with vanilla ice cream',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '5 mins'
          },
          {
            id: 'ccd_013',
            name: 'Cheesecake',
            price: 110,
            description: 'Creamy New York style cheesecake with berry compote',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.6,
            prepTime: '3 mins'
          }
        ]
      }
    ]
  },

  // Truffles - Continental Fine Dining
  'ka_bl_002': {
    restaurantName: 'Truffles',
    cuisine: 'Continental Fine Dining',
    categories: [
      {
        name: 'Burgers & Steaks',
        items: [
          {
            id: 'tr_001',
            name: 'Truffle Burger',
            price: 280,
            description: 'Premium beef patty with truffle sauce, cheese, and caramelized onions',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.7,
            prepTime: '20 mins'
          },
          {
            id: 'tr_002',
            name: 'Chicken Steak',
            price: 320,
            description: 'Grilled chicken breast with herb butter and mashed potatoes',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.6,
            prepTime: '25 mins'
          },
          {
            id: 'tr_003',
            name: 'Veggie Burger',
            price: 220,
            description: 'House-made vegetable patty with avocado and sprouts',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.4,
            prepTime: '18 mins'
          }
        ]
      },
      {
        name: 'Pizza & Italian',
        items: [
          {
            id: 'tr_004',
            name: 'Margherita Pizza',
            price: 240,
            description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.5,
            prepTime: '15 mins'
          },
          {
            id: 'tr_005',
            name: 'Pepperoni Pizza',
            price: 280,
            description: 'Spicy pepperoni with mozzarella cheese and tomato sauce',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.6,
            prepTime: '15 mins'
          },
          {
            id: 'tr_006',
            name: 'Carbonara Pasta',
            price: 260,
            description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.5,
            prepTime: '18 mins'
          }
        ]
      },
      {
        name: 'Salads & Appetizers',
        items: [
          {
            id: 'tr_007',
            name: 'Caesar Salad',
            price: 180,
            description: 'Crisp romaine lettuce with caesar dressing and croutons',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
            isVeg: true,
            rating: 4.3,
            prepTime: '8 mins'
          },
          {
            id: 'tr_008',
            name: 'Buffalo Wings',
            price: 200,
            description: 'Spicy chicken wings with blue cheese dip',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
            isVeg: false,
            rating: 4.4,
            prepTime: '15 mins'
          }
        ]
      }
    ]
  }
};
