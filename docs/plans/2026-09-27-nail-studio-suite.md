# Nail Studio Suite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a specialized, luxury-aesthetic Web + Client PWA + Backoffice suite for Nail Studios featuring an additive duration booking system (Service + Removal + Nail Art Tier), AI Receptionist Nail-Bot, loyalty points wallet, referral program, multi-technician agenda, and nail health CRM.

**Architecture:** A unified modern React TypeScript SPA/PWA structured into two primary environments: a client-facing booking & PWA loyalty portal and a studio administration backoffice. Both interface with a reactive data store that simulates a real-time backend with full schema validation, photo attachments, dynamic time-slot calculation, and WhatsApp notification templates.

**Tech Stack:** React 19, TypeScript, Vite, Modern Vanilla CSS tokens with CSS variables (Haute Editorial & Warm Nude Minimalism), Lucide Icons, Canvas/Web APIs for interactive nail cards and moodboards.

---

## Design Direction & DFII Evaluation (frontend-design skill)

- **Aesthetic Direction:** *Haute Editorial & Warm Nude Minimalism*
- **Inspiration:** High-fashion luxury beauty lookbooks, Chanel Le Vernis aesthetic, Japanese & Korean structured manicurist studios.
- **Color Story:**
  - Background: `--bg-primary: #FAF7F5` (warm porcelain), `--bg-surface: #FFFFFF`, `--bg-card: #F4EFEB`
  - Accent / Brand: `--brand-terracotta: #A66352`, `--brand-rose-gold: #C89688`, `--brand-gold: #D4AF37`
  - Deep Neutrals: `--text-primary: #211915` (espresso roast), `--text-muted: #7A6F68`
  - Badges & Status: Champagne, Sage green, Soft blush
- **Typography:**
  - Display / Headings: `Playfair Display` or `Syne` (high-fashion editorial elegance)
  - Interface / Body: `Plus Jakarta Sans` (ultra-clean, highly legible UI)
- **DFII Evaluation:**
  - Aesthetic Impact: 5/5
  - Context Fit: 5/5
  - Implementation Feasibility: 4/5
  - Performance Safety: 5/5
  - Consistency Risk: 1/5
  - **DFII Score:** (5 + 5 + 4 + 5) - 1 = **18/15 (Maximum Excellence)**
- **Differentiation Anchor:**
  - *Dynamic Nail-Time Estimator:* Live visual time breakdown card showing how base technique + removal + nail art tier compose the exact minutes needed.
  - *Nail Points PWA Card:* Metallic/iridescent shimmer card with QR code, live tier status, and referral balance.

---

