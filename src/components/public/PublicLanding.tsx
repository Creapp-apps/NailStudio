import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Star,
  Check,
  Scissors,
  Heart,
  Gem,
  PackageCheck,
  Feather
} from 'lucide-react';
import { NailService, NailArtTier } from '../../types/nailStudio';
import { INITIAL_SERVICES, NAIL_ART_TIERS } from '../../services/mockData';
import { InteractiveGlamBackground } from '../effects/InteractiveGlamBackground';
import { Hero3DTiltCard } from '../effects/Hero3DTiltCard';
import { InfiniteCoutureMarquee } from '../effects/InfiniteCoutureMarquee';

interface Props {
  onOpenBooking: (serviceId?: string) => void;
  onOpenNailBot: () => void;
  onOpenPortal: () => void;
}

export const PublicLanding: React.FC<Props> = ({ onOpenBooking, onOpenNailBot, onOpenPortal }) => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const whyChooseUs = [
    {
      id: 0,
      title: 'TRATAMIENTOS DE AUTOR',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-pink-satin)' }}>
          <path d="M12 2v4" />
          <path d="m4.93 4.93 2.83 2.83" />
          <path d="M2 12h4" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
          <path d="m14 14 5 5" />
          <path d="m17 12 3 3" />
        </svg>
      ),
      description: 'Viví una experiencia exclusiva con nuestros tratamientos: manicuría rusa combinada, nivelación con gel Rubber y cuidado profundo de la uña.'
    },
    {
      id: 1,
      title: 'PRODUCTOS HIPOALERGÉNICOS',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-pink-satin)' }}>
          <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z" />
          <path d="M10 8h4" />
          <circle cx="12" cy="15" r="2" />
        </svg>
      ),
      description: 'Utilizamos exclusivamente productos biocompatibles 100% libres de HEMA para garantizar un acabado impecable, seguro y sin alergias.'
    },
    {
      id: 2,
      title: 'MANICURISTAS EXPERTAS',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-pink-satin)' }}>
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      description: 'Nuestras manicuristas maestras dominan la arquitectura ungueal, el corte milimétrico de cutículas y el diseño a mano alzada de precisión.'
    },
    {
      id: 3,
      title: 'AMBIENTE BOUTIQUE',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-pink-satin)' }}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
        </svg>
      ),
      description: 'Relajate en un ambiente de spa exclusivo, pensado para brindarte tranquilidad, café de especialidad y desconexión absoluta.'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      {/* Living Ambient Stardust & Breathing Liquid Aurora Canvas */}
      <InteractiveGlamBackground />

      {/* Editorial Mini-Header Sub-Navigation (Matching Reference) */}
      <div style={{
        background: 'rgba(255, 247, 250, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.65rem 1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.78rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-couture)',
        color: 'var(--text-secondary)',
        position: 'relative',
        zIndex: 20
      }}>
        <span>Inicio</span>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <a href="#servicios" style={{ color: 'inherit', textDecoration: 'none' }}>Servicios</a>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <a href="#why-us" style={{ color: 'inherit', textDecoration: 'none' }}>¿Por Qué Elegirnos?</a>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <a href="#nail-art" style={{ color: 'inherit', textDecoration: 'none' }}>Galería Nail Art</a>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <span onClick={onOpenNailBot} style={{ cursor: 'pointer', color: 'var(--brand-pink-satin)', fontWeight: 700 }}>Nail-Bot IA</span>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <span onClick={onOpenPortal} style={{ cursor: 'pointer', color: '#B8860B', fontWeight: 700 }}>Club Privilege</span>
      </div>

      {/* HERO SECTION: Editorial High Glamour with 3D Specular Tilt */}
      <section style={{
        minHeight: '85vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '3rem 1.5rem 4.5rem 1.5rem',
        background: 'radial-gradient(circle at 75% 25%, rgba(255, 227, 236, 0.45) 0%, rgba(255, 245, 248, 0.25) 45%, rgba(252, 245, 248, 0.1) 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 10
      }}>
        <div className="app-container" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(320px, 1.15fr) 1fr', alignItems: 'center', gap: '3.5rem', position: 'relative', zIndex: 10 }}>
          
          {/* Left Column: Editorial Headline & Actions */}
          <div style={{ maxWidth: '620px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.85)',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 15px rgba(222, 115, 143, 0.1)'
            }}>
              <Sparkles size={14} color="var(--brand-pink-satin)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-couture)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-pink-dark)', fontWeight: 700 }}>
                ESTUDIO DE ALTA MANICURÍA
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
              lineHeight: 1.08,
              color: 'var(--brand-espresso)',
              fontFamily: 'var(--font-serif-glam)',
              letterSpacing: '0.01em',
              fontWeight: 400,
              marginBottom: '1rem'
            }}>
              ARTE, PRECISIÓN Y ALTA COSTURA PARA TUS UÑAS
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              letterSpacing: '0.02em'
            }}>
              @ Atelier Nails Studio • Buenos Aires
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => onOpenBooking()}
                className="btn-satin-pink"
              >
                VER SERVICIOS Y RESERVAR
              </button>

              <button
                onClick={onOpenNailBot}
                className="btn-outline-couture"
              >
                <Sparkles size={15} color="var(--brand-pink-satin)" />
                CONSULTAR CON NAIL-BOT IA
              </button>
            </div>
          </div>

          {/* Right Column: Hero High-Fashion Interactive 3D Card with Holographic Specular Tilt */}
          <Hero3DTiltCard />
        </div>
      </section>

      {/* Infinite Continuous Haute Couture Typography Ribbon Marquee */}
      <InfiniteCoutureMarquee />

      {/* WHY CHOOSE US? (Translucent Glassmorphism) */}
      <section id="why-us" style={{ padding: '5.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.78)', backdropFilter: 'blur(16px)', position: 'relative', zIndex: 10 }}>
        <div className="app-container">
          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontFamily: 'var(--font-serif-glam)',
            color: 'var(--brand-espresso)',
            marginBottom: '3rem',
            letterSpacing: '0.03em',
            fontWeight: 400
          }}>
            ¿POR QUÉ ELEGIRNOS?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '0',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden'
          }}>
            {whyChooseUs.map((item, index) => {
              const isActive = activeFeature === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveFeature(item.id)}
                  className={`glam-feature-card ${isActive ? 'active' : ''}`}
                  style={{
                    borderRight: index < 3 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginBottom: '1.75rem', height: '48px', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </div>

                  <h3 style={{
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-serif-glam)',
                    letterSpacing: '0.04em',
                    color: 'var(--brand-espresso)',
                    marginBottom: '0.85rem',
                    fontWeight: 600
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: '0.825rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)'
                  }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MASSIVE EDITORIAL STATEMENT BANNER (Exact Reference Match) */}
      <section style={{
        padding: '5.5rem 1.5rem',
        background: '#FAF5F8',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative leaf silhouette */}
        <div style={{
          position: 'absolute',
          right: '-5%',
          bottom: '-10%',
          opacity: 0.12,
          pointerEvents: 'none',
          fontSize: '320px',
          color: 'var(--brand-pink-satin)'
        }}>
          🌸
        </div>

        <div className="app-container" style={{ position: 'relative', zIndex: 5 }}>
          <div style={{
            fontSize: '0.825rem',
            fontFamily: 'var(--font-couture)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--brand-pink-dark)',
            marginBottom: '1.25rem'
          }}>
            Atelier Nails • Estudio Boutique Buenos Aires
          </div>

          <div style={{
            fontSize: 'clamp(1.8rem, 4.2vw, 3.4rem)',
            fontFamily: 'var(--font-serif-glam)',
            lineHeight: 1.15,
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              ESTUDIO EXCLUSIVO DE ALTA MANICURÍA
            </span>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              Y NAIL ART DE AUTOR CON
            </span>
            <span style={{ color: 'var(--brand-espresso)' }}>
              TRATAMIENTOS DE VANGUARDIA{' '}
            </span>
            <span style={{ color: 'rgba(156, 133, 142, 0.45)' }}>
              COMO
            </span>
            <span style={{ color: 'rgba(156, 133, 142, 0.45)', display: 'block' }}>
              KAPPING GEL Y EXTENSIONES ESCULPIDAS,
            </span>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              MANICURÍA RUSA COMBINADA CON
            </span>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              PRODUCTOS HIPOALERGÉNICOS LIBRES DE HEMA
            </span>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <button
              onClick={() => onOpenBooking()}
              className="btn-satin-pink"
            >
              VER TURNOS Y DISPONIBILIDAD
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES MENU: Luxury Cards */}
      <section id="servicios" style={{ padding: '5.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.82)', backdropFilter: 'blur(16px)', position: 'relative', zIndex: 10 }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge-luxury badge-rose" style={{ marginBottom: '0.75rem' }}>
              MENÚ DE ALTA MANICURÍA
            </span>
            <h2 style={{ fontSize: '2.6rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)' }}>
              TÉCNICAS ESTRUCTURALES EXCLUSIVAS
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Duración garantizada de 21 días sin desprendimientos, con geles hipoalergénicos libres de HEMA.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {INITIAL_SERVICES.map(service => (
              <div
                key={service.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {service.badge && (
                    <span className="badge-luxury badge-rose" style={{ position: 'absolute', top: '14px', right: '14px' }}>
                      {service.badge}
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)', marginBottom: '0.4rem' }}>
                      {service.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-pink-dark)', fontFamily: 'var(--font-couture)' }}>
                        ${service.basePrice.toLocaleString('es-AR')}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {service.baseDurationMin} min
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {service.description}
                    </p>

                    <div style={{ background: '#FFF0F5', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--brand-pink-dark)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                      <strong>Recomendado:</strong> {service.recommendedFor}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(service.id)}
                    className="btn-satin-pink"
                    style={{ width: '100%', borderRadius: 'var(--radius-full)' }}
                  >
                    Reservar este Set <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NAIL ART TIERS (Glitter & Shiny Finishes) */}
      <section id="nail-art" style={{ padding: '5.5rem 1.5rem', background: 'rgba(255, 247, 250, 0.82)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border-subtle)', position: 'relative', zIndex: 10 }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge-luxury badge-gold" style={{ marginBottom: '0.75rem' }}>
              BARRA DE NAIL ART & DISEÑO
            </span>
            <h2 style={{ fontSize: '2.6rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)' }}>
              NIVELES DE NAIL ART & TIEMPO ADITIVO
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Desde el satinado Glazed Donut hasta gemas 3D talladas a mano.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {NAIL_ART_TIERS.map(tier => (
              <div
                key={tier.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={tier.sampleImage} alt={tier.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)', marginBottom: '0.3rem' }}>
                  {tier.name}
                </h4>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-pink-dark)', marginBottom: '0.5rem', fontFamily: 'var(--font-couture)' }}>
                  {tier.price > 0 ? `+$${tier.price.toLocaleString('es-AR')}` : 'Sin costo adicional'}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  {tier.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {tier.examples.map(ex => (
                    <span key={ex} style={{ fontSize: '0.7rem', background: '#FFF0F5', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', color: 'var(--brand-pink-dark)', border: '1px solid var(--border-subtle)' }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1E1216', color: '#FFFFFF', padding: '4rem 1.5rem 2rem 1.5rem' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2.5rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif-glam)', color: '#F28DA7', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
              Atelier Nails & Co.
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#D9BAC4', maxWidth: '340px' }}>
              Estudio de alta manicura, formación y estética ungueal avanzada con tratamiento de salón spa.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-couture)', color: '#D4AF37', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>HORARIOS DE ATENCIÓN</div>
            <div style={{ fontSize: '0.8rem', color: '#EAE3DC', lineHeight: 1.8 }}>Lunes a Sábados: 09:00 a 20:00 hs</div>
            <div style={{ fontSize: '0.8rem', color: '#EAE3DC' }}>Recoleta / Palermo, Buenos Aires</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-couture)', color: '#D4AF37', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>ACCESOS EXCLUSIVOS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <Link to="/pwa" style={{ color: '#F28DA7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                ✦ Portal Clientas (Club Privilege)
              </Link>
              <Link to="/backoffice" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                ⚙️ Acceso Staff & Backoffice
              </Link>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#25D366', marginTop: '0.85rem', fontWeight: 600 }}>WhatsApp Concierge disponible</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
          © 2026 Atelier Nails & Co. • Estudio de Alta Manicuría. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
