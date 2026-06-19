import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Loader2, Bike, Clock, Pencil, Check, ChevronRight, Search, X } from "lucide-react";
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

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;

declare global { interface Window { __gmapsReady?: Promise<any>; google: any; __initGMaps?: () => void; } }

function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (window.__gmapsReady) return window.__gmapsReady;
  if (!BROWSER_KEY) return Promise.reject(new Error("Maps key missing"));
  window.__gmapsReady = new Promise((resolve, reject) => {
    window.__initGMaps = () => resolve(window.google);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&libraries=places&loading=async&callback=__initGMaps${TRACKING_ID ? `&channel=${TRACKING_ID}` : ""}`;
    s.async = true; s.defer = true; s.onerror = () => reject(new Error("Maps failed to load"));
    document.head.appendChild(s);
  });
  return window.__gmapsReady;
}

const LocationBar = ({ onLocationChange, compact }: Props) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; main: string; secondary: string }[]>([]);
  const [showMap, setShowMap] = useState(false);
  const sessionTokenRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObjRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const p = JSON.parse(raw);
        setCoords({ lat: p.lat, lng: p.lng });
        setAddress(p.address || "");
        onLocationChange?.({ lat: p.lat, lng: p.lng, address: p.address || "" });
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const { data, error } = await supabase.functions.invoke("geo", {
        body: { action: "reverse", lat, lng },
      });
      if (error) throw error;
      return (data?.formatted as string) || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
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
        setShowMap(true);
        toast.success("Location detected");
      },
      () => {
        // Fallback: Delhi center
        persist(28.6139, 77.209, "Connaught Place, New Delhi");
        setExpanded(true);
        setDetecting(false);
        toast.message("Couldn't access GPS — using Delhi as default");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Live Places autocomplete (Places API New, browser key)
  useEffect(() => {
    if (!editing) return;
    const q = draft.trim();
    if (q.length < 3) { setSuggestions([]); return; }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const g = await loadGoogleMaps();
        const { AutocompleteSuggestion, AutocompleteSessionToken } =
          (await g.maps.importLibrary("places")) as any;
        if (!sessionTokenRef.current) sessionTokenRef.current = new AutocompleteSessionToken();
        const bias = coords
          ? { circle: { center: { latitude: coords.lat, longitude: coords.lng }, radius: 50000 } }
          : undefined;
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: q,
          sessionToken: sessionTokenRef.current,
          locationBias: bias,
          includedRegionCodes: ["in"],
        });
        if (cancelled) return;
        setSuggestions(
          (suggestions || []).slice(0, 6).map((s: any) => {
            const p = s.placePrediction;
            return {
              id: p?.placeId,
              main: p?.mainText?.text || p?.text?.text || "",
              secondary: p?.secondaryText?.text || "",
            };
          }).filter((x: any) => x.id)
        );
      } catch {
        setSuggestions([]);
      }
    }, 220);
    return () => { cancelled = true; clearTimeout(t); };
  }, [draft, editing, coords]);

  const pickSuggestion = async (placeId: string, label: string) => {
    setEditing(false);
    setSuggestions([]);
    try {
      const { data, error } = await supabase.functions.invoke("geo", {
        body: { action: "place_details", placeId },
      });
      if (error) throw error;
      const lat = Number(data?.lat), lng = Number(data?.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        persist(lat, lng, (data?.formatted as string) || label);
        setShowMap(true);
        setExpanded(true);
        sessionTokenRef.current = null;
      } else {
        toast.error("Couldn't get coordinates for that place");
      }
    } catch {
      toast.error("Place lookup failed");
    }
  };

  // Map preview with draggable pin (Zomato-style "drag to refine")
  useEffect(() => {
    if (!showMap || !coords || !mapRef.current) return;
    let disposed = false;
    (async () => {
      try {
        const g = await loadGoogleMaps();
        if (disposed) return;
        if (!mapObjRef.current) {
          mapObjRef.current = new g.maps.Map(mapRef.current!, {
            center: coords, zoom: 16, disableDefaultUI: true, zoomControl: true,
            gestureHandling: "greedy", clickableIcons: false,
          });
          markerRef.current = new g.maps.Marker({
            position: coords, map: mapObjRef.current, draggable: true,
          });
          markerRef.current.addListener("dragend", async (e: any) => {
            const lat = e.latLng.lat(), lng = e.latLng.lng();
            const addr = await reverseGeocode(lat, lng);
            persist(lat, lng, addr);
          });
        } else {
          mapObjRef.current.setCenter(coords);
          markerRef.current.setPosition(coords);
        }
      } catch {
        // map unavailable; preview just stays hidden
      }
    })();
    return () => { disposed = true; };
  }, [showMap, coords]);

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Deliver to</div>
          {editing ? (
            <div className="relative mt-1">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") { setEditing(false); setSuggestions([]); } }}
                  placeholder="Search address, area, landmark or building"
                  className="bg-transparent border-b border-primary/40 text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={() => { setEditing(false); setSuggestions([]); }} className="text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
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

      <AnimatePresence>
        {editing && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="border-t border-border bg-background/60 divide-y divide-border/60"
          >
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => pickSuggestion(s.id, [s.main, s.secondary].filter(Boolean).join(", "))}
                  className="w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-secondary transition"
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{s.main}</div>
                    {s.secondary && <div className="text-[11px] text-muted-foreground truncate">{s.secondary}</div>}
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {coords && !compact && showMap && (
        <div className="border-t border-border">
          <div ref={mapRef} className="w-full h-44 bg-secondary" aria-label="Delivery location map" />
          <div className="px-4 py-2 text-[11px] text-muted-foreground bg-background/50 border-t border-border">
            Drag the pin to refine your exact delivery spot
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-2">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setShowMap((v) => !v); }}
                className="text-primary font-semibold"
              >
                {showMap ? "Hide map" : "Show map"}
              </span>
              <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </div>
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