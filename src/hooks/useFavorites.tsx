import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setFavorites(new Set());
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("favorites").select("restaurant_id").eq("user_id", user.id);
    setFavorites(new Set((data || []).map((f) => f.restaurant_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const toggleFavorite = useCallback(
    async (restaurantId: string, restaurantName?: string) => {
      if (!user) {
        toast.error("Sign in to save favourites");
        return;
      }
      const isFav = favorites.has(restaurantId);
      setFavorites((prev) => {
        const next = new Set(prev);
        isFav ? next.delete(restaurantId) : next.add(restaurantId);
        return next;
      });
      if (isFav) {
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("restaurant_id", restaurantId);
        if (error) { toast.error("Could not remove favourite"); load(); return; }
        toast.success(`${restaurantName || "Restaurant"} removed from favourites`);
      } else {
        const { error } = await supabase.from("favorites").insert({ user_id: user.id, restaurant_id: restaurantId });
        if (error) { toast.error("Could not save favourite"); load(); return; }
        toast.success(`${restaurantName || "Restaurant"} saved to favourites`);
      }
    },
    [user, favorites, load]
  );

  return { favorites, loading, toggleFavorite, reload: load };
};