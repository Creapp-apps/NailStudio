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
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';
import { ClientProfile, PastSetRecord } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { useWebConfig } from '../../hooks/useWebConfig';

interface Props {
  client: ClientProfile | null;
  onOpenBooking: () => void;
}

export const ClientPortal: React.FC<Props> = ({ client, onOpenBooking }) => {
  const { login, signUpClient, logout } = useAuth();
  const { config } = useWebConfig();
  const brandName = config.brandName || 'Belcalis Nails';

  const [copiedCode, setCopiedCode] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null);

  // Authentication State for unauthenticated / new client
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status & errors
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Quick WhatsApp lookup fallback
  const [showPhoneLookup, setShowPhoneLookup] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchError, setSearchError] = useState('');

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

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!loginEmail || !loginPassword) {
      setAuthError('Por favor completá correo y contraseña.');
      return;
    }

    setIsAuthLoading(true);
    const res = await login(loginEmail, loginPassword);
    setIsAuthLoading(false);

    if (!res.success) {
      setAuthError(res.error || 'Credenciales inválidas. Verificá tu correo y clave.');
    }
  };

  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword) {
      setAuthError('Por favor completá todos los campos.');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsAuthLoading(true);
    const res = await signUpClient({
      email: regEmail.trim(),
      password: regPassword,
      name: regName.trim(),
      phone: regPhone.trim()
    });
    setIsAuthLoading(false);

    if (!res.success) {
      setAuthError(res.error || 'No se pudo completar el registro.');
    }
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
      setSearchError('No encontramos una billetera vinculada a este número. ¡Podés registrarte ahora con tu correo y sumar 200 pts!');
      setRegPhone(phoneSearch);
      setAuthMode('register');
    }
  };

  const handleLogout = async () => {
    await logout();
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
  // STATE A: NO CLIENT LOGGED IN (LUXURY LOGIN & ONBOARDING HUB)
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
            <Crown size={14} color="#D4AF37" /> Club Privilege • {brandName}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif-glam)', fontSize: '2.2rem', color: 'var(--brand-espresso)', marginBottom: '0.5rem', lineHeight: 1.15 }}>
            Tu Pase Digital de Clienta Exclusiva
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.75rem auto', lineHeight: 1.5 }}>
            Acumulá <strong>Nail Points en cada visita</strong> en {brandName}, canjeá servicios de spa o nail art gratis, y recibí invitaciones preferenciales a eventos del atelier.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setAuthMode('register');
                const formElem = document.getElementById('pwa-auth-section');
                if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-satin-pink"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Sparkles size={16} /> Crear Cuenta VIP (+200 pts de bienvenida)
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

        {/* Real Authentication Hub Card */}
        <div id="pwa-auth-section" style={{
          maxWidth: '520px',
          margin: '0 auto 2.5rem auto',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 115, 143, 0.28)',
          boxShadow: '0 20px 40px -10px rgba(46, 30, 30, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Tabs: Ingresar / Registrarme */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              style={{
                padding: '1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                background: authMode === 'login' ? '#FFFFFF' : 'rgba(240, 235, 236, 0.5)',
                color: authMode === 'login' ? 'var(--brand-pink-dark)' : 'var(--text-muted)',
                borderBottom: authMode === 'login' ? '2px solid var(--brand-pink-dark)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Ingresar a mi Club
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              style={{
                padding: '1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                background: authMode === 'register' ? '#FFFFFF' : 'rgba(240, 235, 236, 0.5)',
                color: authMode === 'register' ? 'var(--brand-pink-dark)' : 'var(--text-muted)',
                borderBottom: authMode === 'register' ? '2px solid var(--brand-pink-dark)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Registrarme (+200 pts)
            </button>
          </div>

          <div style={{ padding: '2rem' }}>
            {/* Error Message */}
            {authError && (
              <div style={{
                background: '#FFF5F5',
                border: '1px solid #FEB2B2',
                color: '#C53030',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB 1: LOGIN */}
            {authMode === 'login' ? (
              <form onSubmit={handleClientLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.4rem' }}>
                    Correo Electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="tu-email@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-strong)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: 'var(--brand-espresso)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.4rem' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.4rem 0.75rem 2.4rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-strong)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: 'var(--brand-espresso)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="btn-satin-pink"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: isAuthLoading ? 'not-allowed' : 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  {isAuthLoading ? (
                    <span>Ingresando a tu cuenta...</span>
                  ) : (
                    <>
                      <Crown size={16} />
                      <span>Ingresar al Club Privilege</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* TAB 2: REGISTER */
              <form onSubmit={handleClientRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.35rem' }}>
                    Nombre y Apellido *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="Camila Rodríguez"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.4rem', borderRadius: '12px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.35rem' }}>
                    WhatsApp / Celular *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 11 5566-7788"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.4rem', borderRadius: '12px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.35rem' }}>
                    Correo Electrónico *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="camila@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.4rem', borderRadius: '12px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.35rem' }}>
                    Contraseña (mínimo 6 caracteres) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 2.4rem 0.7rem 2.4rem', borderRadius: '12px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.74rem',
                  color: '#997300',
                  lineHeight: 1.4
                }}>
                  ✨ Al registrarte recibís tu <strong>email de bienvenida oficial de {brandName}</strong> con tus 200 puntos acreditados y tu código de referidos.
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="btn-satin-pink"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: isAuthLoading ? 'not-allowed' : 'pointer',
                    marginTop: '0.35rem'
                  }}
                >
                  {isAuthLoading ? (
                    <span>Registrando y acreditando puntos...</span>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Activar Mi Pase & Sumar 200 Pts</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Phone Lookup Accordion */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              {!showPhoneLookup ? (
                <button
                  type="button"
                  onClick={() => setShowPhoneLookup(true)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--brand-terracotta)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  ¿Ya sos clienta del salón y no tenés contraseña? Consultá por WhatsApp
                </button>
              ) : (
                <form onSubmit={handlePhoneLookup} style={{ marginTop: '0.5rem', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Consultar por Número de WhatsApp
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="tel"
                      placeholder="11 5566 7788"
                      value={phoneSearch}
                      onChange={(e) => setPhoneSearch(e.target.value)}
                      style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }}
                    />
                    <button type="submit" className="btn-satin-pink" style={{ padding: '0.55rem 0.85rem', fontSize: '0.78rem' }}>
                      Buscar
                    </button>
                  </div>
                  {searchError && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--brand-pink-dark)' }}>
                      {searchError}
                    </div>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Benefits Preview Catalog */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-espresso)', fontFamily: 'var(--font-serif-glam)' }}>
              Catálogo de Canjes Disponibles en {brandName}
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
            title="Cerrar sesión"
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
                {brandName} Privilege Pass
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
              Comparte tu código con amigas que nunca hayan venido a {brandName}. Ellas reciben <strong>$3.000 de regalo</strong> en su primer set y tú sumas <strong>500 Nail Points</strong> automáticamente cuando asistan.
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
            href={`https://wa.me/?text=¡Hola!%20Te%20regalo%20$3.000%20de%20descuento%20para%20tu%20primer%20set%20de%20uñas%20en%20${encodeURIComponent(brandName)}%20con%20mi%20código%20${client.referralCode}.%20Reserva%20tu%20turno%20aquí:%20${window.location.origin}`}
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
                  border: isRedeemed ? '2px solid var(--status-confirmed)' : '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>{rew.name}</h4>
                    <span className={`badge-luxury ${canAfford ? 'badge-gold' : 'badge-rose'}`}>
                      {rew.cost} PTS
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {rew.desc}
                  </p>
                </div>

                <button
                  disabled={!canAfford || isRedeemed}
                  onClick={() => handleRedeem(rew.id, rew.cost)}
                  className={canAfford ? 'btn-satin-pink' : 'btn-outline-gold'}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '0.78rem',
                    opacity: canAfford ? 1 : 0.5,
                    cursor: canAfford && !isRedeemed ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {isRedeemed ? (
                    <>
                      <CheckCircle size={14} /> ¡Canje Acreditado!
                    </>
                  ) : canAfford ? (
                    <>
                      <Sparkles size={14} /> Canjear Beneficio
                    </>
                  ) : (
                    <span>Faltan {rew.cost - client.pointsBalance} pts</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Moodboard & Set History */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        border: '1px solid var(--border-subtle)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-espresso)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Camera size={20} /> Mi Moodboard de Uñas & Sets Anteriores
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Historial de diseños, técnicas y fotos tomadas en cabina
            </p>
          </div>
        </div>

        {client.setsHistory && client.setsHistory.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {client.setsHistory.map((set) => (
              <div
                key={set.id}
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)'
                }}
              >
                <img
                  src={set.photoUrl}
                  alt={set.serviceName}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{ padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>
                      {set.serviceName}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--brand-terracotta)', fontWeight: 600 }}>
                      {set.date}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {set.nailArtTierName} • Tech: {set.techName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.85rem' }}>Aún no tienes registros de sets en cabina. ¡Tu manicurista subirá tus fotos al terminar tu cita!</p>
          </div>
        )}
      </div>

      {/* Clinical Nail Health Record summary */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#997300', flexShrink: 0 }}>
          <ShieldCheck size={20} />
        </div>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>
            Ficha Clínica de Salud Ungueal en {brandName}
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Estado registrado: <strong>{client.nailPlateCondition === 'healthy' ? 'Lámina Saludable' : client.nailPlateCondition}</strong> • Alergias HEMA: {client.allergiesHema ? '⚠️ Sí (Requiere HEMA-Free)' : 'No detectada'} • Sensibilidad a cabina: {client.lampHeatSensitivity === 'high' ? 'Alta (Modo Low Heat)' : 'Normal'}
          </p>
        </div>
      </div>
    </div>
  );
};
