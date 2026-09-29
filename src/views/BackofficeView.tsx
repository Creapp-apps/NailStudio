import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Appointment, NailTechnician, ClientProfile, SupplyItem } from '../types/nailStudio';
import { AdminLayout } from '../components/backoffice/AdminLayout';
import { StaffLoginForm } from '../components/auth/StaffLoginForm';
import { useAuth } from '../context/AuthContext';
import { useWebConfig } from '../hooks/useWebConfig';
import { Sparkles } from 'lucide-react';

export const BackofficeView: React.FC = () => {
  const { user, role, isLoading } = useAuth();
  const { config } = useWebConfig();

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

  // 1. Loading authentication session
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        gap: '1rem',
        fontFamily: 'var(--font-body)'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(222, 115, 143, 0.2), rgba(200, 150, 136, 0.3))',
          border: '1px solid rgba(222, 115, 143, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.8s infinite ease-in-out'
        }}>
          <Sparkles size={24} color="var(--brand-pink-dark)" />
        </div>
        <div style={{
          fontFamily: 'var(--font-serif-glam)',
          fontSize: '1.25rem',
          color: 'var(--brand-espresso)',
          letterSpacing: '0.04em'
        }}>
          {config.brandName || 'Belcalis Nails'}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Verificando credenciales de seguridad...
        </div>
      </div>
    );
  }

  // 2. Unauthenticated or not staff role -> Render Staff Login Form
  if (!user || role !== 'staff') {
    return <StaffLoginForm />;
  }

  // 3. Authenticated Staff Member -> Render Admin Layout
  return (
    <AdminLayout
      appointments={appointments}
      techs={techs}
      clients={clients}
      supplies={supplies}
    />
  );
};
