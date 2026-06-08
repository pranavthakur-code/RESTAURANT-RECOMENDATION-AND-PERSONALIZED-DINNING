import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, Award, ShoppingBag, LogOut, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/restaurants", label: "Order Food" },
  { to: "/dineout", label: "DineOut" },
  { to: "/orders", label: "My Orders" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/account", label: "My Account" },
  { to: "/loyalty", label: "Loyalty" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-warm flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-gradient-warm">MealMatch</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{profile?.location || "New Delhi"}</span>
          </div>
          {user && (
            <Link to="/loyalty" className="flex items-center gap-1.5 text-sm bg-loyalty/10 text-loyalty px-3 py-1.5 rounded-full font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>{profile?.loyalty_points ?? 0} pts</span>
            </Link>
          )}
          {user && profile?.is_premium && (
            <span className="flex items-center gap-1.5 text-xs bg-gradient-warm text-primary-foreground px-3 py-1.5 rounded-full font-semibold">
              <Crown className="w-3.5 h-3.5" /> Premium
            </span>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{profile?.full_name || user.email?.split("@")[0]}</span>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="hero" size="sm">Sign Up</Button>
            </Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Button variant="ghost" onClick={signOut} className="mt-2 justify-start">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" className="mt-2 w-full">Sign Up</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
