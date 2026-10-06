import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Calendar, Clock, MapPin, Sparkles, MessageCircle, X } from 'lucide-react';
import { Appointment } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const PaymentApprovedModal: React.FC<Props> = ({
  isOpen,
  onClose,
  appointment
}) => {
  if (!isOpen || !appointment) return null;
  if (typeof document === 'undefined') return null;

  const salonSettings = storage.getSalonSettings();
  const services = storage.getServices();
  const service = services.find(s => s.id === appointment.serviceId);

  const cleanWhatsapp = (salonSettings.phoneWhatsapp || '+54 9 11 5820-9911').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `¡Hola Belcalis Nails! Acabo de abonar la seña por Mercado Pago de mi turno para el ${appointment.scheduledDate} a las ${appointment.scheduledTime} hs (${service?.title || 'Servicio'}). Mi nombre es ${appointment.clientName}.`
  )}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      style={{
        background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.12) 0%, rgba(20, 10, 15, 0.68) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-emerald-500/25 animate-scale-up"
        style={{
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35), 0 0 40px rgba(16, 185, 129, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Ribbon */}
        <div
          className="h-1.5 w-full"
          style={{
            background: 'linear-gradient(90deg, #10B981 0%, #E0C89E 50%, #34D399 100%)'
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        <div className="p-5 sm:p-6 text-center">
          {/* Success Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Check size={32} strokeWidth={2.5} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[0.7rem] font-bold tracking-wider uppercase mb-2">
            <Sparkles size={12} className="text-emerald-600" />
            <span>Seña Acreditada con Mercado Pago</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-glam mb-1">
            ¡Turno Confirmado, {appointment.clientName.split(' ')[0]}!
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto mb-4 leading-relaxed">
            Tu pago fue procesado con éxito y tu lugar en la agenda quedó 100% reservado.
          </p>

          {/* Appointment Ticket Card */}
          <div className="bg-[#FAF7F8] rounded-2xl p-4 border border-[#DE738F]/20 text-left text-xs sm:text-sm mb-4 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#C45774]" /> Fecha:
              </span>
              <strong className="text-stone-900 font-semibold">{appointment.scheduledDate}</strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Clock size={14} className="text-[#C45774]" /> Horario:
              </span>
              <strong className="text-stone-900 font-semibold">{appointment.scheduledTime} hs</strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">Servicio:</span>
              <strong className="text-stone-900 font-semibold">{service?.title || 'Tratamiento Ungueal'}</strong>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-emerald-700 font-semibold">Seña Abonada:</span>
              <strong className="text-emerald-700 font-bold">
                ${(appointment.depositAmount || 5000).toLocaleString('es-AR')} ARS
              </strong>
            </div>
            <div className="text-[0.68rem] text-stone-400 text-right">
              Saldo restante a abonar en el salón: ${(appointment.totalPrice - (appointment.depositAmount || 5000)).toLocaleString('es-AR')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle size={16} />
              <span>Contactar al Atelier por WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              type="button"
              className="w-full py-2.5 px-4 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Cerrar y Ver Mi Web
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
