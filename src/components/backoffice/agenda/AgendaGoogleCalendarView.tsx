import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Search,
  User,
  Filter,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle,
  Scissors
} from 'lucide-react';
import {
  Appointment,
  NailTechnician,
  AppointmentStatus
} from '../../../types/nailStudio';
import { INITIAL_SERVICES } from '../../../services/mockData';
import { storage } from '../../../services/storage';
import { NuevoTurnoModal } from './NuevoTurnoModal';
import { TurnoDetalleModal } from './TurnoDetalleModal';
import { BuscadorTurnosModal } from './BuscadorTurnosModal';
import { LuxurySelect } from '../../common/LuxurySelect';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
}

type ViewMode = 'hoy' | '3dias' | 'semana' | 'mes';
type ZoomLevel = '0.75x' | '1x' | '1.25x' | '1.5x';

const ZOOM_CONFIG: Record<ZoomLevel, { height: number; label: string }> = {
  '0.75x': { height: 62, label: '0.75x' },
  '1x': { height: 82, label: '1x' },
  '1.25x': { height: 105, label: '1.25x' },
  '1.5x': { height: 130, label: '1.5x' }
};

const ZOOM_ORDER: ZoomLevel[] = ['0.75x', '1x', '1.25x', '1.5x'];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00

export const AgendaGoogleCalendarView: React.FC<Props> = ({ appointments, techs }) => {
  // Navigation & View States
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('hoy');
  const [techFilter, setTechFilter] = useState<string>('todos');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('1x');

  // Modals state
  const [nuevoModalOpen, setNuevoModalOpen] = useState(false);
  const [buscadorOpen, setBuscadorOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [slotPrefill, setSlotPrefill] = useState<{ date: string; time: string; techId?: string } | null>(null);

  // Live Current Time
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const hourHeight = ZOOM_CONFIG[zoomLevel].height;

  const handleZoomIn = () => {
    const currentIndex = ZOOM_ORDER.indexOf(zoomLevel);
    if (currentIndex < ZOOM_ORDER.length - 1) {
      setZoomLevel(ZOOM_ORDER[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_ORDER.indexOf(zoomLevel);
    if (currentIndex > 0) {
      setZoomLevel(ZOOM_ORDER[currentIndex - 1]);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel('1x');
  };

  // Auto-scroll to current hour on initial mount
  useEffect(() => {
    if (gridContainerRef.current && viewMode !== 'mes') {
      const now = new Date();
      const currentH = now.getHours();
      if (currentH >= 8 && currentH <= 21) {
        const scrollTo = (currentH - 8) * hourHeight - 80;
        gridContainerRef.current.scrollTop = Math.max(0, scrollTo);
      }
    }
  }, [viewMode, hourHeight]);

  // Services lookup for badges
  const services = useMemo(() => {
    const s = storage.getServices();
    return s.length > 0 ? s : INITIAL_SERVICES;
  }, []);

  // Filtered techs
  const activeTechs = useMemo(() => {
    if (techFilter === 'todos') return techs;
    return techs.filter(t => t.id === techFilter);
  }, [techs, techFilter]);

  // Compute days to display based on viewMode
  const visibleDays = useMemo(() => {
    if (viewMode === 'hoy') {
      return [currentDate];
    }
    if (viewMode === '3dias') {
      return [currentDate, addDays(currentDate, 1), addDays(currentDate, 2)];
    }
    if (viewMode === 'semana') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    // Month grid days
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    const days: Date[] = [];
    let curr = start;
    while (curr <= end) {
      days.push(new Date(curr));
      curr = addDays(curr, 1);
    }
    return days;
  }, [currentDate, viewMode]);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'hoy') setCurrentDate(prev => subDays(prev, 1));
    else if (viewMode === '3dias') setCurrentDate(prev => subDays(prev, 3));
    else if (viewMode === 'semana') setCurrentDate(prev => subWeeks(prev, 1));
    else if (viewMode === 'mes') setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNext = () => {
    if (viewMode === 'hoy') setCurrentDate(prev => addDays(prev, 1));
    else if (viewMode === '3dias') setCurrentDate(prev => addDays(prev, 3));
    else if (viewMode === 'semana') setCurrentDate(prev => addWeeks(prev, 1));
    else if (viewMode === 'mes') setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Click on empty slot to create appointment
  const handleSlotClick = (day: Date, hour: number, minute: number = 0, techId?: string) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setSlotPrefill({
      date: dateStr,
      time: timeStr,
      techId: techId || (techFilter !== 'todos' ? techFilter : techs[0]?.id)
    });
    setEditingAppointment(null);
    setNuevoModalOpen(true);
  };

  // Card position calculations
  const calculateCardPosition = (apt: Appointment) => {
    if (!apt.scheduledTime) return { top: 0, height: hourHeight };
    const [hStr, mStr] = apt.scheduledTime.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);

    const startDecimal = h + m / 60;
    const top = Math.max(0, (startDecimal - 8) * hourHeight);
    const duration = apt.totalDurationMin || 60;
    const height = Math.max(26, (duration / 60) * hourHeight - 2);

    return { top, height };
  };

  // Status background styling for cards
  const getStatusStyles = (status: AppointmentStatus) => {
    switch (status) {
      case 'in_progress':
        return {
          bg: 'bg-amber-500/15 dark:bg-amber-500/20',
          border: 'border-l-4 border-l-amber-500 border-amber-300 dark:border-amber-700/60',
          text: 'text-amber-900 dark:text-amber-200',
          badge: 'bg-amber-500 text-white'
        };
      case 'pending':
        return {
          bg: 'bg-rose-500/15 dark:bg-rose-500/25 ring-1 ring-[#DE738F]/50',
          border: 'border-l-4 border-l-[#C45774] border-rose-300 dark:border-rose-700/60 shadow-sm shadow-rose-500/20',
          text: 'text-rose-950 dark:text-rose-100 font-bold',
          badge: 'bg-[#C45774] text-white animate-pulse'
        };
      case 'confirmed':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          border: 'border-l-4 border-l-emerald-600 border-emerald-200 dark:border-emerald-800/60',
          text: 'text-emerald-950 dark:text-emerald-200',
          badge: 'bg-emerald-600 text-white'
        };
      case 'pending_deposit':
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-500/15',
          border: 'border-l-4 border-l-rose-500 border-rose-300 dark:border-rose-800/60',
          text: 'text-rose-950 dark:text-rose-200',
          badge: 'bg-rose-500 text-white'
        };
      case 'completed':
        return {
          bg: 'bg-muted/70',
          border: 'border-l-4 border-l-muted-foreground border-border',
          text: 'text-muted-foreground',
          badge: 'bg-muted-foreground text-background'
        };
      default:
        return {
          bg: 'bg-red-500/10',
          border: 'border-l-4 border-l-red-500 border-red-200',
          text: 'text-red-900',
          badge: 'bg-red-500 text-white'
        };
    }
  };

  // Red time line position
  const now = currentTime;
  const nowDecimal = now.getHours() + now.getMinutes() / 60;
  const isNowVisible = nowDecimal >= 8 && nowDecimal <= 22;
  const nowTop = (nowDecimal - 8) * hourHeight;

  // Format header title
  const headerDateTitle = useMemo(() => {
    if (viewMode === 'hoy') {
      return format(currentDate, "EEEE d 'de' MMMM, yyyy", { locale: es });
    }
    if (viewMode === '3dias') {
      const end = addDays(currentDate, 2);
      return `${format(currentDate, "d 'de' MMM", { locale: es })} - ${format(end, "d 'de' MMM, yyyy", { locale: es })}`;
    }
    if (viewMode === 'semana') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `Semana: ${format(start, "d 'de' MMM", { locale: es })} al ${format(end, "d 'de' MMM, yyyy", { locale: es })}`;
    }
    return format(currentDate, "MMMM 'de' yyyy", { locale: es });
  }, [currentDate, viewMode]);

  const pendingApts = useMemo(() => appointments.filter(a => a.status === 'pending'), [appointments]);

  return (
    <div className="flex flex-col w-full h-full flex-1 bg-background overflow-hidden animate-fade-in text-xs border-0">
      {/* ── 1. Top Navigation & Toolbar Bar ─────────────────────── */}
      <div className="relative z-40 p-3.5 sm:p-4 border-b border-border/80 bg-white/95 dark:bg-card/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Left: Date navigation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center rounded-xl border border-border bg-card p-0.5 shadow-xs">
            <button
              onClick={handlePrev}
              title="Anterior"
              className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={handleNext}
              title="Siguiente"
              className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-[#DE738F] shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-foreground font-serif capitalize">
              {headerDateTitle}
            </h2>
          </div>
        </div>

        {/* Right: View mode, tech filter, zoom & action buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap ml-auto">
          {/* View Modes Selector */}
          <div className="flex items-center rounded-xl border border-border bg-card p-0.5 shadow-xs">
            {(['hoy', '3dias', 'semana', 'mes'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-[#DE738F] text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {mode === 'hoy' ? 'Día' : mode === '3dias' ? '3 Días' : mode === 'semana' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>

          {/* Manicurista Selector */}
          <div className="w-44 sm:w-52 relative z-50">
            <LuxurySelect
              size="sm"
              icon={<User className="size-3.5" />}
              value={techFilter}
              onChange={setTechFilter}
              options={[
                { value: 'todos', label: 'Todas las Manicuristas' },
                ...techs.map(t => ({
                  value: t.id,
                  label: t.name,
                  badge: t.role
                }))
              ]}
            />
          </div>

          {/* Zoom scale selector (only for timeline views) */}
          {viewMode !== 'mes' && (
            <div className="hidden lg:flex items-center rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-0.5 text-xs shadow-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel === ZOOM_ORDER[0]}
                title="Reducir escala de horas"
                className={`p-1.5 rounded-lg transition-all ${
                  zoomLevel === ZOOM_ORDER[0]
                    ? 'opacity-30 cursor-not-allowed text-muted-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer active:scale-95'
                }`}
              >
                <ZoomOut className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="Click para restablecer a 1x"
                className={`px-2 py-0.5 text-[11px] font-bold tracking-tight rounded-md transition-all cursor-pointer ${
                  zoomLevel === '1x'
                    ? 'bg-rose-500/15 text-[#C45774] dark:text-rose-300 font-extrabold'
                    : 'text-foreground hover:bg-muted font-bold'
                }`}
              >
                {zoomLevel}
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel === ZOOM_ORDER[ZOOM_ORDER.length - 1]}
                title="Aumentar escala de horas"
                className={`p-1.5 rounded-lg transition-all ${
                  zoomLevel === ZOOM_ORDER[ZOOM_ORDER.length - 1]
                    ? 'opacity-30 cursor-not-allowed text-muted-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer active:scale-95'
                }`}
              >
                <ZoomIn className="size-3.5" />
              </button>
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={() => setBuscadorOpen(true)}
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Buscar turnos (Ctrl+K)"
          >
            <Search className="size-4" />
          </button>

          {/* New Appointment Button */}
          <button
            onClick={() => {
              setSlotPrefill({
                date: format(currentDate, 'yyyy-MM-dd'),
                time: '10:00',
                techId: techFilter !== 'todos' ? techFilter : techs[0]?.id
              });
              setEditingAppointment(null);
              setNuevoModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs font-bold shadow-md shadow-rose-500/25 hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nuevo Turno</span>
          </button>
        </div>
      </div>

      {/* Banner: Turnos Entrantes Pendientes para Revisar */}
      {pendingApts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500/15 via-[#DE738F]/15 to-rose-500/15 border-b border-[#DE738F]/30 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs shrink-0 animate-fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
            </span>
            <span className="font-extrabold text-[#2B181C] dark:text-rose-100 flex items-center gap-1.5 shrink-0">
              <span>🔔 TENES {pendingApts.length} {pendingApts.length === 1 ? 'TURNO PENDIENTE' : 'TURNOS PENDIENTES'} PARA REVISAR</span>
            </span>
            <div className="hidden md:flex items-center gap-2 overflow-x-auto text-[11px] text-stone-600 dark:text-stone-300">
              {pendingApts.slice(0, 3).map(p => (
                <span key={p.id} className="bg-white/80 dark:bg-card px-2 py-0.5 rounded-md border border-[#DE738F]/20 font-medium">
                  {p.clientName} ({p.scheduledDate} {p.scheduledTime} hs)
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const first = pendingApts[0];
                if (first) {
                  try {
                    setCurrentDate(parseISO(first.scheduledDate));
                    setSelectedAppointment(first);
                  } catch {}
                }
              }}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white hover:opacity-90 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all cursor-pointer"
            >
              <Sparkles size={12} className="text-amber-200" />
              <span>Revisar Turno</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ── 2. View Mode Rendering ───────────────────────────────── */}
      {viewMode === 'mes' ? (
        /* ── MONTH CALENDAR VIEW (Google Calendar style) ───────── */
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-7 border-t border-l border-border/80 rounded-xl overflow-hidden shadow-xs bg-background">
            {/* Header row: Day names */}
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <div
                key={d}
                className="py-2.5 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/30 border-r border-b border-border/80"
              >
                {d}
              </div>
            ))}

            {/* Month Day Cells */}
            {visibleDays.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCurrMonth = day.getMonth() === currentDate.getMonth();
              const isDayToday = isToday(day);

              const dayApts = appointments.filter(a => {
                if (a.scheduledDate !== dateStr) return false;
                if (techFilter !== 'todos' && a.techId !== techFilter) return false;
                return true;
              }).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode('hoy');
                  }}
                  className={`min-h-[105px] p-1.5 border-r border-b border-border/70 flex flex-col justify-between cursor-pointer transition-colors hover:bg-rose-500/[0.03] ${
                    isCurrMonth ? 'bg-card' : 'bg-muted/15 text-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`size-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isDayToday
                          ? 'bg-[#DE738F] text-white shadow-xs'
                          : isCurrMonth ? 'text-foreground' : 'text-muted-foreground/40'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayApts.length > 0 && (
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {dayApts.length} turnos
                      </span>
                    )}
                  </div>

                  {/* Turnos preview pills */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {dayApts.slice(0, 3).map(apt => {
                      const st = getStatusStyles(apt.status);
                      return (
                        <div
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(apt);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${st.bg} ${st.border} ${st.text}`}
                        >
                          <span className="font-mono text-[9px] mr-1">{apt.scheduledTime}</span>
                          <span>{apt.clientName}</span>
                        </div>
                      );
                    })}
                    {dayApts.length > 3 && (
                      <span className="text-[9px] text-[#DE738F] font-bold block pl-1">
                        +{dayApts.length - 3} más...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── TIMELINE GRID VIEW (Día, 3 Días, Semana) ───────────── */
        <div ref={gridContainerRef} className="flex-1 overflow-y-auto overflow-x-auto relative">
          <div
            className="min-w-full flex flex-col"
            style={{ minWidth: viewMode === 'hoy' && techFilter === 'todos' ? `${Math.max(800, activeTechs.length * 220)}px` : '780px' }}
          >
            {/* Sticky Header of Columns */}
            <div className="sticky top-0 z-30 flex border-b border-border bg-card/95 backdrop-blur-md">
              {/* Hour corner cell */}
              <div className="w-14 sm:w-16 shrink-0 border-r border-border p-2 text-center text-[10px] text-muted-foreground font-semibold flex items-center justify-center">
                GMT-3
              </div>

              {/* Columns Header */}
              {viewMode === 'hoy' && techFilter === 'todos' ? (
                /* Día: Column per Manicurista */
                <div
                  className="flex-1 grid"
                  style={{ gridTemplateColumns: `repeat(${activeTechs.length || 1}, minmax(0, 1fr))` }}
                >
                  {activeTechs.map((tech) => {
                    const todayAptsCount = appointments.filter(
                      a => a.scheduledDate === format(currentDate, 'yyyy-MM-dd') && (a.techId === tech.id || ((!a.techId || a.techId === 'auto-assigned') && tech.id === activeTechs[0]?.id))
                    ).length;

                    return (
                      <div
                        key={tech.id}
                        className="p-2 sm:p-2.5 border-r border-border/80 flex items-center gap-2.5 overflow-hidden"
                      >
                        {tech.avatar ? (
                          <img
                            src={tech.avatar}
                            alt={tech.name}
                            className="size-7 rounded-full object-cover border border-[#DE738F] shrink-0"
                          />
                        ) : (
                          <div className="size-7 rounded-full bg-[#DE738F]/20 text-[#DE738F] font-bold text-xs flex items-center justify-center shrink-0">
                            {tech.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-foreground text-xs truncate leading-tight">
                            {tech.name}
                          </h4>
                          <span className="text-[10px] text-muted-foreground truncate block">
                            {tech.role} • {todayAptsCount} turnos
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 3 Días o Semana: Column per Day */
                <div
                  className="flex-1 grid"
                  style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))` }}
                >
                  {visibleDays.map((day, idx) => {
                    const isDayToday = isToday(day);
                    return (
                      <div
                        key={idx}
                        className={`p-2 text-center border-r border-border/80 transition-colors ${
                          isDayToday ? 'bg-rose-500/[0.06]' : ''
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          {format(day, 'EEE', { locale: es })}
                        </span>
                        <span
                          className={`inline-flex items-center justify-center size-6 rounded-full font-bold text-xs mx-auto mt-0.5 ${
                            isDayToday
                              ? 'bg-[#DE738F] text-white shadow-xs'
                              : 'text-foreground'
                          }`}
                        >
                          {format(day, 'd')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Main Time Grid Body ─────────────────────────── */}
            <div className="flex relative" style={{ height: `${HOURS.length * hourHeight}px` }}>
              {/* Left Hour Marks Column */}
              <div className="w-14 sm:w-16 shrink-0 border-r border-border select-none relative bg-muted/10">
                {HOURS.map((hour, idx) => (
                  <div
                    key={hour}
                    style={{ height: `${hourHeight}px` }}
                    className="pr-2 text-right text-[10px] font-semibold text-muted-foreground -translate-y-2"
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Grid Background Horizontal Lines */}
              <div className="absolute inset-0 left-14 sm:left-16 pointer-events-none">
                {HOURS.map((_, idx) => (
                  <React.Fragment key={idx}>
                    {/* Hour line */}
                    <div
                      className="absolute left-0 right-0 border-b border-border/60"
                      style={{ top: `${idx * hourHeight}px` }}
                    />
                    {/* Half hour subtle dashed line */}
                    <div
                      className="absolute left-0 right-0 border-b border-dashed border-border/30"
                      style={{ top: `${(idx + 0.5) * hourHeight}px` }}
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* Current Time Red Line Indicator */}
              {isNowVisible && (
                <div
                  className="absolute left-10 sm:left-12 right-0 z-20 pointer-events-none flex items-center"
                  style={{ top: `${nowTop}px` }}
                >
                  <div className="size-2.5 rounded-full bg-rose-600 shadow-sm shadow-rose-500 animate-pulse -ml-1.5" />
                  <div className="flex-1 h-[2px] bg-rose-500 shadow-xs" />
                </div>
              )}

              {/* Columns & Turnos Display */}
              {viewMode === 'hoy' && techFilter === 'todos' ? (
                /* Día: Columns per technician */
                <div
                  className="flex-1 grid relative z-10"
                  style={{ gridTemplateColumns: `repeat(${activeTechs.length || 1}, minmax(0, 1fr))` }}
                >
                  {activeTechs.map((tech) => {
                    const todayStr = format(currentDate, 'yyyy-MM-dd');
                    const techApts = appointments.filter(a => {
                      const isDateMatch = a.scheduledDate === todayStr;
                      const isTechMatch = a.techId === tech.id || ((!a.techId || a.techId === 'auto-assigned') && tech.id === activeTechs[0]?.id);
                      return isDateMatch && isTechMatch;
                    });

                    return (
                      <div
                        key={tech.id}
                        className="relative border-r border-border/70 h-full"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickY = e.clientY - rect.top;
                          const hourFraction = (clickY / hourHeight) + 8;
                          const clickedHour = Math.floor(hourFraction);
                          const clickedMin = (hourFraction - clickedHour) >= 0.5 ? 30 : 0;
                          handleSlotClick(currentDate, clickedHour, clickedMin, tech.id);
                        }}
                      >
                        {/* Appointments on this tech's column */}
                        {techApts.map((apt) => {
                          const { top, height } = calculateCardPosition(apt);
                          const st = getStatusStyles(apt.status);
                          const srv = services.find(s => s.id === apt.serviceId);

                          return (
                            <div
                              key={apt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(apt);
                              }}
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                left: '3px',
                                right: '3px'
                              }}
                              className={`absolute z-10 p-2 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] overflow-hidden flex flex-col justify-between ${st.bg} ${st.border} ${st.text}`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="font-mono text-[10px] font-bold opacity-90 flex items-center gap-1">
                                    <Clock className="size-2.5 shrink-0" />
                                    <span>{apt.scheduledTime} hs</span>
                                  </span>
                                  <span className={`text-[9px] px-1 rounded-sm font-bold uppercase ${st.badge}`}>
                                    {apt.status === 'in_progress' ? 'Mesa' : apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? '🔔 Pendiente' : apt.status === 'pending_deposit' ? 'Seña' : 'Turno'}
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs truncate leading-snug">
                                  {apt.clientName}
                                </h5>
                                <p className="text-[10px] opacity-80 truncate">
                                  {srv?.title || 'Manicuría'}
                                </p>
                              </div>

                              {height > 50 && (
                                <div className="flex items-center justify-between text-[10px] opacity-75 pt-1 border-t border-border/30">
                                  <span>{apt.totalDurationMin} min</span>
                                  <span>${apt.totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 3 Días o Semana: Columns per day */
                <div
                  className="flex-1 grid relative z-10"
                  style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))` }}
                >
                  {visibleDays.map((day, idx) => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const dayApts = appointments.filter(a => {
                      if (a.scheduledDate !== dayStr) return false;
                      if (techFilter !== 'todos' && a.techId !== techFilter) return false;
                      return true;
                    });

                    return (
                      <div
                        key={idx}
                        className={`relative border-r border-border/70 h-full ${
                          isToday(day) ? 'bg-rose-500/[0.02]' : ''
                        }`}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickY = e.clientY - rect.top;
                          const hourFraction = (clickY / hourHeight) + 8;
                          const clickedHour = Math.floor(hourFraction);
                          const clickedMin = (hourFraction - clickedHour) >= 0.5 ? 30 : 0;
                          handleSlotClick(day, clickedHour, clickedMin);
                        }}
                      >
                        {/* Appointments on this day */}
                        {dayApts.map((apt) => {
                          const { top, height } = calculateCardPosition(apt);
                          const st = getStatusStyles(apt.status);
                          const srv = services.find(s => s.id === apt.serviceId);
                          const tech = techs.find(t => t.id === apt.techId);

                          return (
                            <div
                              key={apt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(apt);
                              }}
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                left: '3px',
                                right: '3px'
                              }}
                              className={`absolute z-10 p-2 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] overflow-hidden flex flex-col justify-between ${st.bg} ${st.border} ${st.text}`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="font-mono text-[10px] font-bold opacity-90 flex items-center gap-1">
                                    <Clock className="size-2.5 shrink-0" />
                                    <span>{apt.scheduledTime} hs</span>
                                  </span>
                                  <span className={`text-[9px] px-1 rounded-sm font-bold uppercase ${st.badge}`}>
                                    {apt.status === 'in_progress' ? 'Mesa' : apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? '🔔 Pendiente' : apt.status === 'pending_deposit' ? 'Seña' : 'Turno'}
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs truncate leading-snug">
                                  {apt.clientName}
                                </h5>
                                <p className="text-[10px] opacity-80 truncate">
                                  {srv?.title || 'Manicuría'} • {tech?.name}
                                </p>
                              </div>

                              {height > 50 && (
                                <div className="flex items-center justify-between text-[10px] opacity-75 pt-1 border-t border-border/30">
                                  <span>{apt.totalDurationMin} min</span>
                                  <span>${apt.totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Modals Integration ─────────────────────────────────── */}
      <NuevoTurnoModal
        isOpen={nuevoModalOpen}
        onClose={() => {
          setNuevoModalOpen(false);
          setEditingAppointment(null);
        }}
        initialDate={slotPrefill?.date}
        initialTime={slotPrefill?.time}
        initialTechId={slotPrefill?.techId}
        editingAppointment={editingAppointment}
        techs={techs}
        onSave={(apt) => {
          // Toast or confirmation
        }}
      />

      <TurnoDetalleModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        techs={techs}
        onStatusChanged={(id, newStatus) => {
          storage.updateAppointmentStatus(id, newStatus);
          setSelectedAppointment(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
        }}
        onEdit={(apt) => {
          setEditingAppointment(apt);
          setNuevoModalOpen(true);
        }}
        onDeleted={(id) => {
          storage.deleteAppointment(id);
          setSelectedAppointment(null);
        }}
      />

      <BuscadorTurnosModal
        isOpen={buscadorOpen}
        onClose={() => setBuscadorOpen(false)}
        appointments={appointments}
        techs={techs}
        onSelectAppointment={(apt) => {
          if (apt.scheduledDate) {
            setCurrentDate(parseISO(apt.scheduledDate));
            setViewMode('hoy');
          }
          setSelectedAppointment(apt);
        }}
      />
    </div>
  );
};
