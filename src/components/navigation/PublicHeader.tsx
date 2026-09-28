import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Smartphone, Calendar, ChevronRight } from 'lucide-react';
import { WebCustomizationConfig } from '../../types/webConfig';
import { useWebConfig } from '../../hooks/useWebConfig';
import { getThemeFromConfig } from '../../lib/themeStyles';

interface Props {
  onOpenBooking: () => void;
  config?: WebCustomizationConfig;
}

export const PublicHeader: React.FC<Props> = ({ onOpenBooking, config: propConfig }) => {
  const { config: hookConfig } = useWebConfig();
  const config = propConfig || hookConfig;
  const theme = getThemeFromConfig(config);

  return (
    <header className="header-glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid ${theme.borderSubtle}` }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', padding: '0.5rem 1rem', gap: '0.75rem' }}>
        
        {/* Brand & Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', minWidth: 0 }}>
          {config.customLogoUrl ? (
            <div style={{
              width: '40px',
              height: '40px',
              flexShrink: 0,
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: `0 4px 14px rgba(${theme.primaryRgb}, 0.25)`,
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={config.customLogoUrl}
                alt={config.brandName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: `scale(${(config.customLogoScale || 100) / 100})`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            </div>
          ) : (
            <div style={{
              width: '38px',
              height: '38px',
              flexShrink: 0,
              borderRadius: '50%',
              background: theme.buttonGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: `0 4px 12px rgba(${theme.primaryRgb}, 0.35)`,
              border: '1px solid rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem'
            }}>
              {config.logoEmoji || '💅'}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-serif-glam)',
              fontSize: 'clamp(1.1rem, 4vw, 1.45rem)',
              color: 'var(--brand-espresso)',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {config.brandName}
            </div>
            <div className="hidden sm:block" style={{
              fontSize: '0.58rem',
              color: theme.secondary,
              fontFamily: 'var(--font-couture)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {config.brandTagline}
            </div>
          </div>
        </Link>

        {/* Center Editorial Links (Desktop only) */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Link to Dedicated PWA Client Portal (Hidden on very narrow mobile to prevent wrap) */}
          <Link
            to="/pwa"
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.12) 0%, rgba(${theme.accentRgb}, 0.18) 100%)`,
              border: `1px solid ${theme.borderSubtle}`,
              color: theme.secondary,
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-couture)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            title="Acceso al Portal PWA para Clientas"
          >
            <Smartphone size={13} color={theme.primary} />
            <span>Club Privilege</span>
          </Link>

          {/* Booking CTA Button */}
          <button
            onClick={onOpenBooking}
            className="btn-satin-pink"
            style={{
              background: theme.buttonGradient,
              boxShadow: theme.buttonShadow,
              padding: '0.5rem 1rem',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              borderRadius: 'var(--radius-full)'
            }}
          >
            RESERVAR
          </button>
        </div>

      </div>
    </header>
  );
};
