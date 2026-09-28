import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, Check, Play, AlertCircle, Sparkles } from 'lucide-react';
import { Appointment, NailTechnician, AppointmentStatus } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
}

export const MultiTechCalendar: React.FC<Props> = ({ appointments, techs }) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-28');

  const filteredAppointments = appointments.filter(a => a.scheduledDate === selectedDate);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'in_progress':
        return <span className="badge-luxury" style={{ background: 'var(--status-in-progress-bg)', color: 'var(--status-in-progress)' }}>En Mesa / Atendiendo</span>;
      case 'confirmed':
        return <span className="badge-luxury" style={{ background: 'var(--status-confirmed-bg)', color: 'var(--status-confirmed)' }}>Confirmado (Señado)</span>;
      case 'pending_deposit':
        return <span className="badge-luxury" style={{ background: 'var(--status-pending-bg)', color: 'var(--status-pending)' }}>Pendiente Seña</span>;
      case 'completed':
        return <span className="badge-luxury" style={{ background: '#EDF2F7', color: '#4A5568' }}>Finalizado</span>;
      default:
        return <span className="badge-luxury" style={{ background: '#FFF5F5', color: '#E53E3E' }}>Cancelado / No-show</span>;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
    storage.updateAppointmentStatus(id, newStatus);
  };

  return (
    <div className="animate-fade-in">
      {/* Calendar Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: 'var(--bg-surface)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarIcon size={20} color="var(--brand-terracotta)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--brand-espresso)' }}>Agenda del Día por Manicurista</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {filteredAppointments.length} turnos programados para esta jornada
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Columns per Technician */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${techs.length}, 1fr)`,
        gap: '1.25rem',
        overflowX: 'auto',
        minWidth: '780px'
      }}>
        {techs.map(tech => {
          const techApts = filteredAppointments
            .filter(a => a.techId === tech.id)
            .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

          return (
            <div
              key={tech.id}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <img
                  src={tech.avatar}
                  alt={tech.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-terracotta)' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.925rem', color: 'var(--brand-espresso)' }}>{tech.name}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tech.role}</div>
                </div>
              </div>

              {/* Appointment Cards */}
              <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                {techApts.length > 0 ? (
                  techApts.map(apt => (
                    <div
                      key={apt.id}
                      style={{
                        background: apt.status === 'in_progress' ? '#FBF7F3' : 'var(--bg-card-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        border: `1px solid ${apt.status === 'in_progress' ? 'var(--brand-terracotta)' : 'var(--border-subtle)'}`,
                        boxShadow: 'var(--shadow-sm)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '1rem', color: 'var(--brand-terracotta)' }}>
                          <Clock size={15} /> {apt.scheduledTime} hs
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-espresso)', marginBottom: '0.2rem' }}>
                        {apt.clientName}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Tel: <a href={`https://wa.me/${apt.clientPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-terracotta)', textDecoration: 'none', fontWeight: 600 }}>{apt.clientPhone}</a>
                      </div>

                      <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', marginBottom: '0.65rem' }}>
                        <div><strong>Duración:</strong> {apt.totalDurationMin} min</div>
                        <div><strong>Importe Total:</strong> ${apt.totalPrice.toLocaleString('es-AR')}</div>
                        {apt.notes && <div style={{ color: 'var(--brand-terracotta)', marginTop: '0.2rem' }}>💬 {apt.notes}</div>}
                      </div>

                      {/* Status quick actions */}
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'in_progress')}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none',
                              background: 'var(--brand-terracotta)',
                              color: '#FFFFFF',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <Play size={12} /> Iniciar en Mesa
                          </button>
                        )}
                        {apt.status === 'in_progress' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none',
                              background: 'var(--status-confirmed)',
                              color: '#FFFFFF',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <Check size={14} /> Finalizar Servicio
                          </button>
                        )}
                        {apt.status === 'pending_deposit' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--status-confirmed)',
                              background: 'var(--status-confirmed-bg)',
                              color: 'var(--status-confirmed)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Marcar Seña Pagada
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Sin turnos en esta fecha
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
