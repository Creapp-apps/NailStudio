import React from 'react';
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
  Heart
} from 'lucide-react';
import { NailService, NailArtTier } from '../../types/nailStudio';
import { INITIAL_SERVICES, NAIL_ART_TIERS } from '../../services/mockData';

interface Props {
  onOpenBooking: (serviceId?: string) => void;
  onOpenNailBot: () => void;
  onOpenPortal: () => void;
}

export const PublicLanding: React.FC<Props> = ({ onOpenBooking, onOpenNailBot, onOpenPortal }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '3.5rem 1rem 4rem 1rem',
        background: 'radial-gradient(ellipse at top, #F9F3ED 0%, #FAF7F5 70%)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="app-container" style={{ textAlign: 'center', maxWidth: '840px' }}>
          <span className="badge-luxury badge-rose" style={{ marginBottom: '1rem' }}>
            ✨ Haute Manicure & Nail Care Studio
          </span>

          <h1 style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
            lineHeight: 1.15,
            color: 'var(--brand-espresso)',
            marginBottom: '1.25rem'
          }}>
            La arquitectura de tus uñas, elevada al arte contemporáneo.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Especialistas en <strong>Manicura Rusa Combinada</strong>, Kapping Gel fortalecedor y extensiones en Soft Gel. Sin dolor, con productos <strong>HEMA-Free</strong> y una precisión milimétrica de hasta 21 días.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <button onClick={() => onOpenBooking()} className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem' }}>
              <Calendar size={18} /> Reservar Turno Online
            </button>
            <button onClick={onOpenNailBot} className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem' }}>
              <Sparkles size={18} color="var(--brand-terracotta)" /> Asesorarme con Nail-Bot IA
            </button>
            <button onClick={onOpenPortal} className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem' }}>
              <Award size={18} color="#C8AA82" /> Mis Nail Points PWA
            </button>
          </div>

          {/* Quick Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            textAlign: 'left'
          }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-terracotta)', marginBottom: '0.2rem' }}>
                ✓ Manicura Rusa Pura
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Limpieza con fresas alemanas de torno para un esmaltado debajo de cutícula que dura más.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-terracotta)', marginBottom: '0.2rem' }}>
                ✓ Cuidado HEMA-Free
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Química biocompatible que evita alergias, ardor o debilitamiento de la lámina natural.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-terracotta)', marginBottom: '0.2rem' }}>
                ✓ Nail-Time Exacto
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Sistema aditivo de minutos por técnica y nail art para que nunca esperes de más.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Menu */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="badge-luxury badge-rose" style={{ marginBottom: '0.5rem' }}>
              Catálogo de Servicios
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--brand-espresso)' }}>
              Técnicas Estructurales Exclusivas
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Diseñadas para proteger y embellecer la uña según tu estilo de vida y largo deseado.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {INITIAL_SERVICES.map(service => (
              <div
                key={service.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
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

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--brand-espresso)' }}>{service.title}</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-terracotta)', fontFamily: 'var(--font-editorial)' }}>
                        ${service.basePrice.toLocaleString('es-AR')}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={14} /> {service.baseDurationMin} min
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {service.description}
                    </p>

                    <div style={{ background: '#F9F4F0', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                      <strong>Recomendado para:</strong> {service.recommendedFor}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(service.id)}
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '0.9rem' }}
                  >
                    Reservar este Servicio <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nail Art Tiers Showcase */}
      <section style={{ padding: '4rem 1rem', background: '#F8F3EE', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="badge-luxury badge-gold" style={{ marginBottom: '0.5rem' }}>
              Atelier Creative Bar
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--brand-espresso)' }}>
              Niveles de Nail Art & Tiempo Aditivo
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              El secreto de una manicura impecable es reservar el tiempo necesario para cada detalle.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
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
                <div style={{ height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={tier.sampleImage} alt={tier.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1rem', color: 'var(--brand-espresso)', marginBottom: '0.3rem' }}>{tier.name}</h4>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-terracotta)', marginBottom: '0.5rem', fontFamily: 'var(--font-editorial)' }}>
                  {tier.price > 0 ? `+$${tier.price.toLocaleString('es-AR')}` : 'Sin cargo adicional'}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {tier.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {tier.examples.map(ex => (
                    <span key={ex} style={{ fontSize: '0.7rem', background: '#F5ECE4', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--brand-espresso)', color: '#FFFFFF', padding: '3.5rem 1rem 2rem 1rem' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: '#D4AF37', marginBottom: '0.5rem' }}>
              Atelier Nails & Co.
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#C89688', maxWidth: '320px' }}>
              Estudio de alta manicura, formación y estética ungueal avanzada.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '0.5rem' }}>HORARIOS DE ATENCIÓN</div>
            <div style={{ fontSize: '0.8rem', color: '#EAE3DC' }}>Lunes a Sábados: 09:00 a 20:00 hs</div>
            <div style={{ fontSize: '0.8rem', color: '#EAE3DC' }}>Recoleta / Palermo, Buenos Aires</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '0.5rem' }}>SUITE OPERATIVA</div>
            <div style={{ fontSize: '0.8rem', color: '#EAE3DC' }}>Diseñado con la arquitectura integral de gestión ungueal.</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 Atelier Nails & Co. • Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
