import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Calendar, User, Phone, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { NailService, RemovalOption, NailArtTier, NailTechnician, Appointment } from '../../types/nailStudio';
import { INITIAL_SERVICES, REMOVAL_OPTIONS, NAIL_ART_TIERS } from '../../services/mockData';
import { NailTimeCalculator } from './NailTimeCalculator';
import { storage } from '../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<Props> = ({ isOpen, onClose, preselectedServiceId, onBookingSuccess }) => {
  const availableTechs = storage.getTechs();
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<NailService | null>(
    INITIAL_SERVICES.find(s => s.id === preselectedServiceId) || INITIAL_SERVICES[0]
  );
  const [selectedRemoval, setSelectedRemoval] = useState<RemovalOption>(REMOVAL_OPTIONS[0]);
  const [selectedNailArt, setSelectedNailArt] = useState<NailArtTier>(NAIL_ART_TIERS[0]);
  const [selectedTech, setSelectedTech] = useState<NailTechnician | null>(availableTechs[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-29');
  const [selectedTime, setSelectedTime] = useState<string>('14:30');

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

  const availableHours = ['10:00', '11:45', '14:00', '15:30', '17:15', '19:00'];

  const handleConfirmBooking = () => {
    if (!clientName || !clientPhone) {
      alert('Por favor completa tu nombre y número de WhatsApp');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = storage.createAppointment({
        clientName,
        clientPhone,
        clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
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
    }, 600);
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
      background: 'rgba(28, 20, 18, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card-subtle)'
        }}>
          <div>
            <span className="badge-luxury badge-rose" style={{ marginBottom: '0.25rem' }}>
              Reserva de Manicura Haute
            </span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-espresso)' }}>
              Agenda tu Set en Atelier Nails
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '0.4rem',
              borderRadius: '50%'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper indicator */}
        {!confirmedApt && (
          <div style={{ padding: '0.75rem 1.75rem', background: '#FAF7F5', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            {['1. Servicio Base', '2. Retiro Previo', '3. Nivel Nail Art', '4. Especialista & Horario', '5. Confirmación'].map((label, idx) => (
              <div
                key={label}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap',
                  background: step === idx + 1 ? 'var(--brand-terracotta)' : step > idx + 1 ? 'var(--status-confirmed-bg)' : '#EFE8E2',
                  color: step === idx + 1 ? '#FFFFFF' : step > idx + 1 ? 'var(--status-confirmed)' : 'var(--text-muted)'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div style={{ padding: '1.5rem 1.75rem', flex: 1 }}>
          {confirmedApt ? (
            /* Confirmation View */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }} className="animate-fade-in">
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--status-confirmed-bg)',
                color: 'var(--status-confirmed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Check size={36} strokeWidth={2.5} />
              </div>
              <span className="badge-luxury badge-gold">¡Turno Confirmado con Éxito!</span>
              <h3 style={{ fontSize: '1.6rem', marginTop: '0.5rem', color: 'var(--brand-espresso)' }}>
                Te esperamos, {confirmedApt.clientName}
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0.5rem auto 1.5rem auto' }}>
                Tu turno ha sido bloqueado en la agenda {selectedTech ? <>de <strong>{selectedTech.name}</strong></> : <>del salón (<strong>Mesa asignada</strong>)</>} para el día <strong>{confirmedApt.scheduledDate}</strong> a las <strong>{confirmedApt.scheduledTime} hs</strong> ({confirmedApt.totalDurationMin} minutos).
              </p>

              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                maxWidth: '460px',
                margin: '0 auto 1.5rem auto',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Servicio:</span>
                  <strong>{selectedService?.title}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Retiro:</span>
                  <strong>{selectedRemoval.label}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Nail Art:</span>
                  <strong>{selectedNailArt.name}</strong>
                </div>
                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.75rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                  <span>Total a abonar en el local:</span>
                  <span style={{ color: 'var(--brand-terracotta)' }}>${(confirmedApt.totalPrice - 5000).toLocaleString('es-AR')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-confirmed)', marginTop: '0.35rem' }}>
                  ✓ Seña de $5.000 bonificada / deducida
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <a
                  href={`https://wa.me/?text=Hola%20tengo%20mi%20turno%20reservado%20en%20Atelier%20Nails%20para%20el%20${confirmedApt.scheduledDate}%20a%20las%20${confirmedApt.scheduledTime}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Enviar Recordatorio a mi WhatsApp
                </a>
                <button onClick={handleResetAndClose} className="btn-secondary">
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SERVICE */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--brand-espresso)' }}>
                    Paso 1: Selecciona la Técnica Estructural Base
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Cada técnica incluye manicura combinada rusa profunda y preparación ungueal sin daño.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {INITIAL_SERVICES.map(srv => {
                      const isSelected = selectedService?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          style={{
                            border: `2px solid ${isSelected ? 'var(--brand-terracotta)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            cursor: 'pointer',
                            background: isSelected ? '#FDFBF9' : 'var(--bg-surface)',
                            transition: 'var(--transition-smooth)',
                            position: 'relative'
                          }}
                        >
                          {srv.badge && (
                            <span className="badge-luxury badge-rose" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                              {srv.badge}
                            </span>
                          )}
                          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <img
                              src={srv.imageUrl}
                              alt={srv.title}
                              style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                            <div>
                              <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)' }}>{srv.title}</h4>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-terracotta)', marginTop: '0.2rem' }}>
                                ${srv.basePrice.toLocaleString('es-AR')} • {srv.baseDurationMin} min
                              </div>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            {srv.description}
                          </p>
                          <div style={{ fontSize: '0.72rem', color: 'var(--brand-espresso)', background: '#F5ECE4', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                            <strong>Ideal para:</strong> {srv.recommendedFor}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: REMOVAL */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--brand-espresso)' }}>
                    Paso 2: ¿Traes producto previo en tus uñas?
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    El retiro correcto protege la queratina natural y evita desprendimientos tempranos.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {REMOVAL_OPTIONS.map(rem => {
                      const isSelected = selectedRemoval.id === rem.id;
                      return (
                        <div
                          key={rem.id}
                          onClick={() => setSelectedRemoval(rem)}
                          style={{
                            border: `2px solid ${isSelected ? 'var(--brand-terracotta)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '1.15rem',
                            cursor: 'pointer',
                            background: isSelected ? '#FDFBF9' : 'var(--bg-surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)' }}>{rem.label}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rem.description}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-terracotta)' }}>
                              {rem.additionalPrice > 0 ? `+$${rem.additionalPrice.toLocaleString('es-AR')}` : 'Sin costo extra'}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              +{rem.additionalDurationMin} min
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: NAIL ART */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--brand-espresso)' }}>
                    Paso 3: Selecciona la Complejidad del Nail Art
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    El tiempo extra asegura que la profesional pueda pintar a mano alzada y curar cada detalle sin apuros.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {NAIL_ART_TIERS.map(tier => {
                      const isSelected = selectedNailArt.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedNailArt(tier)}
                          style={{
                            border: `2px solid ${isSelected ? 'var(--brand-terracotta)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            cursor: 'pointer',
                            background: isSelected ? '#FDFBF9' : 'var(--bg-surface)',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-espresso)' }}>{tier.name}</h4>
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-terracotta)', marginBottom: '0.4rem' }}>
                            {tier.price > 0 ? `+$${tier.price.toLocaleString('es-AR')}` : 'Incluido'}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                            {tier.description}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                            {tier.examples.map(ex => (
                              <span key={ex} style={{ fontSize: '0.68rem', background: '#F5ECE4', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
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

              {/* STEP 4: TECH & DATETIME */}
              {step === 4 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--brand-espresso)' }}>
                    Paso 4: Elige tu Especialista y Horario
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Visualizando huecos que admiten tu sesión completa de <strong>{totalDuration} minutos</strong>.
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                      Nail Artist y Mesa:
                    </label>
                    {availableTechs.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        {availableTechs.map(tech => {
                          const isSelected = selectedTech?.id === tech.id;
                          return (
                            <div
                              key={tech.id}
                              onClick={() => setSelectedTech(tech)}
                              style={{
                                border: `2px solid ${isSelected ? 'var(--brand-terracotta)' : 'var(--border-subtle)'}`,
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: isSelected ? '#FDFBF9' : 'var(--bg-surface)'
                              }}
                            >
                              {tech.avatar ? (
                                <img
                                  src={tech.avatar}
                                  alt={tech.name}
                                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                              ) : (
                                <div style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '50%',
                                  background: 'var(--brand-terracotta)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.85rem'
                                }}>
                                  {tech.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>{tech.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>★ {tech.rating || 5.0} ({tech.reviewsCount || 0})</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(219, 131, 147, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--brand-terracotta)'
                        }}>
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>
                            Asignación Automática de Mesa
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Tu set será atendido por la profesional en turno del salón según la técnica solicitada.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                        Fecha:
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-strong)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          background: 'var(--bg-card)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                        Horarios Disponibles:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                        {availableHours.map(hour => (
                          <button
                            key={hour}
                            type="button"
                            onClick={() => setSelectedTime(hour)}
                            style={{
                              padding: '0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              border: selectedTime === hour ? '2px solid var(--brand-terracotta)' : '1px solid var(--border-strong)',
                              background: selectedTime === hour ? 'var(--brand-terracotta)' : 'var(--bg-surface)',
                              color: selectedTime === hour ? '#FFFFFF' : 'var(--text-main)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            {hour}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CLIENT INFO */}
              {step === 5 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--brand-espresso)' }}>
                    Paso 5: Datos de Contacto y Confirmación
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Recibirás recordatorios automáticos por WhatsApp 24h antes y soporte personalizado.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.3rem' }}>
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Sofía Rossi"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-strong)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.3rem' }}>
                          WhatsApp / Teléfono *
                        </label>
                        <input
                          type="tel"
                          placeholder="+54 9 11 4455-6677"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-strong)',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.3rem' }}>
                          Email (para recibir tus fotos y puntos)
                        </label>
                        <input
                          type="email"
                          placeholder="sofia@email.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-strong)',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-espresso)', display: 'block', marginBottom: '0.3rem' }}>
                        Notas especiales (Alergias al HEMA, uñas mordidas o inspiración)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ej: Tengo las uñas cortas y débiles, o tengo alergia a ciertos primers..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-strong)',
                          fontSize: '0.85rem',
                          fontFamily: 'var(--font-body)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Live Nail-Time Calculator */}
              <div style={{ marginTop: '1.5rem' }}>
                <NailTimeCalculator
                  service={selectedService}
                  removal={selectedRemoval}
                  nailArt={selectedNailArt}
                />
              </div>

              {/* Stepper Footer Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 1.1rem' }}
                  >
                    <ArrowLeft size={16} /> Volver
                  </button>
                ) : <div />}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    className="btn-primary"
                  >
                    Continuar al siguiente paso <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmBooking}
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #427A5B 0%, #2F5740 100%)' }}
                  >
                    {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva de Turno'} <Check size={18} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
