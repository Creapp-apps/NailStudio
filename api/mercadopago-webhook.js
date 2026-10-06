import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function getEnvToken() {
  if (process.env.MERCADOPAGO_ACCESS_TOKEN) return process.env.MERCADOPAGO_ACCESS_TOKEN;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/MERCADOPAGO_ACCESS_TOKEN=([^\r\n]+)/);
      if (match) return match[1].trim();
    }
  } catch {}
  return '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Webhook active');
  }

  try {
    const { type, action, data } = req.body || {};
    const paymentId = data?.id || req.query?.['data.id'] || req.query?.id;

    if (!paymentId || (type !== 'payment' && action !== 'payment.created' && action !== 'payment.updated')) {
      return res.status(200).json({ received: true });
    }

    const mpAccessToken = (getEnvToken() || '').trim();
    if (!mpAccessToken) {
      console.warn('Webhook received but MERCADOPAGO_ACCESS_TOKEN is not configured.');
      return res.status(200).json({ received: true });
    }

    // Verify payment status with Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`
      }
    });

    if (!mpRes.ok) {
      return res.status(200).json({ received: true, error: 'Could not fetch payment' });
    }

    const paymentInfo = await mpRes.json();
    const externalReference = paymentInfo.external_reference; // contains appointmentId
    const status = paymentInfo.status; // approved, rejected, pending, etc.

    if (status === 'approved' && externalReference) {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aloqecmxdshpoidhuysx.supabase.co';
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsb3FlY214ZHNocG9pZGh1eXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU1MjcwNiwiZXhwIjoyMTA2MTI4NzA2fQ.hLY8L5PNWchsd-rEl0LNSV9jF-o3NV9aMFYoDiAOGZM';

      const supabase = createClient(supabaseUrl, serviceRoleKey);

      await supabase
        .from('appointments')
        .update({
          deposit_paid: true,
          status: 'confirmed',
          notes: `Acreditado vía Mercado Pago (ID: ${paymentId})`
        })
        .eq('id', externalReference);

      console.log(`Appointment ${externalReference} confirmed via Mercado Pago payment ${paymentId}`);
    }

    return res.status(200).json({ received: true, status });
  } catch (error) {
    console.error('Error handling MP webhook:', error);
    return res.status(200).json({ received: true, error: error.message });
  }
}
