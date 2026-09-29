import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWebConfig } from '../../hooks/useWebConfig';

interface Props {
  onSuccess?: () => void;
}

export const StaffLoginForm: React.FC<Props> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { config } = useWebConfig();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const brandName = config.brandName || 'Belcalis Nails';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completá tu correo y contraseña.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Credenciales inválidas. Verificá tu correo y clave.');
      return;
    }

    if (res.role !== 'staff') {
      setErrorMsg('Esta cuenta no cuenta con permisos operativos de personal del salón.');
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleQuickAdmin = () => {
    setEmail('admin@belcalisnails.com.ar');
    setPassword('BelcalisNails2026!');
    setErrorMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(222, 115, 143, 0.12) 0%, rgba(46, 30, 30, 0.04) 50%, var(--bg-main) 100%)',
      fontFamily: 'var(--font-body)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(222, 115, 143, 0.28)',
        boxShadow: '0 25px 50px -12px rgba(46, 30, 30, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        padding: '2.5rem 2.25rem',
        position: 'relative'
      }} className="animate-fade-in">

        {/* Top Back Link */}
        <a
          href="/"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0,0,0,0.03)'
          }}
        >
          <ArrowLeft size={13} />
          <span>Volver a la Web</span>
        </a>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', marginBottom: '2rem' }}>
          {config.customLogoUrl ? (
            <img
              src={config.customLogoUrl}
              alt={brandName}
              style={{
                maxHeight: '60px',
                maxWidth: '180px',
                objectFit: 'contain',
                margin: '0 auto 0.75rem auto',
                display: 'block'
              }}
            />
          ) : (
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 0.75rem auto',
              background: 'linear-gradient(135deg, rgba(222, 115, 143, 0.15), rgba(200, 150, 136, 0.25))',
              border: '1px solid rgba(222, 115, 143, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem'
            }}>
              {config.logoEmoji || '💅'}
            </div>
          )}

          <h2 style={{
            fontFamily: 'var(--font-serif-glam)',
            fontSize: '1.65rem',
            color: 'var(--brand-espresso)',
            letterSpacing: '0.04em',
            margin: '0 0 0.35rem 0',
            fontWeight: 700
          }}>
            {brandName}
          </h2>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(222, 115, 143, 0.1)',
            border: '1px solid rgba(222, 115, 143, 0.25)',
            color: 'var(--brand-pink-dark)',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)'
          }}>
            <ShieldCheck size={12} />
            <span>Backoffice & Operaciones</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            color: '#C53030',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            lineHeight: 1.4
          }}>
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--brand-espresso)',
              marginBottom: '0.4rem'
            }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                placeholder="operaciones@belcalisnails.com.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-strong)',
                  background: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                  color: 'var(--brand-espresso)'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--brand-espresso)'
              }}>
                Contraseña de Seguridad
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.4rem 0.75rem 2.4rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-strong)',
                  background: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                  color: 'var(--brand-espresso)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
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
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              marginTop: '0.5rem'
            }}
          >
            {isSubmitting ? (
              <span>Autenticando en Atelier...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Ingresar al Backoffice</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Staff Filler Box */}
        <div style={{
          marginTop: '1.75rem',
          padding: '0.9rem',
          borderRadius: '14px',
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#997300', fontWeight: 600, marginBottom: '0.45rem' }}>
            Acceso Rápido Administrador / Dirección
          </div>
          <button
            type="button"
            onClick={handleQuickAdmin}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: 'var(--brand-espresso)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <CheckCircle2 size={13} color="#D4AF37" />
            <span>Completar Credenciales de Dirección</span>
          </button>
        </div>

      </div>
    </div>
  );
};
