// Location-based restaurant data for different cities and areas
// This data will be used based on user's detected location

export const locationBasedRestaurants = {
  // Tamil Nadu - Perudurai and surrounding areas
  'tamil_nadu': {
    'perudurai': [
      {
        _id: 'tn_pr_001',
        name: 'Annapoorna Restaurant',
        cuisine: 'South Indian',
        rating: 4.5,
        etaMins: 25,
        deliveryFee: 30,
        location: {
          address: 'Near Bus Stand, Perudurai, Tamil Nadu 638052',
          coordinates: { lat: 11.2379, lng: 77.5864 },
          area: 'Perudurai Bus Stand'
        },
        specialties: ['Meals', 'Dosa', 'Idli', 'Vada'],
        openHours: '6:00 AM - 10:00 PM',
        phone: '+91 98765 43210',
        isVeg: true,
        type: 'restaurant'
      },
      {
        _id: 'tn_pr_002',
        name: 'Saravana Bhavan',
        cuisine: 'South Indian',
        rating: 4.3,
        etaMins: 20,
        deliveryFee: 25,
        location: {
          address: 'Main Road, Perudurai, Tamil Nadu 638052',
          coordinates: { lat: 11.2385, lng: 77.5870 },
          area: 'Perudurai Main Road'
        },
        specialties: ['Chettinad Meals', 'Biryani', 'Parotta'],
        openHours: '7:00 AM - 11:00 PM',
        phone: '+91 98765 43211',
        isVeg: false,
        type: 'restaurant'
      },
      {
        _id: 'tn_pr_003',
        name: 'Hotel Tamil Nadu',
        cuisine: 'South Indian',
        rating: 4.2,
        etaMins: 30,
        deliveryFee: 35,
        location: {
          address: 'Railway Station Road, Perudurai, Tamil Nadu 638052',
          coordinates: { lat: 11.2390, lng: 77.5880 },
          area: 'Railway Station'
        },
        specialties: ['Chicken Curry', 'Mutton Biryani', 'Fish Fry', 'Meals'],
        openHours: '11:00 AM - 11:00 PM',
        phone: '+91 98765 43212',
        isVeg: false,
        type: 'hotel'
      },
      {
        _id: 'tn_pr_004',
        name: 'Cafe Coffee Day',
        cuisine: 'Cafe',
        rating: 4.0,
        etaMins: 15,
        deliveryFee: 20,
        location: {
          address: 'Market Street, Perudurai, Tamil Nadu 638052',
          coordinates: { lat: 11.2375, lng: 77.5855 },
          area: 'Market Area'
        },
        specialties: ['Coffee', 'Sandwiches', 'Pastries', 'Shakes'],
        openHours: '8:00 AM - 10:00 PM',
        phone: '+91 98765 43213',
        isVeg: true,
        type: 'cafe'
      },
      {
        _id: 'tn_pr_005',
        name: 'Perudurai Biriyani House',
        cuisine: 'North Indian',
        rating: 4.4,
        etaMins: 35,
        deliveryFee: 40,
        location: {
          address: 'College Road, Perudurai, Tamil Nadu 638052',
          coordinates: { lat: 11.2395, lng: 77.5875 },
          area: 'College Area'
        },
        specialties: ['Chicken Biryani', 'Mutton Biryani', 'Kebabs', 'Tandoori'],
        openHours: '12:00 PM - 11:00 PM',
        phone: '+91 98765 43214',
        isVeg: false,
        type: 'restaurant'
      },
      {
        _id: 'tn_pr_006',
        name: 'Green Leaf Cafe',
        cuisine: 'Continental',
        rating: 4.1,
        etaMins: 20,
        deliveryFee: 25,
        location: {
          address: 'Temple Street, Perudurai, Tamil Nadu 638052',
          coordinates: { lat: 11.2370, lng: 77.5860 },
          area: 'Temple Area'
        },
        specialties: ['Pasta', 'Pizza', 'Burgers', 'Fresh Juices'],
        openHours: '9:00 AM - 10:00 PM',
        phone: '+91 98765 43215',
        isVeg: true,
        type: 'cafe'
      },
      {
        _id: 'tn_pr_007',
        name: 'Royal Palace Hotel',
        cuisine: 'Multi-Cuisine',
        rating: 4.6,
        etaMins: 40,
        deliveryFee: 50,
        location: {
          address: 'NH-44, Perudurai, Tamil Nadu 638052',
          coordinates: { lat: 11.2400, lng: 77.5890 },
          area: 'Highway'
        },
        specialties: ['Buffet Meals', 'Chinese', 'Continental', 'Indian'],
        openHours: '6:00 AM - 11:00 PM',
        phone: '+91 98765 43216',
        isVeg: false,
        type: 'hotel'
      }
    ],
    'erode': [
      {
        _id: 'tn_er_001',
        name: 'Hotel Junior Kuppanna',
        cuisine: 'South Indian',
        rating: 4.6,
        etaMins: 35,
        deliveryFee: 45,
        location: {
          address: 'Perundurai Road, Erode, Tamil Nadu 638001',
          coordinates: { lat: 11.3410, lng: 77.7172 },
          area: 'Erode Central'
        },
        specialties: ['Mutton Biryani', 'Chicken Curry', 'Fish Fry'],
        openHours: '11:00 AM - 11:00 PM',
        phone: '+91 98765 43212',
        isVeg: false,
        type: 'hotel'
      },
      {
        _id: 'tn_er_002',
        name: 'Erode Biriyani Palace',
        cuisine: 'North Indian',
        rating: 4.4,
        etaMins: 30,
        deliveryFee: 40,
        location: {
          address: 'Brough Road, Erode, Tamil Nadu 638001',
          coordinates: { lat: 11.3420, lng: 77.7180 },
          area: 'Brough Road'
        },
        specialties: ['Chicken Biryani', 'Mutton Biryani', 'Kebabs'],
        openHours: '12:00 PM - 11:00 PM',
        phone: '+91 98765 43217',
        isVeg: false,
        type: 'restaurant'
      },
      {
        _id: 'tn_er_003',
        name: 'Cafe Mocha Erode',
        cuisine: 'Cafe',
        rating: 4.2,
        etaMins: 20,
        deliveryFee: 30,
        location: {
          address: 'Sathy Road, Erode, Tamil Nadu 638003',
          coordinates: { lat: 11.3400, lng: 77.7160 },
          area: 'Sathy Road'
        },
        specialties: ['Coffee', 'Sandwiches', 'Cakes', 'Smoothies'],
        openHours: '8:00 AM - 10:00 PM',
        phone: '+91 98765 43218',
        isVeg: true,
        type: 'cafe'
      },
      {
        _id: 'tn_er_004',
        name: 'Hotel Selvam',
        cuisine: 'South Indian',
        rating: 4.3,
        etaMins: 25,
        deliveryFee: 35,
        location: {
          address: 'Bus Stand Road, Erode, Tamil Nadu 638001',
          coordinates: { lat: 11.3415, lng: 77.7175 },
          area: 'Bus Stand'
        },
        specialties: ['Meals', 'Dosa', 'Chicken Curry', 'Fish Curry'],
        openHours: '6:00 AM - 10:00 PM',
        phone: '+91 98765 43219',
        isVeg: false,
        type: 'hotel'
      }
    ]
  },

  // Karnataka - Bangalore
  'karnataka': {
    'bangalore': [
      {
        _id: 'ka_bl_001',
        name: 'MTR (Mavalli Tiffin Room)',
        cuisine: 'South Indian',
        rating: 4.7,
        etaMins: 30,
        deliveryFee: 40,
        location: {
          address: 'Lalbagh Road, Bangalore, Karnataka 560027',
          coordinates: { lat: 12.9716, lng: 77.5946 },
          area: 'Lalbagh'
        },
        specialties: ['Masala Dosa', 'Rava Idli', 'Filter Coffee'],
        openHours: '6:30 AM - 11:00 AM, 3:00 PM - 8:30 PM',
        phone: '+91 98765 43213',
        isVeg: true
      },
      {
        _id: 'ka_bl_002',
        name: 'Truffles',
        cuisine: 'Continental',
        rating: 4.4,
        etaMins: 25,
        deliveryFee: 35,
        location: {
          address: 'Koramangala, Bangalore, Karnataka 560034',
          coordinates: { lat: 12.9279, lng: 77.6271 },
          area: 'Koramangala'
        },
        specialties: ['Burgers', 'Pasta', 'Desserts'],
        openHours: '12:00 PM - 12:00 AM',
        phone: '+91 98765 43214',
        isVeg: false
      },
      {
        _id: 'ka_bl_003',
        name: 'Vidyarthi Bhavan',
        cuisine: 'South Indian',
        rating: 4.6,
        etaMins: 20,
        deliveryFee: 30,
        location: {
          address: 'Gandhi Bazaar, Bangalore, Karnataka 560004',
          coordinates: { lat: 12.9298, lng: 77.5848 },
          area: 'Gandhi Bazaar'
        },
        specialties: ['Masala Dosa', 'Coffee', 'Vada'],
        openHours: '6:30 AM - 11:30 AM, 2:30 PM - 7:30 PM',
        phone: '+91 98765 43215',
        isVeg: true
      },
      {
        _id: 'ka_bl_004',
        name: 'Koshy\'s Restaurant',
        cuisine: 'Continental',
        rating: 4.3,
        etaMins: 35,
        deliveryFee: 45,
        location: {
          address: 'St. Marks Road, Bangalore, Karnataka 560001',
          coordinates: { lat: 12.9716, lng: 77.6197 },
          area: 'St. Marks Road'
        },
        specialties: ['English Breakfast', 'Mutton Chops', 'Apple Pie'],
        openHours: '8:00 AM - 11:00 PM',
        phone: '+91 98765 43216',
        isVeg: false
      },
      {
        _id: 'ka_bl_005',
        name: 'Nagarjuna Restaurant',
        cuisine: 'Andhra',
        rating: 4.5,
        etaMins: 28,
        deliveryFee: 40,
        location: {
          address: 'Residency Road, Bangalore, Karnataka 560025',
          coordinates: { lat: 12.9698, lng: 77.6205 },
          area: 'Residency Road'
        },
        specialties: ['Andhra Meals', 'Biryani', 'Gongura Mutton'],
        openHours: '11:00 AM - 11:00 PM',
        phone: '+91 98765 43217',
        isVeg: false,
        type: 'restaurant'
      },
      {
        _id: 'ka_bl_006',
        name: 'The Leela Palace Hotel',
        cuisine: 'Multi-Cuisine',
        rating: 4.8,
        etaMins: 45,
        deliveryFee: 80,
        location: {
          address: 'Airport Road, Bangalore, Karnataka 560008',
          coordinates: { lat: 12.9698, lng: 77.6480 },
          area: 'Airport Road'
        },
        specialties: ['Continental', 'Indian', 'Chinese', 'Desserts'],
        openHours: '6:00 AM - 12:00 AM',
        phone: '+91 98765 43220',
        isVeg: false,
        type: 'hotel'
      },
      {
        _id: 'ka_bl_007',
        name: 'Cafe Coffee Day - Brigade Road',
        cuisine: 'Cafe',
        rating: 4.1,
        etaMins: 20,
        deliveryFee: 25,
        location: {
          address: 'Brigade Road, Bangalore, Karnataka 560001',
          coordinates: { lat: 12.9716, lng: 77.6099 },
          area: 'Brigade Road'
        },
        specialties: ['Coffee', 'Sandwiches', 'Pastries', 'Cold Beverages'],
        openHours: '7:00 AM - 11:00 PM',
        phone: '+91 98765 43221',
        isVeg: true,
        type: 'cafe'
      },
      {
        _id: 'ka_bl_008',
        name: 'Toit Brewpub',
        cuisine: 'Continental',
        rating: 4.5,
        etaMins: 35,
        deliveryFee: 50,
        location: {
          address: 'Indiranagar, Bangalore, Karnataka 560038',
          coordinates: { lat: 12.9719, lng: 77.6412 },
          area: 'Indiranagar'
        },
        specialties: ['Craft Beer', 'Pizza', 'Burgers', 'Continental'],
        openHours: '12:00 PM - 1:00 AM',
        phone: '+91 98765 43222',
        isVeg: false,
        type: 'cafe'
      },
      {
        _id: 'ka_bl_009',
        name: 'Hotel Empire',
        cuisine: 'South Indian',
        rating: 4.3,
        etaMins: 25,
        deliveryFee: 30,
        location: {
          address: 'Church Street, Bangalore, Karnataka 560001',
          coordinates: { lat: 12.9716, lng: 77.6103 },
          area: 'Church Street'
        },
        specialties: ['Dosa', 'Idli', 'Vada', 'South Indian Meals'],
        openHours: '6:00 AM - 10:00 PM',
        phone: '+91 98765 43223',
        isVeg: true,
        type: 'hotel'
      }
    ]
  },

  // Maharashtra - Mumbai
  'maharashtra': {
    'mumbai': [
      {
        _id: 'mh_mb_001',
        name: 'Trishna',
        cuisine: 'Seafood',
        rating: 4.8,
        etaMins: 40,
        deliveryFee: 60,
        location: {
          address: 'Fort, Mumbai, Maharashtra 400001',
          coordinates: { lat: 18.9322, lng: 72.8264 },
          area: 'Fort'
        },
        specialties: ['Koliwada Prawns', 'Fish Curry', 'Crab Masala'],
        openHours: '12:00 PM - 3:00 PM, 7:00 PM - 11:30 PM',
        phone: '+91 98765 43215',
        isVeg: false
      },
      {
        _id: 'mh_mb_002',
        name: 'Shree Thaker Bhojanalay',
        cuisine: 'Gujarati',
        rating: 4.5,
        etaMins: 30,
        deliveryFee: 45,
        location: {
          address: 'Kalbadevi, Mumbai, Maharashtra 400002',
          coordinates: { lat: 18.9467, lng: 72.8342 },
          area: 'Kalbadevi'
        },
        specialties: ['Gujarati Thali', 'Dhokla', 'Khandvi'],
        openHours: '11:00 AM - 3:30 PM, 7:00 PM - 10:30 PM',
        phone: '+91 98765 43216',
        isVeg: true
      },
      {
        _id: 'mh_mb_003',
        name: 'Leopold Cafe',
        cuisine: 'Continental',
        rating: 4.2,
        etaMins: 35,
        deliveryFee: 50,
        location: {
          address: 'Colaba Causeway, Mumbai, Maharashtra 400001',
          coordinates: { lat: 18.9067, lng: 72.8147 },
          area: 'Colaba'
        },
        specialties: ['Fish & Chips', 'Chicken Tikka', 'Beer'],
        openHours: '8:00 AM - 12:00 AM',
        phone: '+91 98765 43218',
        isVeg: false
      },
      {
        _id: 'mh_mb_004',
        name: 'Britannia & Co.',
        cuisine: 'Parsi',
        rating: 4.6,
        etaMins: 25,
        deliveryFee: 40,
        location: {
          address: 'Ballard Estate, Mumbai, Maharashtra 400001',
          coordinates: { lat: 18.9354, lng: 72.8365 },
          area: 'Ballard Estate'
        },
        specialties: ['Berry Pulao', 'Dhansak', 'Caramel Custard'],
        openHours: '11:30 AM - 4:00 PM',
        phone: '+91 98765 43219',
        isVeg: false
      },
      {
        _id: 'mh_mb_005',
        name: 'Cafe Mocha',
        cuisine: 'Continental',
        rating: 4.3,
        etaMins: 30,
        deliveryFee: 45,
        location: {
          address: 'Bandra West, Mumbai, Maharashtra 400050',
          coordinates: { lat: 19.0596, lng: 72.8295 },
          area: 'Bandra'
        },
        specialties: ['Pasta', 'Pizza', 'Coffee', 'Desserts'],
        openHours: '9:00 AM - 1:00 AM',
        phone: '+91 98765 43220',
        isVeg: false
      }
    ],
    'pune': [
      {
        _id: 'mh_pn_001',
        name: 'Vaishali Restaurant',
        cuisine: 'South Indian',
        rating: 4.4,
        etaMins: 25,
        deliveryFee: 35,
        location: {
          address: 'FC Road, Pune, Maharashtra 411004',
          coordinates: { lat: 18.5196, lng: 73.8553 },
          area: 'FC Road'
        },
        specialties: ['Dosa', 'Uttapam', 'Filter Coffee'],
        openHours: '7:00 AM - 11:00 PM',
        phone: '+91 98765 43221',
        isVeg: true
      }
    ]
  },

  // Delhi
  'delhi': {
    'new_delhi': [
      {
        _id: 'dl_nd_001',
        name: 'Karim\'s',
        cuisine: 'Mughlai',
        rating: 4.6,
        etaMins: 35,
        deliveryFee: 50,
        location: {
          address: 'Jama Masjid, New Delhi, Delhi 110006',
          coordinates: { lat: 28.6507, lng: 77.2334 },
          area: 'Old Delhi'
        },
        specialties: ['Mutton Korma', 'Chicken Jahangiri', 'Seekh Kebab'],
        openHours: '11:00 AM - 12:00 AM',
        phone: '+91 98765 43217',
        isVeg: false
      },
      {
        _id: 'dl_nd_002',
        name: 'Paranthe Wali Gali',
        cuisine: 'North Indian',
        rating: 4.3,
        etaMins: 25,
        deliveryFee: 40,
        location: {
          address: 'Chandni Chowk, New Delhi, Delhi 110006',
          coordinates: { lat: 28.6562, lng: 77.2410 },
          area: 'Chandni Chowk'
        },
        specialties: ['Aloo Paratha', 'Paneer Paratha', 'Lassi'],
        openHours: '9:00 AM - 10:00 PM',
        phone: '+91 98765 43218',
        isVeg: true
      },
      {
        _id: 'dl_nd_003',
        name: 'Indian Accent',
        cuisine: 'Modern Indian',
        rating: 4.8,
        etaMins: 45,
        deliveryFee: 80,
        location: {
          address: 'The Manor Hotel, New Delhi, Delhi 110003',
          coordinates: { lat: 28.6139, lng: 77.2090 },
          area: 'Friends Colony'
        },
        specialties: ['Duck Khurchan', 'Pork Ribs', 'Mishti Doi Cannelloni'],
        openHours: '12:30 PM - 2:45 PM, 7:00 PM - 11:45 PM',
        phone: '+91 98765 43222',
        isVeg: false
      },
      {
        _id: 'dl_nd_004',
        name: 'Bukhara',
        cuisine: 'North Indian',
        rating: 4.7,
        etaMins: 40,
        deliveryFee: 70,
        location: {
          address: 'ITC Maurya, New Delhi, Delhi 110021',
          coordinates: { lat: 28.5706, lng: 77.1507 },
          area: 'Chanakyapuri'
        },
        specialties: ['Dal Bukhara', 'Tandoori Chicken', 'Naan'],
        openHours: '12:30 PM - 2:45 PM, 7:00 PM - 11:45 PM',
        phone: '+91 98765 43223',
        isVeg: false
      }
    ]
  },

  // West Bengal - Kolkata
  'west_bengal': {
    'kolkata': [
      {
        _id: 'wb_kl_001',
        name: 'Peter Cat',
        cuisine: 'Continental',
        rating: 4.5,
        etaMins: 30,
        deliveryFee: 45,
        location: {
          address: 'Park Street, Kolkata, West Bengal 700016',
          coordinates: { lat: 22.5448, lng: 88.3426 },
          area: 'Park Street'
        },
        specialties: ['Chelo Kebab', 'Fish & Chips', 'Prawn Cocktail'],
        openHours: '12:00 PM - 11:30 PM',
        phone: '+91 98765 43224',
        isVeg: false
      },
      {
        _id: 'wb_kl_002',
        name: 'Flurys',
        cuisine: 'Continental',
        rating: 4.4,
        etaMins: 25,
        deliveryFee: 40,
        location: {
          address: 'Park Street, Kolkata, West Bengal 700016',
          coordinates: { lat: 22.5448, lng: 88.3426 },
          area: 'Park Street'
        },
        specialties: ['Pastries', 'English Breakfast', 'Rum Balls'],
        openHours: '7:30 AM - 10:00 PM',
        phone: '+91 98765 43225',
        isVeg: false
      }
    ]
  },

  // Rajasthan - Jaipur
  'rajasthan': {
    'jaipur': [
      {
        _id: 'rj_jp_001',
        name: 'Laxmi Mishthan Bhandar',
        cuisine: 'Rajasthani',
        rating: 4.6,
        etaMins: 20,
        deliveryFee: 30,
        location: {
          address: 'Johari Bazaar, Jaipur, Rajasthan 302003',
          coordinates: { lat: 26.9124, lng: 75.7873 },
          area: 'Johari Bazaar'
        },
        specialties: ['Dal Baati Churma', 'Ghewar', 'Pyaaz Kachori'],
        openHours: '8:00 AM - 11:00 PM',
        phone: '+91 98765 43226',
        isVeg: true
      }
    ]
  }
};

