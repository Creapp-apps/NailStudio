import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicLanding } from '../components/public/PublicLanding';
import { BookingModal } from '../components/booking/BookingModal';
import { HotSlotsModal } from '../components/booking/HotSlotsModal';
import { NailBotModal } from '../components/ai/NailBotModal';
import { CinematicPreloader } from '../components/public/CinematicPreloader';
import { PaymentApprovedModal } from '../components/booking/PaymentApprovedModal';
import { Appointment } from '../types/nailStudio';
import { useWebConfig } from '../hooks/useWebConfig';
import { WebCustomizationConfig } from '../types/webConfig';
import { getThemeFromConfig } from '../lib/themeStyles';
import { storage } from '../services/storage';

export const PublicWebView: React.FC = () => {
  const navigate = useNavigate();
  const { config: globalConfig } = useWebConfig();
  const [liveConfig, setLiveConfig] = useState<WebCustomizationConfig>(globalConfig);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isHotSlotsOpen, setIsHotSlotsOpen] = useState(false);
  const [isNailBotOpen, setIsNailBotOpen] = useState(false);
  const [isBotTriggerCollapsed, setIsBotTriggerCollapsed] = useState(false);
  const [isHoveredTrigger, setIsHoveredTrigger] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [approvedAppointment, setApprovedAppointment] = useState<Appointment | null>(null);
  const [isPaymentApprovedOpen, setIsPaymentApprovedOpen] = useState(false);

  const salonSettings = storage.getSalonSettings();
  const assistantName = salonSettings.assistantName || 'Lucía Altieri';

  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
  const theme = getThemeFromConfig(liveConfig);

  // Cinematic preloader state (displayed on initial entrance per session, skipped in studio iframe)
  const [showPreloader, setShowPreloader] = useState(() => {
    if (isEmbedded) return false;
    const seen = sessionStorage.getItem('atelier_intro_seen');
    return !seen;
  });
  const [isRevealed, setIsRevealed] = useState(() => isEmbedded || Boolean(sessionStorage.getItem('atelier_intro_seen')));

  // Allow re-triggering from DevSwitcher or user preference
  useEffect(() => {
    const handleReplayIntro = () => {
      setShowPreloader(true);
      setIsRevealed(false);
    };
    window.addEventListener('replay_atelier_intro', handleReplayIntro);
    return () => window.removeEventListener('replay_atelier_intro', handleReplayIntro);
  }, []);

  const handlePreloaderFinish = () => {
    sessionStorage.setItem('atelier_intro_seen', 'true');
    setShowPreloader(false);
    setIsRevealed(true);
  };

  // Failsafe: Never let page get permanently stuck on opacity: 0
  useEffect(() => {
    const failsafeTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 4500);
    return () => clearTimeout(failsafeTimer);
  }, []);

  // Keep local config in sync with global hook
  useEffect(() => {
    setLiveConfig(globalConfig);
  }, [globalConfig]);

  // Listen for real-time postMessage updates from WebStudio in parent window
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'STUDIO_CONFIG_UPDATE' && e.data.config) {
        setLiveConfig(e.data.config);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Detect direct hot slot link (e.g. /?flash=hoy, /?flash=true, /?turnos_hoy=true, #turnos-calientes)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const hasFlashParam =
      params.get('flash') === 'true' ||
      params.get('flash') === 'hoy' ||
      params.get('hot_slots') === 'true' ||
      params.get('turnos_hoy') === 'true' ||
      window.location.hash === '#turnos-calientes' ||
      window.location.hash === '#turnos-hoy';

    if (hasFlashParam) {
      // Auto open Hot Slots modal immediately
      setIsHotSlotsOpen(true);
      // Skip preloader if coming from direct flash link so client has zero-friction instant booking
      setShowPreloader(false);
      setIsRevealed(true);
    }
  }, []);

  // Detect Mercado Pago redirect status (?booking_status=approved&apt_id=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const bookingStatus = params.get('booking_status');
    const aptId = params.get('apt_id');

    if (bookingStatus === 'approved') {
      setShowPreloader(false);
      setIsRevealed(true);

      if (aptId) {
        storage.confirmDepositPaid(aptId, 'Acreditado vía Mercado Pago Checkout Pro');
        const found = storage.getAppointments().find(a => a.id === aptId);
        if (found) {
          setApprovedAppointment(found);
          setIsPaymentApprovedOpen(true);
        }
      }

      // Clean query params from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Synchronize active theme CSS variables to document.documentElement and document.body
  // so that root-level browser styles (scrollbars, sticky header, body background) match the palette instantly
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-app', theme.bgApp);
    root.style.setProperty('--bg-card', theme.bgCard);
    root.style.setProperty('--bg-card-hover', theme.bgCardHover);
    root.style.setProperty('--border-subtle', theme.borderSubtle);
    root.style.setProperty('--border-strong', theme.borderStrong);
    root.style.setProperty('--border-focus', theme.borderFocus);
    root.style.setProperty('--brand-pink-satin', theme.primary);
    root.style.setProperty('--brand-pink-dark', theme.secondary);
    root.style.setProperty('--brand-gold', theme.accent);
    root.style.setProperty('--header-bg', theme.headerBg);
    root.style.setProperty('--subnav-bg', theme.subnavBg);
    root.style.setProperty('--scrollbar-thumb', theme.scrollbarThumb);
    root.style.setProperty('--scrollbar-hover', theme.scrollbarHover);
    root.style.setProperty('--button-gradient', theme.buttonGradient);
    root.style.setProperty('--button-shadow', theme.buttonShadow);
    root.style.setProperty('--marquee-bg', theme.marqueeBg);
    if (liveConfig.headingFont) root.style.setProperty('--font-serif-glam', liveConfig.headingFont);
    if (liveConfig.accentFont) root.style.setProperty('--font-couture', liveConfig.accentFont);
    if (liveConfig.bodyFont) root.style.setProperty('--font-body', liveConfig.bodyFont);

    document.body.style.backgroundColor = 'transparent';
    document.body.style.transition = 'background-color 0.3s ease';
  }, [theme, liveConfig]);

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        '--bg-app': theme.bgApp,
        '--bg-card': theme.bgCard,
        '--bg-card-hover': theme.bgCardHover,
        '--border-subtle': theme.borderSubtle,
        '--border-strong': theme.borderStrong,
        '--brand-pink-satin': theme.primary,
        '--brand-pink-dark': theme.secondary,
        '--brand-gold': theme.accent,
        '--button-gradient': theme.buttonGradient,
        '--button-shadow': theme.buttonShadow,
        '--marquee-bg': theme.marqueeBg,
        '--font-serif-glam': liveConfig.headingFont,
        '--font-couture': liveConfig.accentFont,
        '--font-body': liveConfig.bodyFont,
        transition: 'background-color 0.4s ease'
      } as React.CSSProperties}
    >
      {/* Cinematic Haute Glam Preloader */}
      {showPreloader && (
        <CinematicPreloader
          brandName={liveConfig.brandName || 'Atelier Nails & Co.'}
          onFinish={handlePreloaderFinish}
        />
      )}

      {/* Dedicated Luxury Public Header */}
      <div className={isRevealed ? 'cinematic-stagger-header' : ''} style={{ opacity: isRevealed ? 1 : 0 }}>
        <PublicHeader onOpenBooking={() => handleOpenBooking()} config={liveConfig} />
      </div>

      {/* Main Public Web Landing */}
      <main style={{ flex: 1, opacity: isRevealed ? 1 : 0 }} className={isRevealed ? 'cinematic-stagger-hero' : ''}>
        <PublicLanding
          onOpenBooking={handleOpenBooking}
          onOpenNailBot={() => setIsNailBotOpen(true)}
          onOpenPortal={() => navigate('/pwa')}
          config={liveConfig}
        />
      </main>

      {/* Floating AI Receptionist Trigger (hidden in studio preview iframe to prevent obstruction) */}
      {!isEmbedded && (
        <div
          className={isRevealed ? 'cinematic-stagger-floating' : ''}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 80,
            opacity: isRevealed ? 1 : 0,
            display: isNailBotOpen ? 'none' : 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          {isBotTriggerCollapsed ? (
            /* Ultra-discrete collapsed mini-icon */
            <button
              onClick={() => setIsBotTriggerCollapsed(false)}
              title={`Abrir asistente virtual con ${assistantName}`}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2A171D 0%, #1A0E13 100%)',
                border: '1px solid rgba(222, 115, 143, 0.4)',
                color: '#FFAEC0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={16} />
            </button>
          ) : (
            /* Compact luxury reception widget */
            <div
              onMouseEnter={() => setIsHoveredTrigger(true)}
              onMouseLeave={() => setIsHoveredTrigger(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #251419 0%, #170C11 100%)',
                border: '1px solid rgba(222, 115, 143, 0.35)',
                borderRadius: '999px',
                padding: '0.35rem 0.5rem 0.35rem 0.35rem',
                boxShadow: '0 10px 32px rgba(25, 12, 16, 0.4), 0 0 0 1px rgba(222, 115, 143, 0.15)',
                gap: '0.55rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Main Avatar Trigger */}
              <button
                onClick={() => setIsNailBotOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #DE738F 0%, #B84D6B 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '1rem',
                      fontFamily: 'var(--font-display)',
                      boxShadow: '0 0 14px rgba(222, 115, 143, 0.5)'
                    }}
                  >
                    {assistantName.charAt(0)}
                  </div>
                  {/* Green pulse dot */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#10B981',
                      border: '2px solid #170C11'
                    }}
                  />
                </div>

                <div style={{ textAlign: 'left', paddingRight: '0.2rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-display)', letterSpacing: '0.01em' }}>
                    {assistantName}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#D9AAB7', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ color: '#34D399', fontSize: '0.6rem' }}>●</span> Recepción de turnos
                  </div>
                </div>
              </button>

              {/* Minimize toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBotTriggerCollapsed(true);
                }}
                title="Minimizar ícono"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#D9AAB7',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  lineHeight: 1,
                  marginLeft: '0.1rem',
                  transition: 'all 0.15s ease'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Booking Stepper Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedServiceId={preselectedService}
      />

      {/* Express Hot Slots of Today Modal */}
      <HotSlotsModal
        isOpen={isHotSlotsOpen}
        onClose={() => {
          setIsHotSlotsOpen(false);
          // Clean URL params if closed
          if (typeof window !== 'undefined' && window.location.search) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
        onOpenStandardBooking={() => setIsBookingOpen(true)}
      />

      {/* Nail-Bot AI Receptionist Modal */}
      <NailBotModal
        isOpen={isNailBotOpen}
        onClose={() => setIsNailBotOpen(false)}
        onOpenBooking={(srvId) => handleOpenBooking(srvId)}
        onOpenHotSlots={() => setIsHotSlotsOpen(true)}
      />

      {/* Mercado Pago Payment Approved Celebratory Modal */}
      <PaymentApprovedModal
        isOpen={isPaymentApprovedOpen}
        onClose={() => setIsPaymentApprovedOpen(false)}
        appointment={approvedAppointment}
      />
    </div>
  );
};
