import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { Appointment, NailTechnician, NailService } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { webConfigStorage } from '../../services/webConfigStorage';

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
  onGoToCalendar: () => void;
  techs: NailTechnician[];
}

// Crystalline luxury audio chime via Web Audio API
const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Bell 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    // Bell 2: B5 (987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 1.2);
  } catch {
    // Autoplay policy fallback
  }
};

export const IncomingAppointmentModal: React.FC<Props> = ({
  appointment,
  onClose,
  onGoToCalendar,
  techs
}) => {
  useEffect(() => {
    if (appointment) {
      playNotificationChime();
    }
  }, [appointment]);

  if (!appointment) return null;

  const assignedTech = techs.find(t => t.id === appointment.techId);
  const services = storage.getServices();
  const matchedService = services.find(s => s.id === appointment.serviceId);

  const cleanPhone = appointment.clientPhone.replace(/[^\d+]/g, '');
  const brandName = webConfigStorage.getConfig().brandName || 'Atelier Nails';
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    `Hola ${appointment.clientName}! Te escribimos de ${brandName} respecto a tu turno solicitado para el ${appointment.scheduledDate} a las ${appointment.scheduledTime} hs.`
  )}`;

  return typeof document !== 'undefined' ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: 'rgba(26, 17, 21, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
        animation: 'modalBackdropFade 0.25s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 30px 90px -15px rgba(26, 17, 21, 0.4), 0 0 0 1px rgba(222, 115, 143, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'min(92vh, 720px)',
          margin: 'auto',
          animation: 'modalCardPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Luxury Header with Realtime Alert */}
        <div style={{
          padding: '1.15rem 1.5rem',
          borderBottom: '1px solid rgba(222, 115, 143, 0.15)',
          background: 'linear-gradient(135deg, rgba(222, 115, 143, 0.12) 0%, rgba(255, 245, 248, 0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #DE738F 0%, #C45774 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(222, 115, 143, 0.35)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#2F5740',
                  background: 'rgba(66, 122, 91, 0.12)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(66, 122, 91, 0.25)'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#427A5B', marginRight: '5px' }} />
                  Alerta en Tiempo Real
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>hace instantes</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-espresso)', margin: '2px 0 0 0', fontFamily: 'var(--font-editorial)' }}>
                ¡Nuevo Turno Recibido!
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto' }} className="space-y-4">
          {/* Client Card */}
          <div style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9FA 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 115, 143, 0.25)',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(222, 115, 143, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(222, 115, 143, 0.12)',
                  color: 'var(--brand-pink-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  {appointment.clientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-espresso)', margin: 0 }}>
                    {appointment.clientName}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    <Phone size={12} color="var(--brand-pink-dark)" />
                    <span>{appointment.clientPhone}</span>
                  </div>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '10px',
                  background: 'rgba(37, 211, 102, 0.12)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  color: '#128C7E',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={14} />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>

            {/* Appointment Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '0.65rem',
              padding: '0.75rem',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.06)',
              fontSize: '0.76rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Fecha & Horario
                </span>
                <span style={{ fontWeight: 800, color: 'var(--brand-espresso)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                  <Calendar size={13} color="var(--brand-pink-dark)" />
                  {appointment.scheduledDate} a las {appointment.scheduledTime} hs
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Especialista / Mesa
                </span>
                <span style={{ fontWeight: 700, color: 'var(--brand-espresso)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                  <User size={13} color="var(--brand-pink-dark)" />
                  {assignedTech ? `${assignedTech.name} (${assignedTech.role.split('&')[0]})` : 'Mesa de Alta Precisión'}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Servicio Solicitado
                </span>
                <span style={{ fontWeight: 700, color: 'var(--brand-espresso)', marginTop: '2px', display: 'block' }}>
                  {matchedService?.title || 'Servicio Atelier'} ({appointment.totalDurationMin} min)
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Total & Seña
                </span>
                <span style={{ fontWeight: 800, color: '#2F5740', marginTop: '2px', display: 'block' }}>
                  ${appointment.totalPrice.toLocaleString('es-AR')} • <span style={{ color: 'var(--brand-pink-dark)' }}>Seña $5.000 OK</span>
                </span>
              </div>
            </div>

            {appointment.notes && (
              <div style={{
                marginTop: '0.65rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                fontSize: '0.72rem',
                color: '#8A6D1C',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <AlertCircle size={14} className="shrink-0" />
                <span><strong>Observación / Alergias:</strong> {appointment.notes}</span>
              </div>
            )}
          </div>

          {/* Action Reminder Banner for Professional */}
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            background: 'rgba(66, 122, 91, 0.08)',
            border: '1px solid rgba(66, 122, 91, 0.2)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.75rem',
            color: '#2F5740',
            lineHeight: 1.4
          }}>
            <ShieldCheck size={18} className="shrink-0" style={{ marginTop: '2px' }} />
            <div>
              <strong>Acción requerida para la profesional:</strong>
              <div style={{ color: 'var(--brand-espresso)', opacity: 0.85, marginTop: '2px' }}>
                Verifica en la Agenda de Mesas / PWA que el puesto esté liberado y comunícate con la clienta para confirmar el turno y coordinar detalles del diseño.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(222, 115, 143, 0.15)',
          background: '#FAF7F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid rgba(0,0,0,0.15)',
              background: '#FFFFFF',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cerrar Alerta
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToCalendar();
            }}
            style={{
              padding: '0.6rem 1.35rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--brand-pink-satin, #DE738F) 0%, var(--brand-pink-dark, #C45774) 100%)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(222, 115, 143, 0.35)'
            }}
          >
            <span>Verificar en Agenda de Mesas (PWA)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
};
