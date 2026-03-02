import { Award, Gift, Ticket, BadgePercent } from "lucide-react";
import { motion } from "framer-motion";

const rewards = [
  { icon: Ticket, name: "₹100 Off Voucher", points: 200, color: "text-primary" },
  { icon: BadgePercent, name: "20% Discount Coupon", points: 350, color: "text-accent" },
  { icon: Gift, name: "Free Dessert", points: 150, color: "text-success" },
  { icon: Ticket, name: "₹500 Off DineOut", points: 500, color: "text-loyalty" },
];

const LoyaltySection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-loyalty/10 text-loyalty text-sm font-medium mb-4 border border-loyalty/20">
              <Award className="w-4 h-4" /> Loyalty Rewards
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Earn Points. Unlock <span className="text-gradient-warm">Rewards.</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Every order and booking earns you points. Redeem them for exclusive vouchers, coupons, and discounts.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rewards.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-loyalty/30 transition-all cursor-pointer text-center"
            >
              <r.icon className={`w-10 h-10 mx-auto mb-4 ${r.color}`} />
              <h3 className="font-display font-semibold mb-2">{r.name}</h3>
              <p className="text-sm text-loyalty font-medium">{r.points} points</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoyaltySection;
