import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Plus,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  HeartHandshake,
  Share2,
  Zap,
  Eye
} from 'lucide-react';
import { Appointment, NailTechnician, ClientProfile, SupplyItem, AppointmentStatus } from '../../types/nailStudio';
import { BackofficeSection } from './BackofficeSidebar';
import { PlatformTier, PLATFORM_TIERS } from '../../types/platformTiers';
import { calculateTodayHotSlots } from '../../services/hotSlotsService';
import { HotSlotsModal } from '../booking/HotSlotsModal';
import { format, parseISO, isToday, differenceInMinutes, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useWebConfig } from '../../hooks/useWebConfig';
import { storage } from '../../services/storage';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
  clients: ClientProfile[];
  supplies: SupplyItem[];
  onNavigate: (section: BackofficeSection) => void;
  onOpenNewBooking: () => void;
}

export const HomeDashboardView: React.FC<Props> = ({
  appointments,
  techs,
  clients,
  supplies,
  onNavigate,
  onOpenNewBooking
}) => {
  const { config } = useWebConfig();
  const brandName = config.brandName || 'Belcalis Nails';

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedStory, setCopiedStory] = useState(false);
  const [copiedFlashLink, setCopiedFlashLink] = useState(false);
  const [isHotSlotsPreviewOpen, setIsHotSlotsPreviewOpen] = useState(false);

  // Platform Tier Check (Hide inventory for Bronce)
  const [currentTier, setCurrentTier] = useState<PlatformTier>(() => storage.getPlatformTier());
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setCurrentTier(storage.getPlatformTier());
    });
    return unsub;
  }, []);

  const canViewInventory = useMemo(() => {
    return PLATFORM_TIERS[currentTier]?.allowedSections.includes('inventory') ?? false;
  }, [currentTier]);

  // 1. Filter Today's Appointments
  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  
  const todayAppointments = useMemo(() => {
    return appointments
      .filter(a => a.scheduledDate === todayStr && a.status !== 'cancelled')
      .sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));
  }, [appointments, todayStr]);

  // Today Hot Slots calculation (Available Unbooked Slots for Today)
  const hotSlotsSummary = useMemo(() => {
    return calculateTodayHotSlots();
  }, [appointments, techs]);

  // 2. Metrics of Today
  const confirmedOrCompletedToday = useMemo(() => {
    return todayAppointments.filter(a => ['confirmed', 'in_progress', 'completed'].includes(a.status));
  }, [todayAppointments]);

  const estimatedTodayRevenue = useMemo(() => {
    return confirmedOrCompletedToday.reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  }, [confirmedOrCompletedToday]);

  const depositsCollectedToday = useMemo(() => {
    return confirmedOrCompletedToday
      .filter(a => a.depositPaid)
      .reduce((sum, a) => sum + (a.depositAmount || 0), 0);
  }, [confirmedOrCompletedToday]);

  // Estimated occupied hours (assuming 8h standard workday = 480 min per tech)
  const totalOccupiedMin = useMemo(() => {
    return confirmedOrCompletedToday.reduce((sum, a) => sum + (a.totalDurationMin || 90), 0);
  }, [confirmedOrCompletedToday]);

  const availableWorkMin = Math.max(480, (techs.length || 1) * 480);
  const occupancyPercentage = Math.min(100, Math.round((totalOccupiedMin / availableWorkMin) * 100));

  // 3. Current / Upcoming In-Desk Appointment
  const nextUpAppointment = useMemo(() => {
    if (todayAppointments.length === 0) return null;
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const nowMinutes = currentH * 60 + currentM;

    // First check if someone is currently 'in_progress'
    const inProgress = todayAppointments.find(a => a.status === 'in_progress');
    if (inProgress) return { apt: inProgress, status: 'in_progress' as const };

    // Otherwise find next scheduled today
    for (const apt of todayAppointments) {
      if (apt.status === 'completed' || apt.status === 'cancelled') continue;
      const [h, m] = (apt.scheduledTime || '00:00').split(':').map(Number);
      const aptMinutes = h * 60 + m;
      if (aptMinutes >= nowMinutes - 30) {
        return { apt, status: 'upcoming' as const };
      }
    }
    return todayAppointments[0] ? { apt: todayAppointments[0], status: 'upcoming' as const } : null;
  }, [todayAppointments]);

  // Client profile of the next appointment
  const nextClientProfile = useMemo(() => {
    if (!nextUpAppointment) return null;
    return clients.find(
      c => c.phone === nextUpAppointment.apt.clientPhone ||
           c.name.toLowerCase() === nextUpAppointment.apt.clientName.toLowerCase()
    ) || null;
  }, [nextUpAppointment, clients]);

  // 4. Pending Web Bookings that need quick approval
  const pendingWebBookings = useMemo(() => {
    return appointments.filter(a => a.status === 'pending');
  }, [appointments]);

  // 5. Day 18+ Retention Pending (Preventing nail breakage)
  const retentionAlerts = useMemo(() => {
    const now = new Date();
    return clients.filter(c => {
      // Find client's last completed appointment
      const clientApts = appointments
        .filter(a => a.clientPhone === c.phone || a.clientName.toLowerCase() === c.name.toLowerCase())
        .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
      
      const last = clientApts[0];
      if (!last) return false;
      const diff = differenceInDays(now, new Date(last.scheduledDate));
      // In critical retention window (between 18 and 35 days without future appointment)
      const hasFuture = clientApts.some(a => new Date(a.scheduledDate).getTime() >= now.getTime() && a.status !== 'cancelled');
      return diff >= 18 && diff <= 35 && !hasFuture;
    }).slice(0, 4);
  }, [clients, appointments]);

  // 6. Critical Stock Alerts (< minStockAlert)
  const lowStockSupplies = useMemo(() => {
    return supplies.filter(s => s.currentStock <= s.minStockAlert).slice(0, 3);
  }, [supplies]);

  // Actions
  const handleStatusChange = (aptId: string, status: AppointmentStatus) => {
    storage.updateAppointmentStatus(aptId, status);
  };

  const handleCopyBookingLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyFlashLink = () => {
    const url = hotSlotsSummary.shareableUrl;
    navigator.clipboard.writeText(url);
    setCopiedFlashLink(true);
    setTimeout(() => setCopiedFlashLink(false), 2200);
  };

  const handleShareStoryText = () => {
    const text = hotSlotsSummary.shareableStoryCopy;
    navigator.clipboard.writeText(text);
    setCopiedStory(true);
    setTimeout(() => setCopiedStory(false), 2200);
  };

  const openWhatsApp = (phone: string, clientName: string, time?: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hola ${clientName}! ✨ Te escribimos desde ${brandName}${time ? ` para recordarte tu turno de hoy a las ${time} hs.` : '.'} ¿Confirmás tu asistencia? Te esperamos!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const openRetentionWhatsApp = (client: ClientProfile) => {
    const cleanPhone = client.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hola ${client.name}! ✨ Notamos que ya pasaron casi 3 semanas desde tu último set en ${brandName}. Para cuidar la arquitectura de tus uñas y evitar quiebres o desprendimientos, te recomendamos agendar tu service de mantenimiento esta semana. ¿Te gustaría ver los horarios disponibles?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── 1. Atelier Greeting & Live Status Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-5 sm:p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Atelier en Actividad • Hoy {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Hola, {brandName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Resumen operativo en tiempo real: turnos de hoy, clienta en mesa y alertas críticas.
          </p>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/30 bg-[#FFF9FB] dark:bg-card/50 px-4 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-pink-500/10 text-[#DE738F]">
              <Calendar className="size-4.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Turnos Hoy</span>
              <span className="text-base font-extrabold text-foreground">{todayAppointments.length} agendados</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/30 bg-[#FFF9FB] dark:bg-card/50 px-4 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="size-4.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Estimado Hoy</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                ${estimatedTodayRevenue.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/30 bg-[#FFF9FB] dark:bg-card/50 px-4 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <TrendingUp className="size-4.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Ocupación</span>
              <span className="text-base font-extrabold text-foreground">{occupancyPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Quick Counter Bar (Mostrador Express) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenNewBooking}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#DE738F] via-[#D86280] to-[#C45774] text-white shadow-md shadow-pink-500/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-left"
        >
          <div>
            <span className="text-xs font-bold block">+ Agendar Turno</span>
            <span className="text-[10px] text-white/80">Nuevo turno manual</span>
          </div>
          <Plus className="size-5 shrink-0" />
        </button>

        <button
          onClick={handleCopyBookingLink}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer text-left shadow-xs"
        >
          <div>
            <span className="text-xs font-bold text-foreground block">
              {copiedLink ? '¡Link Copiado!' : 'Copiar Link Web'}
            </span>
            <span className="text-[10px] text-muted-foreground">Para stories o chat</span>
          </div>
          {copiedLink ? <Check className="size-4.5 text-emerald-500 shrink-0" /> : <Copy className="size-4.5 text-[#DE738F] shrink-0" />}
        </button>

        <button
          onClick={() => onNavigate('calendar')}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer text-left shadow-xs"
        >
          <div>
            <span className="text-xs font-bold text-foreground block">Ver Agenda Hoy</span>
            <span className="text-[10px] text-muted-foreground">Google Calendar vista</span>
          </div>
          <Calendar className="size-4.5 text-[#DE738F] shrink-0" />
        </button>

        <button
          onClick={() => onNavigate('crm')}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer text-left shadow-xs"
        >
          <div>
            <span className="text-xs font-bold text-foreground block">Fichas Técnicas</span>
            <span className="text-[10px] text-muted-foreground">{clients.length} clientas en CRM</span>
          </div>
          <User className="size-4.5 text-[#DE738F] shrink-0" />
        </button>
      </div>

      {/* ── 3. Main Grid: Current In-Desk Hero + Critical Operational Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Cols: Next / In-Progress Appointment in Mesa */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl border border-rose-200/90 dark:border-rose-900/40 bg-white dark:bg-card p-6 shadow-md overflow-hidden">
            {/* Top Glam Highlight Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DE738F] via-[#E5C158] to-[#C45774]" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-pink-500/10 text-[#DE738F]">
                  <Sparkles className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground font-serif">
                  {nextUpAppointment?.status === 'in_progress' ? 'Atención en Curso (En Mesa)' : 'Próxima Clienta por Atender'}
                </span>
              </div>

              {nextUpAppointment ? (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  nextUpAppointment.status === 'in_progress'
                    ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 animate-pulse'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {nextUpAppointment.status === 'in_progress' ? '● En Mesa' : `A las ${nextUpAppointment.apt.scheduledTime} hs`}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-muted-foreground">Sin turnos pendientes hoy</span>
              )}
            </div>

            {nextUpAppointment ? (
              <div className="space-y-4">
                {/* Client info & Service Box */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF9FB] dark:bg-card/60 border border-rose-100 dark:border-rose-900/30">
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DE738F] to-[#C45774] text-white font-serif font-bold text-xl shadow-md">
                      {nextUpAppointment.apt.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground tracking-tight">
                        {nextUpAppointment.apt.clientName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Phone className="size-3 text-[#DE738F]" />
                        <span>{nextUpAppointment.apt.clientPhone || 'Sin teléfono'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total del Servicio</span>
                    <span className="text-lg font-extrabold text-foreground font-serif">
                      ${nextUpAppointment.apt.totalPrice?.toLocaleString('es-AR') || '0'}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                      {nextUpAppointment.apt.depositPaid ? `✓ Seña de $${nextUpAppointment.apt.depositAmount?.toLocaleString('es-AR')} abonada` : 'Sin seña previa'}
                    </span>
                  </div>
                </div>

                {/* Service Details & HEMA Clinical Alert */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-white dark:bg-card">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">Servicio</span>
                    <span className="font-bold text-foreground block">
                      {nextUpAppointment.apt.serviceId === 'service-kapping' ? 'Kapping con Nivelación Rubber' :
                       nextUpAppointment.apt.serviceId === 'service-softgel' ? 'Soft Gel Tips Press On' :
                       nextUpAppointment.apt.serviceId === 'service-semi' ? 'Esmaltado Semipermanente Ruso' : 'Set Esculpido en Gel'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Duración estimada: {nextUpAppointment.apt.totalDurationMin || 90} minutos
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-white dark:bg-card">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">Diagnóstico Ungueal</span>
                    {nextClientProfile?.allergiesHema ? (
                      <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                        <ShieldAlert className="size-3.5 shrink-0" />
                        <span>¡Alergia a HEMA detectada! Usar geles libres de monómeros.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="size-3.5 shrink-0" />
                        <span>Lámina ungueal sana. Sin alergias registradas.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instant Actions for Current Appointment */}
                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <button
                    onClick={() => openWhatsApp(nextUpAppointment.apt.clientPhone, nextUpAppointment.apt.clientName, nextUpAppointment.apt.scheduledTime)}
                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 shadow-sm transition-all cursor-pointer"
                  >
                    <MessageCircle className="size-4" />
                    <span>WhatsApp Recordatorio</span>
                  </button>

                  {nextUpAppointment.apt.status !== 'in_progress' ? (
                    <button
                      onClick={() => handleStatusChange(nextUpAppointment.apt.id, 'in_progress')}
                      className="flex-1 min-w-[150px] flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white font-semibold text-xs py-2.5 px-4 shadow-sm hover:opacity-90 transition-all cursor-pointer"
                    >
                      <Clock className="size-4" />
                      <span>Iniciar en Mesa</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(nextUpAppointment.apt.id, 'completed')}
                      className="flex-1 min-w-[150px] flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 px-4 shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Completar & Cobrar</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-2">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-[#DE738F] mx-auto">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="font-serif font-bold text-foreground text-sm">No hay clientas en espera en este momento</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Podés agendar un turno manual express o compartir tu enlace web para llenar los espacios de la jornada.
                </p>
                <button
                  onClick={onOpenNewBooking}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#DE738F] hover:underline cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Agendar turno ahora</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Today's Appointment Timeline List ── */}
          <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#DE738F]" />
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-foreground">
                  Cronograma de Hoy ({todayAppointments.length} turnos)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-[11px] font-semibold text-[#DE738F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Agenda Completa</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No hay turnos agendados para la fecha de hoy.
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-rose-200/60 dark:border-rose-900/30 hover:border-rose-300 bg-[#FFFDFE] dark:bg-card transition-all text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-[#C45774] font-bold text-xs font-mono shrink-0">
                        {apt.scheduledTime}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-foreground block truncate">{apt.clientName}</span>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {apt.serviceId === 'service-kapping' ? 'Kapping Rubber' :
                           apt.serviceId === 'service-softgel' ? 'Soft Gel Tips' :
                           apt.serviceId === 'service-semi' ? 'Semi Rusa' : 'Set Esculpido'} • ${apt.totalPrice?.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'in_progress' ? 'bg-purple-500/15 text-purple-700' :
                        apt.status === 'completed' ? 'bg-emerald-500/15 text-emerald-700' :
                        apt.status === 'pending' ? 'bg-amber-500/15 text-amber-700' : 'bg-rose-500/10 text-rose-700'
                      }`}>
                        {apt.status === 'in_progress' ? 'En Mesa' :
                         apt.status === 'completed' ? 'Listo' :
                         apt.status === 'pending' ? 'Pendiente' : 'Confirmado'}
                      </span>

                      <button
                        onClick={() => openWhatsApp(apt.clientPhone, apt.clientName, apt.scheduledTime)}
                        title="Enviar WhatsApp"
                        className="p-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/40 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Operational Alerts (Web Requests, Retention Day 18, Low Stock) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. Solicitudes Web Pendientes de Aprobación */}
          <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Flame className="size-4" />
                </div>
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-foreground">
                  Reservas Web Pendientes ({pendingWebBookings.length})
                </h3>
              </div>
              {pendingWebBookings.length > 0 && (
                <span className="size-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>

            {pendingWebBookings.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FFF9FB] dark:bg-card/50 border border-rose-100 text-center text-xs text-muted-foreground">
                ✓ No tenés solicitudes pendientes. ¡Todo al día!
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingWebBookings.slice(0, 3).map((pending) => (
                  <div
                    key={pending.id}
                    className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{pending.clientName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-bold">
                        {pending.scheduledDate} a las {pending.scheduledTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Total: ${pending.totalPrice?.toLocaleString('es-AR')}</span>
                      <span>Seña req: ${pending.depositAmount?.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleStatusChange(pending.id, 'confirmed')}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Confirmar Turno
                      </button>
                      <button
                        onClick={() => openWhatsApp(pending.clientPhone, pending.clientName, pending.scheduledTime)}
                        className="p-1.5 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <MessageCircle className="size-3.5 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Clientas para Retención (Día 18+ sin agendar service) */}
          <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-pink-500/10 text-[#DE738F]">
                  <HeartHandshake className="size-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-foreground">
                    Retención Inteligente (Día 18+)
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Mantenimiento preventivo de uñas</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#DE738F] bg-rose-500/10 px-2 py-0.5 rounded-full">
                {retentionAlerts.length} clientas
              </span>
            </div>

            {retentionAlerts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FFF9FB] dark:bg-card/50 border border-rose-100 text-center text-xs text-muted-foreground">
                ✓ Todas tus clientas recurrentes tienen turnos agendados.
              </div>
            ) : (
              <div className="space-y-2">
                {retentionAlerts.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-rose-200/60 dark:border-rose-900/30 bg-[#FFFDFE] dark:bg-card text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground block">{client.name}</span>
                      <span className="text-[10px] text-rose-500 font-medium block">
                        Service hace {client.lastVisitDate ? differenceInDays(new Date(), new Date(client.lastVisitDate)) : 20} días
                      </span>
                    </div>

                    <button
                      onClick={() => openRetentionWhatsApp(client)}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="size-3" />
                      <span>Recordar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Insumos con Stock Bajo (Sólo visible en planes con acceso a Proveedores & Logística - Silver u Oro) */}
          {canViewInventory && (
            <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                    <AlertTriangle className="size-4" />
                  </div>
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-foreground">
                    Insumos Críticos
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="text-[10px] font-semibold text-[#DE738F] hover:underline cursor-pointer"
                >
                  Ver Stock
                </button>
              </div>

              {lowStockSupplies.length === 0 ? (
                <div className="p-3 rounded-2xl bg-[#FFF9FB] dark:bg-card/50 border border-rose-100 text-center text-xs text-muted-foreground">
                  ✓ Niveles de stock óptimos en base, rubber y descartables.
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockSupplies.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl border border-rose-200/60 dark:border-rose-900/30 bg-[#FFFDFE] dark:bg-card text-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground block">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.brand} • {item.unit}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        Quedan {item.currentStock}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Calendario en Caliente (Llenar huecos de turnos hoy para maximizar profit) */}
          <div className="rounded-3xl border border-amber-500/40 dark:border-amber-500/25 bg-gradient-to-br from-[#FFF9F6] via-[#FFF3F7] to-[#FFEBF2] dark:from-[#23141A] dark:via-[#1D1016] dark:to-[#170C12] p-5 shadow-sm space-y-3.5 relative overflow-hidden">
            {/* Ambient flame glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8.5 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-[#DE738F] to-[#C45774] text-white shadow-sm shadow-amber-500/30">
                  <Flame className="size-4.5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <span>Calendario en Caliente</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[9px] font-extrabold font-mono border border-amber-500/30">
                      HOY
                    </span>
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    Llenar huecos del día • Maximizar Profit
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                hotSlotsSummary.freeSlots.length > 0
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              }`}>
                {hotSlotsSummary.freeSlots.length > 0
                  ? `${hotSlotsSummary.freeSlots.length} huecos libres`
                  : '✓ Jornada Completa'}
              </span>
            </div>

            {/* Profit Recovery KPI Banner */}
            <div className="p-3 rounded-2xl bg-white/95 dark:bg-card/90 border border-amber-500/20 space-y-1 relative z-10 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="size-3 text-emerald-600" />
                  Profit en juego hoy:
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm font-serif">
                  +${hotSlotsSummary.potentialProfitLoss.toLocaleString('es-AR')}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {hotSlotsSummary.freeSlots.length > 0
                  ? 'Cada turno libre en mesa es ganancia que se pierde al cerrar la jornada. El link flash lleva directo al modal de agendamiento de hoy.'
                  : '¡Excelente! Todos los cupos de hoy están ocupados. ¡Facturación optimizada al 100%!'}
              </p>
            </div>

            {/* Interactive Slot Pills of Today */}
            {hotSlotsSummary.freeSlots.length > 0 && (
              <div className="space-y-1.5 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Horarios libres detectados para hoy:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hotSlotsSummary.freeSlots.map((slot) => (
                    <div
                      key={slot.time}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-card border border-rose-200/90 dark:border-rose-900/40 text-xs font-mono font-bold text-foreground shadow-xs"
                    >
                      <Flame className="size-3 text-amber-500 shrink-0" />
                      <span>{slot.time} hs</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions for Sharing & Maximizing Profit */}
            <div className="space-y-2 pt-1 relative z-10">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyFlashLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-[#DE738F] to-[#C45774] hover:opacity-95 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                  title="Copiar link directo a modal de turnos calientes"
                >
                  {copiedFlashLink ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copiedFlashLink ? '¡Link Copiado!' : 'Copiar Link Flash'}</span>
                </button>

                <button
                  onClick={handleShareStoryText}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white dark:bg-card border border-amber-500/30 hover:border-amber-500 text-foreground font-bold text-[11px] shadow-xs transition-all cursor-pointer"
                  title="Copiar texto con horarios libres para publicar en Instagram Stories o WhatsApp"
                >
                  {copiedStory ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5 text-[#DE738F]" />}
                  <span>{copiedStory ? '¡Texto Copiado!' : 'Texto para Stories'}</span>
                </button>
              </div>

              {/* Live Preview Button */}
              <button
                onClick={() => setIsHotSlotsPreviewOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200/70 dark:border-rose-900/30 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-card/80 transition-colors cursor-pointer"
              >
                <Eye className="size-3.5 text-amber-500" />
                <span>Probar Modal de Clienta en caliente</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Preview for Backoffice testing */}
      <HotSlotsModal
        isOpen={isHotSlotsPreviewOpen}
        onClose={() => setIsHotSlotsPreviewOpen(false)}
        onOpenStandardBooking={onOpenNewBooking}
      />
    </div>
  );
};
