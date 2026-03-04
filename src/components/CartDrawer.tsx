import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Plus, Minus, Trash2, Award } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart, restaurantName } = useCart();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loyaltyPointsEarned = Math.floor(total / 20);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        restaurant_name: restaurantName!,
        items: items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price })),
        total_amount: total,
        loyalty_points_earned: loyaltyPointsEarned,
        status: "confirmed",
      });
      if (error) throw error;

      // Update profile
      const { data: profile } = await supabase.from("profiles").select("loyalty_points, total_orders, total_points_earned").eq("user_id", user.id).single();
      if (profile) {
        await supabase.from("profiles").update({
          loyalty_points: profile.loyalty_points + loyaltyPointsEarned,
          total_orders: profile.total_orders + 1,
          total_points_earned: profile.total_points_earned + loyaltyPointsEarned,
        }).eq("user_id", user.id);
      }

      await refreshProfile();
      clearCart();
      toast.success(`Order placed! You earned ${loyaltyPointsEarned} loyalty points 🎉`);
    } catch (e: any) {
      toast.error(e.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-20 right-6 z-40 rounded-full shadow-lg h-14 w-14 p-0" variant="hero">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-background border-border">
        <SheetHeader>
          <SheetTitle className="font-display text-foreground">Your Cart</SheetTitle>
          {restaurantName && <p className="text-sm text-muted-foreground">{restaurantName}</p>}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Your cart is empty</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-primary font-bold text-sm">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center text-foreground">{item.quantity}</span>
                    <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="flex-col gap-3 border-t border-border pt-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-bold text-lg">₹{total}</span>
              </div>
              <div className="flex items-center gap-1 text-loyalty text-sm font-medium w-full">
                <Award className="w-4 h-4" />
                You'll earn {loyaltyPointsEarned} loyalty points
              </div>
              <Button className="w-full" variant="hero" size="lg" onClick={handleCheckout} disabled={loading}>
                {loading ? "Placing Order..." : `Place Order · ₹${total}`}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
