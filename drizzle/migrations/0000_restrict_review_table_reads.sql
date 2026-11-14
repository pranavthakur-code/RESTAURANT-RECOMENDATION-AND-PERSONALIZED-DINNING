DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.reviews;
CREATE POLICY "Users can view their own review" ON public.reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
REVOKE SELECT ON TABLE public.reviews FROM anon;
GRANT SELECT ON TABLE public.reviews TO authenticated;
CREATE OR REPLACE VIEW public.public_reviews WITH (security_barrier = true, security_invoker = false) AS
  SELECT id, restaurant_id, rating, comment, user_name, created_at
  FROM public.reviews;
GRANT SELECT ON public.public_reviews TO anon, authenticated;