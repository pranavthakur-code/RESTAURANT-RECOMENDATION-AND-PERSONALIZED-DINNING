import RestaurantCard from "./RestaurantCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { allRestaurants } from "@/data/restaurants";

const FeaturedRestaurants = () => {
  const featured = allRestaurants.slice(0, 4);

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
          {featured.map((r) => (
            <RestaurantCard key={r.slug} slug={r.slug} name={r.name} cuisine={r.cuisine} rating={r.rating} deliveryTime={r.deliveryTime} image={r.image} loyaltyPoints={r.loyaltyPoints} priceRange={r.priceRange} location={r.location} featured={r.featured} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
