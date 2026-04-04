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
  {
    slug: "wok-on-fire", name: "Wok on Fire", cuisine: "Chinese", rating: 4.3, deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop",
    loyaltyPoints: 12, priceRange: "₹₹", location: "Park Street, Kolkata", featured: true,
    description: "Sizzling Indo-Chinese and authentic Cantonese dishes.",
    menu: [
      { id: "wf1", name: "Hakka Noodles", description: "Stir-fried noodles with veggies and soy", price: 200, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", category: "Chinese", veg: true },
      { id: "wf2", name: "Chicken Manchurian", description: "Crispy chicken in tangy Manchurian sauce", price: 280, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=200&fit=crop", category: "Chinese", veg: false },
      { id: "wf3", name: "Veg Fried Rice", description: "Wok-tossed rice with mixed vegetables", price: 180, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop", category: "Chinese", veg: true },
      { id: "wf4", name: "Chilli Paneer", description: "Spicy paneer tossed with peppers", price: 250, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop", category: "Chinese", veg: true },
      { id: "wf5", name: "Spring Rolls", description: "Crispy rolls stuffed with veggies", price: 160, image: "https://images.unsplash.com/photo-1606525437033-430f4f14a765?w=300&h=200&fit=crop", category: "Starters", veg: true },
      { id: "wf6", name: "Honey Chilli Potato", description: "Crispy potatoes in honey chilli glaze", price: 190, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", category: "Starters", veg: true },
    ],
  },
  {
    slug: "dragon-wok", name: "Dragon Wok", cuisine: "Chinese", rating: 4.1, deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    loyaltyPoints: 10, priceRange: "₹", location: "Chandni Chowk, Delhi",
    description: "Street-style Chinese food with bold flavors.",
    menu: [
      { id: "dw1", name: "Schezwan Noodles", description: "Spicy Schezwan-style stir-fried noodles", price: 160, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", category: "Chinese", veg: true },
      { id: "dw2", name: "Dragon Chicken", description: "Crispy chicken in fiery dragon sauce", price: 260, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=200&fit=crop", category: "Chinese", veg: false },
      { id: "dw3", name: "Momos (8pc)", description: "Steamed dumplings with spicy chutney", price: 120, image: "https://images.unsplash.com/photo-1606525437033-430f4f14a765?w=300&h=200&fit=crop", category: "Starters", veg: true },
      { id: "dw4", name: "Manchow Soup", description: "Thick spicy soup with crispy noodles", price: 140, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop", category: "Soups", veg: true },
    ],
  },
  {
    slug: "sugar-rush", name: "Sugar Rush", cuisine: "Desserts & Bakery", rating: 4.5, deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
    loyaltyPoints: 8, priceRange: "₹₹", location: "Jubilee Hills, Hyderabad",
    description: "Handcrafted desserts, cakes, and pastries.",
    menu: [
      { id: "sr1", name: "Belgian Chocolate Cake", description: "Rich dark chocolate layered cake", price: 350, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "sr2", name: "Red Velvet Cupcake", description: "Cream cheese frosted cupcake", price: 150, image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "sr3", name: "Mango Cheesecake", description: "Creamy cheesecake with mango puree", price: 280, image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "sr4", name: "Brownie Sundae", description: "Warm brownie with vanilla ice cream", price: 220, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "sr5", name: "Croissant", description: "Buttery flaky French pastry", price: 120, image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=200&fit=crop", category: "Bakery", veg: true },
    ],
  },
  {
    slug: "sweet-tooth", name: "Sweet Tooth", cuisine: "Desserts & Ice Cream", rating: 4.4, deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    loyaltyPoints: 8, priceRange: "₹", location: "MI Road, Jaipur",
    description: "Traditional Indian sweets and modern desserts.",
    menu: [
      { id: "st1", name: "Rabri Falooda", description: "Chilled falooda with rich rabri", price: 160, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "st2", name: "Kesar Kulfi", description: "Traditional saffron-flavored frozen dessert", price: 100, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "st3", name: "Rasgulla (4pc)", description: "Soft spongy cottage cheese balls in syrup", price: 120, image: "https://images.unsplash.com/photo-1666190050267-4b821d6c6e8b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
      { id: "st4", name: "Ghewar", description: "Rajasthani disc-shaped sweet cake", price: 200, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "green-bowl", name: "Green Bowl", cuisine: "Healthy & Salads", rating: 4.3, deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    loyaltyPoints: 10, priceRange: "₹₹", location: "Koramangala, Bangalore",
    description: "Fresh salads, smoothie bowls, and clean eating.",
    menu: [
      { id: "gb1", name: "Greek Salad Bowl", description: "Feta, olives, cucumber, cherry tomatoes", price: 280, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop", category: "Healthy", veg: true },
      { id: "gb2", name: "Grilled Chicken Salad", description: "Mixed greens with herb-grilled chicken", price: 350, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop", category: "Healthy", veg: false },
      { id: "gb3", name: "Acai Smoothie Bowl", description: "Acai blend topped with granola & berries", price: 320, image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=200&fit=crop", category: "Healthy", veg: true },
      { id: "gb4", name: "Quinoa Power Bowl", description: "Quinoa with roasted veggies and hummus", price: 300, image: "https://images.unsplash.com/photo-1543339308-d595c4f9bc52?w=300&h=200&fit=crop", category: "Healthy", veg: true },
      { id: "gb5", name: "Green Detox Juice", description: "Spinach, apple, ginger, lemon juice", price: 180, image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=300&h=200&fit=crop", category: "Drinks", veg: true },
    ],
  },
  {
    slug: "brew-haven", name: "Brew Haven", cuisine: "Coffee & Café", rating: 4.6, deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    loyaltyPoints: 8, priceRange: "₹₹", location: "Hauz Khas, Delhi", featured: true,
    description: "Specialty coffees, artisan teas, and light bites.",
    menu: [
      { id: "bh1", name: "Cappuccino", description: "Espresso with steamed milk foam", price: 180, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop", category: "Coffee", veg: true },
      { id: "bh2", name: "Cold Brew", description: "Smooth slow-steeped cold coffee", price: 220, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop", category: "Coffee", veg: true },
      { id: "bh3", name: "Matcha Latte", description: "Japanese green tea with oat milk", price: 250, image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&h=200&fit=crop", category: "Coffee", veg: true },
      { id: "bh4", name: "Avocado Toast", description: "Sourdough with smashed avocado & eggs", price: 280, image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop", category: "Snacks", veg: true },
      { id: "bh5", name: "Blueberry Muffin", description: "Freshly baked muffin with blueberries", price: 140, image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=200&fit=crop", category: "Bakery", veg: true },
    ],
  },
  {
    slug: "chai-stop", name: "Chai Stop", cuisine: "Coffee & Snacks", rating: 4.2, deliveryTime: "10-20 min",
    image: "https://images.unsplash.com/photo-1561336526-2914f13db765?w=400&h=300&fit=crop",
    loyaltyPoints: 6, priceRange: "₹", location: "Colaba, Mumbai",
    description: "Cutting chai, bun maska, and Mumbai street snacks.",
    menu: [
      { id: "cs1", name: "Cutting Chai", description: "Half-glass strong Mumbai chai", price: 30, image: "https://images.unsplash.com/photo-1561336526-2914f13db765?w=300&h=200&fit=crop", category: "Coffee", veg: true },
      { id: "cs2", name: "Bun Maska", description: "Soft bun with butter — Irani café classic", price: 50, image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=200&fit=crop", category: "Snacks", veg: true },
      { id: "cs3", name: "Vada Pav", description: "Spicy potato fritter in a bun", price: 40, image: "https://images.unsplash.com/photo-1606525437033-430f4f14a765?w=300&h=200&fit=crop", category: "Snacks", veg: true },
      { id: "cs4", name: "Cold Coffee", description: "Creamy chilled coffee with ice cream", price: 120, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop", category: "Coffee", veg: true },
    ],
  },
  {
    slug: "sakura-sushi", name: "Sakura Sushi", cuisine: "Japanese Sushi", rating: 4.5, deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    loyaltyPoints: 16, priceRange: "₹₹₹", location: "Banjara Hills, Hyderabad",
    description: "Authentic Japanese sushi bar and izakaya.",
    menu: [
      { id: "ss1", name: "California Roll (6pc)", description: "Crab, avocado, cucumber inside-out roll", price: 380, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop", category: "Sushi", veg: false },
      { id: "ss2", name: "Tempura Udon", description: "Thick noodles in dashi with crispy tempura", price: 420, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", category: "Ramen", veg: false },
      { id: "ss3", name: "Vegetable Tempura", description: "Crispy battered seasonal vegetables", price: 280, image: "https://images.unsplash.com/photo-1606525437033-430f4f14a765?w=300&h=200&fit=crop", category: "Starters", veg: true },
      { id: "ss4", name: "Matcha Tiramisu", description: "Japanese-Italian fusion dessert", price: 260, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "jaipur-rasoi", name: "Jaipur Rasoi", cuisine: "Rajasthani", rating: 4.5, deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    loyaltyPoints: 14, priceRange: "₹₹", location: "C Scheme, Jaipur", featured: true,
    description: "Authentic Rajasthani thali and royal cuisine.",
    menu: [
      { id: "jr1", name: "Dal Baati Churma", description: "Classic Rajasthani wheat balls with lentils", price: 280, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop", category: "Main Course", veg: true },
      { id: "jr2", name: "Laal Maas", description: "Fiery red mutton curry", price: 420, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=300&h=200&fit=crop", category: "Main Course", veg: false },
      { id: "jr3", name: "Ker Sangri", description: "Desert beans and berries stir-fry", price: 200, image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=300&h=200&fit=crop", category: "Starters", veg: true },
      { id: "jr4", name: "Pyaaz Kachori", description: "Crispy onion-stuffed pastry", price: 80, image: "https://images.unsplash.com/photo-1606525437033-430f4f14a765?w=300&h=200&fit=crop", category: "Starters", veg: true },
      { id: "jr5", name: "Mawa Kachori", description: "Sweet pastry filled with dried fruits", price: 100, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
  {
    slug: "kolkata-rolls", name: "Kolkata Rolls", cuisine: "Street Food", rating: 4.3, deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    loyaltyPoints: 8, priceRange: "₹", location: "New Market, Kolkata",
    description: "Famous Kolkata-style kathi rolls and street bites.",
    menu: [
      { id: "kr1", name: "Chicken Kathi Roll", description: "Spiced chicken wrapped in paratha", price: 130, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop", category: "Rolls", veg: false },
      { id: "kr2", name: "Egg Roll", description: "Egg paratha roll with onions and chutney", price: 80, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop", category: "Rolls", veg: false },
      { id: "kr3", name: "Paneer Roll", description: "Spiced paneer tikka in a flaky wrap", price: 110, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop", category: "Rolls", veg: true },
      { id: "kr4", name: "Mishti Doi", description: "Sweet fermented yogurt — Bengali classic", price: 60, image: "https://images.unsplash.com/photo-1666190050267-4b821d6c6e8b?w=300&h=200&fit=crop", category: "Desserts", veg: true },
    ],
  },
];
