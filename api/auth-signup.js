import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aloqecmxdshpoidhuysx.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsb3FlY214ZHNocG9pZGh1eXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU1MjcwNiwiZXhwIjoyMTA2MTI4NzA2fQ.hLY8L5PNWchsd-rEl0LNSV9jF-o3NV9aMFYoDiAOGZM';

  try {
    const { email, password, name, phone, role = 'client' } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = (phone || '').trim();

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 1. Create or get user in Supabase Auth with auto-confirmed email
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: role,
        full_name: cleanName,
        phone: cleanPhone
      }
    });

    if (createError) {
      // If user already exists, return friendly message
      if (createError.message.includes('already registered') || createError.message.includes('already exists')) {
        return res.status(409).json({ error: 'Ya existe una cuenta registrada con este correo electrónico.' });
      }
      return res.status(400).json({ error: createError.message });
    }

    const userId = userData.user.id;
    const initials = cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 4);
    const referralCode = `${initials}-BELCALIS`;

    // 2. Ensure profile exists in client_profiles with clinical data
    const newProfile = {
      id: userId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      nail_plate_condition: req.body.nail_plate_condition || 'healthy',
      allergies_hema: !!req.body.allergies_hema,
      lamp_heat_sensitivity: req.body.lamp_heat_sensitivity || 'low',
      favorite_colors: [],
      technician_notes: req.body.technician_notes || 'Alta autorizada por personal de Belcalis Nails.',
      points_balance: 200,
      tier: 'Silver',
      referral_code: referralCode,
      total_visits: 0,
      last_visit_date: new Date().toISOString().split('T')[0]
    };

    const { error: profileError } = await adminClient
      .from('client_profiles')
      .upsert(newProfile, { onConflict: 'id' });

    if (profileError) {
      console.warn('[auth-signup] Profile upsert warning:', profileError);
    }

    // 3. Trigger Welcome Email dispatch non-blockingly
    try {
      const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'www.belcalisnails.com.ar';
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const baseUrl = `${protocol}://${host}`;

      // Call our send-welcome endpoint with clientPassword so the client receives her login key
      fetch(`${baseUrl}/api/send-welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: cleanName,
          clientEmail: cleanEmail,
          clientPhone: cleanPhone,
          clientPassword: password,
          pointsBalance: 200,
          referralCode: referralCode
        })
      }).catch(err => console.warn('[auth-signup] Non-blocking welcome email error:', err));
    } catch (e) {
      // Continue even if email dispatch fails
    }

    return res.status(201).json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        role: role,
        name: cleanName,
        phone: cleanPhone,
        points: 200,
        referralCode: referralCode
      }
    });

  } catch (error) {
    console.error('[auth-signup] Fatal error:', error);
    return res.status(500).json({ error: 'Error del servidor al registrar clienta', details: error.message });
  }
}
