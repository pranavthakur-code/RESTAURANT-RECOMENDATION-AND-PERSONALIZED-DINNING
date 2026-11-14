# MealMatch location, dish photos, and rush tracking

## What will change
- Make delivery location selection more dependable: use the device's precise location without silently substituting Delhi, improve address search through the secure Places service, and keep the map pin/address in sync.
- Correct existing menu photo data so dish names display relevant food images instead of repeated or unrelated pictures.
- Clarify and enhance delivery progress as a rush tracker on both My Orders and My Account, with a current stage and estimated time remaining.

## Technical approach
- Update the existing location component and its Google Maps edge function; keep Places requests server-side and validate the signed-in user and bounded inputs.
- Update `menu_items_db.image_url` values using name-based dish matching; no schema changes.
- Update the existing order-tracking displays consistently, without changing checkout, loyalty, or restaurant navigation.
- Verify the menu-image data, run relevant tests, and check the preview/build output. Google Maps behavior cannot be validated in this sandbox, so it will need confirmation on the published authorized domain.
