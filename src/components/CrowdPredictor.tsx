import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, Activity, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  restaurantName: string;
  pricingFor2?: number | null;
  seed?: string;
}

const SLOTS = ["12:00 PM", "1:00 PM", "2:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

// Deterministic pseudo-random 0..1 from string
function rand(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

// Historical baseline curve for a slot (0..1)
function historical(slot: string, weekend: boolean) {
  const peakLunch = ["12:00 PM", "1:00 PM"].includes(slot);
  const peakDinner = ["8:00 PM", "9:00 PM"].includes(slot);
  const shoulder = ["2:00 PM", "7:00 PM", "10:00 PM"].includes(slot);
  let base = peakDinner ? 0.78 : peakLunch ? 0.62 : shoulder ? 0.45 : 0.3;
  if (weekend) base = Math.min(0.98, base + 0.15);
  return base;
}

function levelFor(p: number) {
  if (p < 0.45) return { label: "Low", color: "bg-success", text: "text-success" };
  if (p < 0.75) return { label: "Medium", color: "bg-loyalty", text: "text-loyalty" };
  return { label: "High", color: "bg-destructive", text: "text-destructive" };
}

const CrowdPredictor = ({ restaurantName, pricingFor2, seed }: Props) => {
  const [tab, setTab] = useState<"weekday" | "weekend">(() => {
    const d = new Date().getDay();
    return d === 0 || d === 6 ? "weekend" : "weekday";
  });
  const [bookings, setBookings] = useState<Record<string, number>>({});
  const [refreshing, setRefreshing] = useState(false);

  // Capacity heuristic: higher-priced restaurants typically have fewer seats
  const capacity = useMemo(() => {
    const p = pricingFor2 ?? 500;
    if (p > 2000) return 35;
    if (p > 1000) return 55;
    if (p > 500) return 80;
    return 110;
  }, [pricingFor2]);

  const fetchBookings = useCallback(async () => {
    setRefreshing(true);
    const from = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("bookings")
      .select("booking_time, guests, booking_date, status")
      .eq("venue_name", restaurantName)
      .gte("booking_date", from)
      .neq("status", "cancelled");
    const map: Record<string, number> = {};
    (data || []).forEach((b: any) => {
      const dow = new Date(b.booking_date).getDay();
      const isWk = dow === 0 || dow === 6;
      const key = `${isWk ? "wk" : "wd"}|${b.booking_time}`;
      map[key] = (map[key] || 0) + (b.guests || 2);
    });
    setBookings(map);
    setRefreshing(false);
  }, [restaurantName]);

  useEffect(() => {
    let cancelled = false;
    fetchBookings();
    const interval = setInterval(() => {
      if (!cancelled) fetchBookings();
    }, 120000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [fetchBookings]);

  const rows = useMemo(() => {
    const weekend = tab === "weekend";
    return SLOTS.map((slot) => {
      const seatsBooked = bookings[`${weekend ? "wk" : "wd"}|${slot}`] || 0;
      const livePct = Math.min(1, seatsBooked / capacity);
      const noise = (rand(`${seed || restaurantName}|${slot}|${weekend}`) - 0.5) * 0.1;
      const predicted = Math.max(0.05, Math.min(0.99, historical(slot, weekend) * 0.7 + livePct * 0.4 + noise));
      return { slot, pct: predicted, seatsBooked, level: levelFor(predicted) };
    });
  }, [bookings, tab, capacity, restaurantName, seed]);

  const avg = rows.reduce((s, r) => s + r.pct, 0) / rows.length;
  const avgLevel = levelFor(avg);

  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Live Crowd Predictor
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Powered by live bookings, capacity (~{capacity} seats) & historical trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBookings}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:bg-secondary transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh{refreshing ? "ing" : ""}
          </button>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-background border border-border ${avgLevel.text}`}>
            <TrendingUp className="w-3.5 h-3.5" /> {avgLevel.label} overall
          </div>
        </div>
      </div>

      <div className="inline-flex rounded-lg bg-secondary p-1 mb-4">
        {(["weekday", "weekend"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            {t === "weekday" ? "Mon–Fri" : "Sat–Sun"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={r.slot}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[70px_1fr_auto] items-center gap-3"
          >
            <span className="text-xs font-medium text-muted-foreground">{r.slot}</span>
            <div className="relative h-2.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(r.pct * 100)}%` }}
                transition={{ duration: 0.7, delay: i * 0.04 }}
                className={`absolute inset-y-0 left-0 ${r.level.color}`}
              />
            </div>
            <span className={`text-xs font-semibold w-20 text-right ${r.level.text}`}>
              {Math.round(r.pct * 100)}% · {r.level.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Best time to visit: <strong className="text-foreground ml-1">{rows.slice().sort((a, b) => a.pct - b.pct)[0].slot}</strong></span>
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" />Low</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-loyalty" />Medium</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />High</span>
        </span>
      </div>
    </div>
  );
};

export default CrowdPredictor;