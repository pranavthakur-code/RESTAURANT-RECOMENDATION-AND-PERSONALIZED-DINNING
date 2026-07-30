## What to add

Three high-impact features that build on what MealMatch already has (orders, bookings, loyalty, premium).

### 1. Ratings & Reviews
- After an order is delivered (or a booking completes), users can leave a 1–5 star rating plus a short comment.
- Reviews shown on the restaurant detail page with an average score and count.
- Users can edit or delete only their own review; one review per restaurant per user.
- Award 10 loyalty points for the first review on an order (anti-spam: only once per order).

### 2. Favourites & One-Tap Reorder
- Heart icon on restaurant cards and the detail page to save/unsave a favourite.
- New "Favourites" tab on the My Account page listing saved restaurants.
- "Reorder" button on any past order in My Account / Orders that refills the cart with the same items (validates items still exist and prices are current, warns if anything changed).

### 3. Offers & Coupon Codes
- Promo code field in the cart checkout step.
- Supports flat (₹X off) and percentage (X% off, with max cap) coupons, minimum order value, expiry date, usage limit per user, and a premium-only flag.
- Discount shown as a line item in the order summary; loyalty points still calculated on the amount actually paid.
- A small "Offers" strip on the Order Food page showing currently active public coupons.

## Technical details

**Database (Lovable Cloud):**
- `reviews` — user_id, restaurant_id, order_id (nullable), rating (1–5 check), comment, timestamps; unique (user_id, restaurant_id). RLS: anyone can read, only owner can insert/update/delete their own. Explicit GRANTs for `anon` (select) and `authenticated`.
- `favorites` — user_id, restaurant_id, unique pair. RLS: owner-only read/insert/delete.
- `coupons` — code (unique), type (flat/percent), value, max_discount, min_order, valid_from/valid_to, usage_limit_per_user, premium_only, active. RLS: authenticated read of active coupons only; no client writes.
- `coupon_redemptions` — user_id, coupon_id, order_id, discount_amount. RLS: owner read, owner insert.
- Coupon validation done in a `SECURITY DEFINER` function so the discount can't be forged from the client; the order insert stores the validated discount.

**Frontend:**
- `ReviewSection.tsx` + `ReviewDialog.tsx` on `RestaurantDetail`; average rating merged into restaurant card display.
- Favourite toggle added to `RestaurantCard` and `RestaurantDetail`; new Favourites tab in `Account.tsx`.
- `CartDrawer` checkout step gains a coupon input calling the validation function; totals and loyalty maths updated to use the discounted amount.
- Reorder handler in `Account.tsx` / `Orders.tsx` that repopulates `CartContext` (respecting the single-restaurant cart rule).

Existing design system (amber/charcoal, Outfit + Space Grotesk) and responsiveness maintained throughout. No changes to the DineOut page flow.
