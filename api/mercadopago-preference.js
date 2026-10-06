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
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      appointmentId,
      title = 'Seña Turno • Belcalis Nails Studio',
      amount = 5000,
      client = {},
      origin = 'http://localhost:5175',
      accessToken,
      sandboxMode = false
    } = req.body || {};

    const mpAccessToken = (accessToken || getEnvToken() || '').trim();

    if (!mpAccessToken) {
      return res.status(400).json({
        error: 'No se ha configurado el Access Token de Mercado Pago. Configúralo en el panel de Integraciones o en el archivo .env.'
      });
    }

    const cleanAmount = Number(amount);
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      return res.status(400).json({ error: 'Monto de seña inválido.' });
    }

    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

    // Build standard Mercado Pago Preference object
    const preferenceData = {
      items: [
        {
          id: appointmentId || `apt-${Date.now()}`,
          title: String(title).slice(0, 128),
          description: 'Seña de reserva de turno. Deducible del total en el salón.',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: cleanAmount
        }
      ],
      payer: {
        name: client.name || 'Clienta Atelier',
        email: client.email || 'contacto@belcalisnails.com',
        phone: {
          number: client.phone ? String(client.phone).replace(/\D/g, '').slice(-10) : '1100000000'
        }
      },
      back_urls: {
        success: `${origin}/?booking_status=approved&apt_id=${appointmentId || ''}`,
        pending: `${origin}/?booking_status=pending&apt_id=${appointmentId || ''}`,
        failure: `${origin}/?booking_status=failure&apt_id=${appointmentId || ''}`
      },
      external_reference: appointmentId || `apt-${Date.now()}`,
      statement_descriptor: 'BELCALIS NAILS',
      binary_mode: true
    };

    // Mercado Pago requires HTTPS and public domain for auto_return and notification_url
    if (!isLocalhost && origin.startsWith('https://')) {
      preferenceData.auto_return = 'approved';
      preferenceData.notification_url = `${origin}/api/mercadopago-webhook`;
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpAccessToken}`
      },
      body: JSON.stringify(preferenceData)
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Mercado Pago API Error:', data);
      return res.status(mpResponse.status).json({
        error: data.message || data.error || 'Error al comunicarse con Mercado Pago.',
        details: data
      });
    }

    return res.status(200).json({
      preferenceId: data.id,
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point
    });
  } catch (error) {
    console.error('Server error creating MP preference:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al procesar la seña de Mercado Pago.',
      message: error?.message || String(error)
    });
  }
}
