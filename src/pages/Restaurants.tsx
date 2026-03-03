import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import RestaurantCard from "@/components/RestaurantCard";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const allRestaurants = [
  // Delhi
  { name: "The Royal Kitchen", cuisine: "North Indian", rating: 4.6, deliveryTime: "30-40 min", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", loyaltyPoints: 15, priceRange: "₹₹", location: "Connaught Place, Delhi", featured: true },
  { name: "Burger Barn", cuisine: "American Fast Food", rating: 4.2, deliveryTime: "20-30 min", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", loyaltyPoints: 10, priceRange: "₹", location: "Saket, Delhi" },
  { name: "Karim's", cuisine: "Mughlai", rating: 4.7, deliveryTime: "35-45 min", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop", loyaltyPoints: 18, priceRange: "₹₹", location: "Jama Masjid, Delhi" },
  { name: "Haldiram's", cuisine: "Street Food & Sweets", rating: 4.3, deliveryTime: "20-30 min", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop", loyaltyPoints: 8, priceRange: "₹", location: "Chandni Chowk, Delhi" },
  // Mumbai
  { name: "Pizza Paradise", cuisine: "Italian", rating: 4.4, deliveryTime: "25-35 min", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", loyaltyPoints: 12, priceRange: "₹₹", location: "Bandra, Mumbai" },
  { name: "Bombay Canteen", cuisine: "Modern Indian", rating: 4.8, deliveryTime: "35-45 min", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", loyaltyPoints: 22, priceRange: "₹₹₹", location: "Lower Parel, Mumbai" },
  { name: "Bademiya", cuisine: "Kebabs & Rolls", rating: 4.5, deliveryTime: "25-35 min", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop", loyaltyPoints: 12, priceRange: "₹", location: "Colaba, Mumbai" },
  // Bangalore
  { name: "Sushi Master", cuisine: "Japanese", rating: 4.8, deliveryTime: "35-45 min", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop", loyaltyPoints: 20, priceRange: "₹₹₹", location: "Indiranagar, Bangalore" },
  { name: "MTR", cuisine: "South Indian", rating: 4.7, deliveryTime: "25-35 min", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop", loyaltyPoints: 14, priceRange: "₹", location: "Lalbagh, Bangalore" },
  { name: "Green Bowl", cuisine: "Healthy & Salads", rating: 4.7, deliveryTime: "25-35 min", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", loyaltyPoints: 18, priceRange: "₹₹", location: "Koramangala, Bangalore" },
  // Jaipur
  { name: "Laxmi Mishthan Bhandar", cuisine: "Rajasthani", rating: 4.6, deliveryTime: "30-40 min", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop", loyaltyPoints: 14, priceRange: "₹", location: "Johari Bazaar, Jaipur" },
  { name: "Dragon Wok", cuisine: "Chinese", rating: 4.5, deliveryTime: "30-40 min", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop", loyaltyPoints: 14, priceRange: "₹₹", location: "MI Road, Jaipur" },
  // Kolkata
  { name: "Peter Cat", cuisine: "Continental & Indian", rating: 4.6, deliveryTime: "35-45 min", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", loyaltyPoints: 16, priceRange: "₹₹", location: "Park Street, Kolkata" },
  { name: "Sweet Tooth Bakery", cuisine: "Desserts & Bakery", rating: 4.9, deliveryTime: "20-30 min", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop", loyaltyPoints: 8, priceRange: "₹", location: "Salt Lake, Kolkata" },
  // Hyderabad
  { name: "Paradise Biryani", cuisine: "Hyderabadi Biryani", rating: 4.8, deliveryTime: "30-40 min", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", loyaltyPoints: 20, priceRange: "₹₹", location: "Secunderabad, Hyderabad" },
  { name: "Taco Bell Express", cuisine: "Mexican", rating: 4.1, deliveryTime: "20-30 min", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", loyaltyPoints: 10, priceRange: "₹", location: "Banjara Hills, Hyderabad" },
];

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");

  const filtered = allRestaurants.filter((r) => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = !locationFilter || r.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display font-bold mb-2">Order Food</h1>
          <p className="text-muted-foreground mb-8">Browse restaurants near you and earn loyalty points on every order</p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location (e.g. Delhi, Mumbai, Jaipur)..."
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants or cuisines..."
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm"
              />
            </div>
          </div>

          {locationFilter && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing restaurants in <span className="text-primary font-medium">"{locationFilter}"</span> — {filtered.length} found
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((r) => (
              <RestaurantCard key={r.name} {...r} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No restaurants found {locationFilter && `in "${locationFilter}"`} {search && `matching "${search}"`}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Restaurants;
