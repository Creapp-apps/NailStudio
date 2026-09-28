import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Sparkles, PlusCircle, Crown } from 'lucide-react';
import { storage } from '../services/storage';
import { ClientProfile } from '../types/nailStudio';
import { ClientPortal } from '../components/client/ClientPortal';
import { BookingModal } from '../components/booking/BookingModal';

export const PwaClientView: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientProfile[]>(storage.getClients());
  const [currentClient, setCurrentClient] = useState<ClientProfile | null>(storage.getCurrentClient());
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setClients(storage.getClients());
      setCurrentClient(storage.getCurrentClient());
    });
    return unsubscribe;
  }, []);

  const handleChangeClient = (clientId: string) => {
    storage.setCurrentClientId(clientId);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      {/* PWA Dedicated Top Application Bar */}
      <header style={{
        background: 'rgba(255, 247, 250, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: '0 4px 20px rgba(222, 115, 143, 0.08)'
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {/* Back to Web Link & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--brand-pink-dark)',
                textDecoration: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(222, 115, 143, 0.1)',
                border: '1px solid rgba(222, 115, 143, 0.25)'
              }}
              title="Volver a la Web Pública"
            >
              <ArrowLeft size={14} />
              <span>Web</span>
            </Link>

            <div>
              <div style={{ fontFamily: 'var(--font-serif-glam)', fontSize: '1.25rem', color: 'var(--brand-espresso)', lineHeight: 1.1 }}>
                Club Privilege
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--brand-pink-dark)', fontFamily: 'var(--font-couture)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Atelier Nails PWA Clienta
              </div>
            </div>
          </div>

          {/* Right Controls: Client Switcher or Status & Booking */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {clients.length > 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                background: '#FFFFFF',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <UserCheck size={13} color="var(--brand-pink-dark)" />
                <select
                  value={currentClient?.id || ''}
                  onChange={(e) => handleChangeClient(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    color: 'var(--brand-espresso)',
                    outline: 'none',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  <option value="">-- Sin Identificar (Invitada) --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.pointsBalance} pts)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                background: 'rgba(212, 175, 55, 0.12)',
                color: '#997300',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                fontWeight: 600
              }}>
                <Crown size={13} color="#D4AF37" />
                <span>Pase Digital</span>
              </div>
            )}

            {/* Quick Booking CTA */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="btn-satin-pink"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <PlusCircle size={14} />
              <span>Nuevo Turno</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main PWA Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <ClientPortal
          client={currentClient}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
      </main>

      {/* Booking Stepper Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
