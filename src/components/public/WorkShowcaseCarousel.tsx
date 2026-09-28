import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Maximize2,
  X,
  CheckCircle2,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { WebCustomizationConfig, ShowcaseWorkItem } from '../../types/webConfig';
import { useWebConfig } from '../../hooks/useWebConfig';
import { getThemeFromConfig } from '../../lib/themeStyles';

interface Props {
  config?: WebCustomizationConfig;
  onOpenBooking: () => void;
}

export const WorkShowcaseCarousel: React.FC<Props> = ({ config: propConfig, onOpenBooking }) => {
  const { config: hookConfig } = useWebConfig();
  const config = propConfig || hookConfig;
  const theme = getThemeFromConfig(config);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [zoomItem, setZoomItem] = useState<ShowcaseWorkItem | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const rawItems = config.showcaseItems || [];
  const filteredItems = activeCategory === 'all'
    ? rawItems
    : rawItems.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'all', label: 'Todos los Trabajos' },
    { id: 'kapping', label: 'Kapping Gel' },
    { id: 'nail_art', label: 'Nail Art & Efectos' },
    { id: 'soft_gel', label: 'Soft Gel' },
    { id: 'rusa', label: 'Manicuría Rusa' }
  ];

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay || filteredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredItems.length]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex(prev => (prev + 1) % filteredItems.length);
  };

  return (
    <section
      id="galeria-trabajos"
      style={{
        padding: '5.5rem 1.5rem',
        background: theme.statementBg || 'linear-gradient(180deg, rgba(255, 247, 250, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
        borderTop: `1px solid ${theme.borderSubtle}`,
        borderBottom: `1px solid ${theme.borderSubtle}`,
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Decorative ambient background accents */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-5%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${theme.primaryRgb}, 0.08) 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              background: `rgba(${theme.primaryRgb}, 0.12)`,
              color: theme.secondary,
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-couture)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
              border: `1px solid ${theme.borderSubtle}`
            }}
          >
            <Sparkles size={13} color={theme.primary} />
            <span>{config.showcaseBadge || '✦ OBRAS DE AUTOR & PORTFOLIO ✦'}</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3.1rem)',
            color: 'var(--brand-espresso)',
            fontFamily: 'var(--font-serif-glam)',
            lineHeight: 1.15,
            letterSpacing: '0.02em',
            marginBottom: '0.85rem'
          }}>
            {config.showcaseTitle || 'GALERÍA DE TRABAJOS DESTACADOS'}
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '620px',
            margin: '0 auto'
          }}>
            {config.showcaseSubtitle || 'Explorá nuestras técnicas más solicitadas: arquitectura estructural en Soft Gel, Kapping con Rubber hipoalergénico y Nail Art exclusivo de alta precisión.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? `1px solid ${theme.primary}` : `1px solid ${theme.borderSubtle}`,
                  background: isSelected ? theme.buttonGradient : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--brand-espresso)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: isSelected ? theme.buttonShadow : '0 1px 4px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Work Carousel & Cards */}
        {filteredItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 'var(--radius-lg)',
            border: `1px dashed ${theme.borderSubtle}`
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No hay fotos cargadas en esta categoría por el momento.
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Carousel Navigation Arrow Controls */}
            {filteredItems.length > 3 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'absolute',
                top: '40%',
                left: '-15px',
                right: '-15px',
                transform: 'translateY(-50%)',
                zIndex: 20,
                pointerEvents: 'none'
              }}>
                <button
                  onClick={handlePrev}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: `1px solid ${theme.borderSubtle}`,
                    color: 'var(--brand-espresso)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    pointerEvents: 'auto',
                    transition: 'all 0.2s ease'
                  }}
                  title="Anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: `1px solid ${theme.borderSubtle}`,
                    color: 'var(--brand-espresso)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    pointerEvents: 'auto',
                    transition: 'all 0.2s ease'
                  }}
                  title="Siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Grid / Carousel Cards Container */}
            <div
              ref={sliderRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: `1px solid ${theme.borderSubtle}`,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    position: 'relative'
                  }}
                  className="showcase-card"
                >
                  {/* Photo Container */}
                  <div style={{
                    position: 'relative',
                    aspectRatio: '4/4.5',
                    overflow: 'hidden',
                    background: 'var(--bg-app)',
                    cursor: 'pointer'
                  }}
                    onClick={() => setZoomItem(item)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                      }}
                      className="showcase-img"
                    />

                    {/* Technique Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(255, 255, 255, 0.94)',
                      backdropFilter: 'blur(8px)',
                      color: theme.secondary,
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-couture)',
                      letterSpacing: '0.08em',
                      border: `1px solid ${theme.borderSubtle}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                      {item.techniqueTag}
                    </div>

                    {/* Zoom Icon Button */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.45)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      <Maximize2 size={14} />
                    </div>

                    {/* Ambient subtle vignette */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 60%, rgba(30, 18, 22, 0.3) 100%)',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  {/* Card Content & Details */}
                  <div style={{
                    padding: '1.25rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.15rem',
                        color: 'var(--brand-espresso)',
                        fontFamily: 'var(--font-serif-glam)',
                        fontWeight: 600,
                        lineHeight: 1.25,
                        marginBottom: '0.4rem'
                      }}>
                        {item.title}
                      </h3>

                      {item.description && (
                        <p style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                          marginBottom: '0.85rem'
                        }}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div>
                      {/* Durability / Guarantee Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        marginBottom: '1rem'
                      }}>
                        <ShieldCheck size={14} color={theme.primary} />
                        <span>Duración intacta {item.durationDays || 21}+ días • HEMA-Free</span>
                      </div>

                      {/* Action Button: Book this look */}
                      <button
                        onClick={onOpenBooking}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${theme.borderSubtle}`,
                          background: 'rgba(222, 115, 143, 0.08)',
                          color: theme.secondary,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = theme.buttonGradient;
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(222, 115, 143, 0.08)';
                          e.currentTarget.style.color = theme.secondary;
                        }}
                      >
                        <Calendar size={13} />
                        <span>Quiero Este Diseño</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA & Instagram link */}
            <div style={{
              textAlign: 'center',
              marginTop: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <button
                onClick={onOpenBooking}
                className="btn-satin-pink"
                style={{
                  background: theme.buttonGradient,
                  boxShadow: theme.buttonShadow,
                  padding: '0.85rem 2rem',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em'
                }}
              >
                VER TURNOS Y DISPONIBILIDAD
              </button>
              {config.instagram && (
                <a
                  href={`https://instagram.com/${config.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <span>Mirá más sets en nuestro Instagram {config.instagram}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26, 17, 21, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.25s ease'
          }}
          onClick={() => setZoomItem(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '560px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setZoomItem(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.55)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <img
              src={zoomItem.imageUrl}
              alt={zoomItem.title}
              style={{
                width: '100%',
                maxHeight: '420px',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'inline-block',
                background: `rgba(${theme.primaryRgb}, 0.1)`,
                color: theme.secondary,
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>
                {zoomItem.techniqueTag}
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)', marginBottom: '0.4rem' }}>
                {zoomItem.title}
              </h3>
              {zoomItem.description && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {zoomItem.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setZoomItem(null);
                    onOpenBooking();
                  }}
                  className="btn-satin-pink"
                  style={{
                    flex: 1,
                    background: theme.buttonGradient,
                    boxShadow: theme.buttonShadow,
                    padding: '0.75rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Calendar size={15} />
                  <span>Reservar Este Look</span>
                </button>
                <button
                  onClick={() => setZoomItem(null)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
