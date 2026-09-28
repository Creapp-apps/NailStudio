# Project Findings & Domain Research: Nail Studio Suite

## 1. Domain Discoveries (Nail Studio vs General Salon vs Dental-IA)
- **Nail-Time Multiplier Logic:** Unlike dental appointments that have standard block procedures, nail appointments require additive durations:
  - Base Service: 45 min to 90 min (Semipermanente, Kapping Gel/Acrigel, Soft Gel, Esculpidas).
  - Removal / Service: +15 min (own salon) vs +30 min (other salon / unknown acrylic/gel).
  - Nail Art Complexity: Nivel 1 (+15m), Nivel 2 (+30m), Nivel 3 (+45m a 60m).
  - Dynamic slot finder must sum these durations before querying available slots.
- **Client Retention Cycle:** Nail growth makes 18-21 days the golden window for maintenance. Beyond 25 days, risk of lifting, fungus, or natural nail breakage increases. Automatic triggers on day 18 are essential for high customer lifetime value (LTV).
- **Client Ficha Técnica Ungueal:** Crucial health metrics: nail plate sensitivity, history of onychophagy (bitten nails), allergies to HEMA / acrylates, UV lamp heat spike tolerance, and visual photo logs (before/after).
- **Gamification & Referrals:** "Nail Points" wallet + referral code for discounts on refills/services and nail art rewards.
- **AI Receptionist (Nail-Bot):** Guidance bot on the web that qualifies client requests (e.g. recommending Kapping for weak nails or calculating nail art tier) and hands off to booking.

## 2. Technical Stack & Architectural Decisions
- **Frontend / PWA:** Vite + React 19 + TypeScript + Vanilla CSS / modern CSS tokens for rich luxury aesthetics, fast mobile-first rendering, and zero bloat.
- **Aesthetic Stance:** *Haute Editorial & Warm Nude Minimalism*
  - Palette: Warm porcelain, cashmere nude, blush terracotta, deep espresso contrast, gold/champagne accents.
  - Typography: Playfair Display / Syne for editorial display headers, Plus Jakarta Sans for clean readable UI.
  - Differentiation Anchor: Interactive "Nail Canvas & Time Estimator" + PWA Wallet card with live shine/foil tilt effect.
- **Data & Mock Store:** Fully typed reactive state with LocalStorage / IndexedDB sync for local standalone reliability and zero-config deployment.
