/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// vite.config.ts mapea estas constantes desde VITE_SUPABASE_* (local) o SUPABASE_* (Vercel).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[Supabase] Faltan variables de entorno. Definí SUPABASE_URL y SUPABASE_ANON_KEY (o VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) en Vercel, o en tu .env local.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
