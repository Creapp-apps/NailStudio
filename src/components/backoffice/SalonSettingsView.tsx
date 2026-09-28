import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  DollarSign,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Save,
  CheckCircle2,
  Sparkles,
  Sliders,
  Layers,
  AlertCircle
} from 'lucide-react';
import { storage } from '../../services/storage';
import { SalonOperatingSettings } from '../../types/nailStudio';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DAYS_MAP = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
] as const;

export const SalonSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SalonOperatingSettings>(storage.getSalonSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSalonSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleDay = (dayKey: keyof SalonOperatingSettings['openDays']) => {
    setSettings(prev => ({
      ...prev,
      openDays: {
        ...prev.openDays,
        [dayKey]: !prev.openDays[dayKey]
      }
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-rose-300 text-rose-700 bg-rose-50/60 uppercase tracking-wider font-semibold">
              Centro de Mando
            </Badge>
            <span className="text-xs text-muted-foreground">• Operaciones del Atelier</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Parámetros Operativos del Salón</h2>
          <p className="text-xs text-muted-foreground">
            Configuración general de horarios, política de señas anti no-show, mesas de atención y datos comerciales
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="size-4 text-emerald-500" />
              ¡Cambios guardados con éxito!
            </span>
          )}
          <Button
            type="submit"
            size="sm"
            className="bg-primary text-primary-foreground text-xs gap-1.5 shadow-sm"
          >
            <Save className="size-3.5" />
            <span>Guardar Parámetros</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Días y Horarios */}
        <Card className="border-rose-200/70 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-rose-600">
              <Calendar className="size-4" />
              <CardTitle className="text-sm font-bold text-foreground">Días & Horarios de Apertura</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Define los días hábiles del salón y los turnos que estarán habilitados para reserva
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Días de Atención en el Salón
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DAYS_MAP.map(({ key, label }) => {
                  const isOpen = settings.openDays[key];
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleDay(key)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                        isOpen
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold shadow-2xs'
                          : 'bg-zinc-50/50 border-zinc-200 text-zinc-400 hover:border-zinc-300'
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isOpen ? 'bg-rose-200 text-rose-800' : 'bg-zinc-200 text-zinc-500'
                      }`}>
                        {isOpen ? 'Abierto' : 'Cerrado'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-rose-500" />
                  <span>Hora de Apertura</span>
                </label>
                <input
                  type="time"
                  value={settings.openingTime}
                  onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-rose-500" />
                  <span>Hora de Cierre</span>
                </label>
                <input
                  type="time"
                  value={settings.closingTime}
                  onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-rose-500" />
                  <span>Margen de Desinfección / Buffer entre clientas</span>
                </span>
                <span className="text-rose-600 font-bold">{settings.slotBufferMin} minutos</span>
              </label>
              <select
                value={settings.slotBufferMin}
                onChange={(e) => setSettings({ ...settings, slotBufferMin: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-zinc-800"
              >
                <option value={0}>Sin margen (0 min)</option>
                <option value={10}>10 minutos (Sanitizado básico)</option>
                <option value={15}>15 minutos (Esterilización de fresas & autoclave)</option>
                <option value={20}>20 minutos (Preparación integral de mesa)</option>
              </select>
              <p className="text-[11px] text-muted-foreground">
                Se añadirá este tiempo automáticamente entre cada turno para limpieza y esterilización de instrumental.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Políticas de Reserva & Anti No-Show */}
        <Card className="border-rose-200/70 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldCheck className="size-4" />
              <CardTitle className="text-sm font-bold text-foreground">Políticas de Reserva & Anti No-Show</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Protección de agenda mediante señas obligatorias y reglas de cancelación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="rounded-xl bg-rose-50/50 p-3.5 border border-rose-200/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-zinc-900">Exigir Seña Obligatoria para Reservar</div>
                <div className="text-[11px] text-muted-foreground">
                  El turno solo se confirmará una vez acreditado el pago de la seña.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.depositRequired}
                onChange={(e) => setSettings({ ...settings, depositRequired: e.target.checked })}
                className="size-4 accent-rose-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <DollarSign className="size-3.5 text-emerald-600" />
                  <span>Valor de la Seña Fija ($)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={settings.depositAmount}
                  onChange={(e) => setSettings({ ...settings, depositAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-amber-500" />
                  <span>Tolerancia de Cancelación</span>
                </label>
                <select
                  value={settings.cancellationHoursTolerance}
                  onChange={(e) => setSettings({ ...settings, cancellationHoursTolerance: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                >
                  <option value={12}>Hasta 12 horas antes</option>
                  <option value={24}>Hasta 24 horas antes (Recomendado)</option>
                  <option value={48}>Hasta 48 horas antes</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span>Ventana de Agenda Abierta a Clientas</span>
                <span className="text-rose-600 font-bold">{settings.bookingWindowDays} días hacia adelante</span>
              </label>
              <select
                value={settings.bookingWindowDays}
                onChange={(e) => setSettings({ ...settings, bookingWindowDays: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              >
                <option value={15}>Próximos 15 días</option>
                <option value={30}>Próximos 30 días (1 mes)</option>
                <option value={45}>Próximos 45 días</option>
                <option value={60}>Próximos 60 días (2 meses)</option>
              </select>
              <p className="text-[11px] text-muted-foreground">
                Evita reservas excesivamente lejanas en el tiempo que aumentan la tasa de ausencias.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Capacidad & Mesas */}
        <Card className="border-rose-200/70 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-rose-600">
              <Layers className="size-4" />
              <CardTitle className="text-sm font-bold text-foreground">Capacidad Operativa & Puestos de Trabajo</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Configuración de mesas físicas de manicuría para atención simultánea
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span>Mesas de Manicuría Activas en Salón</span>
                <span className="text-rose-600 font-bold">{settings.simultaneousTablesCount} mesas simultáneas</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setSettings({ ...settings, simultaneousTablesCount: num })}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      settings.simultaneousTablesCount === num
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-rose-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                La plataforma no permitirá más de {settings.simultaneousTablesCount} reservas en el mismo horario superpuesto.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200/70 space-y-2">
              <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <Sliders className="size-3.5 text-rose-500" />
                <span>Asignación Inteligente de Mesa</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Cuando una clienta reserva sin preferencia de profesional, el sistema balancea automáticamente los turnos entre las especialistas disponibles en mesa para optimizar la ocupación del salón.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Identidad & Cobros Bancarios */}
        <Card className="border-rose-200/70 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-rose-600">
              <Building2 className="size-4" />
              <CardTitle className="text-sm font-bold text-foreground">Identidad & Datos de Transferencia</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Datos comerciales que se le muestran a las clientas para pagar la seña y asistir al salón
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Nombre del Salón</label>
                <input
                  value={settings.salonName}
                  onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Sede / Sucursal</label>
                <input
                  value={settings.branchName}
                  onChange={(e) => setSettings({ ...settings, branchName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 flex items-center gap-1">
                <MapPin className="size-3 text-rose-500" />
                <span>Dirección del Salón</span>
              </label>
              <input
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Alias Bancario para Señas</label>
                <input
                  value={settings.bankAlias}
                  onChange={(e) => setSettings({ ...settings, bankAlias: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold text-rose-700 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-rose-50/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">CBU / CVU</label>
                <input
                  value={settings.bankCbu}
                  onChange={(e) => setSettings({ ...settings, bankCbu: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono text-zinc-700 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Titular de Cuenta</label>
                <input
                  value={settings.bankAccountHolder}
                  onChange={(e) => setSettings({ ...settings, bankAccountHolder: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Banco / Entidad</label>
                <input
                  value={settings.bankName}
                  onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
