-- REVIEWS
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants_db(id) ON DELETE CASCADE,
  order_id UUID,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  user_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, restaurant_id)
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own review" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own review" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own review" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_reviews_restaurant ON public.reviews(restaurant_id);

-- FAVORITES
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants_db(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, restaurant_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add their own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- COUPONS
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('flat','percent')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  max_discount NUMERIC,
  min_order NUMERIC NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_to TIMESTAMPTZ,
  usage_limit_per_user INTEGER NOT NULL DEFAULT 1,
  premium_only BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active coupons readable by signed-in users" ON public.coupons FOR SELECT TO authenticated USING (active = true);
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COUPON REDEMPTIONS
CREATE TABLE public.coupon_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  order_id UUID,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own coupon redemptions" ON public.coupon_redemptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can record their own coupon redemptions" ON public.coupon_redemptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- VALIDATION FUNCTION
CREATE OR REPLACE FUNCTION public.validate_coupon(_code TEXT, _order_total NUMERIC)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons%ROWTYPE;
  uses INTEGER;
  is_prem BOOLEAN;
  discount NUMERIC;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Please sign in to use a promo code');
  END IF;

  SELECT * INTO c FROM public.coupons WHERE upper(code) = upper(trim(_code)) AND active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Invalid promo code');
  END IF;

  IF c.valid_from > now() OR (c.valid_to IS NOT NULL AND c.valid_to < now()) THEN
    RETURN jsonb_build_object('valid', false, 'message', 'This promo code has expired');
  END IF;

  IF _order_total < c.min_order THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Minimum order of ₹' || c.min_order::INTEGER || ' required');
  END IF;

  IF c.premium_only THEN
    SELECT is_premium INTO is_prem FROM public.profiles WHERE user_id = auth.uid();
    IF COALESCE(is_prem, false) = false THEN
      RETURN jsonb_build_object('valid', false, 'message', 'This code is for Premium members only');
    END IF;
  END IF;

  SELECT count(*) INTO uses FROM public.coupon_redemptions WHERE user_id = auth.uid() AND coupon_id = c.id;
  IF uses >= c.usage_limit_per_user THEN
    RETURN jsonb_build_object('valid', false, 'message', 'You have already used this promo code');
  END IF;

  IF c.discount_type = 'flat' THEN
    discount := c.discount_value;
  ELSE
    discount := _order_total * c.discount_value / 100.0;
    IF c.max_discount IS NOT NULL THEN
      discount := LEAST(discount, c.max_discount);
    END IF;
  END IF;
  discount := LEAST(ROUND(discount), _order_total);

  RETURN jsonb_build_object(
    'valid', true,
    'coupon_id', c.id,
    'code', c.code,
    'title', c.title,
    'discount', discount
  );
END;
$$;
REVOKE ALL ON FUNCTION public.validate_coupon(TEXT, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.validate_coupon(TEXT, NUMERIC) TO authenticated;

INSERT INTO public.coupons (code, title, description, discount_type, discount_value, max_discount, min_order, usage_limit_per_user, premium_only) VALUES
('WELCOME50', '₹50 off your order', 'Flat ₹50 off on orders above ₹199', 'flat', 50, NULL, 199, 1, false),
('SAVE20', '20% off up to ₹100', 'Get 20% off on orders above ₹299', 'percent', 20, 100, 299, 3, false),
('FEAST150', '₹150 off big orders', 'Flat ₹150 off on orders above ₹799', 'flat', 150, NULL, 799, 2, false),
('PREMIUM30', '30% off for Premium', 'Premium members get 30% off up to ₹200', 'percent', 30, 200, 249, 5, true),
('TRYNEW', '₹75 off', 'Flat ₹75 off on orders above ₹349', 'flat', 75, NULL, 349, 1, false);