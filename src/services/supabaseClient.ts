/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[Supabase] Faltan variables de entorno. Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env (local) y en las Environment Variables de Vercel.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
