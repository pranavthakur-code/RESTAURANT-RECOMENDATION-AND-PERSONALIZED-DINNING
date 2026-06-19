
-- Explicit restrictive DELETE deny on bookings and orders
CREATE POLICY "No deletes on bookings"
ON public.bookings FOR DELETE
TO authenticated, anon
USING (false);

CREATE POLICY "No deletes on orders"
ON public.orders FOR DELETE
TO authenticated, anon
USING (false);

-- Redemption validation: enforce sufficient points & atomic deduction
CREATE OR REPLACE FUNCTION public.validate_and_apply_redemption()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points INTEGER;
BEGIN
  IF NEW.user_id IS NULL OR NEW.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Invalid user for redemption';
  END IF;

  IF NEW.points_spent IS NULL OR NEW.points_spent <= 0 THEN
    RAISE EXCEPTION 'points_spent must be positive';
  END IF;

  SELECT loyalty_points INTO current_points
  FROM public.profiles
  WHERE user_id = NEW.user_id
  FOR UPDATE;

  IF current_points IS NULL OR current_points < NEW.points_spent THEN
    RAISE EXCEPTION 'Insufficient loyalty points';
  END IF;

  UPDATE public.profiles
  SET loyalty_points = loyalty_points - NEW.points_spent
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS redemptions_validate_points ON public.redemptions;
CREATE TRIGGER redemptions_validate_points
BEFORE INSERT ON public.redemptions
FOR EACH ROW EXECUTE FUNCTION public.validate_and_apply_redemption();
