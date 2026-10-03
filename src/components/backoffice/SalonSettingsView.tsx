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
  AlertCircle,
  Plus,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { storage, DEFAULT_SCHEDULE_BY_DAY } from '../../services/storage';
import { SalonOperatingSettings, DayOfWeekKey, TimeRangeBlock } from '../../types/nailStudio';
import { PlatformTier, PLATFORM_TIERS } from '../../types/platformTiers';
import { PlatformTierSwitcher } from './PlatformTierSwitcher';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LuxuryManualTimeInput } from '../common/LuxuryManualTimeInput';
import { LuxurySelect } from '../common/LuxurySelect';

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
  const [currentTier, setCurrentTier] = useState<PlatformTier>(() => storage.getPlatformTier());
  const [isSaved, setIsSaved] = useState(false);
  const [activeDayKey, setActiveDayKey] = useState<DayOfWeekKey>('monday');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handleTierChange = (newTier: PlatformTier) => {
    storage.setPlatformTier(newTier);
    setCurrentTier(newTier);
    window.dispatchEvent(new CustomEvent('atelier-tier-changed', { detail: newTier }));
  };

  const currentSchedule = settings.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY;
  const activeDayConfig = currentSchedule[activeDayKey] || { enabled: false, ranges: [] };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSalonSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleToggleDay = (dayKey: DayOfWeekKey) => {
    const dayConfig = currentSchedule[dayKey] || { enabled: false, ranges: [] };
    const nextEnabled = !dayConfig.enabled;
    const nextRanges = nextEnabled && dayConfig.ranges.length === 0
      ? [{ id: `${dayKey}-1`, startTime: '09:00', endTime: '18:00' }]
      : dayConfig.ranges;

    setSettings(prev => ({
      ...prev,
      openDays: {
        ...prev.openDays,
        [dayKey]: nextEnabled
      },
      scheduleByDay: {
        ...(prev.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY),
        [dayKey]: {
          enabled: nextEnabled,
          ranges: nextRanges
        }
      }
    }));
  };

  const handleAddRange = (dayKey: DayOfWeekKey) => {
    const dayConfig = currentSchedule[dayKey];
    const existing = dayConfig.ranges;
    let newStart = '15:00';
    let newEnd = '18:00';
    if (existing.length > 0) {
      const lastEnd = existing[existing.length - 1].endTime;
      const [h] = lastEnd.split(':');
      const startH = Math.min(21, (parseInt(h, 10) || 12) + 1);
      const endH = Math.min(23, startH + 2);
      newStart = `${String(startH).padStart(2, '0')}:00`;
      newEnd = `${String(endH).padStart(2, '0')}:00`;
    }

    const newBlock: TimeRangeBlock = {
      id: `${dayKey}-${Date.now()}`,
      startTime: newStart,
      endTime: newEnd
    };

    setSettings(prev => ({
      ...prev,
      scheduleByDay: {
        ...(prev.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY),
        [dayKey]: {
          ...dayConfig,
          enabled: true,
          ranges: [...existing, newBlock]
        }
      }
    }));
  };

  const handleRemoveRange = (dayKey: DayOfWeekKey, rangeId: string) => {
    const dayConfig = currentSchedule[dayKey];
    setSettings(prev => ({
      ...prev,
      scheduleByDay: {
        ...(prev.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY),
        [dayKey]: {
          ...dayConfig,
          ranges: dayConfig.ranges.filter(r => r.id !== rangeId)
        }
      }
    }));
  };

  const handleUpdateRangeTime = (dayKey: DayOfWeekKey, rangeId: string, field: 'startTime' | 'endTime', val: string) => {
    const dayConfig = currentSchedule[dayKey];
    setSettings(prev => ({
      ...prev,
      scheduleByDay: {
        ...(prev.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY),
        [dayKey]: {
          ...dayConfig,
          ranges: dayConfig.ranges.map(r => r.id === rangeId ? { ...r, [field]: val } : r)
        }
      }
    }));
  };

  const handleCopyScheduleToAllOpenDays = (sourceDayKey: DayOfWeekKey) => {
    const sourceRanges = currentSchedule[sourceDayKey].ranges;
    setSettings(prev => {
      const updated = { ...(prev.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY) };
      (Object.keys(updated) as DayOfWeekKey[]).forEach(k => {
        if (updated[k].enabled && k !== sourceDayKey) {
          updated[k] = {
            ...updated[k],
            ranges: sourceRanges.map((r, i) => ({ ...r, id: `${k}-${i}-${Date.now()}` }))
          };
        }
      });
      return {
        ...prev,
        scheduleByDay: updated
      };
    });
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const getRangeDurationText = (start: string, end: string) => {
    const [h1, m1] = (start || '00:00').split(':').map(Number);
    const [h2, m2] = (end || '00:00').split(':').map(Number);
    const totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (totalMin <= 0) return 'Horario inválido';
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${hrs > 0 ? `${hrs} h ` : ''}${mins > 0 ? `${mins} min` : ''} de atención`;
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
            Franjas horarias flexibles por día, política de señas anti no-show, mesas de atención y datos comerciales
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

      {/* Platform Subscription Tier & Feature Selector */}
      <Card className="border-rose-200/80 shadow-xs bg-gradient-to-br from-white via-rose-50/20 to-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-rose-100/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <Sparkles className="size-4 text-amber-500" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Nivel de Plan & Módulos Habilitados
                </CardTitle>
                <Badge variant="outline" className="text-[10px] border-rose-300 bg-rose-50 text-rose-700">
                  {PLATFORM_TIERS[currentTier].name} Activo
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Adapta la interfaz según la escala de tu salón: simplifica para profesionales independientes o desbloquea operaciones completas de atelier.
              </CardDescription>
            </div>
            <div className="text-[11px] font-medium text-muted-foreground">
              {PLATFORM_TIERS[currentTier].allowedSections.length} módulos habilitados
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <PlatformTierSwitcher
            currentTier={currentTier}
            onSelectTier={handleTierChange}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Días y Franjas Horarias */}
        <Card className="border-rose-200/70 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-rose-600">
              <Calendar className="size-4" />
              <CardTitle className="text-sm font-bold text-foreground">Días & Franjas Horarias de Atención</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Segmenta tu jornada con múltiples bloques horarios (ej: mañana, tarde, noche) adaptados a tu vida diaria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Días Tabs */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Seleccionar Día a Configurar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {DAYS_MAP.map(({ key, label }) => {
                  const dayCfg = currentSchedule[key] || { enabled: false, ranges: [] };
                  const isSelectedTab = activeDayKey === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setActiveDayKey(key)}
                      className={`p-2 rounded-xl border text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        isSelectedTab
                          ? 'border-[#C45774] ring-2 ring-[#DE738F]/30 bg-rose-50/70 text-rose-950 font-bold shadow-2xs'
                          : 'border-zinc-200 bg-white/70 hover:border-rose-200 text-zinc-600'
                      }`}
                    >
                      <span className="text-[11px]">{label}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        dayCfg.enabled
                          ? 'bg-rose-100 text-[#C45774]'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        {dayCfg.enabled ? `${dayCfg.ranges.length} franja${dayCfg.ranges.length !== 1 ? 's' : ''}` : 'Cerrado'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel de Franjas del Día Activo */}
            <div className="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#2B181C]">
                    {DAYS_MAP.find(d => d.key === activeDayKey)?.label}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                    activeDayConfig.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {activeDayConfig.enabled ? 'Atención Habilitada' : 'Cerrado'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeDayConfig.enabled && activeDayConfig.ranges.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleCopyScheduleToAllOpenDays(activeDayKey)}
                      className="text-[10px] font-semibold text-[#C45774] hover:text-[#B83256] bg-white border border-rose-200 px-2 py-1 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer hover:bg-rose-50 transition-all"
                      title="Copiar las franjas de este día a todos los demás días habilitados"
                    >
                      {copiedSuccess ? (
                        <>
                          <Check size={11} className="text-emerald-600" />
                          <span className="text-emerald-600">¡Copiado a días abiertos!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copiar a días abiertos</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleDay(activeDayKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      activeDayConfig.enabled
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                        : 'btn-satin-pink text-white shadow-2xs'
                    }`}
                  >
                    {activeDayConfig.enabled ? 'Marcar Cerrado' : 'Habilitar Día'}
                  </button>
                </div>
              </div>

              {/* Contenido de franjas */}
              {activeDayConfig.enabled ? (
                <div className="space-y-2.5">
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>Franjas Horarias Disponibles (Sin presets fijos, ingresá la hora exacta):</span>
                    <span className="font-semibold text-rose-700">{activeDayConfig.ranges.length} activa(s)</span>
                  </div>

                  {activeDayConfig.ranges.length === 0 ? (
                    <div className="p-3 text-center rounded-lg border border-dashed border-rose-300/80 bg-white/60">
                      <p className="text-muted-foreground text-xs mb-2">No tenés franjas horarias configuradas para este día.</p>
                      <button
                        type="button"
                        onClick={() => handleAddRange(activeDayKey)}
                        className="btn-satin-pink text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>Agregar Primera Franja</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeDayConfig.ranges.map((range, idx) => (
                        <div
                          key={range.id}
                          className="p-2.5 rounded-xl border border-rose-200/80 bg-white flex flex-wrap items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#DE738F]/15 text-[#C45774] font-bold text-[10px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <LuxuryManualTimeInput
                                value={range.startTime}
                                onChange={(val) => handleUpdateRangeTime(activeDayKey, range.id, 'startTime', val)}
                              />
                              <span className="text-xs text-muted-foreground font-semibold">hasta</span>
                              <LuxuryManualTimeInput
                                value={range.endTime}
                                onChange={(val) => handleUpdateRangeTime(activeDayKey, range.id, 'endTime', val)}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#C45774] font-medium bg-[#DE738F]/10 px-2 py-0.5 rounded-full">
                              {getRangeDurationText(range.startTime, range.endTime)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRange(activeDayKey, range.id)}
                              className="text-muted-foreground hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar franja"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddRange(activeDayKey)}
                          className="w-full py-2 border border-dashed border-[#DE738F]/60 hover:border-[#DE738F] text-[#C45774] hover:bg-[#DE738F]/5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>+ Agregar Otra Franja Horaria en este Día</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center rounded-xl bg-white/60 border border-zinc-200">
                  <p className="text-xs text-zinc-500 mb-2">
                    El atelier permanece cerrado este día. Ninguna clienta podrá agendar turnos.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleToggleDay(activeDayKey)}
                    className="btn-satin-pink text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Habilitar atención los {DAYS_MAP.find(d => d.key === activeDayKey)?.label}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Buffer de Sanitizado */}
            <div className="space-y-1.5 pt-1">
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-rose-500" />
                  <span>Margen de Desinfección / Buffer entre clientas</span>
                </span>
                <span className="text-rose-600 font-bold">{settings.slotBufferMin} minutos</span>
              </label>
              <LuxurySelect
                value={settings.slotBufferMin}
                onChange={(val) => setSettings({ ...settings, slotBufferMin: Number(val) })}
                options={[
                  { value: 0, label: 'Sin margen (0 min)' },
                  { value: 10, label: '10 minutos (Sanitizado básico)' },
                  { value: 15, label: '15 minutos (Esterilización de fresas & autoclave)' },
                  { value: 20, label: '20 minutos (Preparación integral de mesa)' }
                ]}
              />
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
                <LuxurySelect
                  value={settings.cancellationHoursTolerance}
                  onChange={(val) => setSettings({ ...settings, cancellationHoursTolerance: Number(val) })}
                  options={[
                    { value: 12, label: 'Hasta 12 horas antes' },
                    { value: 24, label: 'Hasta 24 horas antes (Recomendado)' },
                    { value: 48, label: 'Hasta 48 horas antes' }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span>Ventana de Agenda Abierta a Clientas</span>
                <span className="text-rose-600 font-bold">{settings.bookingWindowDays} días hacia adelante</span>
              </label>
              <LuxurySelect
                value={settings.bookingWindowDays}
                onChange={(val) => setSettings({ ...settings, bookingWindowDays: Number(val) })}
                options={[
                  { value: 15, label: 'Próximos 15 días' },
                  { value: 30, label: 'Próximos 30 días (1 mes)' },
                  { value: 45, label: 'Próximos 45 días' },
                  { value: 60, label: 'Próximos 60 días (2 meses)' }
                ]}
              />
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
              <label className="font-semibold text-zinc-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="size-3 text-rose-500" />
                  <span>Nombre de la Profesional / Asistente Virtual (Nail-Bot)</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">Recepción de turnos en chat</span>
              </label>
              <input
                placeholder="Ej: Lucía Altieri, Valen, etc."
                value={settings.assistantName || ''}
                onChange={(e) => setSettings({ ...settings, assistantName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              />
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
