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
- **Aesthetic Direction Evolution (Reference: Aurora Beauty / Haute Editorial Glam):**
  - **Style Stance:** *Ethereal Haute Glam & Rose Quartz Editorial* (inspirado en la referencia "Aurora Beauty by Drea").
  - **Color Story:**
    - Backgrounds: Aura suave en cuarzo rosa y porcelana traslúcida (`#FFF4F7`, `#FDF7F9`, `#FFF8FA`).
    - Acentos Glam: Rosa satinado chic (`#DE738F`), destellos champagne y oro perlado (`#D4AF37`, `#F2D5DE`), y espresso editorial profundo (`#1C1115`) para contraste tipográfico de revista.
    - Glassmorphism & Glow: Sombras difusas rosadas (`rgba(222, 115, 143, 0.18)`), bordes satinados y micro-resplandores (shiny finish).
  - **Tipografía Editorial:**
    - Display / Headings: `Italiana` y `Cormorant Garamond` (letras de alta costura con trazos hairline ultradelgados y mayúsculas editoriales con espaciado amplio).
    - Subtítulos & Enlaces: Mayúsculas estilizadas con viñetas centrales (`• Home • Servicios • Nail Art •`).
    - Body: `Plus Jakarta Sans` en peso regular y semibold para máxima legibilidad.
  - **Elementos Diferenciadores Clave de la Referencia:**
    - Hero asimétrico con mano de alta costura entrando con sombras suaves y uñas glitter/joya.
    - Cuadrícula de 4 tarjetas "Why Choose Us?" con sombras rosadas difusas y líneas de acento.
    - Declaración editorial de gran escala ("Statement Banner") con texto en capas de contraste y opacidad reducida.
    - Botón flotante directo de WhatsApp en verde esmeralda con micro-interacción.
- **Data & Mock Store:** Fully typed reactive state with LocalStorage / IndexedDB sync for local standalone reliability and zero-config deployment.

