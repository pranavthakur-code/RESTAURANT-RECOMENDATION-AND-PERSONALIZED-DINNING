import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Users, Clock, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Venue {
  name: string;
  type: string;
  location: string;
  points: number;
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  venue: Venue | null;
}

const timeSlots = ["12:00 PM", "1:00 PM", "2:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

const BookingDialog = ({ open, onOpenChange, venue }: Props) => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(timeSlots[3]);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!venue) return null;

  const handleBook = async () => {
    if (!user) {
      toast.error("Please sign in to book a table");
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    if (!name || !phone) {
      toast.error("Please enter your name and phone");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        venue_name: venue.name,
        booking_date: date,
        booking_time: time,
        guests,
        loyalty_points_earned: venue.points,
        status: "confirmed",
      });
      if (error) throw error;

      // Update profile points
      const { data: profile } = await supabase
        .from("profiles")
        .select("loyalty_points, total_bookings, total_points_earned")
        .eq("user_id", user.id)
        .single();
      if (profile) {
        await supabase.from("profiles").update({
          loyalty_points: profile.loyalty_points + venue.points,
          total_bookings: profile.total_bookings + 1,
          total_points_earned: profile.total_points_earned + venue.points,
        }).eq("user_id", user.id);
      }
      await refreshProfile();
      toast.success(`Table booked at ${venue.name}! +${venue.points} loyalty points 🎉`);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Book at {venue.name}</DialogTitle>
          <DialogDescription>
            {venue.type} • {venue.location}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Date</Label>
              <Input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Guests</Label>
              <Input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="flex items-center gap-1 mb-2"><Clock className="w-3.5 h-3.5" /> Time slot</Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`text-xs py-2 px-2 rounded-md border transition ${
                    time === t ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-loyalty bg-loyalty/10 rounded-md px-3 py-2">
            <Award className="w-4 h-4" /> Earn {venue.points} loyalty points on this booking
          </div>
          <Button variant="hero" className="w-full" onClick={handleBook} disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;