import React from 'react';
import { Clock, Sparkles, Scissors, ShieldCheck } from 'lucide-react';
import { NailService, RemovalOption, NailArtTier } from '../../types/nailStudio';

interface Props {
  service: NailService | null;
  removal: RemovalOption | null;
  nailArt: NailArtTier | null;
}

export const NailTimeCalculator: React.FC<Props> = ({ service, removal, nailArt }) => {
  const baseMinutes = service ? service.baseDurationMin : 0;
  const removalMinutes = removal ? removal.additionalDurationMin : 0;
  const nailArtMinutes = nailArt ? nailArt.additionalDurationMin : 0;
  const totalMinutes = baseMinutes + removalMinutes + nailArtMinutes;

  const basePrice = service ? service.basePrice : 0;
  const removalPrice = removal ? removal.additionalPrice : 0;
  const nailArtPrice = nailArt ? nailArt.price : 0;
  const totalPrice = basePrice + removalPrice + nailArtPrice;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}` || '0m';

  return (
    <div style={{
      background: 'linear-gradient(145deg, #FAF4EF 0%, #F5ECE4 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      border: '1px solid #E6D8CC',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'var(--brand-terracotta)',
            color: '#FFFFFF',
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex'
          }}>
            <Clock size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)' }}>
              Nail-Time & Presupuesto
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Cálculo de duración aditiva para reserva exacta
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-terracotta)', fontFamily: 'var(--font-editorial)' }}>
            {timeFormatted}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>
            ${totalPrice.toLocaleString('es-AR')}
          </div>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div style={{
        height: '8px',
        width: '100%',
        background: '#E2D5C8',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        display: 'flex',
        marginBottom: '0.85rem'
      }}>
        {baseMinutes > 0 && (
          <div
            title={`Servicio Base: ${baseMinutes}m`}
            style={{
              width: `${(baseMinutes / Math.max(totalMinutes, 1)) * 100}%`,
              background: 'var(--brand-terracotta)',
              transition: 'width 0.3s ease'
            }}
          />
        )}
        {removalMinutes > 0 && (
          <div
            title={`Retiro previo: ${removalMinutes}m`}
            style={{
              width: `${(removalMinutes / Math.max(totalMinutes, 1)) * 100}%`,
              background: 'var(--brand-champagne)',
              transition: 'width 0.3s ease'
            }}
          />
        )}
        {nailArtMinutes > 0 && (
          <div
            title={`Nail Art: ${nailArtMinutes}m`}
            style={{
              width: `${(nailArtMinutes / Math.max(totalMinutes, 1)) * 100}%`,
              background: '#805AD5',
              transition: 'width 0.3s ease'
            }}
          />
        )}
      </div>

      {/* Detail Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-terracotta)' }} />
          <span>Base: <strong>{baseMinutes} min</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-champagne)' }} />
          <span>Retiro: <strong>{removalMinutes > 0 ? `+${removalMinutes} min` : '0 min'}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#805AD5' }} />
          <span>Deco: <strong>{nailArtMinutes > 0 ? `+${nailArtMinutes} min` : '0 min'}</strong></span>
        </div>
      </div>
    </div>
  );
};
