import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://aloqecmxdshpoidhuysx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsb3FlY214ZHNocG9pZGh1eXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NTI3MDYsImV4cCI6MjEwNjEyODcwNn0.WiyUVFPL1IanfkYLAUo4SajGYrPWMMG3bLfmTI2cH0Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
