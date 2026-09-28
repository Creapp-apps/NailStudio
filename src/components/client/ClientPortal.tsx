import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Share2,
  Calendar,
  Heart,
  Camera,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';
import { ClientProfile, PastSetRecord } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  client: ClientProfile;
  onOpenBooking: () => void;
}

export const ClientPortal: React.FC<Props> = ({ client, onOpenBooking }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null);

  const rewards = [
    { id: 'rew-1', name: 'Nail Art Nivel 1 Gratis', cost: 400, desc: 'Francesitas o glitter sutil en tu próximo set' },
    { id: 'rew-2', name: 'Spa de Manos & Exfoliación', cost: 750, desc: 'Baño de parafina vegetal y masaje relajante' },
    { id: 'rew-3', name: '20% OFF en Kapping o Soft Gel', cost: 1200, desc: 'Válido para tu próximo service de mantenimiento' }
  ];

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(client.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeem = (rewardId: string, cost: number) => {
    if (client.pointsBalance < cost) {
      alert('Puntos insuficientes para este beneficio.');
      return;
    }

    const updated = {
      ...client,
      pointsBalance: client.pointsBalance - cost
    };
    storage.updateClient(updated);
    setRedeemedReward(rewardId);
    setTimeout(() => setRedeemedReward(null), 3000);
  };

  const pointsValuePesos = client.pointsBalance * 10; // Each point = $10 ARS

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }} className="animate-fade-in">
      {/* Top Banner Profile */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={client.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-terracotta)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--brand-espresso)' }}>{client.name}</h2>
              <span className="badge-luxury badge-gold">{client.tier}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Miembro desde 2026 • {client.totalVisits} visitas completadas • Tel: {client.phone}
            </p>
          </div>
        </div>

        <button onClick={onOpenBooking} className="btn-primary">
          <Calendar size={18} /> Reservar Mi Próximo Service
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Luxury Metallic Nail-Pass Card */}
        <div className="nail-pass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D4AF37', fontWeight: 700 }}>
                Atelier Privilege Pass
              </span>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: '#FFFFFF', marginTop: '0.2rem' }}>
                Nail Points Wallet
              </h3>
            </div>
            <Sparkles size={24} color="#D4AF37" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#C89688', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Saldo Acumulado
            </span>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, fontFamily: 'var(--font-editorial)' }}>
              {client.pointsBalance.toLocaleString('es-AR')} <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>PTS</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#E6D8CC', marginTop: '0.2rem' }}>
              Equivalente a <strong>${pointsValuePesos.toLocaleString('es-AR')} ARS</strong> para canjear en tus turnos
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', fontSize: '0.75rem' }}>
            <div>
              <div style={{ color: '#C89688' }}>TITULAR</div>
              <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{client.name.toUpperCase()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#C89688' }}>CÓDIGO DE REFERIDA</div>
              <div style={{ fontWeight: 700, color: '#D4AF37', letterSpacing: '0.05em' }}>{client.referralCode}</div>
            </div>
          </div>
        </div>

        {/* Member-Get-Member Referral Hub */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Gift size={20} color="var(--brand-terracotta)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--brand-espresso)' }}>
                Programa Invita a tu Amiga
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Comparte tu código con amigas que nunca hayan venido al estudio. Ellas reciben <strong>$3.000 de regalo</strong> en su primer set y tú sumas <strong>500 Nail Points</strong> automáticamente cuando asistan.
            </p>

            <div style={{
              background: 'var(--bg-card)',
              border: '2px dashed var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tu Código Exclusivo</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-terracotta)', letterSpacing: '0.06em' }}>
                  {client.referralCode}
                </div>
              </div>
              <button
                onClick={handleCopyReferral}
                style={{
                  background: copiedCode ? 'var(--status-confirmed-bg)' : 'var(--bg-surface)',
                  color: copiedCode ? 'var(--status-confirmed)' : 'var(--text-main)',
                  border: '1px solid var(--border-strong)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copiedCode ? <CheckCircle size={15} /> : <Copy size={15} />}
                {copiedCode ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <a
            href={`https://wa.me/?text=¡Hola!%20Te%20regalo%20$3.000%20de%20descuento%20para%20tu%20primer%20set%20de%20uñas%20en%20Atelier%20Nails%20con%20mi%20código%20${client.referralCode}.%20Reserva%20tu%20turno%20aquí:%20https://atelier-nails.app`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Share2 size={16} /> Compartir por WhatsApp a mis Amigas
          </a>
        </div>
      </div>

      {/* Reward Redemption Catalog */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-espresso)' }}>Canje de Beneficios con Puntos</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Usa tus puntos en el salón presentando tu código</p>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-terracotta)' }}>
            Tienes {client.pointsBalance} pts disponibles
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {rewards.map((rew) => {
            const canAfford = client.pointsBalance >= rew.cost;
            const isRedeemed = redeemedReward === rew.id;

            return (
              <div
                key={rew.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)' }}>{rew.name}</h4>
                    <span className="badge-luxury badge-rose">{rew.cost} PTS</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {rew.desc}
                  </p>
                </div>

                <button
                  disabled={!canAfford || isRedeemed}
                  onClick={() => handleRedeem(rew.id, rew.cost)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isRedeemed ? 'var(--status-confirmed)' : canAfford ? 'var(--brand-terracotta)' : '#EAE3DC',
                    color: canAfford ? '#FFFFFF' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: canAfford && !isRedeemed ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {isRedeemed ? '¡Cupón Aplicado a tu Ficha!' : canAfford ? 'Canjear Beneficio' : `Te faltan ${rew.cost - client.pointsBalance} pts`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client's Sets History & Photo Gallery */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-espresso)' }}>Mi Galería de Sets & Evolución</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Historial fotográfico de cada manicura realizada</p>
          </div>
          <button
            onClick={() => alert('¡Pronto podrás subir tus capturas de Pinterest directamente desde tu carrete!')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            <Camera size={15} /> Subir Foto de Inspiración
          </button>
        </div>

        {client.setsHistory && client.setsHistory.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {client.setsHistory.map((set) => (
              <div
                key={set.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={set.photoUrl}
                  alt={set.serviceName}
                  style={{ width: '100%', height: '190px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-terracotta)' }}>{set.date}</span>
                    <div style={{ display: 'flex', gap: '2px', color: '#D4AF37' }}>
                      {[...Array(set.rating || 5)].map((_, i) => (
                        <Star key={i} size={13} fill="#D4AF37" />
                      ))}
                    </div>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', marginBottom: '0.2rem' }}>{set.serviceName}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {set.nailArtTierName} • Tech: <strong>{set.techName}</strong>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-app)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                    "{set.notes}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem',
            textAlign: 'center',
            border: '1px dashed var(--border-strong)'
          }}>
            <Camera size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontSize: '1rem', color: 'var(--brand-espresso)' }}>Aún no tienes fotos de sets registradas</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.25rem auto 1rem auto' }}>
              Al finalizar tu primer servicio en el estudio, tu manicurista tomará la foto de alta resolución y se sincronizará automáticamente aquí.
            </p>
            <button onClick={onOpenBooking} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              Agendar Mi Primer Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
