export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  veg: boolean;
}

export interface Restaurant {
  slug: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  loyaltyPoints: number;
  priceRange: string;
  location: string;
  featured?: boolean;
  description: string;
  menu: MenuItem[];
}

export const allRestaurants: Restaurant[] = [
  {
    slug: "the-royal-kitchen", name: "The Royal Kitchen", cuisine: "North Indian", rating: 4.6, deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    loyaltyPoints: 15, priceRange: "₹₹", location: "Connaught Place, Delhi", featured: true,
    description: "Authentic North Indian cuisine with royal Mughlai flavors.",
    menu: [
      { id: "rk1", name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken", price: 350, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop", category: "Main Course", veg: false },
      { id: "rk2", name: "Dal Makhani", description: "Slow-cooked black lentils in buttery gravy", price: 250, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop", category: "Main Course", veg: true },
      { id: "rk3", name: "Paneer Tikka", description: "Chargrilled cottage cheese with spices", price: 280, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop", category: "Starters", veg: true },
      { id: "rk4", name: "Chicken Biryani", description: "Fragrant basmati rice with spiced chicken", price: 320, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop", category: "Main Course", veg: false },
      { id: "rk5", name: "Garlic Naan", description: "Soft bread with garlic and butter", price: 60, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", category: "Breads", veg: true },
      { id: "rk6", name: "Gulab Jamun", description: "Deep-fried milk dumplings in sugar syrup", price: 120, image: "https://images.unsplash.com/photo-1666190050267-4b821d6c6e8b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "burger-barn", name: "Burger Barn", cuisine: "American Fast Food", rating: 4.2, deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    loyaltyPoints: 10, priceRange: "₹", location: "Saket, Delhi",
    description: "Juicy burgers and crispy fries, American-style.",
    menu: [
      { id: "bb1", name: "Classic Smash Burger", description: "Double patty with cheese, lettuce, tomato", price: 220, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop", category: "Burgers", veg: false },
      { id: "bb2", name: "Veggie Burger", description: "Crispy veggie patty with special sauce", price: 180, image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=300&h=200&fit=crop", category: "Burgers", veg: true },
      { id: "bb3", name: "Loaded Fries", description: "Crispy fries with cheese and jalapeños", price: 150, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", category: "Sides", veg: true },
      { id: "bb4", name: "Chicken Wings", description: "Spicy buffalo wings with ranch dip", price: 260, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&h=200&fit=crop", category: "Sides", veg: false },
      { id: "bb5", name: "Chocolate Shake", description: "Thick and creamy chocolate milkshake", price: 140, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop", category: "Drinks", veg: true },
    ],
  },
  {
    slug: "pizza-paradise", name: "Pizza Paradise", cuisine: "Italian", rating: 4.4, deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    loyaltyPoints: 12, priceRange: "₹₹", location: "Bandra, Mumbai",
    description: "Wood-fired pizzas and fresh pastas from Italy.",
    menu: [
      { id: "pp1", name: "Margherita Pizza", description: "Classic tomato, mozzarella, fresh basil", price: 299, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop", category: "Pizzas", veg: true },
      { id: "pp2", name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni and cheese", price: 399, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop", category: "Pizzas", veg: false },
      { id: "pp3", name: "Pasta Alfredo", description: "Creamy white sauce penne pasta", price: 280, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&h=200&fit=crop", category: "Pasta", veg: true },
      { id: "pp4", name: "Garlic Bread", description: "Crispy garlic bread with cheese dip", price: 149, image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300&h=200&fit=crop", category: "Sides", veg: true },
      { id: "pp5", name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 220, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "sushi-master", name: "Sushi Master", cuisine: "Japanese", rating: 4.8, deliveryTime: "35-45 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    loyaltyPoints: 20, priceRange: "₹₹₹", location: "Indiranagar, Bangalore",
    description: "Premium Japanese sushi and ramen experience.",
    menu: [
      { id: "sm1", name: "Salmon Nigiri (4pc)", description: "Fresh salmon over seasoned rice", price: 450, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=200&fit=crop", category: "Sushi", veg: false },
      { id: "sm2", name: "Veg Maki Roll (8pc)", description: "Avocado, cucumber, carrot roll", price: 320, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop", category: "Sushi", veg: true },
      { id: "sm3", name: "Tonkotsu Ramen", description: "Rich pork bone broth with noodles", price: 480, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", category: "Ramen", veg: false },
      { id: "sm4", name: "Edamame", description: "Steamed and salted soybeans", price: 180, image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300&h=200&fit=crop", category: "Sides", veg: true },
      { id: "sm5", name: "Mochi Ice Cream", description: "Japanese rice cake with ice cream", price: 200, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "paradise-biryani", name: "Paradise Biryani", cuisine: "Hyderabadi Biryani", rating: 4.8, deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    loyaltyPoints: 20, priceRange: "₹₹", location: "Secunderabad, Hyderabad",
    description: "Legendary Hyderabadi biryani since 1953.",
    menu: [
      { id: "pb1", name: "Chicken Dum Biryani", description: "Slow-cooked aromatic biryani", price: 340, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop", category: "Biryani", veg: false },
      { id: "pb2", name: "Mutton Biryani", description: "Tender mutton pieces in fragrant rice", price: 420, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b7?w=300&h=200&fit=crop", category: "Biryani", veg: false },
      { id: "pb3", name: "Veg Biryani", description: "Mixed vegetables in spiced basmati", price: 260, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=300&h=200&fit=crop", category: "Biryani", veg: true },
      { id: "pb4", name: "Mirchi Ka Salan", description: "Tangy chili curry, perfect with biryani", price: 160, image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=300&h=200&fit=crop", category: "Sides", veg: true },
      { id: "pb5", name: "Double Ka Meetha", description: "Hyderabadi bread pudding dessert", price: 140, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "bombay-canteen", name: "Bombay Canteen", cuisine: "Modern Indian", rating: 4.8, deliveryTime: "35-45 min",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    loyaltyPoints: 22, priceRange: "₹₹₹", location: "Lower Parel, Mumbai",
    description: "Modern twist on classic Indian dishes.",
    menu: [
      { id: "bc1", name: "Keema Pav Sliders", description: "Spiced minced meat on mini buns", price: 380, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop", category: "Starters", veg: false },
      { id: "bc2", name: "Paneer Bhurji Taco", description: "Indian cottage cheese in crispy taco", price: 320, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop", category: "Starters", veg: true },
      { id: "bc3", name: "Nalli Nihari", description: "Slow-cooked lamb shank curry", price: 520, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=300&h=200&fit=crop", category: "Main Course", veg: false },
      { id: "bc4", name: "Mishti Doi Cheesecake", description: "Bengali sweet yogurt cheesecake", price: 280, image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "mtr", name: "MTR", cuisine: "South Indian", rating: 4.7, deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop",
    loyaltyPoints: 14, priceRange: "₹", location: "Lalbagh, Bangalore",
    description: "Iconic South Indian breakfast and meals since 1924.",
    menu: [
      { id: "mt1", name: "Masala Dosa", description: "Crispy dosa with potato filling", price: 120, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop", category: "Breakfast", veg: true },
      { id: "mt2", name: "Idli Vada Combo", description: "Soft idlis with crispy vada and chutney", price: 100, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop", category: "Breakfast", veg: true },
      { id: "mt3", name: "Rava Kesari Bath", description: "Sweet semolina pudding with cashews", price: 90, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "mt4", name: "Filter Coffee", description: "Traditional South Indian filter coffee", price: 50, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop", category: "Drinks", veg: true },
    ],
  },
  {
    slug: "karims", name: "Karim's", cuisine: "Mughlai", rating: 4.7, deliveryTime: "35-45 min",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop",
    loyaltyPoints: 18, priceRange: "₹₹", location: "Jama Masjid, Delhi",
    description: "Legendary Mughlai food near Jama Masjid since 1913.",
    menu: [
      { id: "km1", name: "Mutton Burra", description: "Charcoal grilled mutton chops", price: 400, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop", category: "Starters", veg: false },
      { id: "km2", name: "Chicken Jahangiri", description: "Royal Mughlai chicken curry", price: 380, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop", category: "Main Course", veg: false },
      { id: "km3", name: "Seekh Kebab", description: "Minced meat kebabs with spices", price: 300, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop", category: "Starters", veg: false },
      { id: "km4", name: "Shahi Tukda", description: "Royal bread pudding with rabri", price: 150, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
];
