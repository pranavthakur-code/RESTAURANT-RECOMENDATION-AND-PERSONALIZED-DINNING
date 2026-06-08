-- Restaurants table (DB-backed catalog from Delhi NCR dataset)
CREATE TABLE public.restaurants_db (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text,
  pricing_for_2 integer DEFAULT 500,
  locality text,
  address text,
  dining_rating numeric(3,1),
  dining_review_count integer DEFAULT 0,
  delivery_rating numeric(3,1),
  delivery_review_count integer DEFAULT 0,
  latitude numeric(10,7),
  longitude numeric(10,7),
  known_for text,
  image_url text,
  premium_only boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.restaurants_db TO anon, authenticated;
GRANT ALL ON public.restaurants_db TO service_role;
ALTER TABLE public.restaurants_db ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Restaurants are publicly readable" ON public.restaurants_db FOR SELECT USING (true);

CREATE INDEX idx_restaurants_db_locality ON public.restaurants_db(locality);
CREATE INDEX idx_restaurants_db_lat_lng ON public.restaurants_db(latitude, longitude);

-- Menu items
CREATE TABLE public.menu_items_db (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants_db(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  category text,
  is_veg boolean NOT NULL DEFAULT true,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items_db TO anon, authenticated;
GRANT ALL ON public.menu_items_db TO service_role;
ALTER TABLE public.menu_items_db ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menu items are publicly readable" ON public.menu_items_db FOR SELECT USING (true);

CREATE INDEX idx_menu_items_db_restaurant ON public.menu_items_db(restaurant_id);
CREATE INDEX idx_menu_items_db_is_veg ON public.menu_items_db(is_veg);

-- Premium membership flag on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_since timestamptz;