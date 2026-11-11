import RestaurantCard from "./RestaurantCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type FeaturedRestaurant = {
  slug: string;
  name: string;
  category: string | null;
  pricing_for_2: number | null;
  locality: string | null;
  dining_rating: number | null;
  image_url: string | null;
};

const FeaturedRestaurants = () => {
  const [featured, setFeatured] = useState<FeaturedRestaurant[]>([]);

  useEffect(() => {
    let active = true;

    const loadFeatured = async () => {
      const { data } = await supabase
        .from("restaurants_db")
        .select("slug, name, category, pricing_for_2, locality, dining_rating, image_url")
        .order("dining_rating", { ascending: false, nullsFirst: false })
        .limit(4);

      if (active) setFeatured(data || []);
    };

    void loadFeatured();
    return () => {
      active = false;
    };
  }, []);

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
          {featured.map((restaurant) => (
            <RestaurantCard
              key={restaurant.slug}
              slug={restaurant.slug}
              name={restaurant.name}
              cuisine={restaurant.category || "Restaurant"}
              rating={restaurant.dining_rating}
              image={restaurant.image_url}
              priceForTwo={restaurant.pricing_for_2}
              location={restaurant.locality}
              featured
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
