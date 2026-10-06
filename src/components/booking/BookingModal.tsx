import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building2,
  Copy,
  Lock,
  AlertCircle
} from 'lucide-react';
import { NailService, RemovalOption, NailArtTier, NailTechnician, Appointment, DayOfWeekKey, TimeRangeBlock } from '../../types/nailStudio';
import { INITIAL_SERVICES, REMOVAL_OPTIONS, NAIL_ART_TIERS } from '../../services/mockData';
import { storage, DEFAULT_SCHEDULE_BY_DAY } from '../../services/storage';
import { useWebConfig } from '../../hooks/useWebConfig';
import { LuxuryDatePicker } from '../common/LuxuryDatePicker';
import { mercadoPagoService } from '../../services/mercadoPagoService';
import { format } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  onBookingSuccess?: (appointment: Appointment) => void;
}

const DAY_KEYS: DayOfWeekKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const BookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  onBookingSuccess
}) => {
  const { config: webConfig } = useWebConfig();
  const [services, setServices] = useState<NailService[]>(() => {
    const s = storage.getServices();
    return s.length > 0 ? s : INITIAL_SERVICES;
  });
  const [removals, setRemovals] = useState<RemovalOption[]>(() => {
    const r = storage.getRemovals();
    return r.length > 0 ? r : REMOVAL_OPTIONS;
  });
  const [nailArtTiers, setNailArtTiers] = useState<NailArtTier[]>(() => {
    const t = storage.getNailArtTiers();
    return t.length > 0 ? t : NAIL_ART_TIERS;
  });
  const [availableTechs, setAvailableTechs] = useState<NailTechnician[]>(() => storage.getTechs());
  const [salonSettings, setSalonSettings] = useState(() => storage.getSalonSettings());
  const [appointments, setAppointments] = useState(() => storage.getAppointments());

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      const s = storage.getServices();
      if (s.length > 0) setServices(s);
      const r = storage.getRemovals();
      if (r.length > 0) setRemovals(r);
      const t = storage.getNailArtTiers();
      if (t.length > 0) setNailArtTiers(t);
      setAvailableTechs(storage.getTechs());
      setSalonSettings(storage.getSalonSettings());
      setAppointments(storage.getAppointments());
    });
    return unsub;
  }, []);

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<NailService | null>(
    services.find(s => s.id === preselectedServiceId) || services[0]
  );

  // Synchronize preselected service when opening modal with a chosen design
  useEffect(() => {
    if (preselectedServiceId) {
      const match = services.find(s => s.id === preselectedServiceId);
      if (match) setSelectedService(match);
    }
  }, [preselectedServiceId, services, isOpen]);

  const [selectedRemoval, setSelectedRemoval] = useState<RemovalOption>(removals[0] || REMOVAL_OPTIONS[0]);
  const [selectedNailArt, setSelectedNailArt] = useState<NailArtTier>(nailArtTiers[0] || NAIL_ART_TIERS[0]);
  const [selectedTech, setSelectedTech] = useState<NailTechnician | null>(availableTechs[0] || null);

  // Helper to find next open date
  const findNextOpenDate = (fromStr: string) => {
    const sched = salonSettings.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY;
    const curr = new Date(fromStr + 'T12:00:00');
    for (let i = 0; i < 14; i++) {
      const key = DAY_KEYS[curr.getDay()];
      if (sched[key]?.enabled && sched[key]?.ranges.length > 0) {
        return format(curr, 'yyyy-MM-dd');
      }
      curr.setDate(curr.getDate() + 1);
    }
    return fromStr;
  };

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return findNextOpenDate(format(new Date(), 'yyyy-MM-dd'));
  });
  const [selectedTime, setSelectedTime] = useState<string>('14:00');

  // Keep selected tech synced when availableTechs loads or updates
  useEffect(() => {
    if (!selectedTech && availableTechs.length > 0) {
      setSelectedTech(availableTechs[0]);
    }
  }, [availableTechs, selectedTech]);

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transfer'>('mercadopago');
  const [copiedAlias, setCopiedAlias] = useState<boolean>(false);
  const [isRedirectingMp, setIsRedirectingMp] = useState<boolean>(false);
  const [mpError, setMpError] = useState<string | null>(null);

  const totalDuration = (selectedService?.baseDurationMin || 0) +
    selectedRemoval.additionalDurationMin +
    selectedNailArt.additionalDurationMin;

  const totalPrice = (selectedService?.basePrice || 0) +
    selectedRemoval.additionalPrice +
    selectedNailArt.price;

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const timeFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}` || '0m';

  // Dynamic schedule calculation for the selected date
  const currentDaySchedule = useMemo(() => {
    try {
      const d = new Date(selectedDate + 'T12:00:00');
      const dayKey = DAY_KEYS[d.getDay()];
      const sched = salonSettings.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY;
      return sched[dayKey] || { enabled: false, ranges: [] };
    } catch {
      return { enabled: false, ranges: [] };
    }
  }, [selectedDate, salonSettings]);

  const isDayClosed = !currentDaySchedule.enabled || currentDaySchedule.ranges.length === 0;

  // Generate available slots based on the day's time blocks and active bookings
  const availableHours = useMemo(() => {
    if (isDayClosed) return [];

    const effectiveSlotDuration = totalDuration > 0 ? totalDuration : 60;
    const stepMin = 30; // Offer slots every 30 mins
    const generated: string[] = [];

    const activeApts = appointments.filter(a =>
      a.scheduledDate === selectedDate &&
      a.status !== 'cancelled' &&
      (!selectedTech || a.techId === selectedTech.id)
    );

    const toMinutes = (timeStr: string) => {
      const [h, m] = (timeStr || '00:00').split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const toTimeString = (totalMin: number) => {
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    currentDaySchedule.ranges.forEach((range: TimeRangeBlock) => {
      const startM = toMinutes(range.startTime);
      const endM = toMinutes(range.endTime);

      for (let curr = startM; curr + effectiveSlotDuration <= endM; curr += stepMin) {
        const slotEnd = curr + effectiveSlotDuration;

        const hasCollision = activeApts.some(apt => {
          const aptStart = toMinutes(apt.scheduledTime);
          const aptEnd = aptStart + (apt.totalDurationMin || 60);
          return Math.max(curr, aptStart) < Math.min(slotEnd, aptEnd);
        });

        if (!hasCollision) {
          const timeStr = toTimeString(curr);
          if (!generated.includes(timeStr)) {
            generated.push(timeStr);
          }
        }
      }
    });

    return generated;
  }, [isDayClosed, currentDaySchedule, totalDuration, appointments, selectedDate, selectedTech]);

  // Keep selectedTime synced with available slots
  useEffect(() => {
    if (availableHours.length > 0) {
      if (!selectedTime || !availableHours.includes(selectedTime)) {
        setSelectedTime(availableHours[0]);
      }
    } else {
      setSelectedTime('');
    }
  }, [availableHours, selectedTime]);

  const stepTitles = [
    'Técnica Estructural Base',
    'Retiro de Producto Previo',
    'Nivel de Nail Art & Efectos',
    'Especialista & Horario',
    'Datos de Contacto'
  ];

  const handleConfirmBooking = async () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor completa tu nombre y número de WhatsApp');
      return;
    }

    const targetTech = selectedTech || availableTechs[0] || null;
    const targetTechId = targetTech?.id || 'tech-1';
    const depositVal = salonSettings.depositAmount || 5000;

    setIsSubmitting(true);
    setMpError(null);

    // Flow A: Mercado Pago Checkout Pro
    if (paymentMethod === 'mercadopago') {
      setIsRedirectingMp(true);
      try {
        const created = storage.createAppointment({
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          clientEmail: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          techId: targetTechId,
          serviceId: selectedService!.id,
          removalId: selectedRemoval.id,
          nailArtTierId: selectedNailArt.id,
          totalDurationMin: totalDuration,
          totalPrice,
          depositAmount: depositVal,
          depositPaid: false,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          status: 'pending',
          notes: bookingNotes ? `${bookingNotes} [Seña Mercado Pago]` : '[Seña Mercado Pago]'
        });

        const pref = await mercadoPagoService.createPreference({
          appointment: created,
          amount: depositVal,
          title: `Seña Turno: ${selectedService!.title} - Belcalis Nails`,
          client: {
            name: clientName.trim(),
            phone: clientPhone.trim(),
            email: clientEmail.trim() || undefined
          }
        });

        const targetUrl = (storage.getIntegrations()?.mercadoPago?.sandboxMode && pref.sandboxInitPoint)
          ? pref.sandboxInitPoint
          : pref.initPoint;

        window.location.href = targetUrl;
      } catch (err: any) {
        console.error('Error al iniciar Mercado Pago:', err);
        setMpError(err.message || 'No se pudo conectar con Mercado Pago. Podés intentar nuevamente o abonar por Transferencia Bancaria.');
        setIsSubmitting(false);
        setIsRedirectingMp(false);
      }
      return;
    }

    // Flow B: Manual Transfer with WhatsApp
    setTimeout(() => {
      const created = storage.createAppointment({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        techId: targetTechId,
        serviceId: selectedService!.id,
        removalId: selectedRemoval.id,
        nailArtTierId: selectedNailArt.id,
        totalDurationMin: totalDuration,
        totalPrice,
        depositAmount: depositVal,
        depositPaid: false,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        status: 'pending',
        notes: bookingNotes ? `${bookingNotes} [Transferencia manual]` : '[Transferencia manual]'
      });

      setIsSubmitting(false);
      setConfirmedApt(created);
      if (onBookingSuccess) onBookingSuccess(created);
    }, 400);
  };

  const handleResetAndClose = () => {
    setConfirmedApt(null);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto"
      style={{
        background: 'radial-gradient(circle at center, rgba(222, 115, 143, 0.14) 0%, rgba(22, 12, 17, 0.48) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {/* FLOATING MODAL CARD (Luxury Editorial Haute Glam) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[760px] max-h-[94vh] sm:max-h-[88vh] flex flex-col relative rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden my-auto animate-fade-in"
        style={{
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(222, 115, 143, 0.22)'
        }}
      >
        {/* Top Accent Luxury Ribbon */}
        <div
          className="h-1 w-full shrink-0"
          style={{
            background: 'linear-gradient(90deg, #DE738F 0%, #E0C89E 50%, #C45774 100%)'
          }}
        />

        {/* Compact Header Bar - Centered Luxury Editorial */}
        <div
          className="relative px-4 py-3.5 sm:px-6 sm:py-4 border-b shrink-0 text-center flex flex-col items-center justify-center"
          style={{
            borderColor: 'rgba(222, 115, 143, 0.16)',
            background: 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)'
          }}
        >
          {/* Close button positioned top-right with accessible touch area */}
          <button
            onClick={handleResetAndClose}
            type="button"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full border border-black/10 bg-black/[0.03] text-stone-500 hover:text-stone-800 hover:bg-black/[0.06] flex items-center justify-center transition-all cursor-pointer z-10"
            title="Cerrar"
          >
            <X size={16} />
          </button>

          {/* Eyebrow: Brand & Step Indicator */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-1 pr-6 pl-6 sm:px-0">
            {webConfig.customLogoUrl ? (
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white border border-[#DE738F]/30 flex items-center justify-center shrink-0">
                <img
                  src={webConfig.customLogoUrl}
                  alt={webConfig.brandName}
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${(webConfig.customLogoScale || 100) / 100})` }}
                />
              </div>
            ) : null}
            <span
              className="text-[0.66rem] uppercase tracking-[0.14em] font-bold text-[#C45774]"
              style={{ fontFamily: 'var(--font-couture)' }}
            >
              {webConfig.brandName || 'Belcalis Nails'}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[0.72rem] text-stone-500 font-semibold">
              {!confirmedApt ? `Paso ${step} de 5: ${stepTitles[step - 1]}` : 'Turno Confirmado'}
            </span>
          </div>

          {/* Centered Serif Glam Headline */}
          <h2
            className="text-lg sm:text-2xl font-bold tracking-tight text-[#2B181C] m-0 leading-tight uppercase font-serif-glam"
            style={{ letterSpacing: '0.02em' }}
          >
            {!confirmedApt ? 'Reserva tu Turno Exclusivo' : '¡Tu Cita ha sido Agendada!'}
          </h2>

          {/* Step Progress Dots */}
          {!confirmedApt && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {[1, 2, 3, 4, 5].map(s => (
                <div
                  key={s}
                  style={{
                    width: step === s ? '22px' : '7px',
                    height: '6px',
                    borderRadius: '3px',
                    background: step === s
                      ? 'var(--brand-pink-dark, #C45774)'
                      : step > s
                        ? '#C45774'
                        : 'rgba(222, 115, 143, 0.25)',
                    transition: 'all 0.25s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Body Content (Fluid, Responsive, Centered & Zero Clip) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-5 max-h-[64vh] sm:max-h-[460px] flex flex-col justify-start sm:justify-center w-full box-border">
          {confirmedApt ? (
            /* Confirmation View */
            <div className="animate-fade-in text-center py-2 sm:py-4 max-w-lg mx-auto w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-800 flex items-center justify-center mx-auto mb-2.5">
                <Check size={26} strokeWidth={2.5} />
              </div>

              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold text-emerald-800 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Transmitido a Recepción en Tiempo Real
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl text-[#2B181C] font-serif-glam font-bold mb-1">
                ¡Turno recibido, {confirmedApt.clientName}!
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mb-3.5 leading-relaxed">
                Tu reserva para el <strong>{confirmedApt.scheduledDate}</strong> a las <strong>{confirmedApt.scheduledTime} hs</strong> ha ingresado a la terminal del atelier.
              </p>

              <div className="bg-[#FAF6F7] rounded-xl p-3.5 sm:p-4 max-w-md mx-auto mb-4 border border-[#DE738F]/20 text-xs sm:text-sm text-left">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-stone-500">Especialista:</span>
                  <strong className="text-[#2B181C]">
                    {selectedTech ? `${selectedTech.name} (${selectedTech.role})` : 'Mesa de Alta Precisión (Asignada)'}
                  </strong>
                </div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-stone-500">Técnica & Deco:</span>
                  <strong className="text-[#2B181C]">{selectedService?.title} ({selectedNailArt.name.split(':')[0]})</strong>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-stone-200 font-bold">
                  <span>Total estimado:</span>
                  <span className="text-[#C45774]">${confirmedApt.totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-[0.72rem] text-stone-500">
                  <span>Seña requerida:</span>
                  <span className="font-semibold text-stone-700">${(confirmedApt.depositAmount || 5000).toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <a
                  href={`https://wa.me/${(salonSettings.phoneWhatsapp || '+54 9 11 5820-9911').replace(/\D/g, '')}?text=${encodeURIComponent(
                    `¡Hola Belcalis Nails! Acabo de solicitar mi turno para el ${confirmedApt.scheduledDate} a las ${confirmedApt.scheduledTime} hs (${selectedService?.title}). Mi nombre es ${confirmedApt.clientName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-satin-pink px-5 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 rounded-full cursor-pointer shadow-md bg-[#25D366] hover:bg-[#20ba5a] text-white"
                >
                  <span>Enviar Comprobante por WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer shadow-sm"
                >
                  <Check size={16} strokeWidth={2.5} />
                  <span>Finalizar</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SERVICE (Responsive Grid - Zero Truncation, High-End Luxury Cards) */}
              {step === 1 && (
                <div className="animate-fade-in w-full max-w-2xl mx-auto flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
                    {services.filter(s => s.isActive !== false).map(srv => {
                      const isSelected = selectedService?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`relative rounded-xl p-3 sm:p-3.5 cursor-pointer transition-all duration-200 flex flex-col justify-between border ${
                            isSelected
                              ? 'border-[#C45774] ring-2 ring-[#C45774]/30 bg-[#DE738F]/[0.06] shadow-md shadow-[#DE738F]/15'
                              : 'border-[#DE738F]/25 bg-white hover:border-[#DE738F]/50 hover:shadow-xs'
                          }`}
                          style={{ minHeight: '105px' }}
                        >
                          <div>
                            {/* Category & Badge Header Row */}
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[0.66rem] sm:text-[0.68rem] font-bold uppercase tracking-wider text-[#C45774]">
                                {srv.category}
                              </span>
                              {srv.badge && (
                                <span className="text-[0.58rem] sm:text-[0.62rem] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#DE738F]/15 text-[#B83256] border border-[#DE738F]/30 shrink-0">
                                  {srv.badge}
                                </span>
                              )}
                            </div>

                            {/* Service Title - Full Title, Never Cut Off */}
                            <h4 className="text-[0.88rem] sm:text-[0.92rem] font-bold text-[#2B181C] leading-snug mb-1">
                              {srv.title}
                            </h4>

                            {/* Legible Description */}
                            <p className="text-[0.72rem] sm:text-[0.75rem] text-stone-500 leading-relaxed mb-2.5">
                              {srv.description}
                            </p>
                          </div>

                          {/* Price & Duration Strip - Always Clear and Fully Visible */}
                          <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-200/80">
                            <span className="text-[0.95rem] sm:text-base font-extrabold text-[#C45774]">
                              ${srv.basePrice.toLocaleString('es-AR')}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[0.72rem] font-semibold text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/60">
                              <Clock size={11} className="text-[#C45774]" />
                              <span>{srv.baseDurationMin} min</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: REMOVAL (Responsive Row Cards) */}
              {step === 2 && (
                <div className="animate-fade-in w-full max-w-xl mx-auto flex flex-col justify-center">
                  <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
                    {removals.filter(r => r.isActive !== false).map(rem => {
                      const isSelected = selectedRemoval.id === rem.id;
                      return (
                        <div
                          key={rem.id}
                          onClick={() => setSelectedRemoval(rem)}
                          className={`rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 border ${
                            isSelected
                              ? 'border-[#C45774] ring-2 ring-[#C45774]/30 bg-[#DE738F]/[0.06] shadow-md shadow-[#DE738F]/15'
                              : 'border-[#DE738F]/25 bg-white hover:border-[#DE738F]/50 hover:shadow-xs'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="text-[0.88rem] sm:text-[0.92rem] font-bold text-[#2B181C] leading-snug mb-0.5">
                              {rem.label}
                            </h4>
                            <p className="text-[0.72rem] sm:text-[0.75rem] text-stone-500 leading-relaxed m-0">
                              {rem.description}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[0.92rem] sm:text-base font-extrabold text-[#C45774]">
                              {rem.additionalPrice > 0 ? `+$${rem.additionalPrice.toLocaleString('es-AR')}` : 'Sin costo'}
                            </div>
                            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-stone-400">
                              {rem.additionalDurationMin > 0 ? `+${rem.additionalDurationMin} min` : '0 min'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: NAIL ART (Responsive Cards - Zero Text Truncation) */}
              {step === 3 && (
                <div className="animate-fade-in w-full max-w-2xl mx-auto flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
                    {nailArtTiers.filter(t => t.isActive !== false).map(tier => {
                      const isSelected = selectedNailArt.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedNailArt(tier)}
                          className={`rounded-xl p-3 sm:p-3.5 cursor-pointer transition-all duration-200 flex flex-col justify-between border ${
                            isSelected
                              ? 'border-[#C45774] ring-2 ring-[#C45774]/30 bg-[#DE738F]/[0.06] shadow-md shadow-[#DE738F]/15'
                              : 'border-[#DE738F]/25 bg-white hover:border-[#DE738F]/50 hover:shadow-xs'
                          }`}
                          style={{ minHeight: '105px' }}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-[0.88rem] sm:text-[0.92rem] font-bold text-[#2B181C] leading-snug">
                                {tier.name.split(':')[0]}
                              </h4>
                              <span className="text-[0.88rem] sm:text-[0.92rem] font-extrabold text-[#C45774] shrink-0">
                                {tier.price > 0 ? `+$${tier.price.toLocaleString('es-AR')}` : 'Incluido'}
                              </span>
                            </div>
                            <p className="text-[0.72rem] sm:text-[0.75rem] text-stone-500 leading-relaxed mb-2">
                              {tier.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1 pt-1.5 border-t border-dashed border-stone-200/80">
                            {tier.examples.map(ex => (
                              <span
                                key={ex}
                                className="text-[0.62rem] sm:text-[0.65rem] font-medium bg-[#DE738F]/10 text-[#2B181C] px-2 py-0.5 rounded-md"
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: TECH, DATE & TIME (Responsive Centered Layout) */}
              {step === 4 && (
                <div className="animate-fade-in w-full max-w-2xl mx-auto flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
                    {/* Specialist & Date */}
                    <div className="flex flex-col gap-3.5 w-full">
                      <div>
                        <label className="text-[0.72rem] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                          Especialista & Mesa
                        </label>
                        {availableTechs.length > 0 ? (
                          <div className="space-y-2">
                            {availableTechs.map(tech => {
                              const isSelected = selectedTech?.id === tech.id;
                              return (
                                <button
                                  key={tech.id}
                                  type="button"
                                  onClick={() => setSelectedTech(tech)}
                                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-[#C45774] bg-gradient-to-r from-[#FFF5F7] to-[#FFF0F4] shadow-sm ring-1 ring-[#DE738F]/30'
                                      : 'border-stone-200 bg-white hover:border-[#DE738F]/40 hover:bg-stone-50/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DE738F]/30 shrink-0 bg-stone-100">
                                      {tech.avatar ? (
                                        <img src={tech.avatar} alt={tech.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#C45774]">
                                          {tech.name.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="truncate">
                                      <div className="text-xs sm:text-sm font-bold text-[#2B181C] flex items-center gap-1.5">
                                        <span>{tech.name}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#DE738F]/15 text-[#C45774] font-medium">
                                          {tech.role}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                                        <span>Mesa Técnica</span>
                                        <span>•</span>
                                        <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                                          ⭐ {tech.rating || 5.0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                    isSelected
                                      ? 'bg-[#C45774] border-[#C45774] text-white'
                                      : 'border-stone-300 bg-white'
                                  }`}>
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl border border-[#DE738F]/25 bg-[#DE738F]/5 flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2B181C]">
                            <Sparkles size={14} className="text-[#C45774] shrink-0" />
                            <span>Mesa de Alta Precisión (Asignada automáticamente)</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full">
                        <LuxuryDatePicker
                          label="Fecha de Atención"
                          value={selectedDate}
                          onChange={setSelectedDate}
                          minDate={format(new Date(), 'yyyy-MM-dd')}
                          isDateDisabled={(date) => {
                            const dayKey = DAY_KEYS[date.getDay()];
                            const sched = salonSettings.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY;
                            const config = sched[dayKey];
                            return !config || !config.enabled || config.ranges.length === 0;
                          }}
                        />
                      </div>
                    </div>

                    {/* Available Hours */}
                    <div className="w-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[0.72rem] font-bold uppercase tracking-wider text-stone-500 block">
                            Horarios Disponibles (Sesión {totalDuration} min)
                          </label>
                          {!isDayClosed && (
                            <span className="text-[10px] font-bold text-[#C45774] bg-[#DE738F]/10 px-2 py-0.5 rounded-full">
                              {availableHours.length} turno(s) libre(s)
                            </span>
                          )}
                        </div>

                        {/* Franjas del día info banner */}
                        {!isDayClosed && currentDaySchedule.ranges.length > 0 && (
                          <div className="text-[10px] text-stone-500 bg-[#FAF6F7] border border-[#DE738F]/20 rounded-lg p-2 mb-2 flex items-center gap-1.5">
                            <Clock size={11} className="text-[#C45774] shrink-0" />
                            <span className="truncate">
                              Franjas habilitadas: {currentDaySchedule.ranges.map((r: TimeRangeBlock) => `${r.startTime} a ${r.endTime}`).join(' • ')}
                            </span>
                          </div>
                        )}

                        {isDayClosed ? (
                          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 text-center space-y-1.5 my-2">
                            <div className="text-xs font-bold text-[#C45774]">Atelier cerrado en este día</div>
                            <p className="text-[11px] text-stone-500">
                              No hay atención ni turnos habilitados para esta fecha. Por favor seleccioná un día habilitado en el calendario.
                            </p>
                          </div>
                        ) : availableHours.length === 0 ? (
                          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 text-center space-y-1.5 my-2">
                            <div className="text-xs font-bold text-stone-700">Sin turnos disponibles</div>
                            <p className="text-[11px] text-stone-500">
                              No quedan horarios libres para una sesión de {totalDuration} min dentro de las franjas de este día.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 w-full max-h-52 overflow-y-auto pr-0.5">
                            {availableHours.map((hour: string) => {
                              const isSelected = selectedTime === hour;
                              return (
                                <button
                                  key={hour}
                                  type="button"
                                  onClick={() => setSelectedTime(hour)}
                                  className={`py-2 px-1 text-center rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-[#C45774] text-white border-[#C45774] shadow-sm shadow-[#C45774]/30'
                                      : 'bg-white text-[#2B181C] border-stone-200 hover:border-[#DE738F]/40 hover:bg-[#DE738F]/5'
                                  }`}
                                >
                                  {hour}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CONTACT FORM (Responsive Aligned Layout) */}
              {step === 5 && (
                <div className="animate-fade-in w-full max-w-xl mx-auto flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 w-full">
                    <div>
                      <label className="text-[0.72rem] font-bold text-[#2B181C] block mb-1">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Sofía Rossi"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#C45774] focus:ring-2 focus:ring-[#DE738F]/20"
                      />
                    </div>
                    <div>
                      <label className="text-[0.72rem] font-bold text-[#2B181C] block mb-1">
                        WhatsApp de Contacto *
                      </label>
                      <input
                        type="tel"
                        placeholder="+54 9 11 4455-6677"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#C45774] focus:ring-2 focus:ring-[#DE738F]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div>
                      <label className="text-[0.72rem] font-bold text-[#2B181C] block mb-1">
                        Email (opcional)
                      </label>
                      <input
                        type="email"
                        placeholder="tuemail@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#C45774] focus:ring-2 focus:ring-[#DE738F]/20"
                      />
                    </div>
                    <div>
                      <label className="text-[0.72rem] font-bold text-[#2B181C] block mb-1">
                        Notas o alergias al HEMA
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Uñas cortas / Alergias"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#C45774] focus:ring-2 focus:ring-[#DE738F]/20"
                      />
                    </div>
                  </div>

                  {/* Trust Banner */}
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[0.7rem] sm:text-xs text-amber-900 w-full">
                    <ShieldCheck size={16} className="text-amber-700 shrink-0" />
                    <span>Seña deducible de ${(salonSettings.depositAmount || 5000).toLocaleString('es-AR')} ARS al presentarte en el salón. Cancelación con 24h de aviso.</span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="mt-3.5 pt-3 border-t border-stone-200 w-full">
                    <label className="text-[0.72rem] font-bold text-[#2B181C] block mb-2">
                      Elegí cómo abonar tu Seña de ${(salonSettings.depositAmount || 5000).toLocaleString('es-AR')} ARS:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Option 1: Mercado Pago (Checkout Pro) */}
                      <div
                        onClick={() => setPaymentMethod('mercadopago')}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          paymentMethod === 'mercadopago'
                            ? 'border-[#009EE3] bg-[#009EE3]/5 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-md bg-[#009EE3] text-white flex items-center justify-center font-black text-[10px]">
                                MP
                              </div>
                              <span className="font-bold text-xs text-stone-900">Mercado Pago</span>
                            </div>
                            <span className="text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#009EE3]/15 text-[#0074A8]">
                              Inmediato
                            </span>
                          </div>
                          <p className="text-[0.68rem] text-stone-500 leading-tight">
                            Tarjetas de débito/crédito, dinero en cuenta o transferencia vía MP.
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1 text-[0.65rem] text-[#0074A8] font-semibold">
                          <Lock size={11} /> Checkout Pro 100% Seguro
                        </div>
                      </div>

                      {/* Option 2: Transferencia Directa */}
                      <div
                        onClick={() => setPaymentMethod('transfer')}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          paymentMethod === 'transfer'
                            ? 'border-[#C45774] bg-[#C45774]/5 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Building2 size={16} className="text-[#C45774]" />
                              <span className="font-bold text-xs text-stone-900">Transferencia</span>
                            </div>
                            <span className="text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              Alias / CBU
                            </span>
                          </div>
                          <p className="text-[0.68rem] text-stone-500 leading-tight">
                            Transferí desde tu app bancaria y adjuntá comprobante.
                          </p>
                        </div>

                        {salonSettings.bankAlias ? (
                          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[0.68rem]">
                            <span className="font-mono text-stone-700 font-semibold truncate max-w-[130px]">
                              {salonSettings.bankAlias}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(salonSettings.bankAlias);
                                setCopiedAlias(true);
                                setTimeout(() => setCopiedAlias(false), 2000);
                              }}
                              className="text-[#C45774] font-bold hover:underline flex items-center gap-0.5"
                            >
                              <Copy size={11} /> {copiedAlias ? '¡Copiado!' : 'Copiar'}
                            </button>
                          </div>
                        ) : (
                          <div className="mt-2.5 pt-2 border-t border-stone-100 text-[0.65rem] text-stone-400">
                            Alias disponible al confirmar
                          </div>
                        )}
                      </div>
                    </div>

                    {mpError && (
                      <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
                        <AlertCircle size={15} className="shrink-0 text-rose-600" />
                        <span>{mpError}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Integrated Micro-Summary Footer Bar (Responsive Centered & High-End) */}
        {!confirmedApt && (
          <div
            className="px-4 py-3 sm:px-6 sm:py-3.5 border-t shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
            style={{
              borderColor: 'rgba(222, 115, 143, 0.16)',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9FA 100%)'
            }}
          >
            {/* Live Pricing & Duration Breakdown Pill */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <div className="bg-[#DE738F]/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold text-[#2B181C]">
                <Clock size={13} className="text-[#C45774]" />
                <span>{timeFormatted}</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-[#C45774]">
                ${totalPrice.toLocaleString('es-AR')}
                <span className="text-[0.68rem] font-semibold text-stone-400 ml-1.5 font-sans">
                  (Seña ${(salonSettings.depositAmount || 5000).toLocaleString('es-AR')})
                </span>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 font-semibold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <ArrowLeft size={14} />
                  <span>Volver</span>
                </button>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 4) {
                      if (isDayClosed) {
                        alert('El atelier se encuentra cerrado en la fecha seleccionada. Por favor elegí otro día en el calendario.');
                        return;
                      }
                      if (!selectedTime) {
                        alert('Por favor seleccioná un horario disponible para tu turno.');
                        return;
                      }
                    }
                    setStep(s => s + 1);
                  }}
                  className={`btn-satin-pink px-5 py-2 text-xs sm:text-sm flex items-center justify-center gap-2 rounded-full cursor-pointer shadow-md ${
                    step === 1 ? 'w-full sm:w-auto' : 'flex-1 sm:flex-initial'
                  }`}
                >
                  <span>Continuar</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className={`btn-satin-pink px-6 py-2 text-xs sm:text-sm flex items-center justify-center gap-2 rounded-full cursor-pointer shadow-md transition-all ${
                    paymentMethod === 'mercadopago'
                      ? 'bg-gradient-to-r from-[#009EE3] to-[#0074A8] text-white hover:brightness-105'
                      : 'bg-gradient-to-r from-[#427A5B] to-[#2F5740] text-white'
                  } ${step === 1 ? 'w-full sm:w-auto' : 'flex-1 sm:flex-initial'}`}
                >
                  {isSubmitting ? (
                    <span>{isRedirectingMp ? 'Abriendo Mercado Pago...' : 'Confirmando...'}</span>
                  ) : paymentMethod === 'mercadopago' ? (
                    <>
                      <span>Abonar Seña con Mercado Pago</span>
                      <Lock size={13} />
                    </>
                  ) : (
                    <>
                      <span>Confirmar y Enviar Comprobante</span>
                      <Check size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
