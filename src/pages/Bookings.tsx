import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, Users, Clock, CheckCircle, XCircle, Award, Pencil, Utensils } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

const timeSlots = ["12:00 PM", "1:00 PM", "2:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

const Bookings = () => {
  const { user, refreshProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editGuests, setEditGuests] = useState(2);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  };

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

  const handleCancel = async (b: Booking) => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
          <Utensils className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Sign in to view bookings</h2>
          <p className="text-muted-foreground mb-6">Manage your table reservations</p>
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
          <h1 className="text-4xl font-display font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-8">Manage your DineOut table reservations</p>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No bookings yet</p>
              <Link to="/dineout"><Button variant="hero">Browse DineOut</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b, i) => {
                const cancelled = b.status === "cancelled";
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground">{b.venue_name}</h3>
                        <p className="text-xs text-muted-foreground">Booked on {new Date(b.created_at).toLocaleString()}</p>
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
                            onClick={() => handleCancel(b)}
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

export default Bookings;