// Function to get restaurants based on user location
export const getRestaurantsByLocation = (userLat, userLng) => {
  // Simple location detection based on coordinates
  // In a real app, you'd use a proper geocoding service

  // Tamil Nadu region
  if (userLat >= 8.0 && userLat <= 13.5 && userLng >= 76.0 && userLng <= 80.5) {
    if (userLat >= 11.0 && userLat <= 11.5 && userLng >= 77.0 && userLng <= 78.0) {
      return [...locationBasedRestaurants.tamil_nadu.perudurai, ...locationBasedRestaurants.tamil_nadu.erode];
    }
    return locationBasedRestaurants.tamil_nadu.perudurai;
  }

  // Karnataka region (Bangalore)
  if (userLat >= 12.5 && userLat <= 13.5 && userLng >= 77.0 && userLng <= 78.0) {
    return locationBasedRestaurants.karnataka.bangalore;
  }

  // Maharashtra region
  if (userLat >= 18.0 && userLat <= 20.0 && userLng >= 72.0 && userLng <= 75.0) {
    // Mumbai area
    if (userLat >= 18.5 && userLat <= 19.5 && userLng >= 72.5 && userLng <= 73.5) {
      return locationBasedRestaurants.maharashtra.mumbai;
    }
    // Pune area
    if (userLat >= 18.0 && userLat <= 19.0 && userLng >= 73.5 && userLng <= 74.5) {
      return [...locationBasedRestaurants.maharashtra.mumbai, ...locationBasedRestaurants.maharashtra.pune];
    }
    return locationBasedRestaurants.maharashtra.mumbai;
  }

  // Delhi region
  if (userLat >= 28.0 && userLat <= 29.0 && userLng >= 76.5 && userLng <= 77.5) {
    return locationBasedRestaurants.delhi.new_delhi;
  }

  // West Bengal region (Kolkata)
  if (userLat >= 22.0 && userLat <= 23.0 && userLng >= 88.0 && userLng <= 89.0) {
    return locationBasedRestaurants.west_bengal.kolkata;
  }

  // Rajasthan region (Jaipur)
  if (userLat >= 26.5 && userLat <= 27.5 && userLng >= 75.5 && userLng <= 76.5) {
    return locationBasedRestaurants.rajasthan.jaipur;
  }

  // Default to Perudurai restaurants if location not recognized
  return locationBasedRestaurants.tamil_nadu.perudurai;
};

