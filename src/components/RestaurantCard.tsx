import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface RestaurantCardProps {
  slug: string;
  name: string;
  cuisine: string;
  rating: number | null;
  image: string | null;
  priceForTwo: number | null;
  location?: string;
  featured?: boolean;
}

const RestaurantCard = ({ slug, name, cuisine, rating, image, priceForTwo, location, featured }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${slug}`}>
      <motion.div
        whileHover={{ y: -6 }}
        className={`group rounded-2xl overflow-hidden bg-card border transition-all duration-300 cursor-pointer ${
          featured ? "border-primary/30 glow-primary" : "border-border hover:border-primary/20"
        }`}
      >
        <div className="relative h-48 overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {rating != null && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3.5 h-3.5 text-loyalty fill-loyalty" />
              {Number(rating).toFixed(1)}
            </div>
          )}
          {featured && (
            <div className="absolute top-3 left-3 bg-gradient-warm px-2.5 py-1 rounded-full text-xs font-semibold text-primary-foreground">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-foreground mb-1">{name}</h3>
            {priceForTwo != null && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">₹{priceForTwo} for 2</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{cuisine}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {location && <><MapPin className="w-3.5 h-3.5" />{location}</>}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default RestaurantCard;
