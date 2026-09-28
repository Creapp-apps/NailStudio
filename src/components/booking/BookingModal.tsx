import React, { useState } from 'react';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { NailService, RemovalOption, NailArtTier, NailTechnician, Appointment } from '../../types/nailStudio';
import { INITIAL_SERVICES, REMOVAL_OPTIONS, NAIL_ART_TIERS } from '../../services/mockData';
import { storage } from '../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  onBookingSuccess
}) => {
  const services = storage.getServices().length > 0 ? storage.getServices() : INITIAL_SERVICES;
  const availableTechs = storage.getTechs();

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<NailService | null>(
    services.find(s => s.id === preselectedServiceId) || services[0]
  );
  const [selectedRemoval, setSelectedRemoval] = useState<RemovalOption>(REMOVAL_OPTIONS[0]);
  const [selectedNailArt, setSelectedNailArt] = useState<NailArtTier>(NAIL_ART_TIERS[0]);
  const [selectedTech, setSelectedTech] = useState<NailTechnician | null>(availableTechs[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-29');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const totalDuration = (selectedService?.baseDurationMin || 0) +
    selectedRemoval.additionalDurationMin +
    selectedNailArt.additionalDurationMin;

  const totalPrice = (selectedService?.basePrice || 0) +
    selectedRemoval.additionalPrice +
    selectedNailArt.price;

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const timeFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}` || '0m';

  const availableHours = ['10:00', '11:45', '14:00', '15:30', '17:15', '19:00'];

  const stepTitles = [
    'Técnica Estructural Base',
    'Retiro de Producto Previo',
    'Nivel de Nail Art & Efectos',
    'Especialista & Horario',
    'Datos de Contacto'
  ];

  const handleConfirmBooking = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor completa tu nombre y número de WhatsApp');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = storage.createAppointment({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        techId: selectedTech?.id || 'auto-assigned',
        serviceId: selectedService!.id,
        removalId: selectedRemoval.id,
        nailArtTierId: selectedNailArt.id,
        totalDurationMin: totalDuration,
        totalPrice,
        depositAmount: 5000,
        depositPaid: true,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        status: 'confirmed',
        notes: bookingNotes
      });

      setIsSubmitting(false);
      setConfirmedApt(created);
      if (onBookingSuccess) onBookingSuccess(created);
    }, 500);
  };

  const handleResetAndClose = () => {
    setConfirmedApt(null);
    setStep(1);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(26, 17, 21, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      overflow: 'hidden'
    }}>
      {/* SINGLE PAGE FLOATING MODAL TOAST (ZERO SCROLL DESIGN) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '740px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(222, 115, 143, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Top Accent Luxury Ribbon */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #DE738F 0%, #E0C89E 50%, #C45774 100%)'
        }} />

        {/* Compact Header Bar */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid rgba(222, 115, 143, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-couture)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--brand-pink-dark)',
                fontWeight: 700
              }}>
                Atelier Nails & Co.
              </span>
              <span style={{ color: 'rgba(0,0,0,0.2)' }}>•</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {!confirmedApt ? `Paso ${step} de 5: ${stepTitles[step - 1]}` : 'Turno Confirmado'}
              </span>
            </div>
            <h2 style={{
              fontSize: '1.15rem',
              color: 'var(--brand-espresso)',
              fontFamily: 'var(--font-serif-glam)',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: '0.15rem 0 0 0'
            }}>
              {!confirmedApt ? 'Reserva tu Turno Exclusivo' : '¡Tu Cita ha sido Agendada!'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Minimal Progress Step Indicators */}
            {!confirmedApt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <div
                    key={s}
                    style={{
                      width: step === s ? '18px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: step === s
                        ? 'var(--brand-pink-dark)'
                        : step > s
                          ? '#C45774'
                          : 'rgba(222, 115, 143, 0.25)',
                      transition: 'all 0.25s ease'
                    }}
                  />
                ))}
              </div>
            )}

            <button
              onClick={handleResetAndClose}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgba(0,0,0,0.02)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              title="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body Content (Single-Page Fixed Height - No Scroll) */}
        <div style={{
          padding: '1rem 1.25rem',
          minHeight: '275px',
          maxHeight: '310px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {confirmedApt ? (
            /* Confirmation View */
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }} className="animate-fade-in">
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(66, 122, 91, 0.12)',
                color: '#2F5740',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}>
                <Check size={28} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)', marginBottom: '0.2rem' }}>
                Te esperamos, {confirmedApt.clientName}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '440px', margin: '0 auto 0.85rem auto', lineHeight: 1.4 }}>
                Turno agendado para el <strong>{confirmedApt.scheduledDate}</strong> a las <strong>{confirmedApt.scheduledTime} hs</strong> ({confirmedApt.totalDurationMin} min de sesión).
              </p>

              <div style={{
                background: '#FAF6F7',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                maxWidth: '420px',
                margin: '0 auto 1rem auto',
                border: '1px solid rgba(222, 115, 143, 0.2)',
                fontSize: '0.78rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Técnica & Deco:</span>
                  <strong style={{ color: 'var(--brand-espresso)' }}>{selectedService?.title} ({selectedNailArt.name.split(':')[0]})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Retiro:</span>
                  <strong style={{ color: 'var(--brand-espresso)' }}>{selectedRemoval.label.split('(')[0]}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px dashed rgba(0,0,0,0.1)', fontWeight: 700 }}>
                  <span>Total en salón:</span>
                  <span style={{ color: 'var(--brand-pink-dark)' }}>${(confirmedApt.totalPrice - 5000).toLocaleString('es-AR')} (Seña de $5.000 bonificada)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <a
                  href={`https://wa.me/?text=Hola%20tengo%20mi%20turno%20reservado%20en%20Atelier%20Nails%20para%20el%20${confirmedApt.scheduledDate}%20a%20las%20${confirmedApt.scheduledTime}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-satin-pink"
                  style={{ textDecoration: 'none', padding: '0.55rem 1.25rem', fontSize: '0.78rem' }}
                >
                  Recordatorio a mi WhatsApp
                </a>
                <button onClick={handleResetAndClose} className="btn-outline-couture" style={{ padding: '0.55rem 1rem', fontSize: '0.78rem' }}>
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SERVICE (2x2 Compact Grid - Badges Never Overlap) */}
              {step === 1 && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.65rem'
                  }}>
                    {services.slice(0, 4).map(srv => {
                      const isSelected = selectedService?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          style={{
                            border: isSelected
                              ? '2px solid var(--brand-pink-dark)'
                              : '1px solid rgba(222, 115, 143, 0.25)',
                            borderRadius: '12px',
                            padding: '0.65rem 0.85rem',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(222, 115, 143, 0.06)' : '#FFFFFF',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '110px',
                            boxShadow: isSelected ? '0 4px 14px rgba(222, 115, 143, 0.15)' : '0 1px 3px rgba(0,0,0,0.03)'
                          }}
                        >
                          <div>
                            {/* Header row: category + badge without collision */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.4rem',
                              marginBottom: '0.2rem'
                            }}>
                              <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: 'var(--brand-pink-dark)',
                                letterSpacing: '0.06em'
                              }}>
                                {srv.category}
                              </span>
                              {srv.badge && (
                                <span style={{
                                  fontSize: '0.58rem',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '999px',
                                  background: 'rgba(222, 115, 143, 0.15)',
                                  color: '#B83256',
                                  border: '1px solid rgba(222, 115, 143, 0.3)'
                                }}>
                                  {srv.badge}
                                </span>
                              )}
                            </div>

                            {/* Service Title */}
                            <h4 style={{
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: 'var(--brand-espresso)',
                              lineHeight: 1.2,
                              margin: '0 0 0.15rem 0',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {srv.title}
                            </h4>

                            <p style={{
                              fontSize: '0.68rem',
                              color: 'var(--text-secondary)',
                              margin: 0,
                              lineHeight: 1.25,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {srv.description}
                            </p>
                          </div>

                          {/* Price & Duration Strip */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.25rem',
                            borderTop: '1px dashed rgba(0,0,0,0.06)'
                          }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-pink-dark)' }}>
                              ${srv.basePrice.toLocaleString('es-AR')}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              ⏱ {srv.baseDurationMin} min
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: REMOVAL (3 Compact Row Cards) */}
              {step === 2 && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {REMOVAL_OPTIONS.map(rem => {
                      const isSelected = selectedRemoval.id === rem.id;
                      return (
                        <div
                          key={rem.id}
                          onClick={() => setSelectedRemoval(rem)}
                          style={{
                            border: isSelected
                              ? '2px solid var(--brand-pink-dark)'
                              : '1px solid rgba(222, 115, 143, 0.25)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(222, 115, 143, 0.06)' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? '0 4px 14px rgba(222, 115, 143, 0.12)' : 'none'
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-espresso)', margin: '0 0 0.15rem 0' }}>
                              {rem.label}
                            </h4>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                              {rem.description}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-pink-dark)' }}>
                              {rem.additionalPrice > 0 ? `+$${rem.additionalPrice.toLocaleString('es-AR')}` : 'Sin costo'}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {rem.additionalDurationMin > 0 ? `+${rem.additionalDurationMin} min` : '0 min'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: NAIL ART (2x2 Compact Cards) */}
              {step === 3 && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.65rem'
                  }}>
                    {NAIL_ART_TIERS.map(tier => {
                      const isSelected = selectedNailArt.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedNailArt(tier)}
                          style={{
                            border: isSelected
                              ? '2px solid var(--brand-pink-dark)'
                              : '1px solid rgba(222, 115, 143, 0.25)',
                            borderRadius: '12px',
                            padding: '0.65rem 0.85rem',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(222, 115, 143, 0.06)' : '#FFFFFF',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '110px',
                            boxShadow: isSelected ? '0 4px 14px rgba(222, 115, 143, 0.15)' : 'none'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-espresso)', margin: 0 }}>
                                {tier.name.split(':')[0]}
                              </h4>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-pink-dark)' }}>
                                {tier.price > 0 ? `+$${tier.price.toLocaleString('es-AR')}` : 'Incluido'}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '0.68rem',
                              color: 'var(--text-secondary)',
                              margin: '0 0 0.35rem 0',
                              lineHeight: 1.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {tier.description}
                            </p>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {tier.examples.slice(0, 2).map(ex => (
                              <span
                                key={ex}
                                style={{
                                  fontSize: '0.62rem',
                                  background: 'rgba(222, 115, 143, 0.1)',
                                  color: 'var(--brand-espresso)',
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '4px',
                                  whiteSpace: 'nowrap'
                                }}
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

              {/* STEP 4: TECH, DATE & TIME (2 Columns Compact) */}
              {step === 4 && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    {/* Left: Professional & Date */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                          Mesa & Especialista
                        </label>
                        <div style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(222, 115, 143, 0.25)',
                          background: 'rgba(222, 115, 143, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--brand-espresso)'
                        }}>
                          <Sparkles size={14} color="var(--brand-pink-dark)" />
                          <span>Mesa de Alta Precisión (Asignada)</span>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                          Fecha de Atención
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem 0.75rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--brand-espresso)',
                            background: '#FFFFFF',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* Right: Available Hours Grid */}
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                        Horarios Disponibles (Sesión {totalDuration} min)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                        {availableHours.map(hour => {
                          const isSelected = selectedTime === hour;
                          return (
                            <button
                              key={hour}
                              type="button"
                              onClick={() => setSelectedTime(hour)}
                              style={{
                                padding: '0.55rem 0.25rem',
                                borderRadius: '8px',
                                border: isSelected
                                  ? '2px solid var(--brand-pink-dark)'
                                  : '1px solid rgba(0,0,0,0.1)',
                                background: isSelected ? 'var(--brand-pink-dark)' : '#FFFFFF',
                                color: isSelected ? '#FFFFFF' : 'var(--brand-espresso)',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CONTACT FORM (Compact 2x2 Grid) */}
              {step === 5 && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.2rem' }}>
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Sofía Rossi"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.15)',
                          fontSize: '0.82rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.2rem' }}>
                        WhatsApp de Contacto *
                      </label>
                      <input
                        type="tel"
                        placeholder="+54 9 11 4455-6677"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.15)',
                          fontSize: '0.82rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.2rem' }}>
                        Email (opcional)
                      </label>
                      <input
                        type="email"
                        placeholder="tuemail@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.15)',
                          fontSize: '0.82rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.2rem' }}>
                        Notas o alergias al HEMA
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Uñas cortas / Alergia a primers"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.15)',
                          fontSize: '0.82rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Trust Banner */}
                  <div style={{
                    marginTop: '0.65rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.7rem',
                    color: '#8A6D1C'
                  }}>
                    <ShieldCheck size={14} />
                    <span>Seña protegida de $5.000 ARS deducible al presentarte en el salón. Cancelación gratuita con 24h de aviso.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Integrated Micro-Summary Footer Bar (Zero Scroll Navigation) */}
        {!confirmedApt && (
          <div style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid rgba(222, 115, 143, 0.15)',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9FA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            {/* Live Pricing & Duration Breakdown Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: 'rgba(222, 115, 143, 0.1)',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand-espresso)'
              }}>
                <Clock size={13} color="var(--brand-pink-dark)" />
                <span>{timeFormatted}</span>
              </div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                color: 'var(--brand-pink-dark)',
                fontFamily: 'var(--font-editorial)'
              }}>
                ${totalPrice.toLocaleString('es-AR')}
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                  (Seña $5.000)
                </span>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    padding: '0.55rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <ArrowLeft size={14} /> Volver
                </button>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  className="btn-satin-pink"
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>Continuar</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="btn-satin-pink"
                  style={{
                    padding: '0.55rem 1.35rem',
                    fontSize: '0.78rem',
                    background: 'linear-gradient(135deg, #427A5B 0%, #2F5740 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}</span>
                  <Check size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
