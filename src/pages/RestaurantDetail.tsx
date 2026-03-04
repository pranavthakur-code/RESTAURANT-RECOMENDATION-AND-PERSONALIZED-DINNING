import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import { allRestaurants } from "@/data/restaurants";
import { useCart } from "@/contexts/CartContext";
import { Star, Clock, MapPin, Award, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const RestaurantDetail = () => {
  const { slug } = useParams();
  const restaurant = allRestaurants.find((r) => r.slug === slug);
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-2">Restaurant not found</h1>
          <Link to="/restaurants" className="text-primary hover:underline">Browse all restaurants</Link>
        </div>
      </div>
    );
  }

  const categories = [...new Set(restaurant.menu.map((i) => i.category))];
  const filteredMenu = activeCategory ? restaurant.menu.filter((i) => i.category === activeCategory) : restaurant.menu;

  const handleAdd = (item: typeof restaurant.menu[0]) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, restaurantName: restaurant.name });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 container mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{restaurant.name}</h1>
            <p className="text-muted-foreground mt-1">{restaurant.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-loyalty fill-loyalty" />{restaurant.rating}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{restaurant.deliveryTime}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{restaurant.location}</span>
              <span className="flex items-center gap-1 text-loyalty font-medium"><Award className="w-4 h-4" />Earn {restaurant.loyaltyPoints} pts per order</span>
              <span className="font-medium text-foreground">{restaurant.priceRange}</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="container mx-auto px-4 py-8">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <Button variant={activeCategory === null ? "default" : "secondary"} size="sm" onClick={() => setActiveCategory(null)}>All</Button>
            {categories.map((cat) => (
              <Button key={cat} variant={activeCategory === cat ? "default" : "secondary"} size="sm" onClick={() => setActiveCategory(cat)}>{cat}</Button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMenu.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/20 transition-colors"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {item.veg && (
                    <div className="absolute top-2 left-2 bg-success/90 backdrop-blur-sm text-success-foreground px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> Veg
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-primary font-bold whitespace-nowrap">₹{item.price}</span>
                  </div>
                  <Button size="sm" className="mt-auto w-full" onClick={() => handleAdd(item)}>
                    <Plus className="w-4 h-4" /> Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ChatBot />
      <CartDrawer />
    </div>
  );
};

export default RestaurantDetail;
