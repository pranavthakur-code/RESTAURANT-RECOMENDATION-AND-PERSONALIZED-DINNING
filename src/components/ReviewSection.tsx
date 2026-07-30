import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, MessageSquare, Trash2, Pencil, Award } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  user_name: string | null;
  created_at: string;
}

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Pick a star rating").max(5),
  comment: z.string().trim().max(500, "Keep your review under 500 characters"),
});

const Stars = ({ value, size = "w-4 h-4" }: { value: number; size?: string }) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className={`${size} ${n <= value ? "text-loyalty fill-loyalty" : "text-muted-foreground"}`} />
    ))}
  </span>
);

const ReviewSection = ({ restaurantId, restaurantName }: { restaurantId: string; restaurantName: string }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, user_name, created_at")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) || []);
  }, [restaurantId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    (async () => {
      if (!user) { setHasOrdered(false); return; }
      const [{ count: orderCount }, { count: bookingCount }] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("restaurant_name", restaurantName).neq("status", "cancelled"),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("venue_name", restaurantName).neq("status", "cancelled"),
      ]);
      setHasOrdered((orderCount || 0) > 0 || (bookingCount || 0) > 0);
    })();
  }, [user, restaurantName]);

  const mine = user ? reviews.find((r) => r.user_id === user.id) : undefined;
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const openDialog = () => {
    if (!user) { toast.error("Please sign in to write a review"); return; }
    setRating(mine?.rating ?? 0);
    setComment(mine?.comment ?? "");
    setOpen(true);
  };

  const submit = async () => {
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSaving(true);
    try {
      const payload = {
        user_id: user!.id,
        restaurant_id: restaurantId,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
        user_name: profile?.full_name || user!.email?.split("@")[0] || "Guest",
      };
      if (mine) {
        const { error } = await supabase.from("reviews").update(payload).eq("id", mine.id);
        if (error) throw error;
        toast.success("Review updated");
      } else {
        const { error } = await supabase.from("reviews").insert(payload);
        if (error) throw error;
        const { data: p } = await supabase.from("profiles").select("loyalty_points, total_points_earned").eq("user_id", user!.id).maybeSingle();
        if (p) {
          await supabase.from("profiles").update({
            loyalty_points: p.loyalty_points + 10,
            total_points_earned: p.total_points_earned + 10,
          }).eq("user_id", user!.id);
          await refreshProfile();
        }
        toast.success("Thanks for your review! You earned 10 loyalty points");
      }
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e.message || "Could not save your review");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!mine) return;
    const { error } = await supabase.from("reviews").delete().eq("id", mine.id);
    if (error) { toast.error("Could not delete review"); return; }
    toast.success("Review deleted");
    setOpen(false);
    await load();
  };

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display font-bold text-foreground">Ratings & Reviews</h2>
          {reviews.length > 0 && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Stars value={Math.round(average)} />
              <span className="font-semibold text-foreground">{average.toFixed(1)}</span>
              <span>({reviews.length})</span>
            </span>
          )}
        </div>
        <Button size="sm" variant={mine ? "outline" : "hero"} onClick={openDialog}>
          {mine ? <><Pencil className="w-3.5 h-3.5 mr-1" /> Edit your review</> : <><MessageSquare className="w-3.5 h-3.5 mr-1" /> Write a review</>}
        </Button>
      </div>

      {user && !mine && !hasOrdered && (
        <p className="text-xs text-muted-foreground mb-3">
          Order or dine here first for a verified review — you can still share your experience anytime.
        </p>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No reviews yet. Be the first to rate {restaurantName} and earn 10 loyalty points.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {(r.user_name || "G").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.user_name || "Guest"}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{mine ? "Edit your review" : `Rate ${restaurantName}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                >
                  <Star className={`w-8 h-8 transition ${n <= (hover || rating) ? "text-loyalty fill-loyalty" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
            <Textarea
              value={comment}
              maxLength={500}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of the food, service and ambience?"
              rows={4}
            />
            {!mine && (
              <p className="flex items-center gap-1 text-xs text-loyalty font-medium">
                <Award className="w-3.5 h-3.5" /> Earn 10 loyalty points for your first review here
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="hero" className="flex-1" onClick={submit} disabled={saving}>
                {saving ? "Saving..." : mine ? "Update review" : "Post review"}
              </Button>
              {mine && (
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={remove} disabled={saving}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewSection;