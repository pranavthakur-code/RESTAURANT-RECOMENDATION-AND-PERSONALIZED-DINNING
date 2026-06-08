import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Award, Gift, Ticket, BadgePercent, TrendingUp, ShoppingBag, CalendarDays, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const rewards = [
  { icon: Ticket, name: "₹100 Off Voucher", points: 200, description: "Valid on orders above ₹500" },
  { icon: BadgePercent, name: "20% Discount", points: 350, description: "Up to ₹200 off on any order" },
  { icon: Gift, name: "Free Dessert", points: 150, description: "Complimentary dessert with any meal" },
  { icon: Ticket, name: "₹500 Off DineOut", points: 500, description: "Valid on table bookings" },
  { icon: BadgePercent, name: "Buy 1 Get 1 Free", points: 400, description: "On selected restaurants" },
  { icon: Crown, name: "Premium Membership", points: 1000, description: "Unlock 2x points, premium-only restaurants & perks" },
];

const Loyalty = () => {
  const { user, profile, refreshProfile } = useAuth();
  const pts = profile?.loyalty_points ?? 0;
  const isPremium = !!profile?.is_premium;

  const handleRedeem = async (reward: typeof rewards[0]) => {
    if (!user) { toast.error("Please sign in first"); return; }
    if (pts < reward.points) { toast.error("Not enough points"); return; }

    // Deduct points (and grant Premium if applicable)
    const updates: Record<string, any> = { loyalty_points: pts - reward.points };
    if (reward.name === "Premium Membership") {
      updates.is_premium = true;
      updates.premium_since = new Date().toISOString();
    }
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (updateError) { toast.error("Failed to redeem"); return; }

    // Record redemption
    await supabase.from("redemptions").insert({
      user_id: user.id,
      reward_name: reward.name,
      points_spent: reward.points,
    });

    toast.success(`Redeemed: ${reward.name}!`);
    await refreshProfile();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {!user ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Award className="w-16 h-16 text-loyalty mx-auto mb-4" />
              <h1 className="text-3xl font-display font-bold mb-3">Join MealMatch & Earn Rewards</h1>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Sign up to get 50 free loyalty points and start earning on every order and booking.</p>
              <Link to="/auth"><Button variant="hero" size="lg">Sign Up Now</Button></Link>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-warm p-8 mb-12 text-primary-foreground"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Your Balance</p>
                    <h1 className="text-5xl font-display font-extrabold mb-2 flex items-center gap-3">
                      <Award className="w-10 h-10" /> {pts} Points
                    </h1>
                    <p className="opacity-80">
                      {profile?.full_name ? `Hey ${profile.full_name}!` : "Hey!"} Keep ordering to earn more.
                    </p>
                    {isPremium && (
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-primary-foreground/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
                        <Crown className="w-3.5 h-3.5" /> Premium Member · 2x points active
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
                      <ShoppingBag className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <p className="text-2xl font-bold">{profile?.total_orders ?? 0}</p>
                      <p className="text-xs opacity-80">Orders</p>
                    </div>
                    <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
                      <CalendarDays className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <p className="text-2xl font-bold">{profile?.total_bookings ?? 0}</p>
                      <p className="text-xs opacity-80">Bookings</p>
                    </div>
                    <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
                      <TrendingUp className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <p className="text-2xl font-bold">{pts}</p>
                      <p className="text-xs opacity-80">Available</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold mb-6">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { step: "1", title: "Sign Up", desc: "Get 50 bonus loyalty points instantly" },
                    { step: "2", title: "Order & Book", desc: "Earn points on every food order and DineOut booking" },
                    { step: "3", title: "Redeem Rewards", desc: "Exchange points for vouchers, coupons & discounts" },
                  ].map((s, i) => (
                    <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-card border border-border text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
                      <h3 className="font-display font-semibold mb-1">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold mb-6">Redeem Rewards</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rewards.map((r, i) => (
                  <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-6 rounded-2xl bg-card border border-border hover:border-loyalty/30 transition-all flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-loyalty/10 flex items-center justify-center shrink-0">
                      <r.icon className="w-6 h-6 text-loyalty" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold mb-1">{r.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-loyalty">{r.points} pts</span>
                        <Button variant="loyalty" size="sm" disabled={pts < r.points} onClick={() => handleRedeem(r)}>
                          Redeem
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Loyalty;
