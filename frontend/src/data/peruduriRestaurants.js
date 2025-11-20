// Real restaurants in and around Perudurai, Tamil Nadu with detailed menus and ingredients

export const peruduriRestaurants = [
  {
    _id: 'pr001',
    name: 'Annapoorna Restaurant',
    cuisine: 'South Indian',
    rating: 4.5,
    deliveryTime: '25-30 min',
    minOrder: 100,
    color: '#8b5cf6',
    icon: '🍽️',
    description: 'Authentic South Indian cuisine with traditional flavors and fresh ingredients',
    menu: [
      {
        _id: 'item001',
        name: 'Idli Sambar',
        description: 'Soft steamed rice cakes served with hot sambar and coconut chutney',
        price: 45,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1668853177303-a2123547285a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Urad Dal', 'Sambar', 'Coconut Chutney'],
        allergens: []
      },
      {
        _id: 'item002',
        name: 'Masala Dosa',
        description: 'Crispy dosa filled with spiced potato mixture, served with sambar and chutney',
        price: 65,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Urad Dal', 'Potatoes', 'Onions', 'Spices'],
        allergens: []
      },
      {
        _id: 'item003',
        name: 'Vada Curry',
        description: 'Crispy vadas in spicy curry gravy, perfect with rice or roti',
        price: 55,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1668853177303-a2123547285a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Urad Dal', 'Onions', 'Curry Gravy', 'Spices'],
        allergens: []
      },
      {
        _id: 'item004',
        name: 'Pongal',
        description: 'Traditional rice and lentil dish cooked with ghee and black pepper',
        price: 50,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1579619379206-8d5c9d12a87c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Moong Dal', 'Ghee', 'Black Pepper', 'Cumin'],
        allergens: []
      },
      {
        _id: 'item005',
        name: 'Rasam',
        description: 'Spicy and tangy soup made with tamarind, tomatoes and spices',
        price: 40,
        category: 'soups',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Tamarind', 'Tomatoes', 'Garlic', 'Spices', 'Coriander'],
        allergens: []
      },
      {
        _id: 'item006',
        name: 'Coconut Rice',
        description: 'Fragrant rice cooked with fresh coconut and mild spices',
        price: 60,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1668853177303-a2123547285a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Coconut', 'Mustard Seeds', 'Curry Leaves', 'Spices'],
        allergens: []
      }
    ]
  },
  {
    _id: 'pr002',
    name: 'Hotel Selvam',
    cuisine: 'Tamil Non-Veg',
    rating: 4.3,
    deliveryTime: '30-35 min',
    minOrder: 150,
    color: '#ef4444',
    icon: '🍗',
    description: 'Famous for authentic Tamil non-vegetarian dishes with traditional recipes',
    menu: [
      {
        _id: 'item007',
        name: 'Chicken 65',
        description: 'Spicy deep-fried chicken marinated in special spices and curry leaves',
        price: 180,
        category: 'starters',
        image: 'https://images.unsplash.com/photo-1606771588691-8c433364f9b2?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Chicken', 'Curry Leaves', 'Spices', 'Ginger', 'Garlic'],
        allergens: []
      },
      {
        _id: 'item008',
        name: 'Fish Fry',
        description: 'Crispy fried fish marinated with traditional Tamil spices',
        price: 220,
        category: 'starters',
        image: 'https://images.unsplash.com/photo-1563722744030-a044d0df45c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Fish', 'Turmeric', 'Red Chilli', 'Ginger', 'Garlic'],
        allergens: ['Fish']
      },
      {
        _id: 'item009',
        name: 'Mutton Curry',
        description: 'Tender mutton cooked in rich gravy with aromatic spices',
        price: 280,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Mutton', 'Onions', 'Tomatoes', 'Spices', 'Ginger'],
        allergens: []
      },
      {
        _id: 'item010',
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices',
        price: 250,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a04221?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Spices', 'Mint'],
        allergens: []
      },
      {
        _id: 'item011',
        name: 'Egg Curry',
        description: 'Hard-boiled eggs in spicy tomato-based gravy',
        price: 120,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Eggs', 'Tomatoes', 'Onions', 'Spices', 'Ginger'],
        allergens: ['Eggs']
      },
      {
        _id: 'item012',
        name: 'Mutton Biryani',
        description: 'Traditional biryani with tender mutton and aromatic spices',
        price: 320,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a04221?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Basmati Rice', 'Mutton', 'Saffron', 'Spices', 'Mint'],
        allergens: []
      }
    ]
  },
  {
    _id: 'pr003',
    name: 'Sri Lakshmi Vilas',
    cuisine: 'Pure Vegetarian',
    rating: 4.6,
    deliveryTime: '20-25 min',
    minOrder: 80,
    color: '#10b981',
    icon: '🥬',
    description: 'Pure vegetarian restaurant serving traditional Tamil dishes with fresh vegetables',
    menu: [
      {
        _id: 'item013',
        name: 'Adhirasam',
        description: 'Traditional sweet made with rice flour and jaggery, deep-fried',
        price: 35,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1563722744030-a044d0df45c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice Flour', 'Jaggery', 'Cardamom', 'Ghee'],
        allergens: []
      },
      {
        _id: 'item014',
        name: 'Pongal',
        description: 'Sweet pongal made with rice, moong dal and jaggery',
        price: 45,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1579619379206-8d5c9d12a87c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Moong Dal', 'Jaggery', 'Ghee', 'Cardamom'],
        allergens: []
      },
      {
        _id: 'item015',
        name: 'Vegetable Kurma',
        description: 'Mixed vegetables cooked in coconut-based gravy with mild spices',
        price: 90,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Mixed Vegetables', 'Coconut', 'Poppy Seeds', 'Spices'],
        allergens: []
      },
      {
        _id: 'item016',
        name: 'Rava Idli',
        description: 'Soft idlis made with semolina, served with sambar and chutney',
        price: 40,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1668853177303-a2123547285a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Semolina', 'Curd', 'Mustard Seeds', 'Curry Leaves'],
        allergens: []
      },
      {
        _id: 'item017',
        name: 'Jangri',
        description: 'Traditional sweet made with urad dal flour, shaped like flowers',
        price: 30,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1563722744030-a044d0df45c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Urad Dal', 'Sugar', 'Saffron', 'Ghee'],
        allergens: []
      },
      {
        _id: 'item018',
        name: 'Vegetable Biryani',
        description: 'Fragrant rice cooked with fresh vegetables and aromatic spices',
        price: 140,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a04221?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Saffron', 'Spices'],
        allergens: []
      }
    ]
  },
  {
    _id: 'pr004',
    name: 'Modern Cafe',
    cuisine: 'Multi-Cuisine',
    rating: 4.2,
    deliveryTime: '25-30 min',
    minOrder: 120,
    color: '#f59e0b',
    icon: '☕',
    description: 'Modern cafe serving Chinese, North Indian and continental favorites',
    menu: [
      {
        _id: 'item019',
        name: 'Chicken Fried Rice',
        description: 'Chinese-style fried rice with tender chicken and vegetables',
        price: 160,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Chicken', 'Mixed Vegetables', 'Soy Sauce', 'Eggs'],
        allergens: ['Eggs']
      },
      {
        _id: 'item020',
        name: 'Veg Manchurian',
        description: 'Crispy vegetable dumplings in spicy Chinese gravy',
        price: 120,
        category: 'starters',
        image: 'https://images.unsplash.com/photo-1579619379206-8d5c9d12a87c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Mixed Vegetables', 'Flour', 'Ginger', 'Garlic', 'Soy Sauce'],
        allergens: []
      },
      {
        _id: 'item021',
        name: 'Butter Chicken',
        description: 'Tender chicken in rich, creamy tomato-based gravy',
        price: 220,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Spices'],
        allergens: ['Dairy']
      },
      {
        _id: 'item022',
        name: 'Veg Noodles',
        description: 'Stir-fried noodles with fresh vegetables and soy sauce',
        price: 100,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Noodles', 'Mixed Vegetables', 'Soy Sauce', 'Ginger', 'Garlic'],
        allergens: []
      },
      {
        _id: 'item023',
        name: 'Chicken 65',
        description: 'Spicy deep-fried chicken with curry leaves and spices',
        price: 180,
        category: 'starters',
        image: 'https://images.unsplash.com/photo-1606771588691-8c433364f9b2?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Chicken', 'Curry Leaves', 'Spices', 'Ginger', 'Garlic'],
        allergens: []
      },
      {
        _id: 'item024',
        name: 'Veg Fried Rice',
        description: 'Chinese-style fried rice with fresh vegetables',
        price: 120,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Mixed Vegetables', 'Soy Sauce', 'Ginger', 'Garlic'],
        allergens: []
      }
    ]
  },
  {
    _id: 'pr005',
    name: 'Thalappakatti Biryani',
    cuisine: 'Biryani Specialist',
    rating: 4.7,
    deliveryTime: '35-40 min',
    minOrder: 200,
    color: '#fbbf24',
    icon: '🍚',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a04221?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Famous for authentic Dindigul-style biryani with aromatic spices',
    menu: [
      {
        _id: 'item025',
        name: 'Chicken Biryani',
        description: 'Traditional Dindigul biryani with tender chicken and aromatic spices',
        price: 280,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a04221?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Seeraga Samba Rice', 'Chicken', 'Saffron', 'Spices', 'Mint'],
        allergens: []
      },
      {
        _id: 'item026',
        name: 'Mutton Biryani',
        description: 'Rich mutton biryani cooked with traditional Dindigul spices',
        price: 350,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Seeraga Samba Rice', 'Mutton', 'Saffron', 'Spices', 'Mint'],
        allergens: []
      },
      {
        _id: 'item027',
        name: 'Veg Biryani',
        description: 'Vegetarian biryani with fresh vegetables and aromatic spices',
        price: 200,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Seeraga Samba Rice', 'Mixed Vegetables', 'Saffron', 'Spices'],
        allergens: []
      },
      {
        _id: 'item028',
        name: 'Chicken 65',
        description: 'Spicy starter chicken with curry leaves and special spices',
        price: 200,
        category: 'starters',
        image: 'https://images.unsplash.com/photo-1606771588691-8c433364f9b2?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Chicken', 'Curry Leaves', 'Spices', 'Ginger', 'Garlic'],
        allergens: []
      },
      {
        _id: 'item029',
        name: 'Mutton Curry',
        description: 'Rich mutton curry to accompany biryani',
        price: 320,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Mutton', 'Onions', 'Tomatoes', 'Spices', 'Ginger'],
        allergens: []
      },
      {
        _id: 'item030',
        name: 'Raita',
        description: 'Cooling yogurt accompaniment for biryani',
        price: 60,
        category: 'sides',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Yogurt', 'Cucumber', 'Onions', 'Mint', 'Coriander'],
        allergens: ['Dairy']
      }
    ]
  },
  {
    _id: 'pr006',
    name: 'Quick Tiffin Center',
    cuisine: 'Quick Tiffins',
    rating: 4.4,
    deliveryTime: '15-20 min',
    minOrder: 60,
    color: '#06b6d4',
    icon: '🥟',
    description: 'Fast and fresh tiffin items perfect for quick meals',
    menu: [
      {
        _id: 'item031',
        name: 'Idli Set',
        description: '2 soft idlis with sambar and coconut chutney',
        price: 35,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1668853177303-a2123547285a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Urad Dal', 'Sambar', 'Coconut Chutney'],
        allergens: []
      },
      {
        _id: 'item032',
        name: 'Dosa Set',
        description: 'Crispy dosa with sambar and coconut chutney',
        price: 45,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Urad Dal', 'Sambar', 'Coconut Chutney'],
        allergens: []
      },
      {
        _id: 'item033',
        name: 'Vada Set',
        description: '2 crispy vadas with sambar and coconut chutney',
        price: 40,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1668853177303-a2123547285a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Urad Dal', 'Onions', 'Sambar', 'Coconut Chutney'],
        allergens: []
      },
      {
        _id: 'item034',
        name: 'Pongal Set',
        description: 'Hot pongal with sambar and coconut chutney',
        price: 50,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1579619379206-8d5c9d12a87c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Moong Dal', 'Sambar', 'Coconut Chutney'],
        allergens: []
      },
      {
        _id: 'item035',
        name: 'Upma',
        description: 'Semolina upma with vegetables and mild spices',
        price: 35,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Semolina', 'Vegetables', 'Mustard Seeds', 'Curry Leaves'],
        allergens: []
      },
      {
        _id: 'item036',
        name: 'Tea/Coffee',
        description: 'Hot tea or coffee to complete your meal',
        price: 15,
        category: 'beverages',
        image: 'https://images.unsplash.com/photo-1579619379206-8d5c9d12a87c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Tea Leaves/Coffee', 'Milk', 'Sugar'],
        allergens: ['Dairy']
      }
    ]
  },
  {
    _id: 'pr007',
    name: 'Royal Sweets & Snacks',
    cuisine: 'Sweets & Snacks',
    rating: 4.4,
    deliveryTime: '15-20 min',
    minOrder: 80,
    color: '#ec4899',
    icon: '🍰',
    description: 'Traditional Tamil sweets and snacks made with authentic recipes',
    menu: [
      {
        _id: 'item037',
        name: 'Adhirasam',
        description: 'Traditional sweet made with rice flour and jaggery',
        price: 35,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1563722744030-a044d0df45c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice Flour', 'Jaggery', 'Cardamom', 'Ghee'],
        allergens: []
      },
      {
        _id: 'item038',
        name: 'Jangri',
        description: 'Sweet flower-shaped snack made with urad dal flour',
        price: 30,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1563722744030-a044d0df45c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Urad Dal', 'Sugar', 'Saffron', 'Ghee'],
        allergens: []
      },
      {
        _id: 'item039',
        name: 'Murukku',
        description: 'Crispy rice and lentil snack with mild spices',
        price: 40,
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1626202410714-3685c2707255?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice Flour', 'Urad Dal', 'Sesame Seeds', 'Spices'],
        allergens: []
      },
      {
        _id: 'item040',
        name: 'Laddu',
        description: 'Sweet balls made with gram flour and sugar',
        price: 25,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1579619379206-8d5c9d12a87c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Gram Flour', 'Sugar', 'Ghee', 'Cardamom'],
        allergens: []
      },
      {
        _id: 'item041',
        name: 'Pongal',
        description: 'Sweet pongal with rice, moong dal and jaggery',
        price: 45,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1579619379206-8d5c9d12a87c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Rice', 'Moong Dal', 'Jaggery', 'Ghee', 'Cardamom'],
        allergens: []
      },
      {
        _id: 'item042',
        name: 'Kesari',
        description: 'Saffron-flavored sweet made with semolina and ghee',
        price: 40,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1563722744030-a044d0df45c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: ['Semolina', 'Sugar', 'Ghee', 'Saffron', 'Nuts'],
        allergens: ['Nuts']
      }
    ]
  }
];

