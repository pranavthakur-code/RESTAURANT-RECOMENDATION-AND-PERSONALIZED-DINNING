import { Star, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  loyaltyPoints: number;
  priceRange: string;
  featured?: boolean;
}

const RestaurantCard = ({ name, cuisine, rating, deliveryTime, image, loyaltyPoints, priceRange, featured }: RestaurantCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`group rounded-2xl overflow-hidden bg-card border transition-all duration-300 cursor-pointer ${
        featured ? "border-primary/30 glow-primary" : "border-border hover:border-primary/20"
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          <Star className="w-3.5 h-3.5 text-loyalty fill-loyalty" />
          {rating}
        </div>
        {featured && (
          <div className="absolute top-3 left-3 bg-gradient-warm px-2.5 py-1 rounded-full text-xs font-semibold text-primary-foreground">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-loyalty/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-loyalty-foreground">
          <Award className="w-3 h-3" />
          Earn {loyaltyPoints} pts
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{cuisine} · {priceRange}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {deliveryTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
