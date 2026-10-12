import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) return next();

        const urlPath = req.url.split('?')[0].replace('/api/', '');
        const filePath = path.resolve(__dirname, 'api', `${urlPath}.js`);

        if (fs.existsSync(filePath)) {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch {
              req.body = {};
            }

            res.status = (code: number) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };

            try {
              const mod = await server.ssrLoadModule(filePath);
              const handler = mod.default || mod;
              await handler(req, res);
            } catch (err: any) {
              console.error('API Dev Server Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Env desde archivos .env (local) y desde process.env (Vercel inyecta las vars del proyecto).
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const pick = (...keys: string[]) =>
    keys.map((k) => process.env[k] || fileEnv[k]).find((v) => v && v.length > 0) || '';

  // Aceptamos tanto los nombres con prefijo VITE_ (local) como sin prefijo (Vercel).
  const SUPABASE_URL = pick('VITE_SUPABASE_URL', 'SUPABASE_URL');
  const SUPABASE_ANON_KEY = pick('VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');

  return {
    plugins: [react(), apiDevMiddleware()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 5173,
      host: true
    }
  };
});
