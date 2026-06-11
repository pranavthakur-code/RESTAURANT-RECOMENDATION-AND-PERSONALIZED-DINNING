
# Sync Presentation with Current Site

The uploaded `MealMatch_Presentation_v2 (1).pptx` is significantly behind the live app. It still lists HTML/CSS/JS as the stack and only mentions browsing, recommendations and loyalty. The site has grown well past that. I'll update the **PPT** (not the site) so the deck reflects what's actually built.

## Gap analysis (in site, missing from PPT)

**Tech stack** — PPT says HTML5 / CSS3 / JS / generic DB. Actual: React 18 + Vite + TypeScript, Tailwind, shadcn/ui, Framer Motion, Lovable Cloud (Supabase: Postgres + Auth + RLS + Edge Functions), Google Gemini via Lovable AI Gateway.

**Features missing from PPT:**
- Food ordering: cart, checkout, order history, single-restaurant cart constraint
- DineOut table booking with date/time/guests
- Veg / Non-Veg classification with green/red indicators and filters
- Premium membership tier (2x points, premium-only restaurants, Crown badge)
- Loyalty system specifics: 50 pts signup, 1 pt / ₹20 spent, auto-deduct on cancel, redemptions
- Live Crowd Predictor — weekday vs weekend, Low/Medium/High, occupancy % per time slot, auto-refresh every 2 min + manual "Refresh now"
- Modern location bar: "Use My Current Location" GPS, manual edit, nearby branches, distance + ETA
- AI ChatBot (Gemini Edge Function) for recommendations
- Real Delhi NCR restaurant dataset (`restaurants_db`, `menu_items_db`) with rating, address, pricing, known-for
- Auth (email + Google), profiles, RLS-secured user data
- Security hardening (privilege-escalation trigger, realtime lockdown, HIBP password check)

## Plan: rewrite the deck

Regenerate the .pptx with `pptxgenjs` using the existing warm amber + charcoal brand (Outfit / Space Grotesk). Keep team / guide / reviewer info from slide 1. New slide list:

1. **Title** — keep existing names, university, guide, reviewer
2. **About** — updated tagline: smart multi-restaurant ordering + dining + AI recs
3. **Problem Statement** — keep, lightly tightened
4. **Objectives** — add: ordering, dineout booking, veg/non-veg trust, live crowd insight, premium tier
5. **Technology Stack (rewritten)** — React + Vite + TS, Tailwind + shadcn, Framer Motion, Lovable Cloud (Postgres + Auth + Edge Functions + RLS), Google Gemini via Lovable AI Gateway
6. **System Architecture (rewritten)** — Client (React SPA) → Lovable Cloud (Auth, Postgres + RLS, Edge Functions) → Gemini AI; data flow diagram
7. **Key Modules (expanded to 8 cards across 2 slides)**
   - 7a: Restaurant Discovery · Veg/Non-Veg Filters · Ordering & Cart · Order History
   - 7b: DineOut Booking · Loyalty & Premium · Live Crowd Predictor · AI ChatBot + Smart Location
8. **Feature Spotlight — Live Crowd Predictor** — weekday/weekend split, time-slot occupancy bars, Low/Med/High, auto-refresh + manual refresh
9. **Feature Spotlight — Smart Location & Ordering** — GPS detect, nearby branches, ETA; single-restaurant cart, UPI/PhonePe/Paytm
10. **Loyalty & Premium** — 50 pt signup, 1 pt / ₹20, cancel auto-deduct, 2x for premium, premium-only restaurants
11. **Methodology** — Collect → Match → Filter → Display, plus AI assist layer
12. **Results & Testing** — modules covered, crowd predictor accuracy, security scan = 0 open issues
13. **Security & Data Integrity** — RLS on all user tables, privilege-escalation trigger, realtime lockdown, HIBP
14. **Future Scope** — keep ML / real-time / payments / mobile / smart history; add: multi-city expansion, group ordering, AR menu

## Deliverable

A new file at `/mnt/documents/MealMatch_Presentation_v3.pptx`, rendered via pptxgenjs, then QA'd by converting to images and visually inspecting every slide for overflow / contrast / overlap before handing over. Original site code is **not** changed.

## Technical notes

- pptxgenjs, 16:9, brand palette (amber `#D97706` primary, charcoal `#1F2937`, cream `#FDF8F3`, success green, destructive red for veg/non-veg chips).
- Outfit for headings, Space Grotesk for body (fallback Calibri/Arial in PPT).
- All images embedded as base64 (none needed beyond simple shapes/icons drawn with pptxgenjs primitives — no external image deps).
- QA loop: `soffice --convert-to pdf` → `pdftoppm` → read every slide image → fix → re-render until clean.
