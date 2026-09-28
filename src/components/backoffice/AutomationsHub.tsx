import React, { useState } from 'react';
import { MessageSquare, Clock, Send, CheckCircle, Sparkles, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ClientProfile } from '../../types/nailStudio';

interface Props {
  clients: ClientProfile[];
}

export const AutomationsHub: React.FC<Props> = ({ clients }) => {
  const [sentLog, setSentLog] = useState<Record<string, boolean>>({});

  // Clients that need maintenance (Day 18+ since last visit)
  // Let's calculate days since last visit relative to "2026-09-28"
  const referenceDate = new Date('2026-09-28');

  const clientsDueForService = clients.map(client => {
    const lastVisit = new Date(client.lastVisitDate);
    const diffTime = Math.abs(referenceDate.getTime() - lastVisit.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      client,
      diffDays,
      isDue: diffDays >= 18
    };
  }).filter(item => item.isDue);

  const handleSendWhatsApp = (clientId: string, phone: string, name: string, days: number) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `¡Hola ${name}! 💅 Pasaron ${days} días de tu último set en Atelier Nails. Para mantener tus uñas sanas, evitar levantamientos o quiebres, te sugerimos reservar tu service de mantenimiento. ¿Te gustaría coordinar tu horario para esta semana? Reserva directo aquí: https://atelier-nails.app`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');

    setSentLog(prev => ({ ...prev, [clientId]: true }));
  };

  return (
    <div className="animate-fade-in">
      {/* Intro Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FAF4EF 0%, #F5ECE4 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        border: '1px solid #E6D8CC',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <Sparkles size={20} color="var(--brand-terracotta)" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-espresso)' }}>
              Motor de Retención & Automatizaciones WhatsApp
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            En manicuría, las clientas que superan los 21 días sufren quiebres y riesgo de pérdida. El trigger inteligente del <strong>Día 18</strong> reactiva a tus clientas en el momento biológico exacto de crecimiento de su uña.
          </p>
        </div>

        <div style={{ textAlign: 'right', background: 'var(--bg-surface)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Clientas en Ventana de Service
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-terracotta)', fontFamily: 'var(--font-editorial)' }}>
            {clientsDueForService.length} pendientes
          </div>
        </div>
      </div>

      {/* Due for Service Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--brand-espresso)' }}>
              Clientas que superaron los 18 días desde su último set
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Un clic para enviar recordatorio personalizado por WhatsApp con link a su agenda
            </span>
          </div>
        </div>

        <div>
          {clientsDueForService.length > 0 ? (
            clientsDueForService.map(({ client, diffDays }) => {
              const isSent = sentLog[client.id];
              return (
                <div
                  key={client.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    gap: '1rem',
                    background: diffDays >= 21 ? '#FFFBF8' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={client.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-espresso)' }}>{client.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Último set: {client.lastVisitDate} (<strong>hace {diffDays} días</strong>)
                      </div>
                    </div>
                  </div>

                  <div>
                    {diffDays >= 21 ? (
                      <span className="badge-luxury" style={{ background: 'var(--status-alert-bg)', color: 'var(--status-alert)' }}>
                        ⚠️ {diffDays} días: Riesgo de Levantamiento
                      </span>
                    ) : (
                      <span className="badge-luxury badge-rose">
                        ✨ {diffDays} días: Momento Ideal para Service
                      </span>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => handleSendWhatsApp(client.id, client.phone, client.name, diffDays)}
                      style={{
                        background: isSent ? 'var(--status-confirmed)' : '#25D366',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.55rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                      }}
                    >
                      {isSent ? <CheckCircle size={15} /> : <MessageSquare size={15} />}
                      {isSent ? 'Mensaje Enviado' : 'Enviar Recordatorio WhatsApp'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No hay clientas pendientes en ventana de service hoy.
            </div>
          )}
        </div>
      </div>

      {/* Routine Automation Templates Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', marginBottom: '0.4rem' }}>
            📅 Recordatorio 24h Previas
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Se envía a las 09:00 hs del día anterior al turno para solicitar confirmación de asistencia o liberar el espacio para otra clienta.
          </p>
          <span className="badge-luxury" style={{ background: '#EDF7F1', color: '#427A5B' }}>Activo y Automatizado</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', marginBottom: '0.4rem' }}>
            ⭐ Calificación & Fotos Post-Turno
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Disparado 3 horas después del turno terminado. Envía la foto de alta calidad y pide calificación 5 estrellas en Google Maps.
          </p>
          <span className="badge-luxury" style={{ background: '#EDF7F1', color: '#427A5B' }}>Activo y Automatizado</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', marginBottom: '0.4rem' }}>
            🎁 Acreditación de Puntos y Referidas
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Al marcar "Finalizado" en la agenda, se acreditan los 5% de puntos automáticamente en la Billetera PWA de la clienta.
          </p>
          <span className="badge-luxury" style={{ background: '#EDF7F1', color: '#427A5B' }}>Activo y Automatizado</span>
        </div>
      </div>
    </div>
  );
};
