import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import { Search, MapPin, Star, Award, Leaf, Drumstick, Navigation, Crown, Clock } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Resto = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  pricing_for_2: number | null;
  locality: string | null;
  address: string | null;
  dining_rating: number | null;
  delivery_rating: number | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  premium_only: boolean;
};

type DietFilter = "all" | "veg" | "nonveg";

const NONVEG_KEYS = ["chicken", "mutton", "fish", "seafood", "non-veg", "non veg", "bbq", "barbecue", "kebab", "meat", "lamb", "prawn"];
const VEG_KEYS = ["pure veg", "vegetarian", "jain", "bakery", "desserts only"];

function classifyResto(category: string | null): { hasVeg: boolean; hasNonVeg: boolean; pureVeg: boolean } {
  const c = (category || "").toLowerCase();
  const pureVeg = VEG_KEYS.some((k) => c.includes(k));
  if (pureVeg) return { hasVeg: true, hasNonVeg: false, pureVeg: true };
  const hasNonVeg = NONVEG_KEYS.some((k) => c.includes(k)) || /mughlai|north indian|chinese|continental|biryani|parsi|asian/.test(c);
  return { hasVeg: true, hasNonVeg, pureVeg: false };
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const h = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const isPremium = !!profile?.is_premium;
  const userCity = profile?.location || "";
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [diet, setDiet] = useState<DietFilter>("all");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [restos, setRestos] = useState<Resto[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("restaurants_db").select("*").order("dining_rating", { ascending: false }).limit(200);
      setRestos((data as any) || []);
      setLoading(false);
    })();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setUserLoc({ lat: 28.6139, lng: 77.209 }) // fallback: Delhi center
    );
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return restos.filter((r) => {
      const matchSearch = !s || r.name.toLowerCase().includes(s) || (r.category || "").toLowerCase().includes(s);
      const matchLoc = !locationFilter || (r.locality || "").toLowerCase().includes(locationFilter.toLowerCase());
      const cls = classifyResto(r.category);
      const matchDiet = diet === "all" || (diet === "veg" ? cls.pureVeg : cls.hasNonVeg);
      const matchPremium = !premiumOnly || r.premium_only;
      return matchSearch && matchLoc && matchDiet && matchPremium;
    });
  }, [restos, search, locationFilter, diet, premiumOnly]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (userLoc && a.latitude && b.latitude) {
        const da = haversineKm(userLoc, { lat: a.latitude!, lng: a.longitude! });
        const db = haversineKm(userLoc, { lat: b.latitude!, lng: b.longitude! });
        return da - db;
      }
      return (b.dining_rating || 0) - (a.dining_rating || 0);
    });
  }, [filtered, userLoc]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display font-bold mb-2">Order Food</h1>
          <p className="text-muted-foreground mb-6">
            {userLoc ? "Sorted by distance from you" : userCity ? `Top-rated picks near ${userCity}` : "Discover top-rated restaurants across Delhi NCR"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <input type="text" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} placeholder="Filter by locality (Khan Market, Cyber Hub...)" className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search restaurants or cuisines..." className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Button size="sm" variant={diet === "all" ? "default" : "secondary"} onClick={() => setDiet("all")}>All</Button>
            <Button size="sm" variant={diet === "veg" ? "default" : "secondary"} onClick={() => setDiet("veg")} className={diet === "veg" ? "" : ""}>
              <span className="w-2.5 h-2.5 rounded-sm bg-success border border-success mr-1.5 inline-block" /> Pure Veg
            </Button>
            <Button size="sm" variant={diet === "nonveg" ? "default" : "secondary"} onClick={() => setDiet("nonveg")}>
              <span className="w-2.5 h-2.5 rounded-sm bg-destructive border border-destructive mr-1.5 inline-block" /> Non-Veg
            </Button>
            <Button size="sm" variant={premiumOnly ? "default" : "secondary"} onClick={() => setPremiumOnly((v) => !v)}>
              <Crown className="w-3.5 h-3.5 mr-1" /> Premium {isPremium ? "" : "(Members)"}
            </Button>
            <Button size="sm" variant="outline" onClick={requestLocation}>
              <Navigation className="w-3.5 h-3.5 mr-1" /> {userLoc ? "Using your location" : "Use my location"}
            </Button>
            <span className="text-sm text-muted-foreground ml-auto">{sorted.length} restaurants</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading restaurants…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sorted.map((r, i) => {
                const cls = classifyResto(r.category);
                const dist = userLoc && r.latitude ? haversineKm(userLoc, { lat: r.latitude, lng: r.longitude! }) : null;
                const locked = r.premium_only && !isPremium;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}>
                    <Link to={locked ? "/loyalty" : `/restaurant/${r.slug}`}>
                      <div className={`group rounded-2xl overflow-hidden bg-card border transition-all hover:-translate-y-1 ${r.premium_only ? "border-loyalty/40" : "border-border hover:border-primary/30"}`}>
                        <div className="relative h-44 overflow-hidden">
                          <img src={r.image_url || ""} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {r.dining_rating != null && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                              <Star className="w-3.5 h-3.5 text-loyalty fill-loyalty" />
                              {Number(r.dining_rating).toFixed(1)}
                            </div>
                          )}
                          {r.premium_only && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 bg-loyalty text-loyalty-foreground px-2 py-1 rounded-full text-xs font-semibold">
                              <Crown className="w-3 h-3" /> Premium
                            </div>
                          )}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                            {cls.pureVeg ? (
                              <><Leaf className="w-3 h-3 text-success" /> Pure Veg</>
                            ) : (
                              <><Drumstick className="w-3 h-3 text-destructive" /> Veg & Non-Veg</>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display font-semibold text-foreground line-clamp-1">{r.name}</h3>
                            {r.pricing_for_2 != null && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">₹{r.pricing_for_2} for 2</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.category}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.locality}</span>
                            {dist != null && <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {dist.toFixed(1)} km</span>}
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-xs text-loyalty font-medium">
                            <Award className="w-3 h-3" /> Earn {Math.max(5, Math.round((r.pricing_for_2 || 200) / 20))} pts{isPremium && " · 2x Premium"}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
          {!loading && sorted.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No restaurants match your filters.</div>
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
