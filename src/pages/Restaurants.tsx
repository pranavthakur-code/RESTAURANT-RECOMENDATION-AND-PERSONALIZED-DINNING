import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import RestaurantCard from "@/components/RestaurantCard";
import { allRestaurants } from "@/data/restaurants";
import { Search, MapPin, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const userCity = profile?.location || "";
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || userCity);

  const filtered = allRestaurants.filter((r) => {
    const s = search.toLowerCase();
    const matchesSearch = !search || r.name.toLowerCase().includes(s) || r.cuisine.toLowerCase().includes(s) || r.menu.some((m) => m.name.toLowerCase().includes(s) || m.category.toLowerCase().includes(s));
    const matchesLocation = !locationFilter || r.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  // Sort: nearby (matching city) first, then by rating
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aLocal = userCity && a.location.toLowerCase().includes(userCity.toLowerCase()) ? 1 : 0;
      const bLocal = userCity && b.location.toLowerCase().includes(userCity.toLowerCase()) ? 1 : 0;
      if (bLocal !== aLocal) return bLocal - aLocal;
      return b.rating - a.rating;
    });
  }, [filtered, userCity]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display font-bold mb-2">Order Food</h1>
          <p className="text-muted-foreground mb-8">
            {userCity ? `Showing popular restaurants near ${userCity}` : "Browse restaurants near you and earn loyalty points on every order"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <input type="text" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} placeholder="Filter by location (e.g. Delhi, Mumbai, Jaipur)..." className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search restaurants or cuisines..." className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm" />
            </div>
          </div>

          {locationFilter && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing restaurants in <span className="text-primary font-medium">"{locationFilter}"</span> — {filtered.length} found
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sorted.map((r) => (
              <RestaurantCard key={r.slug} slug={r.slug} name={r.name} cuisine={r.cuisine} rating={r.rating} deliveryTime={r.deliveryTime} image={r.image} loyaltyPoints={r.loyaltyPoints} priceRange={r.priceRange} location={r.location} featured={r.featured} />
            ))}
          </div>
          {sorted.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No restaurants found {locationFilter && `in "${locationFilter}"`} {search && `matching "${search}"`}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ChatBot />
      <CartDrawer />
    </div>
  );
};

export default Restaurants;
