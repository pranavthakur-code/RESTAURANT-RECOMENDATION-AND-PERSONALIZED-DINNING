import RestaurantCard from "./RestaurantCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const restaurants = [
  {
    name: "The Royal Kitchen",
    cuisine: "North Indian",
    rating: 4.6,
    deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    loyaltyPoints: 15,
    priceRange: "₹₹",
    featured: true,
  },
  {
    name: "Pizza Paradise",
    cuisine: "Italian",
    rating: 4.4,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    loyaltyPoints: 12,
    priceRange: "₹₹",
  },
  {
    name: "Sushi Master",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "35-45 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    loyaltyPoints: 20,
    priceRange: "₹₹₹",
  },
  {
    name: "Burger Barn",
    cuisine: "American Fast Food",
    rating: 4.2,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    loyaltyPoints: 10,
    priceRange: "₹",
  },
];

const FeaturedRestaurants = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-bold">Popular Near You</h2>
          <Link to="/restaurants">
            <Button variant="ghost" className="text-primary gap-1">
              See All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((r) => (
            <RestaurantCard key={r.name} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
