import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicLanding } from '../components/public/PublicLanding';
import { BookingModal } from '../components/booking/BookingModal';
import { NailBotModal } from '../components/ai/NailBotModal';
import { CinematicPreloader } from '../components/public/CinematicPreloader';
import { useWebConfig } from '../hooks/useWebConfig';
import { WebCustomizationConfig } from '../types/webConfig';
import { getThemeFromConfig } from '../lib/themeStyles';

export const PublicWebView: React.FC = () => {
  const navigate = useNavigate();
  const { config: globalConfig } = useWebConfig();
  const [liveConfig, setLiveConfig] = useState<WebCustomizationConfig>(globalConfig);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isNailBotOpen, setIsNailBotOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

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

    document.body.style.backgroundColor = theme.bgApp;
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
        backgroundColor: theme.bgApp,
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
            bottom: '24px',
            right: '24px',
            zIndex: 80,
            opacity: isRevealed ? 1 : 0
          }}
        >
        {!isNailBotOpen && (
          <button
            onClick={() => setIsNailBotOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #2D1E1B 0%, #1A1210 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 122, 0.4)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 8px 30px rgba(35, 25, 22, 0.35)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--brand-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={15} color="#FFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Nail-Bot IA</div>
              <div style={{ fontSize: '0.65rem', color: '#C89688' }}>Asistente de Turnos</div>
            </div>
          </button>
        )}
      </div>
      )}

      {/* Booking Stepper Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedServiceId={preselectedService}
      />

      {/* Nail-Bot AI Chatbot Modal */}
      <NailBotModal
        isOpen={isNailBotOpen}
        onClose={() => setIsNailBotOpen(false)}
        onOpenBooking={(srvId) => handleOpenBooking(srvId)}
      />
    </div>
  );
};
