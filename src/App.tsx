import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Award,
  Settings,
  Globe,
  Smartphone,
  Bot,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { storage } from './services/storage';
import { Appointment, NailTechnician, ClientProfile, SupplyItem } from './types/nailStudio';
import { PublicLanding } from './components/public/PublicLanding';
import { ClientPortal } from './components/client/ClientPortal';
import { AdminLayout } from './components/backoffice/AdminLayout';
import { BookingModal } from './components/booking/BookingModal';
import { NailBotModal } from './components/ai/NailBotModal';

export function App() {
  const [viewMode, setViewMode] = useState<'public' | 'pwa' | 'admin'>('public');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isNailBotOpen, setIsNailBotOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  // Reactive state from storage
  const [appointments, setAppointments] = useState<Appointment[]>(storage.getAppointments());
  const [techs, setTechs] = useState<NailTechnician[]>(storage.getTechs());
  const [clients, setClients] = useState<ClientProfile[]>(storage.getClients());
  const [supplies, setSupplies] = useState<SupplyItem[]>(storage.getSupplies());
  const [currentClient, setCurrentClient] = useState<ClientProfile>(storage.getCurrentClient());

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setAppointments(storage.getAppointments());
      setTechs(storage.getTechs());
      setClients(storage.getClients());
      setSupplies(storage.getSupplies());
      setCurrentClient(storage.getCurrentClient());
    });
    return unsubscribe;
  }, []);

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsBookingOpen(true);
  };

  const handleChangeClient = (clientId: string) => {
    storage.setCurrentClientId(clientId);
  };

  const handleResetData = () => {
    if (confirm('¿Deseas reiniciar los datos de demostración a su estado original?')) {
      storage.resetToSeed();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Application Navigation */}
      <header className="header-glass">
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: '1rem' }}>
          {/* Logo & Brand (Haute Couture Style) */}
          <div
            onClick={() => setViewMode('public')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #DE738F 0%, #301720 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(222, 115, 143, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.6)'
            }}>
              💅
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif-glam)', fontSize: '1.4rem', color: 'var(--brand-espresso)', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                Atelier Nails
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--brand-pink-dark)', fontFamily: 'var(--font-couture)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Estudio de Uñas & Manicuría
              </div>
            </div>
          </div>

          {/* Central Environment Switcher */}
          <div className="tab-pills" style={{ display: 'flex', background: 'var(--bg-card)', padding: '0.25rem' }}>
            <button
              onClick={() => setViewMode('public')}
              className={`tab-pill-btn ${viewMode === 'public' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Globe size={14} /> Web Pública
            </button>
            <button
              onClick={() => setViewMode('pwa')}
              className={`tab-pill-btn ${viewMode === 'pwa' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Smartphone size={14} /> Portal PWA Clienta
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`tab-pill-btn ${viewMode === 'admin' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Settings size={14} /> Backoffice
            </button>
          </div>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {viewMode === 'pwa' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', background: 'var(--bg-surface)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                <UserCheck size={13} color="var(--brand-terracotta)" />
                <span style={{ color: 'var(--text-secondary)' }}>Ver como:</span>
                <select
                  value={currentClient?.id}
                  onChange={(e) => handleChangeClient(e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 700, color: 'var(--brand-espresso)', outline: 'none', cursor: 'pointer' }}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.pointsBalance} pts)</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.72rem',
              background: '#EDF7F1',
              color: '#427A5B',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(66, 122, 91, 0.25)',
              fontWeight: 600
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#48BB78', display: 'inline-block', boxShadow: '0 0 6px #48BB78' }} />
              Supabase Online
            </div>

            <button onClick={() => handleOpenBooking()} className="btn-outline-couture" style={{ padding: '0.55rem 1.15rem' }}>
              RESERVAR TURNO
            </button>

            <button
              title="Reiniciar datos de prueba"
              onClick={handleResetData}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '50%'
              }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Display */}
      <main style={{ flex: 1 }}>
        {viewMode === 'public' && (
          <PublicLanding
            onOpenBooking={handleOpenBooking}
            onOpenNailBot={() => setIsNailBotOpen(true)}
            onOpenPortal={() => setViewMode('pwa')}
          />
        )}

        {viewMode === 'pwa' && (
          <ClientPortal
            client={currentClient}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {viewMode === 'admin' && (
          <AdminLayout
            appointments={appointments}
            techs={techs}
            clients={clients}
            supplies={supplies}
          />
        )}
      </main>

      {/* Floating AI Receptionist Trigger */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 80 }}>
        {!isNailBotOpen && (
          <button
            onClick={() => setIsNailBotOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #2D1E1B 0%, #1A1210 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 122, 0.4)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 8px 30px rgba(35, 25, 22, 0.35)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--brand-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={15} color="#FFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Nail-Bot IA</div>
              <div style={{ fontSize: '0.65rem', color: '#C89688' }}>Asistente de Turnos</div>
            </div>
          </button>
        )}
      </div>

      {/* Booking Stepper Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedServiceId={preselectedService}
      />

      {/* Nail-Bot AI Chatbot Modal */}
      <NailBotModal
        isOpen={isNailBotOpen}
        onClose={() => setIsNailBotOpen(false)}
        onOpenBooking={(srvId) => handleOpenBooking(srvId)}
      />
    </div>
  );
}
export default App;
