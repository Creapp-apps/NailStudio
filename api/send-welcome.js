import nodemailer from 'nodemailer';

// Helper to fetch tenant branding from Supabase or fallback
async function getTenantBranding() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aloqecmxdshpoidhuysx.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsb3FlY214ZHNocG9pZGh1eXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NTI3MDYsImV4cCI6MjEwNjEyODcwNn0.WiyUVFPL1IanfkYLAUo4SajGYrPWMMG3bLfmTI2cH0Q';

  const defaultBranding = {
    brandName: 'Belcalis Nails',
    brandTagline: 'HAUTE MANICURE & ESTUDIO DE ARTE UNGUEAL',
    primaryColor: '#DE738F',
    secondaryColor: '#C89688',
    accentGold: '#D4AF37',
    address: 'Av. Alvear 1890, Recoleta, Buenos Aires',
    whatsapp: '+54 9 11 5821-3312',
    instagram: '@belcalisnails',
    customLogoUrl: ''
  };

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/client_profiles?id=eq.tenant_branding_config&select=technician_notes`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && data[0].technician_notes) {
        const config = JSON.parse(data[0].technician_notes);
        return {
          brandName: config.brandName || defaultBranding.brandName,
          brandTagline: config.brandTagline || defaultBranding.brandTagline,
          primaryColor: config.primaryColor || defaultBranding.primaryColor,
          secondaryColor: config.secondaryColor || defaultBranding.secondaryColor,
          accentGold: config.accentGold || defaultBranding.accentGold,
          address: config.address || defaultBranding.address,
          whatsapp: config.whatsapp || defaultBranding.whatsapp,
          instagram: config.instagram || defaultBranding.instagram,
          customLogoUrl: config.customLogoUrl || ''
        };
      }
    }
  } catch (err) {
    console.warn('[send-welcome] Fallback to default branding:', err);
  }

  return defaultBranding;
}

// Generate luxury responsive HTML template for Belcalis Nails
function generateWelcomeEmailHtml({ clientName, clientEmail, clientPassword, pointsBalance, referralCode, branding, portalUrl }) {
  const brandName = branding.brandName || 'Belcalis Nails';
  const tagline = branding.brandTagline || 'Haute Manicure & Arte Ungueal';
  const points = pointsBalance || 200;
  const refCode = referralCode || `${clientName.split(' ')[0].toUpperCase()}-BELCALIS`;
  const logoHtml = branding.customLogoUrl
    ? `<img src="${branding.customLogoUrl}" alt="${brandName}" style="max-height: 64px; max-width: 200px; display: inline-block; object-fit: contain;" />`
    : `<div style="font-family: 'Cinzel', 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; letter-spacing: 0.15em; color: #2E1E1E; text-transform: uppercase;">${brandName}</div>`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenida a ${brandName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FDF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #332729;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FDF8F5;
      padding: 40px 10px;
    }
    .main {
      background-color: #FFFFFF;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(222, 115, 143, 0.2);
      box-shadow: 0 10px 30px rgba(46, 30, 30, 0.06);
    }
    .hero-banner {
      background: linear-gradient(135deg, #FFF0F3 0%, #FBEBE8 100%);
      padding: 45px 30px 35px 30px;
      text-align: center;
      border-bottom: 1px solid rgba(222, 115, 143, 0.25);
    }
    .tagline {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #DE738F;
      font-weight: 700;
      margin-top: 8px;
    }
    .content-body {
      padding: 40px 35px;
    }
    .greeting {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      color: #2E1E1E;
      margin: 0 0 16px 0;
      font-weight: 700;
      line-height: 1.3;
    }
    .lead-text {
      font-size: 15px;
      line-height: 1.7;
      color: #5C4B4E;
      margin-bottom: 24px;
    }
    .gift-card {
      background: linear-gradient(135deg, #FFF7F9 0%, #FFF3EB 100%);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 12px;
      padding: 24px;
      margin: 25px 0;
      text-align: center;
    }
    .gift-badge {
      display: inline-block;
      background: rgba(212, 175, 55, 0.15);
      color: #997300;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 10px;
    }
    .gift-points {
      font-size: 38px;
      font-weight: 800;
      color: #2E1E1E;
      margin: 5px 0;
      letter-spacing: -0.02em;
    }
    .gift-desc {
      font-size: 13px;
      color: #6E5C5F;
      margin: 0;
    }
    .pass-details {
      background: #FDF8F6;
      border-radius: 10px;
      padding: 18px;
      margin-bottom: 25px;
      font-size: 13px;
    }
    .pass-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dashed rgba(222, 115, 143, 0.2);
    }
    .pass-row:last-child {
      border-bottom: none;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #DE738F 0%, #C89688 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 15px 36px;
      border-radius: 30px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 6px 18px rgba(222, 115, 143, 0.35);
      margin: 15px 0 25px 0;
    }
    .footer {
      background-color: #2E1E1E;
      color: #BDB3B5;
      padding: 30px 25px;
      text-align: center;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer a {
      color: #E8B4C0;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" role="presentation" cellpadding="0" cellspacing="0">
      <!-- HEADER BRAND -->
      <tr>
        <td class="hero-banner">
          ${logoHtml}
          <div class="tagline">${tagline}</div>
        </td>
      </tr>

      <!-- BODY CONTENT -->
      <tr>
        <td class="content-body">
          <h1 class="greeting">¡Bienvenida a ${brandName}, ${clientName}! ✨</h1>
          <p class="lead-text">
            Es un auténtico placer abrirte las puertas de nuestro atelier. Desde hoy formás parte de nuestro exclusivo <strong>Club Privilege</strong>, diseñado para premiar el cuidado y la elegancia de tus manos en cada service.
          </p>

          <!-- GIFT POINTS BOX -->
          <div class="gift-card">
            <div class="gift-badge">💎 Regalo de Bienvenida VIP</div>
            <div class="gift-points">+${points} Pts</div>
            <p class="gift-desc">Acreditados automáticamente en tu Billetera Digital</p>
          </div>

          <!-- CLIENT PASS DETAILS -->
          <table width="100%" cellpadding="6" cellspacing="0" style="background: #FDF8F6; border-radius: 10px; margin-bottom: 25px; font-size: 13px;">
            <tr>
              <td style="color: #7D6B6E; font-weight: 600;">Clienta VIP:</td>
              <td style="text-align: right; color: #2E1E1E; font-weight: 700;">${clientName}</td>
            </tr>
            <tr>
              <td style="color: #7D6B6E; font-weight: 600;">Membresía:</td>
              <td style="text-align: right; color: #997300; font-weight: 700;">🌟 Silver Privilege</td>
            </tr>
            <tr>
              <td style="color: #7D6B6E; font-weight: 600;">Código de Invitada:</td>
              <td style="text-align: right; color: #DE738F; font-weight: 800; letter-spacing: 0.05em;">${refCode}</td>
            </tr>
          </table>

          <!-- ACCESS CREDENTIALS (SET BY SALON AUTHORITY) -->
          ${clientPassword ? `
          <div style="background: #FFF7F9; border: 1px dashed #DE738F; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #DE738F; font-weight: 700; margin-bottom: 6px;">
              🔑 Tus Credenciales de Acceso al Portal PWA
            </div>
            <div style="font-size: 13px; color: #332729; line-height: 1.6;">
              <strong>Usuario:</strong> ${clientEmail}<br>
              <strong>Contraseña de Ingreso:</strong> <span style="font-family: monospace; font-size: 14px; background: #FFFFFF; padding: 2px 8px; border-radius: 6px; border: 1px solid #E5D5D8; color: #DE738F; font-weight: 700;">${clientPassword}</span>
            </div>
            <div style="font-size: 11px; color: #7D6B6E; margin-top: 6px;">
              Tu cuenta fue activada exclusivamente por la encargada de ${brandName}.
            </div>
          </div>
          ` : ''}

          <p class="lead-text" style="font-size: 14px; margin-bottom: 15px;">
            <strong>Tus Beneficios Exclusivos en ${brandName}:</strong><br>
            • 💅 <strong>Canje de Puntos:</strong> Sumás puntos en cada visita para canjear por tratamientos de nutrición, nail art de autor o descuentos.<br>
            • 🎁 <strong>Programa de Referidos:</strong> Compartí tu código <em>${refCode}</em> con amigas. Ellas reciben un beneficio en su primer turno y vos sumás 150 pts extra.<br>
            • 🔬 <strong>Ficha Ungueal Digital:</strong> Registro de tus colores favoritos, fotos de sets anteriores y diagnóstico 100% libre de HEMA.
          </p>

          <div style="text-align: center;">
            <a href="${portalUrl}" class="cta-btn" target="_blank">
              Acceder a mi Portal PWA
            </a>
          </div>

          <p style="font-size: 12px; color: #8F7D80; text-align: center; margin: 0;">
            Podés guardar el portal en la pantalla de inicio de tu smartphone como una aplicación sin necesidad de descargarla de la tienda.
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td class="footer">
          <div style="font-weight: 700; color: #FFFFFF; font-size: 13px; margin-bottom: 6px;">
            ${brandName}
          </div>
          <div>${branding.address}</div>
          <div style="margin-top: 6px;">
            WhatsApp: <a href="https://wa.me/${(branding.whatsapp || '').replace(/[^0-9]/g, '')}">${branding.whatsapp}</a> • 
            Instagram: <a href="https://instagram.com/${(branding.instagram || '').replace('@', '')}">${branding.instagram}</a>
          </div>
          <div style="margin-top: 14px; font-size: 11px; opacity: 0.6;">
            © ${new Date().getFullYear()} ${brandName}. Todos los derechos reservados.
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
}

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      clientName = 'Estimada Clienta',
      clientEmail,
      clientPassword = '',
      clientPhone = '',
      pointsBalance = 200,
      referralCode = '',
      tenantConfig = null
    } = req.body || {};

    if (!clientEmail || !clientEmail.includes('@')) {
      return res.status(400).json({ error: 'Dirección de email requerida y válida.' });
    }

    // 1. Fetch live tenant branding (Belcalis Nails)
    const branding = tenantConfig || await getTenantBranding();
    const brandName = branding.brandName || 'Belcalis Nails';

    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'www.belcalisnails.com.ar';
    const portalUrl = `https://${host}/pwa`;

    // 2. Generate luxury HTML
    const emailHtml = generateWelcomeEmailHtml({
      clientName,
      clientEmail,
      clientPassword,
      pointsBalance,
      referralCode,
      branding,
      portalUrl
    });

    const subject = `✨ ¡Bienvenida al Club Privilege de ${brandName}!`;

    // 3. Option A: Resend API (Recommended for modern Vercel setups)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const fromEmail = process.env.RESEND_FROM || `"${brandName}" <privilege@belcalisnails.com.ar>`;
      
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [clientEmail],
          subject: subject,
          html: emailHtml
        })
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error('[send-welcome] Resend delivery error:', resendData);
        return res.status(500).json({
          error: 'Error al despachar email mediante Resend',
          details: resendData
        });
      }

      console.log(`[send-welcome] Email successfully sent to ${clientEmail} via Resend:`, resendData.id);

      return res.status(200).json({
        success: true,
        delivered: true,
        provider: 'resend',
        id: resendData.id,
        recipient: clientEmail,
        brand: brandName
      });
    }

    // 4. Option B: Traditional SMTP Configuration (e.g. DonWeb cPanel)
    const smtpHost = process.env.SMTP_HOST || process.env.MAIL_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || process.env.MAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.MAIL_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"${brandName}" <${smtpUser || 'contacto@belcalisnails.com.ar'}>`;
    const isSecure = process.env.SMTP_SECURE === 'false' ? false : (smtpPort === 465);

    // If SMTP credentials are provided, attempt delivery
    if (smtpHost && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: isSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false // Helps avoid SSL self-signed cert issues on custom cPanel/Donweb hosts
        }
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: clientEmail,
        subject: subject,
        html: emailHtml
      });

      console.log(`[send-welcome] Email successfully sent to ${clientEmail} via ${smtpHost}:`, info.messageId);

      return res.status(200).json({
        success: true,
        delivered: true,
        provider: 'smtp',
        messageId: info.messageId,
        recipient: clientEmail,
        brand: brandName
      });
    } else {
      // Graceful fallback when SMTP env vars are not yet configured on Vercel
      console.log(`[send-welcome] SMTP not configured on environment. Simulated welcome email for ${clientEmail} (${brandName})`);
      
      return res.status(200).json({
        success: true,
        delivered: false,
        simulated: true,
        message: `Email preparado con la identidad de ${brandName}. Para envíos reales, configurá SMTP_HOST, SMTP_USER y SMTP_PASS en las variables de entorno de Vercel.`,
        preview: {
          to: clientEmail,
          from: smtpFrom,
          subject: subject,
          brand: brandName,
          points: pointsBalance
        }
      });
    }
  } catch (error) {
    console.error('[send-welcome] Error handling welcome email:', error);
    return res.status(500).json({
      error: 'Error al procesar el envío de bienvenida',
      details: error.message
    });
  }
}
