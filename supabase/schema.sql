-- ==============================================================================
-- ATELIER NAILS & CO. - SUPABASE DATABASE SCHEMA
-- Specialized Schema for Nail Studio Suite
-- ==============================================================================

-- 1. Services Table
CREATE TABLE IF NOT EXISTS public.nail_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'semipermanente', 'kapping', 'soft_gel', 'esculpidas'
  base_price NUMERIC NOT NULL,
  base_duration_min INTEGER NOT NULL,
  description TEXT,
  badge TEXT,
  image_url TEXT,
  recommended_for TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Removal Options
CREATE TABLE IF NOT EXISTS public.removal_options (
  id TEXT PRIMARY KEY, -- 'none', 'own_studio', 'other_salon'
  label TEXT NOT NULL,
  description TEXT,
  additional_price NUMERIC DEFAULT 0,
  additional_duration_min INTEGER DEFAULT 0
);

-- 3. Nail Art Tiers
CREATE TABLE IF NOT EXISTS public.nail_art_tiers (
  id TEXT PRIMARY KEY,
  tier_level INTEGER NOT NULL, -- 0, 1, 2, 3
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  additional_duration_min INTEGER DEFAULT 0,
  description TEXT,
  examples TEXT[],
  sample_image TEXT
);

-- 4. Technicians
CREATE TABLE IF NOT EXISTS public.nail_technicians (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  specialties TEXT[],
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  commission_rate NUMERIC DEFAULT 0.50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Client Profiles & Nail Health Record
CREATE TABLE IF NOT EXISTS public.client_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  nail_plate_condition TEXT DEFAULT 'healthy', -- 'healthy', 'thin_weak', 'onychophagy', 'sensitive_lamp'
  allergies_hema BOOLEAN DEFAULT FALSE,
  lamp_heat_sensitivity TEXT DEFAULT 'low',
  favorite_colors TEXT[],
  technician_notes TEXT,
  points_balance INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'Silver',
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  total_visits INTEGER DEFAULT 0,
  last_visit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  tech_id TEXT REFERENCES public.nail_technicians(id),
  service_id TEXT REFERENCES public.nail_services(id),
  removal_id TEXT REFERENCES public.removal_options(id),
  nail_art_tier_id TEXT REFERENCES public.nail_art_tiers(id),
  total_duration_min INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  deposit_amount NUMERIC DEFAULT 5000,
  deposit_paid BOOLEAN DEFAULT FALSE,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending_deposit', -- 'pending_deposit', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Past Set Photo Log
CREATE TABLE IF NOT EXISTS public.past_sets (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  service_name TEXT NOT NULL,
  nail_art_tier_name TEXT NOT NULL,
  tech_name TEXT NOT NULL,
  photo_url TEXT,
  notes TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Supplies & Inventory
CREATE TABLE IF NOT EXISTS public.supplies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'quimicos', 'geles_bases', 'acrilicos', 'descartables', 'herramientas'
  current_stock NUMERIC NOT NULL,
  min_stock_alert NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  brand TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.nail_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.removal_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_art_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog
CREATE POLICY "Public read services" ON public.nail_services FOR SELECT USING (true);
CREATE POLICY "Public read removals" ON public.removal_options FOR SELECT USING (true);
CREATE POLICY "Public read nail art" ON public.nail_art_tiers FOR SELECT USING (true);
CREATE POLICY "Public read techs" ON public.nail_technicians FOR SELECT USING (true);
CREATE POLICY "Public read and write appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Public read and write clients" ON public.client_profiles FOR ALL USING (true);
CREATE POLICY "Public read and write past sets" ON public.past_sets FOR ALL USING (true);
CREATE POLICY "Public read and write supplies" ON public.supplies FOR ALL USING (true);
