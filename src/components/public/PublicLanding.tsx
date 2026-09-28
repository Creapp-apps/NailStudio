import React, { useState } from 'react';
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
  MessageCircle,
  Gem,
  PackageCheck,
  Feather
} from 'lucide-react';
import { NailService, NailArtTier } from '../../types/nailStudio';
import { INITIAL_SERVICES, NAIL_ART_TIERS } from '../../services/mockData';

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
      title: 'LUXURY TREATMENTS',
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
      description: 'Experience unparalleled luxury with our treatments, including Russian manicure, rubber level therapies, and premium nail care.'
    },
    {
      id: 1,
      title: 'PREMIUM PRODUCTS',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-pink-satin)' }}>
          <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z" />
          <path d="M10 8h4" />
          <circle cx="12" cy="15" r="2" />
        </svg>
      ),
      description: 'We use only biocompatible HEMA-Free premium products to ensure exceptional results, offering lasting beauty and unmatched care.'
    },
    {
      id: 2,
      title: 'CERTIFIED PROFESSIONALS',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-pink-satin)' }}>
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      description: 'Our certified master nail artists ensure expert care, precision, and exceptional results for all nail and sculpting services.'
    },
    {
      id: 3,
      title: 'RELAXING ATMOSPHERE',
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
      description: 'Unwind in our relaxing atmosphere, designed to provide comfort and tranquility during your beauty treatments.'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      {/* Editorial Mini-Header Sub-Navigation (Matching Reference) */}
      <div style={{
        background: 'rgba(255, 247, 250, 0.95)',
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
        color: 'var(--text-secondary)'
      }}>
        <span>Home</span>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <a href="#servicios" style={{ color: 'inherit', textDecoration: 'none' }}>Servicios</a>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <a href="#why-us" style={{ color: 'inherit', textDecoration: 'none' }}>Por Qué Elegirnos</a>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <a href="#nail-art" style={{ color: 'inherit', textDecoration: 'none' }}>Galería Nail Art</a>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <span onClick={onOpenNailBot} style={{ cursor: 'pointer', color: 'var(--brand-pink-satin)', fontWeight: 700 }}>Nail-Bot IA</span>
        <span style={{ color: 'var(--brand-pink-satin)' }}>•</span>
        <span onClick={onOpenPortal} style={{ cursor: 'pointer', color: '#B8860B', fontWeight: 700 }}>Privilege Pass</span>
      </div>

      {/* HERO SECTION: Editorial High Glamour (Reference Match) */}
      <section style={{
        minHeight: '85vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '3rem 1.5rem 5rem 1.5rem',
        background: 'radial-gradient(circle at 75% 25%, #FFE3EC 0%, #FFF5F8 45%, #FCF5F8 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="app-container" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(320px, 1.15fr) 1fr', alignItems: 'center', gap: '3rem', position: 'relative', zIndex: 10 }}>
          
          {/* Left Column: Editorial Headline & Actions */}
          <div style={{ maxWidth: '620px' }}>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
              lineHeight: 1.08,
              color: 'var(--brand-espresso)',
              fontFamily: 'var(--font-serif-glam)',
              letterSpacing: '0.01em',
              fontWeight: 400,
              marginBottom: '1rem'
            }}>
              INDULGE IN LUXURY NAIL AND COUTURE TREATMENTS
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              letterSpacing: '0.02em'
            }}>
              @ Atelier Nails Haute Studio & Co.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => onOpenBooking()}
                className="btn-satin-pink"
              >
                VIEW SERVICES & BOOK
              </button>

              <button
                onClick={onOpenNailBot}
                className="btn-outline-couture"
              >
                <Sparkles size={15} color="var(--brand-pink-satin)" />
                CONSULTA CON NAIL-BOT IA
              </button>
            </div>
          </div>

          {/* Right Column: Hero High-Fashion Imagery (Violet & Floral Crystals) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Ambient Halo behind the hand */}
            <div style={{
              position: 'absolute',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(242, 141, 167, 0.45) 0%, rgba(255, 240, 245, 0) 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            {/* Glamour Hand Visual */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 30px 70px -15px rgba(184, 80, 110, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              maxWidth: '480px',
              width: '100%',
              aspectRatio: '4/5'
            }}>
              <img
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85"
                alt="High Fashion Nails with Glitter and Crystals"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.03)',
                  transition: 'transform 0.8s ease'
                }}
              />
              {/* Soft overlay gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(222, 115, 143, 0.1) 0%, rgba(30, 18, 22, 0.35) 100%)',
                pointerEvents: 'none'
              }} />

              {/* Floating Haute Badge */}
              <div style={{
                position: 'absolute',
                bottom: '18px',
                left: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-pink-dark)', fontWeight: 700 }}>
                    EDICIÓN GLAMOUR 2026
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--brand-espresso)', fontWeight: 600 }}>
                    Cat Eye Violeta & Gemas Swarovski
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-pink-dark)' }}>
                  ★ 5.0
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Green WhatsApp Button (Exact from Reference) */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          zIndex: 40
        }}>
          <a
            href="https://wa.me/5491145228901?text=Hola%20Atelier%20Nails,%20me%20gustaria%20consultar%20por%20un%20turno%20de%20manicuria%20glamour"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-floating-pill"
          >
            <MessageCircle size={18} fill="#FFFFFF" color="#25D366" />
            Chat with us on WhatsApp
          </a>
        </div>
      </section>

      {/* WHY CHOOSE US? (Exact 4-Card Section from Reference) */}
      <section id="why-us" style={{ padding: '5rem 1.5rem', background: '#FFFFFF' }}>
        <div className="app-container">
          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontFamily: 'var(--font-serif-glam)',
            color: 'var(--brand-espresso)',
            marginBottom: '3rem',
            letterSpacing: '0.03em',
            fontWeight: 400
          }}>
            WHY CHOOSE US?
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
            Atelier Nails by Haute Studio
          </div>

          <div style={{
            fontSize: 'clamp(1.8rem, 4.2vw, 3.4rem)',
            fontFamily: 'var(--font-serif-glam)',
            lineHeight: 1.15,
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              NAIL AND COUTURE SALON OFFERING
            </span>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              MANICURES AND NAIL ART WITH
            </span>
            <span style={{ color: 'var(--brand-espresso)' }}>
              LUXURY TREATMENTS{' '}
            </span>
            <span style={{ color: 'rgba(156, 133, 142, 0.45)' }}>
              SUCH AS
            </span>
            <span style={{ color: 'rgba(156, 133, 142, 0.45)', display: 'block' }}>
              KAPPING RUBBER GEL AND EXTENSIONS
            </span>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              RUSSIAN MANICURE, SOFT GEL WITH
            </span>
            <span style={{ color: 'var(--brand-espresso)', display: 'block' }}>
              ACRYLIC AND BIOCOMPATIBLE POLISHES
            </span>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <button
              onClick={() => onOpenBooking()}
              className="btn-satin-pink"
            >
              EXPLORAR DISPONIBILIDAD
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES MENU: Luxury Cards */}
      <section id="servicios" style={{ padding: '5rem 1.5rem', background: '#FFFFFF' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge-luxury badge-rose" style={{ marginBottom: '0.75rem' }}>
              HAUTE COUTURE MENU
            </span>
            <h2 style={{ fontSize: '2.6rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)' }}>
              TÉCNICAS ESTRUCTURALES EXCLUSIVAS
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Precisión de 21 días sin desprendimientos, con productos biocompatibles HEMA-Free.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {INITIAL_SERVICES.map(service => (
              <div
                key={service.id}
                style={{
                  background: 'var(--bg-card-subtle)',
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
      <section id="nail-art" style={{ padding: '5rem 1.5rem', background: '#FFF7FA', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge-luxury badge-gold" style={{ marginBottom: '0.75rem' }}>
              CREATIVE ATELIER BAR
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
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-couture)', color: '#D4AF37', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>ATENCIÓN PERSONALIZADA</div>
            <div style={{ fontSize: '0.8rem', color: '#EAE3DC' }}>Turnos con reserva anticipada y seña online.</div>
            <div style={{ fontSize: '0.8rem', color: '#25D366', marginTop: '0.5rem', fontWeight: 600 }}>WhatsApp Concierge disponible</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
          © 2026 Atelier Nails & Co. • Haute Nail Architecture. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
