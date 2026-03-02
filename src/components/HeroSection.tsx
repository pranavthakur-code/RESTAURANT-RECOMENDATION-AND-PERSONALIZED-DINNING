import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import heroFood from "@/assets/hero-food.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroFood} alt="Delicious food spread" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              🔥 50 Loyalty Points on Sign Up
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6">
              Your Perfect
              <br />
              <span className="text-gradient-warm">Meal Awaits</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Order from top restaurants, book tables for DineOut experiences, and earn loyalty points on every bite.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <input
                type="text"
                placeholder="Enter your location..."
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none w-full text-sm"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            <Link to="/restaurants">
              <Button variant="hero" size="lg">Order Now</Button>
            </Link>
            <Link to="/dineout">
              <Button variant="outline" size="lg">Book a Table</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
