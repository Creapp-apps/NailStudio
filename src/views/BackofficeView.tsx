import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Smartphone, RotateCcw, ShieldCheck } from 'lucide-react';
import { storage } from '../services/storage';
import { Appointment, NailTechnician, ClientProfile, SupplyItem } from '../types/nailStudio';
import { AdminLayout } from '../components/backoffice/AdminLayout';

export const BackofficeView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(storage.getAppointments());
  const [techs, setTechs] = useState<NailTechnician[]>(storage.getTechs());
  const [clients, setClients] = useState<ClientProfile[]>(storage.getClients());
  const [supplies, setSupplies] = useState<SupplyItem[]>(storage.getSupplies());

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setAppointments(storage.getAppointments());
      setTechs(storage.getTechs());
      setClients(storage.getClients());
      setSupplies(storage.getSupplies());
    });
    return unsubscribe;
  }, []);

  const handleResetData = () => {
    if (confirm('¿Deseas reiniciar los datos de demostración a su estado original?')) {
      storage.resetToSeed();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Backoffice Dedicated Navigation Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Admin Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1E1216 0%, #301720 100%)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              ⚙️
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif-glam)', fontSize: '1.25rem', color: 'var(--brand-espresso)', lineHeight: 1.1 }}>
                Atelier Nails Admin
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--brand-pink-dark)', fontFamily: 'var(--font-couture)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Suite de Gestión & Agenda
              </div>
            </div>
          </div>

          {/* Quick External Links & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Link to Public Website */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--brand-espresso)',
                textDecoration: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card-subtle)',
                fontWeight: 600
              }}
              title="Abrir la Web Pública"
            >
              <Globe size={13} color="var(--brand-pink-dark)" />
              <span>Ver Web Pública</span>
            </Link>

            {/* Link to PWA Client Portal */}
            <Link
              to="/pwa"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--brand-espresso)',
                textDecoration: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card-subtle)',
                fontWeight: 600
              }}
              title="Abrir el Portal PWA de Clientas"
            >
              <Smartphone size={13} color="var(--brand-pink-dark)" />
              <span>Ver PWA Clientas</span>
            </Link>

            {/* Supabase Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
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

            {/* Reset Demo Data Button */}
            <button
              title="Reiniciar datos de prueba al seed original"
              onClick={handleResetData}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Backoffice Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <AdminLayout
          appointments={appointments}
          techs={techs}
          clients={clients}
          supplies={supplies}
        />
      </main>
    </div>
  );
};