// Function to detect city name from coordinates
export const getCityFromCoordinates = (userLat, userLng) => {
  if (userLat >= 8.0 && userLat <= 13.5 && userLng >= 76.0 && userLng <= 80.5) {
    if (userLat >= 11.0 && userLat <= 11.5 && userLng >= 77.0 && userLng <= 78.0) {
      return 'Perudurai & Erode';
    }
    return 'Perudurai';
  }

  if (userLat >= 12.5 && userLat <= 13.5 && userLng >= 77.0 && userLng <= 78.0) {
    return 'Bangalore';
  }

  if (userLat >= 18.0 && userLat <= 20.0 && userLng >= 72.0 && userLng <= 75.0) {
    if (userLat >= 18.5 && userLat <= 19.5 && userLng >= 72.5 && userLng <= 73.5) {
      return 'Mumbai';
    }
    if (userLat >= 18.0 && userLat <= 19.0 && userLng >= 73.5 && userLng <= 74.5) {
      return 'Pune & Mumbai';
    }
    return 'Mumbai';
  }

  if (userLat >= 28.0 && userLat <= 29.0 && userLng >= 76.5 && userLng <= 77.5) {
    return 'New Delhi';
  }

  if (userLat >= 22.0 && userLat <= 23.0 && userLng >= 88.0 && userLng <= 89.0) {
    return 'Kolkata';
  }

  if (userLat >= 26.5 && userLat <= 27.5 && userLng >= 75.5 && userLng <= 76.5) {
    return 'Jaipur';
  }

  return 'Your Area';
};
