import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { Star, MapPin, Award, Plus, Leaf, Drumstick, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CrowdPredictor from "@/components/CrowdPredictor";

type Resto = {
  id: string; slug: string; name: string; category: string | null;
  pricing_for_2: number | null; locality: string | null; address: string | null;
  dining_rating: number | null; delivery_rating: number | null;
  known_for: string | null; image_url: string | null; premium_only: boolean;
};
type MenuItem = {
  id: string; restaurant_id: string; name: string; description: string | null;
  price: number; category: string | null; is_veg: boolean; image_url: string | null;
};

type DietFilter = "all" | "veg" | "nonveg";

const RestaurantDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { profile } = useAuth();
  const isPremium = !!profile?.is_premium;
  const [restaurant, setRestaurant] = useState<Resto | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [diet, setDiet] = useState<DietFilter>("all");

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data: r } = await supabase.from("restaurants_db").select("*").eq("slug", slug).maybeSingle();
      if (r) {
        setRestaurant(r as any);
        const { data: m } = await supabase.from("menu_items_db").select("*").eq("restaurant_id", (r as any).id).order("category");
        setMenu((m as any) || []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;

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

  if (restaurant.premium_only && !isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-center max-w-md">
          <Crown className="w-12 h-12 text-loyalty mx-auto mb-3" />
          <h1 className="text-3xl font-display font-bold mb-2">{restaurant.name} is Premium</h1>
          <p className="text-muted-foreground mb-6">This restaurant is reserved for Premium members. Upgrade to unlock exclusive top-rated spots.</p>
          <Link to="/loyalty"><Button variant="hero" size="lg"><Crown className="w-4 h-4 mr-1" /> Go Premium</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categories = [...new Set(menu.map((i) => i.category).filter(Boolean))] as string[];
  const filteredMenu = menu.filter((i) => {
    if (activeCategory && i.category !== activeCategory) return false;
    if (diet === "veg" && !i.is_veg) return false;
    if (diet === "nonveg" && i.is_veg) return false;
    return true;
  });

  const basePts = Math.max(5, Math.round((restaurant.pricing_for_2 || 200) / 20));

  const handleAdd = (item: MenuItem) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image_url || "", restaurantName: restaurant.name });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={restaurant.image_url || ""} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 container mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{restaurant.name}</h1>
              {restaurant.premium_only && (
                <span className="inline-flex items-center gap-1 bg-loyalty text-loyalty-foreground text-xs font-semibold px-2 py-1 rounded-full"><Crown className="w-3 h-3" /> Premium</span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">{restaurant.category}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              {restaurant.dining_rating && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-loyalty fill-loyalty" />{Number(restaurant.dining_rating).toFixed(1)} Dining</span>}
              {restaurant.delivery_rating && <span className="flex items-center gap-1"><Star className="w-4 h-4" />{Number(restaurant.delivery_rating).toFixed(1)} Delivery</span>}
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{restaurant.address}</span>
              <span className="flex items-center gap-1 text-loyalty font-medium"><Award className="w-4 h-4" />Earn {basePts} pts{isPremium && " · 2x Premium"}</span>
              <span className="font-medium text-foreground">₹{restaurant.pricing_for_2} for 2</span>
            </div>
            {restaurant.known_for && <p className="text-xs text-muted-foreground mt-2 italic">Known for: {restaurant.known_for}</p>}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <CrowdPredictor restaurantName={restaurant.name} pricingFor2={restaurant.pricing_for_2} seed={restaurant.id} />
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button size="sm" variant={diet === "all" ? "default" : "secondary"} onClick={() => setDiet("all")}>All</Button>
            <Button size="sm" variant={diet === "veg" ? "default" : "secondary"} onClick={() => setDiet("veg")}>
              <span className="w-2.5 h-2.5 rounded-sm bg-success border border-success mr-1.5" /> Veg
            </Button>
            <Button size="sm" variant={diet === "nonveg" ? "default" : "secondary"} onClick={() => setDiet("nonveg")}>
              <span className="w-2.5 h-2.5 rounded-sm bg-destructive border border-destructive mr-1.5" /> Non-Veg
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <Button variant={activeCategory === null ? "default" : "secondary"} size="sm" onClick={() => setActiveCategory(null)}>All Categories</Button>
            {categories.map((cat) => (
              <Button key={cat} variant={activeCategory === cat ? "default" : "secondary"} size="sm" onClick={() => setActiveCategory(cat)}>{cat}</Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMenu.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/20 transition-colors"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={item.image_url || ""} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-2 left-2 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${item.is_veg ? "bg-success/90 text-success-foreground" : "bg-destructive/90 text-destructive-foreground"}`}>
                    {item.is_veg ? <><Leaf className="w-3 h-3" /> Veg</> : <><Drumstick className="w-3 h-3" /> Non-Veg</>}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      {item.category && <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{item.category}</p>}
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
          {filteredMenu.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No items match your filters.</div>
          )}
        </div>
      </div>
      <Footer />
      <ChatBot />
      <CartDrawer />
    </div>
  );
};

export default RestaurantDetail;
