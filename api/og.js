export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aloqecmxdshpoidhuysx.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsb3FlY214ZHNocG9pZGh1eXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NTI3MDYsImV4cCI6MjEwNjEyODcwNn0.WiyUVFPL1IanfkYLAUo4SajGYrPWMMG3bLfmTI2cH0Q';

  let brandName = 'Belcalis Nails';
  let brandTagline = 'HAUTE MANICURE & ESTUDIO DE ARTE UNGUEAL';
  let description = 'Estudio exclusivo de alta manicuría y arte ungueal. Turnos online, nivelación con Rubber, Soft Gel y manicuría rusa 100% libre de HEMA.';
  let imageUrl = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&h=630&q=85';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/client_profiles?id=eq.tenant_branding_config&select=technician_notes`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0].technician_notes) {
        const config = JSON.parse(data[0].technician_notes);
        if (config.brandName) brandName = config.brandName;
        if (config.brandTagline) brandTagline = config.brandTagline;
        if (config.heroSubtitle) description = config.heroSubtitle;
        if (config.heroCardImage) imageUrl = config.heroCardImage;
        else if (config.customLogoUrl) imageUrl = config.customLogoUrl;
      }
    }
  } catch (e) {
    // Non-blocking fallback to defaults
  }

  const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'www.belcalisnails.com.ar';
  const pageUrl = `https://${host}/`;
  const title = `${brandName} | ${brandTagline}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Open Graph / WhatsApp / Facebook / LinkedIn / iMessage -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${brandName}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${brandName}" />
  <meta property="og:url" content="${pageUrl}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <!-- Fallback Redirect -->
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <h1>${brandName}</h1>
  <p>${description}</p>
  <a href="${pageUrl}">Ingresar a ${brandName}</a>
  <script>window.location.replace("${pageUrl}");</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