// Enhanced location data for Perudurai area
export const peruduriAreaInfo = {
  mainLocation: {
    name: 'Perudurai',
    coordinates: { lat: 11.2379, lng: 77.5864 },
    pincode: '638052',
    district: 'Erode',
    state: 'Tamil Nadu'
  },
  deliveryAreas: [
    'Perudurai Bus Stand',
    'Perudurai Railway Station',
    'Temple Street',
    'Main Road',
    'New Bus Stand Area',
    'Market Area',
    'Highway (NH-7)',
    'Residential Areas'
  ],
  landmarks: [
    'Perudurai Railway Junction',
    'Government Hospital',
    'District Collectorate',
    'Central Bus Stand',
    'Sri Murugan Temple',
    'Town Panchayat Office'
  ]
};

// Common allergens and dietary preferences for the region
export const commonAllergens = [
  'Dairy', 'Nuts (Peanuts)', 'Nuts (Cashew)', 'Nuts (Almonds)', 
  'Sesame', 'Legumes', 'Gluten', 'Egg', 'Soy', 'Seafood'
];

export const dietaryPreferences = [
  'Pure Vegetarian', 'Jain Food', 'No Onion No Garlic', 
  'Low Spice', 'No Oil', 'Diabetic Friendly', 'Heart Healthy'
];

// Popular customizations in Tamil cuisine
export const popularCustomizations = {
  spiceLevels: ['Mild', 'Medium', 'Spicy', 'Very Spicy', 'Extra Spicy'],
  sweetness: ['No Sugar', 'Less Sweet', 'Medium', 'Extra Sweet'],
  oilContent: ['No Oil', 'Less Oil', 'Medium', 'Extra Oil'],
  saltContent: ['No Salt', 'Less Salt', 'Medium', 'Extra Salt'],
  portion: ['Mini', 'Regular', 'Large', 'Family Pack', 'Jumbo'],
  cooking: ['Light', 'Medium', 'Well Done', 'Extra Crispy'],
  temperature: ['Room Temperature', 'Hot', 'Extra Hot']
};

// Customization options for menu items
export const customizationOptions = {
  cooking: ['Light', 'Medium', 'Well Done', 'Extra Crispy'],
  temperature: ['Room Temperature', 'Hot', 'Extra Hot']
};