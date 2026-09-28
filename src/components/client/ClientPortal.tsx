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
  Star,
  Search,
  UserCheck,
  UserPlus,
  Crown,
  LogOut,
  Coins,
  ArrowRight
} from 'lucide-react';
import { ClientProfile, PastSetRecord } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  client: ClientProfile | null;
  onOpenBooking: () => void;
}

export const ClientPortal: React.FC<Props> = ({ client, onOpenBooking }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null);

  // Search & Register states for unauthenticated / new client
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const rewards = [
    { id: 'rew-1', name: 'Nail Art Nivel 1 Gratis', cost: 400, desc: 'Francesitas o glitter sutil en tu próximo set' },
    { id: 'rew-2', name: 'Spa de Manos & Exfoliación', cost: 750, desc: 'Baño de parafina vegetal y masaje relajante' },
    { id: 'rew-3', name: '20% OFF en Kapping o Soft Gel', cost: 1200, desc: 'Válido para tu próximo service de mantenimiento' }
  ];

  const handleCopyReferral = () => {
    if (!client) return;
    navigator.clipboard.writeText(client.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeem = (rewardId: string, cost: number) => {
    if (!client) return;
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

  const handlePhoneLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!phoneSearch.trim()) return;

    const found = storage.getClientByPhone(phoneSearch);
    if (found) {
      storage.setCurrentClientId(found.id);
      setPhoneSearch('');
    } else {
      setSearchError('No encontramos una billetera vinculada a este número. ¡Podés activarla ahora y sumar tus primeros 200 pts de bienvenida!');
      setRegPhone(phoneSearch);
      setShowRegister(true);
    }
  };

  const handleSelfRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    const cleanName = regName.trim();
    const initials = cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 4);
    const newClient: ClientProfile = {
      id: `cli-${Date.now()}`,
      name: cleanName,
      phone: regPhone.trim(),
      email: '',
      tier: 'Silver',
      pointsBalance: 200, // Welcome gift
      referralCode: `${initials}-ATELIER`,
      totalVisits: 0,
      lastVisitDate: new Date().toISOString().split('T')[0],
      nailPlateCondition: 'healthy',
      allergiesHema: false,
      lampHeatSensitivity: 'low',
      favoriteColors: [],
      technicianNotes: 'Alta desde PWA Clientas Club Privilege.',
      setsHistory: []
    };

    storage.createClient(newClient);
    setShowRegister(false);
    setRegName('');
    setRegPhone('');
  };

  const handleLogout = () => {
    storage.setCurrentClientId('');
  };

  // Helper for luxury monogram
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // -------------------------------------------------------------
  // STATE A: NO CLIENT LOGGED IN (WELCOME & ONBOARDING PORTAL)
  // -------------------------------------------------------------
  if (!client) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }} className="animate-fade-in">
        {/* Hero Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(222, 115, 143, 0.08) 0%, rgba(200, 150, 136, 0.12) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          boxShadow: '0 4px 24px rgba(222, 115, 143, 0.05)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#997300', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            <Crown size={14} color="#D4AF37" /> Club Privilege • Atelier Nails & Co.
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif-glam)', fontSize: '2.2rem', color: 'var(--brand-espresso)', marginBottom: '0.5rem', lineHeight: 1.15 }}>
            Tu Pase Digital de Clienta Exclusiva
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.75rem auto', lineHeight: 1.5 }}>
            Acumulá el <strong>5% de cashback en Nail Points</strong> en cada visita, canjeá servicios de spa o nail art gratis, y compartí beneficios exclusivos con tus amigas.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setShowRegister(true);
                const input = document.getElementById('pwa-phone-input');
                if (input) input.focus();
              }}
              className="btn-satin-pink"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Sparkles size={16} /> Activar Mi Pase (+200 pts de bienvenida)
            </button>
            <button
              onClick={onOpenBooking}
              className="btn-outline-gold"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Calendar size={16} /> Reservar Turno
            </button>
          </div>
        </div>

        {/* Identification & Registration Hub */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Phone Lookup Box */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(222, 115, 143, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-pink-dark)' }}>
                <Search size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>¿Ya nos visitaste?</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ingresá tu WhatsApp para ver tus puntos y código</p>
              </div>
            </div>

            <form onSubmit={handlePhoneLookup} style={{ marginTop: '1.25rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Número de WhatsApp
                </label>
                <input
                  id="pwa-phone-input"
                  type="tel"
                  placeholder="Ej: 11 4123 4567 o +54 9 11..."
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-card)',
                    color: 'var(--brand-espresso)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {searchError && (
                <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(222, 115, 143, 0.1)', border: '1px solid rgba(222, 115, 143, 0.25)', color: 'var(--brand-espresso)', fontSize: '0.78rem', marginBottom: '1rem', lineHeight: 1.4 }}>
                  {searchError}
                </div>
              )}

              <button
                type="submit"
                className="btn-satin-pink"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Search size={16} /> Consultar Mi Billetera
              </button>
            </form>
          </div>

          {/* Quick Registration Form */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: showRegister ? '2px solid var(--brand-pink-dark)' : '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#997300' }}>
                <UserPlus size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>Activar Mi Pase de Puntos</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Te acreditamos 200 pts de bienvenida al instante</p>
              </div>
            </div>

            <form onSubmit={handleSelfRegister} style={{ marginTop: '1.25rem' }}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Nombre y Apellido
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-card)',
                    color: 'var(--brand-espresso)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  WhatsApp de Contacto
                </label>
                <input
                  type="tel"
                  placeholder="Tu celular para asociar la billetera"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-card)',
                    color: 'var(--brand-espresso)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-satin-pink"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Sparkles size={16} /> Crear Mi Pase & Sumar 200 PTS
              </button>
            </form>
          </div>
        </div>

        {/* Benefits Preview Catalog */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)' }}>
              Catálogo de Canjes Disponibles
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Acumulás puntos automáticamente con cada servicio realizado en el estudio
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {rewards.map((rew) => (
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
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>{rew.name}</h4>
                    <span className="badge-luxury badge-rose">{rew.cost} PTS</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {rew.desc}
                  </p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--brand-pink-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Coins size={14} /> Canjeable en tu próxima cita
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE B: REAL CLIENT ACTIVE / LOGGED IN
  // -------------------------------------------------------------
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
        marginBottom: '2rem',
        padding: '1.25rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {client.avatar ? (
            <img
              src={client.avatar}
              alt={client.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-pink-dark)' }}
            />
          ) : (
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-espresso) 0%, #2A1B22 100%)',
              color: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif-glam)',
              fontSize: '1.35rem',
              fontWeight: 700,
              border: '2px solid #D4AF37',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {getInitials(client.name)}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>{client.name}</h2>
              <span className="badge-luxury badge-gold">{client.tier}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {client.totalVisits > 0 ? `${client.totalVisits} visitas completadas` : 'Billetera activa'} • Tel: {client.phone}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Cambiar a otra clienta o salir"
          >
            <LogOut size={13} />
            <span>Salir</span>
          </button>
          <button onClick={onOpenBooking} className="btn-satin-pink" style={{ padding: '0.55rem 1.15rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} /> Reservar Mi Próximo Service
          </button>
        </div>
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
              <Gift size={20} color="var(--brand-pink-dark)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>
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
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-pink-dark)', letterSpacing: '0.06em' }}>
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
            href={`https://wa.me/?text=¡Hola!%20Te%20regalo%20$3.000%20de%20descuento%20para%20tu%20primer%20set%20de%20uñas%20en%20Atelier%20Nails%20con%20mi%20código%20${client.referralCode}.%20Reserva%20tu%20turno%20aquí:%20${window.location.origin}`}
            target="_blank"
            rel="noreferrer"
            className="btn-satin-pink"
            style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem' }}
          >
            <Share2 size={16} /> Compartir por WhatsApp a mis Amigas
          </a>
        </div>
      </div>

      {/* Reward Redemption Catalog */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>Canje de Beneficios con Puntos</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Usa tus puntos en el salón presentando tu código</p>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-pink-dark)' }}>
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
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>{rew.name}</h4>
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
                    background: isRedeemed ? 'var(--status-confirmed)' : canAfford ? 'var(--brand-pink-dark)' : '#EAE3DC',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>Mi Galería de Sets & Evolución</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Historial fotográfico de cada manicura realizada</p>
          </div>
          <button
            onClick={() => alert('¡Pronto podrás subir tus capturas de Pinterest directamente desde tu carrete!')}
            className="btn-outline-gold"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
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
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-pink-dark)' }}>{set.date}</span>
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
                  {set.notes && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                      "{set.notes}"
                    </p>
                  )}
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
            <h4 style={{ fontSize: '1rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>Aún no tienes fotos de sets registradas</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.25rem auto 1rem auto' }}>
              Al finalizar tu primer servicio en el estudio, tu manicurista tomará la foto de alta resolución y se sincronizará automáticamente aquí.
            </p>
            <button onClick={onOpenBooking} className="btn-satin-pink" style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem' }}>
              Agendar Mi Primer Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
