import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Smartphone, Calendar, ChevronRight } from 'lucide-react';

interface Props {
  onOpenBooking: () => void;
}

export const PublicHeader: React.FC<Props> = ({ onOpenBooking }) => {
  return (
    <header className="header-glass" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px', gap: '1rem' }}>
        
        {/* Brand & Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #DE738F 0%, #301720 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(222, 115, 143, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            fontSize: '1.2rem'
          }}>
            💅
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif-glam)', fontSize: '1.45rem', color: 'var(--brand-espresso)', letterSpacing: '0.04em', lineHeight: 1.1 }}>
              Atelier Nails
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--brand-pink-dark)', fontFamily: 'var(--font-couture)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Estudio de Uñas & Manicuría
            </div>
          </div>
        </Link>

        {/* Center Editorial Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem', fontSize: '0.82rem', fontFamily: 'var(--font-couture)', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="desktop-nav">
          <a href="#servicios" style={{ color: 'var(--brand-espresso)', textDecoration: 'none', fontWeight: 600 }}>
            Servicios
          </a>
          <a href="#why-us" style={{ color: 'var(--brand-espresso)', textDecoration: 'none', fontWeight: 600 }}>
            ¿Por Qué Elegirnos?
          </a>
          <a href="#nail-art" style={{ color: 'var(--brand-espresso)', textDecoration: 'none', fontWeight: 600 }}>
            Nail Art & Efectos
          </a>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Link to Dedicated PWA Client Portal */}
          <Link
            to="/pwa"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(222, 115, 143, 0.12) 0%, rgba(212, 175, 55, 0.12) 100%)',
              border: '1px solid rgba(222, 115, 143, 0.35)',
              color: 'var(--brand-pink-dark)',
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-couture)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s ease'
            }}
            title="Acceso al Portal PWA para Clientas"
          >
            <Smartphone size={14} color="var(--brand-pink-satin)" />
            <span>Mi Club Privilege</span>
          </Link>

          {/* Booking CTA Button */}
          <button
            onClick={onOpenBooking}
            className="btn-satin-pink"
            style={{ padding: '0.6rem 1.35rem', fontSize: '0.78rem', letterSpacing: '0.08em' }}
          >
            RESERVAR TURNO
          </button>
        </div>

      </div>
    </header>
  );
};