### Task 1: Project Scaffolding & Design Token System

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/App.tsx`
- Create: `src/main.tsx`

**Step 1: Write package.json and config files**
Initialize Vite React TypeScript project with Lucide React and necessary tooling.

**Step 2: Define Design Tokens in `src/index.css`**
Set up CSS custom properties for typography, elevation, warm porcelain background, luxury cards, and responsive container layouts.

**Step 3: Test build and dev server startup**
Run: `npm run build` or `npm run dev` to verify clean build without typescript or bundling errors.

---

### Task 2: Data Models & Mock Storage Engine

**Files:**
- Create: `src/types/nailStudio.ts`
- Create: `src/services/mockData.ts`
- Create: `src/services/storage.ts`

**Step 1: Define TypeScript Domain Interfaces**
- `NailService`: ID, title, category (`semipermanente`, `kapping`, `soft_gel`, `esculpidas`), basePrice, baseDurationMin, description, imageUrl.
- `RemovalOption`: ID, type (`none`, `own_studio`, `other_salon`), additionalPrice, additionalDurationMin.
- `NailArtTier`: ID, name, tierLevel (0 to 3), examples, price, additionalDurationMin.
- `NailTechnician`: ID, name, avatar, specialties, workDays, shiftHours, commissionRate.
- `Appointment`: ID, clientName, clientPhone, clientEmail, techId, serviceId, removalId, nailArtTierId, totalDurationMin, totalPrice, scheduledAt, status (`pending_deposit`, `confirmed`, `in_progress`, `completed`, `no_show`).
- `ClientProfile`: ID, name, phone, email, nailPlateCondition, allergiesHema, favoriteColors, notes, pointsBalance, referralCode, referredBy, setsHistory.
- `SupplyItem`: ID, name, category, currentStock, minStockAlert, unit.

**Step 2: Seed Realistic Studio Data**
Provide 6 distinct services, 3 technicians, 8 realistic client profiles with nail histories, 4 sample appointments, and 5 inventory items.

**Step 3: Implement Reactive Local Storage Provider**
Create an event-driven storage wrapper that syncs state across tabs and windows, automatically updating both the client portal and the backoffice.

---

### Task 3: Interactive Booking Flow with Nail-Time Engine

**Files:**
- Create: `src/components/booking/NailTimeCalculator.tsx`
- Create: `src/components/booking/ServiceSelector.tsx`
- Create: `src/components/booking/RemovalSelector.tsx`
- Create: `src/components/booking/NailArtSelector.tsx`
- Create: `src/components/booking/TechnicianDateTimeStep.tsx`
- Create: `src/components/booking/BookingModal.tsx`

**Step 1: Build the Additive Nail-Time Calculator**
Calculate `totalDuration = service.baseDuration + removal.duration + nailArt.duration`. Display a live visual progress bar showing slot requirement (e.g. 1h 45min).

**Step 2: Build Step-by-Step Luxury Booking Stepper**
- Step 1: Base service card selection with high-resolution imagery.
- Step 2: Removal toggle with clear explanations on why foreign acrylics/gels need more time.
- Step 3: Nail art tiers with visual previews (French, Chrome, Hand-painted, 3D Charms).
- Step 4: Technician and calendar time-slot picker (only slots that accommodate the total duration).
- Step 5: Client details & confirmation screen with WhatsApp copy-link option.

**Step 3: Verification**
Complete a test booking and ensure the total duration correctly adjusts availability for subsequent bookings.

---

### Task 4: AI Receptionist Widget ("Nail-Bot")

**Files:**
- Create: `src/components/ai/NailBotModal.tsx`
- Create: `src/services/nailBotEngine.ts`

**Step 1: Implement Domain Knowledge Engine**
Nail-Bot understands nail queries:
- Recommends Kapping for brittle/short nails.
- Recommends Soft Gel or Esculpidas for length extensions.
- Explains HEMA-free alternatives and aftercare (cuticle oil, avoiding hot water for 2h).
- Calculates approximate nail art tier and offers a direct *"Reservar este set"* button that pre-fills the booking modal.

**Step 2: Build the High-Craft Chat UI**
Floating luxury gold badge, smooth entry animation, quick suggestion chips ("¿Qué servicio me conviene?", "¿Cuánto dura el Kapping?", "¿Cómo cotizo Nail Art?").

---

### Task 5: Client PWA Portal (Nail Points & Referral Hub)

**Files:**
- Create: `src/components/client/ClientPortal.tsx`
- Create: `src/components/client/NailPointsCard.tsx`
- Create: `src/components/client/ReferralProgramModal.tsx`
- Create: `src/components/client/ClientSetsGallery.tsx`

**Step 1: Build the Virtual Nail-Points Card**
Metallic luxury design with dynamic tier (Gold / Platinum), current point balance, points-to-currency value, and redemption catalog (Free Nail Art, Hand Spa, 20% OFF next refill).

**Step 2: Referral Engine**
Unique shareable link and code: "Compartí $3.000 de regalo para tu amiga en su primer set y sumá 500 Nail Points para tu próximo service".

**Step 3: Sets Gallery & Moodboard Uploader**
Visual timeline of client's past visits with before/after photos and an upload section for Pinterest inspirations.

---

### Task 6: Studio Backoffice (Agenda, CRM & Management)

**Files:**
- Create: `src/components/backoffice/AdminLayout.tsx`
- Create: `src/components/backoffice/MultiTechCalendar.tsx`
- Create: `src/components/backoffice/ClientCRM.tsx`
- Create: `src/components/backoffice/InventoryManager.tsx`
- Create: `src/components/backoffice/FinancialSummary.tsx`

**Step 1: Multi-Technician Daily Agenda Calendar**
Column-per-manicurist grid with color-coded status pills (`En mesa`, `Confirmado`, `Finalizado`). Drag-or-click status update.

**Step 2: Nail Health Record CRM (Ficha Técnica)**
Detailed card per client:
- Nail plate condition (healthy, thin, onychophagy, ridges)
- Allergies / Sensitivities badge (HEMA allergy alert)
- Favorite color swatches & technician notes
- Before / After photo gallery

**Step 3: Inventory & Critical Supplies**
Monitor bases, top coats, monomer, disposable files, and popular polish codes with low-stock alerts.

**Step 4: Commissions & Daily Cash Closure**
Calculate technician payouts by commission rate, daily earnings by payment method (Cash, Transfer, Card), and average ticket.

---

### Task 7: Automated Messaging & Retention System (Day 18 Re-engagement)

**Files:**
- Create: `src/components/backoffice/AutomationsHub.tsx`
- Create: `src/services/notificationService.ts`

**Step 1: Automated WhatsApp Message Generator**
Generate click-to-WhatsApp links for:
- Immediate confirmation with Google Calendar link.
- 24h pre-appointment confirmation request.
- Day 18 maintenance alert: *"¡Hola [Nombre]! Pasaron 18 días de tu set con [Tech]. Es momento de tu service para mantener tus uñas sanas y perfectas."*

---

### Task 8: End-to-End Verification & Polish

**Files:**
- Audit: All components, accessibility, mobile responsiveness.
- Run: `npm run build` to verify type safety and bundle size.
- Test: Complete end-to-end client journey and backoffice workflow.
