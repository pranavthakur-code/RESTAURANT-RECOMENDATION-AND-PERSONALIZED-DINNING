import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, XCircle, Award, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Order {
  id: string;
  restaurant_name: string;
  items: { name: string; qty: number; price: number }[];
  total_amount: number;
  loyalty_points_earned: number;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: "text-green-500", label: "Confirmed" },
  pending: { icon: <Clock className="w-4 h-4" />, color: "text-yellow-500", label: "Pending" },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-destructive", label: "Cancelled" },
  delivered: { icon: <Package className="w-4 h-4" />, color: "text-primary", label: "Delivered" },
};

const Orders = () => {
  const { user, refreshProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("mealmatch_hidden_orders");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const visibleOrders = orders.filter((o) => !hiddenIds.has(o.id));

  const hideOrder = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev).add(id);
      localStorage.setItem("mealmatch_hidden_orders", JSON.stringify([...next]));
      return next;
    });
    toast.success("Order hidden from list");
  };

  useEffect(() => {
    if (user) fetchOrders();
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

  const handleCancel = async (order: Order) => {
    if (order.status === "cancelled" || order.status === "delivered") return;
    setCancellingId(order.id);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id)
        .eq("user_id", user!.id);
      if (error) throw error;

      // Recalculate points from scratch: 50 (signup) + active order points + active booking points - redemptions
      const [ordersRes, bookingsRes, redemptionsRes] = await Promise.all([
        supabase.from("orders").select("loyalty_points_earned, status").eq("user_id", user!.id),
        supabase.from("bookings").select("loyalty_points_earned, status").eq("user_id", user!.id),
        supabase.from("redemptions").select("id, points_spent, reward_name, created_at").eq("user_id", user!.id).order("created_at", { ascending: false }),
      ]);

      const activeOrderPoints = (ordersRes.data || [])
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.loyalty_points_earned, 0);
      const activeOrderCount = (ordersRes.data || []).filter((o) => o.status !== "cancelled").length;

      const activeBookingPoints = (bookingsRes.data || [])
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + b.loyalty_points_earned, 0);
      const activeBookingCount = (bookingsRes.data || []).filter((b) => b.status !== "cancelled").length;

      const signupBonus = 50;
      const totalEarned = signupBonus + activeOrderPoints + activeBookingPoints;

      // Auto-reverse redemptions if earned points can no longer cover them (newest first)
      const redemptions = redemptionsRes.data || [];
      let totalRedeemed = redemptions.reduce((sum, r) => sum + r.points_spent, 0);
      const reversedNames: string[] = [];

      if (totalEarned < totalRedeemed) {
        // Reverse newest redemptions until points balance is >= 0
        for (const r of redemptions) {
          if (totalEarned >= totalRedeemed) break;
          totalRedeemed -= r.points_spent;
          reversedNames.push(r.reward_name || "Reward");
          // Delete the reversed redemption
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
      await fetchOrders();
      const reversedMsg = reversedNames.length > 0 ? ` Reversed rewards: ${reversedNames.join(", ")}.` : "";
      toast.success(`Order cancelled. Points: ${currentPoints}.${reversedMsg}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Sign in to view orders</h2>
          <p className="text-muted-foreground mb-6">Track your orders and manage your history</p>
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
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground mb-8">Track and manage your food orders</p>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading orders...</div>
          ) : visibleOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link to="/restaurants"><Button variant="hero">Browse Restaurants</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleOrders.map((order, i) => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground">{order.restaurant_name}</h3>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
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
                            onClick={() => handleCancel(order)}
                            disabled={cancellingId === order.id}
                          >
                            {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
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
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-1 text-sm text-loyalty font-medium">
                        <Award className="w-4 h-4" />
                        {order.status === "cancelled" ? "Points reversed" : `+${order.loyalty_points_earned} pts`}
                      </div>
                      <span className="font-bold text-foreground">₹{order.total_amount}</span>
                    </div>
                  </motion.div>
                );
              })}
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

export default Orders;
