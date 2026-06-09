import { useEffect, useState } from "react";
import { MapPin, Navigation, Loader2, Bike, Clock, Pencil, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Branch = {
  id: string;
  slug: string;
  name: string;
  locality: string | null;
  category: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number;
  etaMin: number;
  deliverable: boolean;
};

interface Props {
  onLocationChange?: (loc: { lat: number; lng: number; address: string }) => void;
  compact?: boolean;
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

const STORAGE_KEY = "dineout_user_location";

const LocationBar = ({ onLocationChange, compact }: Props) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const p = JSON.parse(raw);
        setCoords({ lat: p.lat, lng: p.lng });
        setAddress(p.address || "");
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!coords) return;
    (async () => {
      const { data } = await supabase
        .from("restaurants_db")
        .select("id,slug,name,locality,category,image_url,latitude,longitude")
        .not("latitude", "is", null)
        .limit(200);
      const list: Branch[] = ((data as any[]) || [])
        .map((r) => {
          const distanceKm = haversineKm(coords, { lat: r.latitude, lng: r.longitude });
          const etaMin = Math.round(15 + distanceKm * 4);
          return { ...r, distanceKm, etaMin, deliverable: distanceKm <= 8 };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 6);
      setBranches(list);
    })();
  }, [coords]);

  const persist = (lat: number, lng: number, addr: string) => {
    setCoords({ lat, lng });
    setAddress(addr);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng, address: addr }));
    onLocationChange?.({ lat, lng, address: addr });
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        { headers: { Accept: "application/json" } }
      );
      const j = await r.json();
      const a = j.address || {};
      const parts = [a.road || a.neighbourhood, a.suburb || a.city_district, a.city || a.town || a.state_district, a.state]
        .filter(Boolean);
      return parts.join(", ") || j.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const detect = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation isn't available in this browser");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const addr = await reverseGeocode(p.coords.latitude, p.coords.longitude);
        persist(p.coords.latitude, p.coords.longitude, addr);
        setExpanded(true);
        setDetecting(false);
        toast.success("Location detected");
      },
      () => {
        // Fallback: Delhi center
        persist(28.6139, 77.209, "Connaught Place, New Delhi");
        setExpanded(true);
        setDetecting(false);
        toast.message("Couldn't access GPS — using Delhi as default");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const saveManual = () => {
    if (!draft.trim()) return;
    // Keep existing coords (or fallback) so nearby still works
    const c = coords || { lat: 28.6139, lng: 77.209 };
    persist(c.lat, c.lng, draft.trim());
    setEditing(false);
  };

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Deliver to</div>
          {editing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveManual()}
                placeholder="Enter address, area or landmark"
                className="bg-transparent border-b border-primary/40 text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              />
              <button onClick={saveManual} className="text-primary"><Check className="w-4 h-4" /></button>
            </div>
          ) : (
            <button
              onClick={() => { setDraft(address); setEditing(true); }}
              className="flex items-center gap-1.5 text-sm text-foreground font-medium truncate w-full text-left hover:text-primary transition"
            >
              <span className="truncate">{address || "Choose your delivery location"}</span>
              <Pencil className="w-3 h-3 opacity-60 shrink-0" />
            </button>
          )}
        </div>
        <button
          onClick={detect}
          disabled={detecting}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-warm text-primary-foreground text-xs font-semibold disabled:opacity-70"
        >
          {detecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          {detecting ? "Locating…" : "Use my current location"}
        </button>
      </div>

      {coords && !compact && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs border-t border-border bg-background/50 hover:bg-background transition"
          >
            <span className="font-medium text-foreground">
              {branches.length} nearby branches · delivery from{" "}
              <span className="text-primary">{branches[0]?.etaMin || "—"} min</span>
            </span>
            <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                  {branches.map((b) => (
                    <Link
                      key={b.id}
                      to={`/restaurant/${b.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition group"
                    >
                      <img
                        src={b.image_url || ""}
                        alt={b.name}
                        className="w-12 h-12 rounded-lg object-cover bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary">
                            {b.name}
                          </h4>
                          <span className="text-[11px] font-medium text-muted-foreground shrink-0">
                            {b.distanceKm.toFixed(1)} km
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                          <span className="truncate">{b.locality}</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" /> {b.etaMin} min
                          </span>
                          <span
                            className={`flex items-center gap-1 shrink-0 font-medium ${
                              b.deliverable ? "text-success" : "text-destructive"
                            }`}
                          >
                            <Bike className="w-3 h-3" />
                            {b.deliverable ? "Delivers here" : "Out of zone"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {branches.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-4">
                      Finding restaurants near you…
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default LocationBar;