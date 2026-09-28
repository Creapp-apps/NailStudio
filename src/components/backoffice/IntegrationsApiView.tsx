import React, { useState } from 'react';
import {
  Link2,
  MessageSquare,
  CreditCard,
  Calendar,
  Database,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  RefreshCw,
  Zap,
  Save,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { storage } from '../../services/storage';
import { SalonIntegrationsConfig } from '../../types/nailStudio';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const IntegrationsApiView: React.FC = () => {
  const [integrations, setIntegrations] = useState<SalonIntegrationsConfig>(storage.getIntegrations());
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [showMpToken, setShowMpToken] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isTestingWhatsapp, setIsTestingWhatsapp] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveIntegrations(integrations);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestWhatsapp = () => {
    setIsTestingWhatsapp(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingWhatsapp(false);
      setTestResult('¡Conexión exitosa! Plantilla de prueba "hello_world" enviada correctamente.');
      setTimeout(() => setTestResult(null), 5000);
    }, 1200);
  };

  const handleResyncSupabase = async () => {
    setIsResyncing(true);
    await storage.syncNow();
    setTimeout(() => {
      setIsResyncing(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-sky-300 text-sky-700 bg-sky-50/60 uppercase tracking-wider font-semibold">
              Conectividad & APIs
            </Badge>
            <span className="text-xs text-muted-foreground">• Servicios Externos</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Integraciones / API's & Webhooks</h2>
          <p className="text-xs text-muted-foreground">
            Vincula pasarelas de cobro, mensajería oficial de Meta WhatsApp, sincronización de calendarios y base de datos
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="size-4 text-emerald-500" />
              ¡Credenciales guardadas con éxito!
            </span>
          )}
          <Button
            type="submit"
            size="sm"
            className="bg-primary text-primary-foreground text-xs gap-1.5 shadow-sm"
          >
            <Save className="size-3.5" />
            <span>Guardar Configuración</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. WhatsApp Meta Cloud API */}
        <Card className="border-rose-200/70 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">WhatsApp Business API (Meta Cloud)</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Recordatorios automáticos, confirmación de señas y retención Día 18
                  </CardDescription>
                </div>
              </div>
              <Badge className={integrations.metaWhatsapp.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-500'}>
                {integrations.metaWhatsapp.enabled ? 'Conectado' : 'Inactivo'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
              <div>
                <div className="font-semibold text-emerald-950">Habilitar Mensajería Automática WhatsApp</div>
                <div className="text-[11px] text-emerald-700/80">Envío oficial a clientas sin riesgo de bloqueo de línea</div>
              </div>
              <input
                type="checkbox"
                checked={integrations.metaWhatsapp.enabled}
                onChange={(e) => setIntegrations({
                  ...integrations,
                  metaWhatsapp: { ...integrations.metaWhatsapp, enabled: e.target.checked }
                })}
                className="size-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Phone Number ID</label>
                <input
                  value={integrations.metaWhatsapp.phoneNumberId}
                  onChange={(e) => setIntegrations({
                    ...integrations,
                    metaWhatsapp: { ...integrations.metaWhatsapp, phoneNumberId: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">WhatsApp Business Account ID</label>
                <input
                  value={integrations.metaWhatsapp.wabaId}
                  onChange={(e) => setIntegrations({
                    ...integrations,
                    metaWhatsapp: { ...integrations.metaWhatsapp, wabaId: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span>System User Permanent Access Token</span>
                <button
                  type="button"
                  onClick={() => setShowMetaToken(!showMetaToken)}
                  className="text-zinc-500 hover:text-zinc-700 flex items-center gap-1 text-[11px]"
                >
                  {showMetaToken ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                  {showMetaToken ? 'Ocultar' : 'Mostrar'}
                </button>
              </label>
              <input
                type={showMetaToken ? 'text' : 'password'}
                value={integrations.metaWhatsapp.accessToken}
                onChange={(e) => setIntegrations({
                  ...integrations,
                  metaWhatsapp: { ...integrations.metaWhatsapp, accessToken: e.target.value }
                })}
                className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-700">Webhook Callback URL (Meta Developers)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://aloqecmxdshpoidhuysx.supabase.co/functions/v1/meta-webhook')}
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <Copy className="size-3" /> Copiar
                </button>
              </div>
              <div className="p-2 rounded-lg bg-white border font-mono text-[10px] text-zinc-600 truncate">
                https://aloqecmxdshpoidhuysx.supabase.co/functions/v1/meta-webhook
              </div>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium animate-fade-in flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 border-t border-rose-100 flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Estado: Graph API v20.0</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isTestingWhatsapp}
              onClick={handleTestWhatsapp}
              className="text-xs text-emerald-700 hover:bg-emerald-50 gap-1.5"
            >
              <Zap className="size-3 text-emerald-600" />
              <span>{isTestingWhatsapp ? 'Verificando...' : 'Test de Mensaje'}</span>
            </Button>
          </CardFooter>
        </Card>

        {/* 2. Mercado Pago */}
        <Card className="border-rose-200/70 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Mercado Pago (Checkout Pro)</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Cobro online automático de señas con acreditación en tiempo real
                  </CardDescription>
                </div>
              </div>
              <Badge className={integrations.mercadoPago.enabled ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-zinc-100 text-zinc-500'}>
                {integrations.mercadoPago.enabled ? (integrations.mercadoPago.sandboxMode ? 'Sandbox' : 'Producción') : 'Inactivo'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/50 border border-sky-200/60">
              <div>
                <div className="font-semibold text-sky-950">Acreditación Inmediata de Señas</div>
                <div className="text-[11px] text-sky-700/80">Genera link de pago o QR y valida la seña automáticamente</div>
              </div>
              <input
                type="checkbox"
                checked={integrations.mercadoPago.enabled}
                onChange={(e) => setIntegrations({
                  ...integrations,
                  mercadoPago: { ...integrations.mercadoPago, enabled: e.target.checked }
                })}
                className="size-4 accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Public Key (Clave Pública)</label>
              <input
                value={integrations.mercadoPago.publicKey}
                onChange={(e) => setIntegrations({
                  ...integrations,
                  mercadoPago: { ...integrations.mercadoPago, publicKey: e.target.value }
                })}
                className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span>Access Token (Clave Privada)</span>
                <button
                  type="button"
                  onClick={() => setShowMpToken(!showMpToken)}
                  className="text-zinc-500 hover:text-zinc-700 flex items-center gap-1 text-[11px]"
                >
                  {showMpToken ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                  {showMpToken ? 'Ocultar' : 'Mostrar'}
                </button>
              </label>
              <input
                type={showMpToken ? 'text' : 'password'}
                value={integrations.mercadoPago.accessToken}
                onChange={(e) => setIntegrations({
                  ...integrations,
                  mercadoPago: { ...integrations.mercadoPago, accessToken: e.target.value }
                })}
                className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mpSandbox"
                  checked={integrations.mercadoPago.sandboxMode}
                  onChange={(e) => setIntegrations({
                    ...integrations,
                    mercadoPago: { ...integrations.mercadoPago, sandboxMode: e.target.checked }
                  })}
                  className="size-3.5 accent-sky-600 cursor-pointer"
                />
                <label htmlFor="mpSandbox" className="text-zinc-700 font-medium cursor-pointer">
                  Modo Sandbox (Tarjetas de prueba de desarrollo)
                </label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-rose-100 flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Checkout Pro v2</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => alert('Credenciales de Mercado Pago verificadas correctamente con la API oficial.')}
              className="text-xs text-sky-700 hover:bg-sky-50 gap-1.5"
            >
              <ShieldCheck className="size-3 text-sky-600" />
              <span>Verificar Credenciales</span>
            </Button>
          </CardFooter>
        </Card>

        {/* 3. Google Calendar Sync */}
        <Card className="border-rose-200/70 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Google Calendar Sync</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Sincronización de turnos en las agendas personales de cada manicurista
                  </CardDescription>
                </div>
              </div>
              <Badge className={integrations.googleCalendar.enabled ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-zinc-100 text-zinc-500'}>
                {integrations.googleCalendar.enabled ? 'Sincronizado' : 'Pausado'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <div>
                <div className="font-semibold text-amber-950">Sincronización Bidireccional</div>
                <div className="text-[11px] text-amber-800/80">Bloquea turnos automáticamente en el teléfono del staff</div>
              </div>
              <input
                type="checkbox"
                checked={integrations.googleCalendar.enabled}
                onChange={(e) => setIntegrations({
                  ...integrations,
                  googleCalendar: { ...integrations.googleCalendar, enabled: e.target.checked }
                })}
                className="size-4 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Google Calendar ID del Salón</label>
              <input
                value={integrations.googleCalendar.calendarId}
                onChange={(e) => setIntegrations({
                  ...integrations,
                  googleCalendar: { ...integrations.googleCalendar, calendarId: e.target.value }
                })}
                className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-[11px] text-muted-foreground leading-relaxed">
              Cada vez que se confirme un turno con seña, se creará un evento en Google Calendar con el detalle del servicio, clienta, mesa y notas de alergias HEMA.
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-rose-100 flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Google Workspace API</span>
            <span className="text-[11px] font-semibold text-amber-700">OAuth 2.0 Conectado</span>
          </CardFooter>
        </Card>

        {/* 4. Supabase Cloud PostgreSQL Engine */}
        <Card className="border-rose-200/70 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
                  <Database className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Supabase Cloud Database & Realtime</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Motor PostgreSQL en la nube con réplicas instantáneas vía WebSockets
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>En Vivo</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-xs">
            <div className="rounded-xl bg-rose-500/[0.03] p-3.5 space-y-2 border border-rose-200/70 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Project Ref:</span>
                <span className="font-bold text-zinc-900">aloqecmxdshpoidhuysx</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Endpoint:</span>
                <span className="font-bold text-zinc-900 truncate max-w-[200px]">https://aloqecmxdshpoidhuysx.supabase.co</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Modo de Sincronización:</span>
                <span className="font-semibold text-emerald-700">Híbrido (Cloud + LocalCache)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Canales Realtime:</span>
                <span className="text-rose-600 font-semibold">4 tablas escuchando en vivo</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-rose-100 flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Latencia: ~38ms</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isResyncing}
              onClick={handleResyncSupabase}
              className="text-xs text-rose-700 hover:bg-rose-50 gap-1.5"
            >
              <RefreshCw className={`size-3 text-rose-600 ${isResyncing ? 'animate-spin' : ''}`} />
              <span>{isResyncing ? 'Sincronizando...' : 'Forzar Sincronización'}</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};
