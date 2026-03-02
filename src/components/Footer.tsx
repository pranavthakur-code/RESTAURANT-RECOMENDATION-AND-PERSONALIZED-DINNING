import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-12 border-t border-border bg-card/50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-gradient-warm">MealMatch</span>
          </div>
          <p className="text-sm text-muted-foreground">Your perfect meal, every time.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Explore</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link>
            <Link to="/dineout" className="hover:text-primary transition-colors">DineOut</Link>
            <Link to="/loyalty" className="hover:text-primary transition-colors">Loyalty</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>About Us</span>
            <span>Careers</span>
            <span>Contact</span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        © 2026 MealMatch. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
