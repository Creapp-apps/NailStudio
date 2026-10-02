import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Sparkles,
  Scissors,
  CheckCircle2,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';
import {
  Appointment,
  NailTechnician,
  NailService,
  RemovalType,
  NailArtTier,
  AppointmentStatus
} from '../../../types/nailStudio';
import { INITIAL_SERVICES, REMOVAL_OPTIONS, NAIL_ART_TIERS } from '../../../services/mockData';
import { storage } from '../../../services/storage';
import { LuxuryDatePicker } from '../../common/LuxuryDatePicker';
import { LuxuryTimePicker } from '../../common/LuxuryTimePicker';
import { LuxurySelect } from '../../common/LuxurySelect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (appointment: Appointment) => void;
  initialDate?: string;
  initialTime?: string;
  initialTechId?: string;
  editingAppointment?: Appointment | null;
  techs: NailTechnician[];
}

export const NuevoTurnoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  initialTime,
  initialTechId,
  editingAppointment,
  techs
}) => {
  const services = useMemo(() => {
    const s = storage.getServices();
    return s.length > 0 ? s : INITIAL_SERVICES;
  }, []);

  const clients = useMemo(() => storage.getClients(), [isOpen]);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [techId, setTechId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [removalId, setRemovalId] = useState<RemovalType>('none');
  const [nailArtTierId, setNailArtTierId] = useState('art-0');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [depositAmount, setDepositAmount] = useState(5000);
  const [depositPaid, setDepositPaid] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('confirmed');

  const [nameSuggestions, setNameSuggestions] = useState<typeof clients>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize or reset form on open/change
  useEffect(() => {
    if (!isOpen) return;

    if (editingAppointment) {
      setClientName(editingAppointment.clientName);
      setClientPhone(editingAppointment.clientPhone);
      setClientEmail(editingAppointment.clientEmail || '');
      setTechId(editingAppointment.techId);
      setServiceId(editingAppointment.serviceId);
      setRemovalId(editingAppointment.removalId || 'none');
      setNailArtTierId(editingAppointment.nailArtTierId || 'art-0');
      setScheduledDate(editingAppointment.scheduledDate);
      setScheduledTime(editingAppointment.scheduledTime);
      setDepositAmount(editingAppointment.depositAmount || 5000);
      setDepositPaid(editingAppointment.depositPaid);
      setNotes(editingAppointment.notes || '');
      setStatus(editingAppointment.status);
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setTechId(initialTechId || techs[0]?.id || '');
      setServiceId(services[0]?.id || 'srv-kapping');
      setRemovalId('none');
      setNailArtTierId('art-0');
      setScheduledDate(initialDate || todayStr);
      setScheduledTime(initialTime || '10:00');
      setDepositAmount(5000);
      setDepositPaid(true);
      setNotes('');
      setStatus('confirmed');
    }
    setShowSuggestions(false);
  }, [isOpen, editingAppointment, initialDate, initialTime, initialTechId, techs, services]);

  // Autocomplete client
  const handleNameChange = (val: string) => {
    setClientName(val);
    if (val.trim().length >= 2) {
      const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(val.toLowerCase()) ||
        c.phone.includes(val)
      ).slice(0, 5);
      setNameSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setNameSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectClient = (c: typeof clients[0]) => {
    setClientName(c.name);
    setClientPhone(c.phone);
    setClientEmail(c.email || '');
    setShowSuggestions(false);
  };

  // Calculate duration and price dynamically
  const selectedService = services.find(s => s.id === serviceId) || services[0];
  const selectedRemoval = REMOVAL_OPTIONS.find(r => r.id === removalId) || REMOVAL_OPTIONS[0];
  const selectedNailArt = NAIL_ART_TIERS.find(t => t.id === nailArtTierId) || NAIL_ART_TIERS[0];

  const totalDurationMin = (selectedService?.baseDurationMin || 60) +
    (selectedRemoval?.additionalDurationMin || 0) +
    (selectedNailArt?.additionalDurationMin || 0);

  const totalPrice = (selectedService?.basePrice || 15000) +
    (selectedRemoval?.additionalPrice || 0) +
    (selectedNailArt?.price || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      alert('Por favor, ingresá el nombre de la clienta.');
      return;
    }
    if (!clientPhone.trim()) {
      alert('Por favor, ingresá el teléfono de WhatsApp de la clienta.');
      return;
    }
    if (!techId) {
      alert('Seleccioná una manicurista.');
      return;
    }

    if (editingAppointment) {
      const updated: Appointment = {
        ...editingAppointment,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        techId,
        serviceId,
        removalId,
        nailArtTierId,
        totalDurationMin,
        totalPrice,
        depositAmount: Number(depositAmount),
        depositPaid,
        scheduledDate,
        scheduledTime,
        status,
        notes: notes.trim()
      };
      storage.updateAppointment(updated);
      if (onSave) onSave(updated);
    } else {
      const created = storage.createAppointment({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        techId,
        serviceId,
        removalId,
        nailArtTierId,
        totalDurationMin,
        totalPrice,
        depositAmount: Number(depositAmount),
        depositPaid,
        scheduledDate,
        scheduledTime,
        status,
        notes: notes.trim()
      });
      if (onSave) onSave(created);
    }

    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#DE738F] to-[#C45774] flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <CalendarIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-serif">
                {editingAppointment ? 'Editar Turno Programado' : 'Agendar Nuevo Turno en Mesa'}
              </h3>
              <p className="text-xs text-muted-foreground">
                Grilla interactiva de agenda • Atelier Nails
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* 1. Client info */}
          <div className="rounded-xl border border-rose-200/60 dark:border-rose-900/30 p-4 bg-rose-50/20 dark:bg-rose-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <User className="size-3.5" />
                <span>Datos de la Clienta</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Búsqueda rápida en CRM</span>
            </div>

            <div className="relative">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Sofía Valenzuela"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-[#DE738F] focus:ring-1 focus:ring-[#DE738F]"
              />

              {showSuggestions && nameSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-popover border border-border rounded-xl shadow-xl overflow-hidden py-1">
                  {nameSuggestions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectClient(s)}
                      className="px-3 py-2 hover:bg-rose-500/10 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-foreground">{s.name}</span>
                      <span className="text-[11px] text-muted-foreground">{s.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                  WhatsApp / Celular *
                </label>
                <div className="relative">
                  <Phone className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+54 9 11 2345-6789"
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#DE738F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                  Email (Opcional)
                </label>
                <div className="relative">
                  <Mail className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="clienta@ejemplo.com"
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#DE738F]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Service, Removal & Nail Art */}
          <div className="rounded-xl border border-border/70 p-4 bg-card/60 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/90 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-[#DE738F]" />
              <span>Servicio de Manicuría & Nail Art</span>
            </span>

            <div className="space-y-1">
              <LuxurySelect
                label="Tratamiento Base"
                value={serviceId}
                onChange={setServiceId}
                options={services.map(s => ({
                  value: s.id,
                  label: s.title,
                  description: `${s.baseDurationMin} min • $${s.basePrice.toLocaleString('es-AR')}`
                }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <LuxurySelect
                  label="Retiro Previo"
                  value={removalId}
                  onChange={(val) => setRemovalId(val as RemovalType)}
                  options={REMOVAL_OPTIONS.map(r => ({
                    value: r.id,
                    label: r.label,
                    badge: r.additionalPrice > 0 ? `+$${r.additionalPrice.toLocaleString('es-AR')}` : undefined
                  }))}
                />
              </div>

              <div>
                <LuxurySelect
                  label="Nivel de Nail Art"
                  value={nailArtTierId}
                  onChange={setNailArtTierId}
                  options={NAIL_ART_TIERS.map(t => ({
                    value: t.id,
                    label: t.name,
                    badge: t.price > 0 ? `+$${t.price.toLocaleString('es-AR')}` : undefined
                  }))}
                />
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-pink-500/[0.06] border border-pink-500/20 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5 text-rose-500" />
                <span>Tiempo Total: <strong className="text-foreground">{totalDurationMin} minutos</strong></span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="size-3.5 text-emerald-600" />
                <span>Precio Total: <strong className="text-emerald-600 font-bold">${totalPrice.toLocaleString('es-AR')}</strong></span>
              </span>
            </div>
          </div>

          {/* 3. Schedule & Specialist */}
          <div className="rounded-xl border border-border/70 p-4 bg-card/60 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/90 flex items-center gap-1.5">
              <CalendarIcon className="size-3.5 text-[#DE738F]" />
              <span>Programación en Agenda</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <LuxurySelect
                  label="Manicurista *"
                  required
                  value={techId}
                  onChange={setTechId}
                  options={techs.map(t => ({
                    value: t.id,
                    label: t.name,
                    badge: t.role
                  }))}
                />
              </div>

              <div>
                <LuxuryDatePicker
                  label="Fecha del Turno *"
                  value={scheduledDate}
                  onChange={(date) => setScheduledDate(date)}
                />
              </div>

              <div>
                <LuxuryTimePicker
                  label="Hora de Inicio *"
                  required
                  value={scheduledTime}
                  onChange={setScheduledTime}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                  Monto de Seña ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#DE738F]"
                />
              </div>

              <div>
                <LuxurySelect
                  label="Estado Inicial del Turno"
                  value={status}
                  onChange={(val) => setStatus(val as AppointmentStatus)}
                  options={[
                    { value: 'pending', label: '🔔 Pendiente de Revisión' },
                    { value: 'confirmed', label: '✓ Confirmado (Seña Recibida)' },
                    { value: 'pending_deposit', label: '⏳ Pendiente de Seña' },
                    { value: 'in_progress', label: '▶ En Mesa / Atendiendo' },
                    { value: 'completed', label: '✔ Finalizado' },
                    { value: 'cancelled', label: '✕ Cancelado' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="depositPaidCheck"
                checked={depositPaid}
                onChange={(e) => setDepositPaid(e.target.checked)}
                className="rounded text-[#DE738F] accent-[#DE738F] size-4 cursor-pointer"
              />
              <label htmlFor="depositPaidCheck" className="text-xs text-foreground font-medium cursor-pointer">
                Seña acreditada y confirmada en caja / banco
              </label>
            </div>
          </div>

          {/* 4. Notes */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
              Notas u Observaciones del Set
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Trae diseño de referencia en foto, uñas delgadas sensibles a cabina UV, etc."
              className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:border-[#DE738F] resize-none"
            />
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs font-bold shadow-md shadow-rose-500/25 hover:opacity-95 transition-opacity"
            >
              {editingAppointment ? 'Guardar Cambios' : 'Agendar Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
