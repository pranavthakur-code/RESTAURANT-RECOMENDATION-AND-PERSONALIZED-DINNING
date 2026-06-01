import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Package, Clock, CheckCircle, XCircle, Award, EyeOff,
  ChefHat, Bike, MapPin, CalendarDays, Users, Utensils,
  Pencil, User, MapPin as MapPinIcon, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  restaurant_name: string;
  items: OrderItem[];
  total_amount: number;
  loyalty_points_earned: number;
  status: string;
  created_at: string;
}

interface Booking {
  id: string;
  venue_name: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  loyalty_points_earned: number;
  status: string;
  created_at: string;
}

type Activity =
  | { type: "order"; data: Order }
  | { type: "booking"; data: Booking };

const timeSlots = ["12:00 PM", "1:00 PM", "2:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

const TOTAL_MIN = 25;
const stageThresholds = [0, 2, 8, 15, 25];

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: "text-green-500", label: "Confirmed" },
  pending: { icon: <Clock className="w-4 h-4" />, color: "text-yellow-500", label: "Pending" },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-destructive", label: "Cancelled" },
  delivered: { icon: <Package className="w-4 h-4" />, color: "text-primary", label: "Delivered" },
};

const Account = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "orders" | "bookings">("all");
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("mealmatch_hidden_orders");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editGuests, setEditGuests] = useState(2);
  const today = new Date().toISOString().split("T")[0];

  const [, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(i);
  }, []);

  const lastStageRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchBookings();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as unknown as Order[]);
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setBookings(data as unknown as Booking[]);
  };

  const elapsedMin = (order: Order) =>
    (Date.now() - new Date(order.created_at).getTime()) / 60000;

  const getDeliveryStage = (order: Order) => {
    if (order.status === "cancelled") return -1;
    if (order.status === "delivered") return 4;
    const m = elapsedMin(order);
    let stage = 0;
    for (let i = 0; i < stageThresholds.length; i++) {
      if (m >= stageThresholds[i]) stage = i;
    }
    return stage;
  };

  const getProgress = (order: Order) => {
    if (order.status === "cancelled") return 0;
    if (order.status === "delivered") return 100;
    return Math.min(100, (elapsedMin(order) / TOTAL_MIN) * 100);
  };

  const stages = [
    { label: "Order Placed", icon: <CheckCircle className="w-4 h-4" /> },
    { label: "Preparing", icon: <ChefHat className="w-4 h-4" /> },
    { label: "Out for Delivery", icon: <Bike className="w-4 h-4" /> },
    { label: "Nearby", icon: <MapPin className="w-4 h-4" /> },
    { label: "Delivered", icon: <Package className="w-4 h-4" /> },
  ];

  useEffect(() => {
    orders.forEach((o) => {
      if (o.status === "cancelled" || o.status === "delivered") return;
      const stage = getDeliveryStage(o);
      const prev = lastStageRef.current[o.id];
      if (prev !== undefined && stage > prev) {
        const stageLabels = ["Order Placed", "Preparing", "Out for Delivery", "Nearby", "Delivered"];
        toast.info(`${o.restaurant_name}: ${stageLabels[stage]}`);
      }
      lastStageRef.current[o.id] = stage;
      if (stage === 4 && o.status !== "delivered") {
        supabase
          .from("orders")
          .update({ status: "delivered" })
          .eq("id", o.id)
          .eq("user_id", user!.id)
          .then(() => {
            setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: "delivered" } : x)));
          });
      }
    });
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("orders-changes-account")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === "UPDATE" && payload.new) {
            const updated = payload.new as Order;
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
          } else if (payload.eventType === "INSERT" && payload.new) {
            fetchOrders();
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const recalcPoints = async () => {
    const [ordersRes, bookingsRes, redemptionsRes] = await Promise.all([
      supabase.from("orders").select("loyalty_points_earned, status").eq("user_id", user!.id),
      supabase.from("bookings").select("loyalty_points_earned, status").eq("user_id", user!.id),
      supabase.from("redemptions").select("id, points_spent, reward_name, created_at").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    const activeOrderPoints = (ordersRes.data || []).filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.loyalty_points_earned, 0);
    const activeOrderCount = (ordersRes.data || []).filter((o) => o.status !== "cancelled").length;
    const activeBookingPoints = (bookingsRes.data || []).filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.loyalty_points_earned, 0);
    const activeBookingCount = (bookingsRes.data || []).filter((b) => b.status !== "cancelled").length;
    const totalEarned = 50 + activeOrderPoints + activeBookingPoints;
    const redemptions = redemptionsRes.data || [];
    let totalRedeemed = redemptions.reduce((s, r) => s + r.points_spent, 0);
    const reversed: string[] = [];
    if (totalEarned < totalRedeemed) {
      for (const r of redemptions) {
        if (totalEarned >= totalRedeemed) break;
        totalRedeemed -= r.points_spent;
        reversed.push(r.reward_name || "Reward");
        await supabase.from("redemptions").delete().eq("id", r.id);
      }
    }
    const currentPoints = Math.max(0, totalEarned - totalRedeemed);
    await supabase.from("profiles").update({
      loyalty_points: currentPoints,
      total_orders: activeOrderCount,
      total_bookings: activeBookingCount,
      total_points_earned: totalEarned,
    }).eq("user_id", user!.id);
    await refreshProfile();
    return { currentPoints, reversed };
  };

  const handleCancelOrder = async (order: Order) => {
    if (order.status === "cancelled" || order.status === "delivered") return;
    setCancellingId(order.id);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id)
        .eq("user_id", user!.id);
      if (error) throw error;
      const { currentPoints, reversed } = await recalcPoints();
      await fetchOrders();
      const reversedMsg = reversed.length > 0 ? ` Reversed rewards: ${reversed.join(", ")}.` : "";
      toast.success(`Order cancelled. Points: ${currentPoints}.${reversedMsg}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const hideOrder = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev).add(id);
      localStorage.setItem("mealmatch_hidden_orders", JSON.stringify([...next]));
      return next;
    });
    toast.success("Order hidden from list");
  };

  const handleCancelBooking = async (b: Booking) => {
    if (b.status === "cancelled") return;
    setBusyId(b.id);
    try {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", b.id).eq("user_id", user!.id);
      if (error) throw error;
      const { currentPoints, reversed } = await recalcPoints();
      await fetchBookings();
      const msg = reversed.length ? ` Reversed rewards: ${reversed.join(", ")}.` : "";
      toast.success(`Booking cancelled. Points: ${currentPoints}.${msg}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel booking");
    } finally {
      setBusyId(null);
    }
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setEditDate(b.booking_date);
    setEditTime(b.booking_time);
    setEditGuests(b.guests);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setBusyId(editing.id);
    try {
      const { error } = await supabase.from("bookings").update({
        booking_date: editDate,
        booking_time: editTime,
        guests: editGuests,
      }).eq("id", editing.id).eq("user_id", user!.id);
      if (error) throw error;
      toast.success("Booking updated");
      setEditing(null);
      await fetchBookings();
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  const allActivity: Activity[] = [
    ...orders.filter((o) => !hiddenIds.has(o.id)).map((o) => ({ type: "order" as const, data: o })),
    ...bookings.map((b) => ({ type: "booking" as const, data: b })),
  ].sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime());

  const visibleOrders = orders.filter((o) => !hiddenIds.has(o.id));
  const filtered: Activity[] =
    tab === "all" ? allActivity :
    tab === "orders" ? allActivity.filter((a) => a.type === "order") :
    allActivity.filter((a) => a.type === "booking");

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
          <User className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Sign in to view your account</h2>
          <p className="text-muted-foreground mb-6">See your orders, bookings and loyalty points in one place</p>
          <Link to="/auth"><Button variant="hero">Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Profile Summary */}
          <div className="bg-gradient-card border border-border rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                  {(profile?.full_name || user.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold">{profile?.full_name || user.email?.split("@")[0]}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" /> {profile?.location || "New Delhi"}</span>
                    <span className="flex items-center gap-1 text-loyalty font-medium"><Award className="w-3.5 h-3.5" /> {profile?.loyalty_points ?? 0} pts</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center bg-secondary/40 rounded-xl px-4 py-2">
                  <div className="text-lg font-bold text-foreground">{profile?.total_orders ?? 0}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</div>
                </div>
                <div className="text-center bg-secondary/40 rounded-xl px-4 py-2">
                  <div className="text-lg font-bold text-foreground">{profile?.total_bookings ?? 0}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Bookings</div>
                </div>
                <Link to="/loyalty">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Award className="w-3.5 h-3.5" /> Rewards <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(["all", "orders", "bookings"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  tab === t
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                }`}
              >
                {t === "all" ? "All Activity" : t === "orders" ? "Food Orders" : "DineOut Bookings"}
                <span className="ml-1.5 text-xs opacity-70">
                  {t === "all" ? allActivity.length : t === "orders" ? visibleOrders.length : bookings.length}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading your activity...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No activity yet</p>
              <div className="flex items-center justify-center gap-3">
                <Link to="/restaurants"><Button variant="hero" size="sm">Order Food</Button></Link>
                <Link to="/dineout"><Button variant="outline" size="sm">Book a Table</Button></Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((activity, i) => {
                if (activity.type === "order") {
                  const order = activity.data;
                  const sc = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <motion.div
                      key={`o-${order.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                            <Package className="w-3 h-3" /> Food Order
                          </span>
                          <h3 className="font-display font-bold text-lg text-foreground">{order.restaurant_name}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center gap-1 text-sm font-medium ${sc.color}`}>
                            {sc.icon} {sc.label}
                          </span>
                          {order.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => handleCancelOrder(order)}
                              disabled={cancellingId === order.id}
                            >
                              {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => hideOrder(order.id)}
                          >
                            <EyeOff className="w-4 h-4 mr-1" /> Hide
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                            <span className="text-foreground">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                      {order.status !== "cancelled" && (
                        <div className="bg-secondary/30 rounded-xl p-4 mb-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Delivery Tracking</p>
                          <div className="relative h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-linear"
                              style={{ width: `${getProgress(order)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            {stages.map((stage, idx) => {
                              const currentStage = getDeliveryStage(order);
                              const reached = idx <= currentStage;
                              const active = idx === currentStage && currentStage < 4;
                              return (
                                <div key={idx} className="flex-1 flex flex-col items-center text-center relative">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                                    reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                  } ${active ? "ring-2 ring-primary/40 animate-pulse" : ""}`}>
                                    {stage.icon}
                                  </div>
                                  <span className={`text-[10px] mt-1.5 leading-tight ${reached ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                    {stage.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-center text-muted-foreground mt-3">
                            {getDeliveryStage(order) === 4
                              ? "Order delivered. Enjoy your meal! 🍽️"
                              : `Estimated arrival in ${Math.max(1, 25 - Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000))} min`}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <div className="flex items-center gap-1 text-sm text-loyalty font-medium">
                          <Award className="w-4 h-4" />
                          {order.status === "cancelled" ? "Points reversed" : `+${order.loyalty_points_earned} pts`}
                        </div>
                        <span className="font-bold text-foreground">₹{order.total_amount}</span>
                      </div>
                    </motion.div>
                  );
                }

                const b = activity.data;
                const cancelled = b.status === "cancelled";
                return (
                  <motion.div
                    key={`b-${b.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                          <Utensils className="w-3 h-3" /> DineOut
                        </span>
                        <h3 className="font-display font-bold text-lg text-foreground">{b.venue_name}</h3>
                      </div>
                      <span className={`flex items-center gap-1 text-sm font-medium ${cancelled ? "text-destructive" : "text-green-500"}`}>
                        {cancelled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {cancelled ? "Cancelled" : "Confirmed"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-secondary/30 rounded-xl p-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{new Date(b.booking_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{b.booking_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{b.guests} guests</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-1 text-sm text-loyalty font-medium">
                        <Award className="w-4 h-4" />
                        {cancelled ? "Points reversed" : `+${b.loyalty_points_earned} pts`}
                      </div>
                      {!cancelled && (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(b)} disabled={busyId === b.id}>
                            <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => handleCancelBooking(b)}
                            disabled={busyId === b.id}
                          >
                            {busyId === b.id ? "Cancelling..." : "Cancel"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Booking Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Booking</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Date</Label>
                  <Input type="date" min={today} value={editDate} onChange={(e) => setEditDate(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Guests</Label>
                  <Input type="number" min={1} max={20} value={editGuests} onChange={(e) => setEditGuests(parseInt(e.target.value) || 1)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-1 mb-2"><Clock className="w-3.5 h-3.5" /> Time slot</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditTime(t)}
                      className={`text-xs py-2 px-2 rounded-md border transition ${
                        editTime === t ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="hero" className="w-full" onClick={handleSaveEdit} disabled={busyId === editing.id}>
                {busyId === editing.id ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <ChatBot />
      <CartDrawer />
    </div>
  );
};

export default Account;
