import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Plus, Minus, Trash2, Award, ArrowLeft, CreditCard, Banknote, QrCode, Smartphone, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import phonepeQR from "@/assets/phonepe-qr.png";

type PaymentMethod = "phonepe" | "cod" | "card" | "paytm" | "upi" | null;

const paymentMethods = [
  { id: "phonepe" as const, label: "PhonePe (QR)", icon: QrCode, description: "Scan & Pay via PhonePe" },
  { id: "upi" as const, label: "UPI", icon: Smartphone, description: "Google Pay, BHIM, etc." },
  { id: "card" as const, label: "Debit / Credit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "paytm" as const, label: "Paytm", icon: Smartphone, description: "Paytm Wallet or UPI" },
  { id: "cod" as const, label: "Cash on Delivery", icon: Banknote, description: "Pay when you receive" },
];

const CartDrawer = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart, restaurantName } = useCart();
  const { user, refreshProfile, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"cart" | "payment">("cart");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const basePts = Math.floor(total / 20);
  const isPremium = !!profile?.is_premium;
  const loyaltyPointsEarned = isPremium ? basePts * 2 : basePts;

  const handleProceedToPayment = () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }
    if (items.length === 0) return;
    setStep("payment");
  };

  const handleCheckout = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user!.id,
        restaurant_name: restaurantName!,
        items: items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price })),
        total_amount: total,
        loyalty_points_earned: loyaltyPointsEarned,
        status: "confirmed",
      });
      if (error) throw error;

      const { data: profile } = await supabase.from("profiles").select("loyalty_points, total_orders, total_points_earned").eq("user_id", user!.id).single();
      if (profile) {
        await supabase.from("profiles").update({
          loyalty_points: profile.loyalty_points + loyaltyPointsEarned,
          total_orders: profile.total_orders + 1,
          total_points_earned: profile.total_points_earned + loyaltyPointsEarned,
        }).eq("user_id", user!.id);
      }

      await refreshProfile();
      clearCart();
      setStep("cart");
      setSelectedPayment(null);
      setOpen(false);
      toast.success(`Order placed via ${paymentMethods.find(p => p.id === selectedPayment)?.label}! You earned ${loyaltyPointsEarned} loyalty points 🎉`);
    } catch (e: any) {
      toast.error(e.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep("cart");
      setSelectedPayment(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
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
        {step === "cart" ? (
          <>
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
                  <Button className="w-full" variant="hero" size="lg" onClick={handleProceedToPayment}>
                    Proceed to Payment · ₹{total} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </SheetFooter>
              </>
            )}
          </>
        ) : (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setStep("cart"); setSelectedPayment(null); }}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <SheetTitle className="font-display text-foreground">Select Payment</SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <method.icon className={`w-5 h-5 shrink-0 ${selectedPayment === method.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{method.label}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${selectedPayment === method.id ? "border-primary bg-primary" : "border-muted-foreground"}`} />
                </button>
              ))}

              {selectedPayment === "phonepe" && (
                <div className="mt-4 p-4 bg-card border border-border rounded-xl text-center space-y-3">
                  <p className="text-sm font-medium text-foreground">Scan to pay ₹{total}</p>
                  <img src={phonepeQR} alt="PhonePe QR Code" className="w-48 h-48 mx-auto rounded-lg object-contain" />
                  <p className="text-xs text-muted-foreground">Open PhonePe app → Scan QR → Pay ₹{total}</p>
                </div>
              )}

              {selectedPayment === "card" && (
                <div className="mt-4 p-4 bg-card border border-border rounded-xl space-y-3">
                  <p className="text-sm font-medium text-foreground">Card Details</p>
                  <input type="text" placeholder="Card Number" maxLength={19} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="MM/YY" maxLength={5} className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <input type="text" placeholder="CVV" maxLength={4} className="w-20 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              )}

              {(selectedPayment === "upi" || selectedPayment === "paytm") && (
                <div className="mt-4 p-4 bg-card border border-border rounded-xl space-y-3">
                  <p className="text-sm font-medium text-foreground">Enter UPI ID</p>
                  <input type="text" placeholder="yourname@upi" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              )}
            </div>

            <SheetFooter className="flex-col gap-3 border-t border-border pt-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-muted-foreground">Total</span>
                <span className="text-foreground font-bold text-lg">₹{total}</span>
              </div>
              <div className="flex items-center gap-1 text-loyalty text-sm font-medium w-full">
                <Award className="w-4 h-4" />
                You'll earn {loyaltyPointsEarned} loyalty points
              </div>
              <Button
                className="w-full"
                variant="hero"
                size="lg"
                onClick={handleCheckout}
                disabled={loading || !selectedPayment}
              >
                {loading ? "Placing Order..." : `Pay ₹${total}`}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
