
-- 1) Remove orders from Realtime publication to prevent cross-user subscription leakage
ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;

-- 2) Restrict redemption privilege abuse: remove DELETE policy
DROP POLICY IF EXISTS "Users can delete their own redemptions" ON public.redemptions;

-- 3) Prevent profile privilege escalation via trigger
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Preserve privileged fields; only service_role/triggers may change them
  NEW.is_premium := OLD.is_premium;
  NEW.premium_since := OLD.premium_since;
  NEW.loyalty_points := OLD.loyalty_points;
  NEW.total_points_earned := OLD.total_points_earned;
  NEW.total_bookings := OLD.total_bookings;
  NEW.total_orders := OLD.total_orders;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_privilege_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_privilege_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
WHEN (current_setting('role', true) <> 'service_role')
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 4) Lock down SECURITY DEFINER functions: revoke execute from anon/authenticated
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_profile_privilege_escalation() FROM PUBLIC, anon, authenticated;
