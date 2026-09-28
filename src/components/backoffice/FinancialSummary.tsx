import React from 'react';
import { DollarSign, TrendingUp, Users, Award, PieChart } from 'lucide-react';
import { Appointment, NailTechnician } from '../../types/nailStudio';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
}

export const FinancialSummary: React.FC<Props> = ({ appointments, techs }) => {
  const confirmedOrDone = appointments.filter(a => a.status === 'confirmed' || a.status === 'in_progress' || a.status === 'completed');

  const totalRevenue = confirmedOrDone.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalDeposits = confirmedOrDone.filter(a => a.depositPaid).reduce((acc, curr) => acc + curr.depositAmount, 0);
  const averageTicket = confirmedOrDone.length > 0 ? Math.round(totalRevenue / confirmedOrDone.length) : 0;

  // Technician commissions calculation
  const techPayouts = techs.map(tech => {
    const techApts = confirmedOrDone.filter(a => a.techId === tech.id);
    const techVolume = techApts.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const techCommission = Math.round(techVolume * tech.commissionRate);
    const studioNet = techVolume - techCommission;

    return {
      tech,
      servicesCount: techApts.length,
      volume: techVolume,
      commission: techCommission,
      studioNet
    };
  });

  return (
    <div className="animate-fade-in">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Facturación de la Jornada</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-terracotta)', marginTop: '0.2rem', fontFamily: 'var(--font-editorial)' }}>
            ${totalRevenue.toLocaleString('es-AR')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-confirmed)' }}>✓ {confirmedOrDone.length} turnos confirmados</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Señas Recaudadas Online</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#427A5B', marginTop: '0.2rem', fontFamily: 'var(--font-editorial)' }}>
            ${totalDeposits.toLocaleString('es-AR')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Protección contra no-shows</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ticket Promedio por Clienta</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-espresso)', marginTop: '0.2rem', fontFamily: 'var(--font-editorial)' }}>
            ${averageTicket.toLocaleString('es-AR')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--brand-terracotta)' }}>Base + Retiro + Nail Art</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Comisiones Nail Techs</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#805AD5', marginTop: '0.2rem', fontFamily: 'var(--font-editorial)' }}>
            ${techPayouts.reduce((a, c) => a + c.commission, 0).toLocaleString('es-AR')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Calculado al 50%-55% pactado</span>
        </div>
      </div>

      {/* Technician Liquidations Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--brand-espresso)' }}>Liquidación y Rendimiento por Manicurista</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Cálculo transparente de comisiones por mano de obra y recaudación neta para el Atelier
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          padding: '0.75rem 1.25rem',
          background: 'var(--bg-card-subtle)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>Manicurista</div>
          <div>Turnos Atendidos</div>
          <div>Total Facturado</div>
          <div>Comisión Profesional</div>
          <div>Neto para el Atelier</div>
        </div>

        {techPayouts.map(item => (
          <div
            key={item.tech.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '1rem 1.25rem',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={item.tech.avatar}
                alt={item.tech.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ color: 'var(--brand-espresso)' }}>{item.tech.name}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comisión: {item.tech.commissionRate * 100}%</div>
              </div>
            </div>

            <div>{item.servicesCount} sets</div>

            <div style={{ fontWeight: 700 }}>${item.volume.toLocaleString('es-AR')}</div>

            <div style={{ fontWeight: 700, color: 'var(--brand-terracotta)' }}>
              ${item.commission.toLocaleString('es-AR')}
            </div>

            <div style={{ fontWeight: 700, color: 'var(--status-confirmed)' }}>
              ${item.studioNet.toLocaleString('es-AR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
