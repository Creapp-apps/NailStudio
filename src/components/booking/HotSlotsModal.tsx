import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { storage } from '../../services/storage';
import { calculateTodayHotSlots, HotSlot } from '../../services/hotSlotsService';
import { NailService, Appointment } from '../../types/nailStudio';
import { useWebConfig } from '../../hooks/useWebConfig';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenStandardBooking?: () => void;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const HotSlotsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenStandardBooking,
  onBookingSuccess
}) => {
  const { config: webConfig } = useWebConfig();
  const brandName = webConfig?.brandName || 'Belcalis Nails';

  // Services available
  const [services] = useState<NailService[]>(() => storage.getServices());
  const [hotSlotsData, setHotSlotsData] = useState(() => calculateTodayHotSlots());

  // Listen to appointments changes to keep slots 100% updated in real-time
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setHotSlotsData(calculateTodayHotSlots());
    });
    return unsub;
  }, []);

  const availableSlots = hotSlotsData.freeSlots;

  // Selected state
  const [selectedSlot, setSelectedSlot] = useState<HotSlot | null>(() => availableSlots[0] || null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    return services[0]?.id || 'service-kapping';
  });

  // Client form
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  // Sync selectedSlot if slots change
  useEffect(() => {
    if (availableSlots.length > 0) {
      if (!selectedSlot || !availableSlots.some(s => s.time === selectedSlot.time)) {
        setSelectedSlot(availableSlots[0]);
      }
    } else {
      setSelectedSlot(null);
    }
  }, [availableSlots, selectedSlot]);

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const todayFormatted = format(new Date(), "EEEE d 'de' MMMM", { locale: es });

  const handleConfirmReservation = () => {
    if (!selectedSlot) {
      alert('Por favor selecciona un horario disponible de hoy.');
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor ingresá tu nombre y WhatsApp para confirmar.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const tech = selectedSlot.availableTechs[0] || storage.getTechs()[0];
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      const created = storage.createAppointment({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: `${clientName.toLowerCase().replace(/\s+/g, '')}@cliente.com`,
        techId: tech?.id || 'tech-1',
        serviceId: currentService?.id || 'service-kapping',
        removalId: 'none',
        nailArtTierId: 'tier-0',
        totalDurationMin: currentService?.baseDurationMin || 75,
        totalPrice: currentService?.basePrice || 18000,
        depositAmount: 5000,
        depositPaid: false,
        scheduledDate: todayStr,
        scheduledTime: selectedSlot.time,
        status: 'confirmed', // Confirmed directly to immediately lock slot and maximize day's profit
        notes: `🔥 RESERVA FLASH (Turno Caliente de Hoy). ${notes}`.trim()
      });

      setIsSubmitting(false);
      setConfirmedApt(created);
      if (onBookingSuccess) onBookingSuccess(created);
    }, 450);
  };

  const handleOpenWhatsAppConfirmation = () => {
    if (!confirmedApt) return;
    const salonSettings = storage.getSalonSettings();
    const cleanPhone = (salonSettings?.phoneWhatsapp || '5491100000000').replace(/\D/g, '');
    const serviceName = currentService?.title || 'Servicio de Uñas';
    const msg = encodeURIComponent(
      `¡Hola ${brandName}! ✨ Acabo de reservar el turno caliente de hoy a las ${confirmedApt.scheduledTime} hs (${serviceName}). Mi nombre es ${confirmedApt.clientName}. ¡Nos vemos en el atelier!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleClose = () => {
    setConfirmedApt(null);
    onClose();
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{
        background: 'radial-gradient(circle at center, rgba(222, 115, 143, 0.14) 0%, rgba(22, 12, 17, 0.48) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] max-h-[92vh] flex flex-col relative rounded-3xl bg-white dark:bg-[#1A1215] shadow-2xl overflow-hidden my-auto border border-rose-200/80 dark:border-rose-900/40 animate-fade-in text-foreground"
        style={{
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(222, 115, 143, 0.25)'
        }}
      >
        {/* Top Flame Glowing Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#DE738F] to-[#C45774]" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-rose-100 dark:border-rose-900/30 flex items-start justify-between bg-gradient-to-b from-[#FFF5F8] dark:from-[#23151B] to-transparent">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-300/40">
                <Flame className="size-3 text-amber-500 animate-pulse" />
                Turnos Calientes de Hoy
              </span>
              <span className="text-[11px] text-muted-foreground font-medium capitalize">
                • {todayFormatted}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-foreground">
              ¡Últimos Huecos Disponibles!
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Completá tu agendamiento express en 30 segundos y asegurá tu turno hoy mismo.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-rose-100/50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {confirmedApt ? (
            /* Celebration Success State */
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="size-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="size-9" />
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
                  ¡Turno Confirmado con Éxito!
                </span>
                <h3 className="text-2xl font-bold font-serif text-foreground">
                  Te esperamos hoy a las {confirmedApt.scheduledTime} hs
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Guardamos tu lugar para <b>{currentService?.title}</b> a nombre de <b>{confirmedApt.clientName}</b>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-bold text-foreground capitalize">Hoy, {todayFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horario:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm font-mono">
                    {confirmedApt.scheduledTime} hs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio:</span>
                  <span className="font-bold text-foreground">{currentService?.title}</span>
                </div>
                <div className="flex justify-between border-t border-rose-200/40 dark:border-rose-900/30 pt-2">
                  <span className="font-semibold text-foreground">Total estimado:</span>
                  <span className="font-extrabold text-foreground text-sm">
                    ${confirmedApt.totalPrice?.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={handleOpenWhatsAppConfirmation}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="size-4" />
                  <span>Avisar por WhatsApp que ya voy</span>
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                >
                  Listo, cerrar
                </button>
              </div>
            </div>
          ) : (
            /* Booking Steps */
            <>
              {/* Step 1: Available Hot Slots */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 font-serif">
                    <Clock className="size-3.5 text-[#DE738F]" />
                    <span>1. Elegí tu horario de hoy</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {availableSlots.length} huecos libres
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-center space-y-2">
                    <p className="text-xs font-medium text-foreground">
                      ¡Ups! Ya se ocuparon todos los turnos del día de hoy.
                    </p>
                    {onOpenStandardBooking && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenStandardBooking();
                        }}
                        className="text-xs font-bold text-[#DE738F] hover:underline cursor-pointer"
                      >
                        Ver agenda para los próximos días →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'border-[#DE738F] bg-gradient-to-br from-[#FFF0F4] to-[#FFE4EC] dark:from-[#2C131C] dark:to-[#220E16] shadow-sm ring-1 ring-[#DE738F]'
                              : 'border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card hover:border-[#DE738F]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-extrabold font-mono tracking-tight text-foreground">
                              {slot.time} hs
                            </span>
                            <Flame className={`size-3.5 ${isSelected ? 'text-amber-500 fill-amber-500' : 'text-amber-500/70'}`} />
                          </div>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            Hoy libre
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Service Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 font-serif">
                  <Sparkles className="size-3.5 text-[#DE738F]" />
                  <span>2. Servicio que te gustaría hacerte</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.slice(0, 4).map((srv) => {
                    const isSelected = selectedServiceId === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#DE738F] bg-gradient-to-br from-[#FFF0F4] to-[#FFE4EC] dark:from-[#2C131C] dark:to-[#220E16] ring-1 ring-[#DE738F]'
                            : 'border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card hover:border-[#DE738F]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground block truncate">
                            {srv.title}
                          </span>
                          <span className="text-xs font-extrabold text-[#DE738F] shrink-0 font-serif">
                            ${srv.basePrice.toLocaleString('es-AR')}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {srv.baseDurationMin} minutos
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Fast Contact Info */}
              <div className="space-y-3 pt-1 border-t border-rose-100 dark:border-rose-900/30">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 font-serif">
                  <User className="size-3.5 text-[#DE738F]" />
                  <span>3. Tus datos de contacto</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Sofía Herrera"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-card focus:outline-none focus:ring-1 focus:ring-[#DE738F]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 11 3456 7890"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-card focus:outline-none focus:ring-1 focus:ring-[#DE738F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                    Nota o diseño especial (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Tengo retiro previo de otro salón / busco nail art francés"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-card focus:outline-none focus:ring-1 focus:ring-[#DE738F]"
                  />
                </div>
              </div>

              {/* Action Submit */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSubmitting || availableSlots.length === 0}
                  onClick={handleConfirmReservation}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-[#DE738F] to-[#C45774] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Flame className="size-4" />
                  <span>
                    {isSubmitting
                      ? 'Confirmando tu lugar...'
                      : selectedSlot
                      ? `¡Asegurar Turno Hoy a las ${selectedSlot.time} hs!`
                      : 'Seleccioná un horario'}
                  </span>
                  <ArrowRight className="size-4 ml-1" />
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  <span>Confirmación inmediata sin esperas. ¡Llegás y te atendemos!</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
