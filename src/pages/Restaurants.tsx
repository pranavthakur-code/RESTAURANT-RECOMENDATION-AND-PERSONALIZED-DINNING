import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import RestaurantCard from "@/components/RestaurantCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const allRestaurants = [
  { name: "The Royal Kitchen", cuisine: "North Indian", rating: 4.6, deliveryTime: "30-40 min", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", loyaltyPoints: 15, priceRange: "₹₹", featured: true },
  { name: "Pizza Paradise", cuisine: "Italian", rating: 4.4, deliveryTime: "25-35 min", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", loyaltyPoints: 12, priceRange: "₹₹" },
  { name: "Sushi Master", cuisine: "Japanese", rating: 4.8, deliveryTime: "35-45 min", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop", loyaltyPoints: 20, priceRange: "₹₹₹" },
  { name: "Burger Barn", cuisine: "American Fast Food", rating: 4.2, deliveryTime: "20-30 min", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", loyaltyPoints: 10, priceRange: "₹" },
  { name: "Dragon Wok", cuisine: "Chinese", rating: 4.5, deliveryTime: "30-40 min", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop", loyaltyPoints: 14, priceRange: "₹₹" },
  { name: "Taco Bell Express", cuisine: "Mexican", rating: 4.1, deliveryTime: "20-30 min", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", loyaltyPoints: 10, priceRange: "₹" },
  { name: "Green Bowl", cuisine: "Healthy & Salads", rating: 4.7, deliveryTime: "25-35 min", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", loyaltyPoints: 18, priceRange: "₹₹" },
  { name: "Sweet Tooth Bakery", cuisine: "Desserts & Bakery", rating: 4.9, deliveryTime: "20-30 min", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop", loyaltyPoints: 8, priceRange: "₹" },
];

const Restaurants = () => {
  const [search, setSearch] = useState("");
  const filtered = allRestaurants.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display font-bold mb-2">Order Food</h1>
          <p className="text-muted-foreground mb-8">Browse restaurants near you and earn loyalty points on every order</p>

          <div className="flex gap-3 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants or cuisines..."
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((r) => (
              <RestaurantCard key={r.name} {...r} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No restaurants found matching "{search}"</div>
          )}
        </div>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Restaurants;
