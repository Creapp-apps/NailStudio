import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Sparkles,
  MessageCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Scissors,
  DollarSign
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Appointment,
  NailTechnician,
  AppointmentStatus
} from '../../../types/nailStudio';
import { INITIAL_SERVICES, NAIL_ART_TIERS, REMOVAL_OPTIONS } from '../../../services/mockData';
import { storage } from '../../../services/storage';

interface Props {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (appointment: Appointment) => void;
  onStatusChanged: (id: string, newStatus: AppointmentStatus) => void;
  onDeleted: (id: string) => void;
  techs: NailTechnician[];
}

export const TurnoDetalleModal: React.FC<Props> = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onStatusChanged,
  onDeleted,
  techs
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !appointment) return null;

  const tech = techs.find(t => t.id === appointment.techId);
  const services = storage.getServices();
  const allServices = services.length > 0 ? services : INITIAL_SERVICES;
  const service = allServices.find(s => s.id === appointment.serviceId);
  const nailArt = storage.getNailArtTiers().find(t => t.id === appointment.nailArtTierId) || NAIL_ART_TIERS.find(t => t.id === appointment.nailArtTierId);
  const removal = storage.getRemovals().find(r => r.id === appointment.removalId) || REMOVAL_OPTIONS.find(r => r.id === appointment.removalId);

  // WhatsApp reminder message
  const cleanPhone = appointment.clientPhone.replace(/\D/g, '');
  const formattedDate = appointment.scheduledDate ? appointment.scheduledDate : '';
  const messageText = encodeURIComponent(
    `Hola ${appointment.clientName}! 💅 Te recordamos tu turno en Atelier Nails el día ${formattedDate} a las ${appointment.scheduledTime} hs para ${service?.title || 'tu servicio de manicuría'}. ¡Te esperamos!`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${messageText}`;

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-rose-500/20 via-[#DE738F]/25 to-rose-500/20 text-[#C45774] dark:text-rose-200 border border-[#DE738F]/40 shadow-xs animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            🔔 Turno Pendiente de Aprobación
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            En Mesa / Atendiendo
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="size-3.5" />
            Confirmado (Seña Acreditada)
          </span>
        );
      case 'pending_deposit':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            <AlertCircle className="size-3.5" />
            Pendiente de Seña
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
            <CheckCircle2 className="size-3.5" />
            Finalizado
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            Cancelado
          </span>
        );
    }
  };

  const handleStatusClick = (newStatus: AppointmentStatus) => {
    onStatusChanged(appointment.id, newStatus);
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDeleted(appointment.id);
      onClose();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-card border border-border/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/70 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-transparent flex items-start justify-between">
          <div>
            <div className="mb-2">
              {getStatusBadge(appointment.status)}
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-foreground">
              {appointment.clientName}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span>{appointment.scheduledDate}</span>
              <span>•</span>
              <strong className="text-foreground">{appointment.scheduledTime} hs</strong>
              <span>•</span>
              <span>{appointment.totalDurationMin} min de sesión</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
          {/* Quick status bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Gestionar Estado del Turno
              </span>
              {appointment.status === 'pending' && (
                <span className="text-[10px] font-extrabold text-[#C45774] flex items-center gap-1">
                  <Sparkles size={11} />
                  Turno Web Entrante
                </span>
              )}
            </div>

            {appointment.status === 'pending' && (
              <div className="mb-2.5 p-3 rounded-xl bg-gradient-to-r from-rose-500/10 via-[#DE738F]/15 to-rose-500/10 border border-[#DE738F]/30 flex items-center justify-between gap-2.5">
                <div className="text-[11px] text-stone-700 dark:text-stone-200">
                  <strong className="block text-[#2B181C] dark:text-white">¿Aprobar turno entrante?</strong>
                  <span>Confirmarás la reserva directamente en la agenda.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusClick('confirmed')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Aprobar Turno</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleStatusClick('confirmed')}
                className={`py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all border cursor-pointer ${
                  appointment.status === 'confirmed'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-muted/50 text-foreground hover:bg-muted border-border'
                }`}
              >
                ✓ Confirmado
              </button>
              <button
                type="button"
                onClick={() => handleStatusClick('in_progress')}
                className={`py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all border cursor-pointer ${
                  appointment.status === 'in_progress'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-muted/50 text-foreground hover:bg-muted border-border'
                }`}
              >
                ▶ En Mesa
              </button>
              <button
                type="button"
                onClick={() => handleStatusClick('completed')}
                className={`py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all border cursor-pointer ${
                  appointment.status === 'completed'
                    ? 'bg-slate-700 text-white border-slate-800 shadow-sm'
                    : 'bg-muted/50 text-foreground hover:bg-muted border-border'
                }`}
              >
                Finalizar
              </button>
              <button
                type="button"
                onClick={() => handleStatusClick('cancelled')}
                className={`py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all border cursor-pointer ${
                  appointment.status === 'cancelled'
                    ? 'bg-red-600 text-white border-red-700 shadow-sm'
                    : 'bg-muted/50 text-foreground hover:bg-muted border-border'
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Service & Details Card */}
          <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-rose-500 font-bold block">
                  Tratamiento Ungueal
                </span>
                <span className="font-bold text-foreground text-sm">
                  {service?.title || 'Servicio de Manicuría'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">Precio Total</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ${appointment.totalPrice.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
              <div>
                <span className="text-muted-foreground block text-[10px]">Manicurista Asignada:</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  {tech?.avatar && (
                    <img src={tech.avatar} alt={tech.name} className="size-4 rounded-full object-cover" />
                  )}
                  {tech?.name || 'No asignada'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Seña:</span>
                <span className="font-semibold text-foreground mt-0.5 block">
                  ${appointment.depositAmount?.toLocaleString('es-AR') || '5.000'} ({appointment.depositPaid ? 'Pagada' : 'Pendiente'})
                </span>
              </div>
            </div>

            {(nailArt && nailArt.tierLevel > 0) && (
              <div className="text-[11px] bg-rose-500/10 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-md">
                <strong>Nail Art:</strong> {nailArt.name}
              </div>
            )}

            {(removal && removal.id !== 'none') && (
              <div className="text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-md">
                <strong>Retiro:</strong> {removal.label}
              </div>
            )}

            {appointment.notes && (
              <div className="text-[11px] bg-muted/60 p-2 rounded-lg text-foreground/90 italic">
                "{appointment.notes}"
              </div>
            )}
          </div>

          {/* Client contact row */}
          <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">
                Contacto Directo
              </span>
              <span className="font-bold text-foreground text-xs">{appointment.clientPhone}</span>
              {appointment.clientEmail && (
                <span className="text-[10px] text-muted-foreground block">{appointment.clientEmail}</span>
              )}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="size-4" />
              <span>Enviar WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
          <button
            type="button"
            onClick={handleDeleteClick}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              confirmDelete
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-red-500 hover:bg-red-500/10'
            }`}
          >
            <Trash2 className="size-3.5" />
            <span>{confirmDelete ? '¿Confirmar eliminación?' : 'Eliminar Turno'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(appointment);
              }}
              className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="size-3.5" />
              <span>Editar</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
