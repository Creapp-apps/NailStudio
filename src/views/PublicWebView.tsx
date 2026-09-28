import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicLanding } from '../components/public/PublicLanding';
import { BookingModal } from '../components/booking/BookingModal';
import { NailBotModal } from '../components/ai/NailBotModal';
import { useWebConfig } from '../hooks/useWebConfig';
import { WebCustomizationConfig } from '../types/webConfig';

export const PublicWebView: React.FC = () => {
  const navigate = useNavigate();
  const { config: globalConfig } = useWebConfig();
  const [liveConfig, setLiveConfig] = useState<WebCustomizationConfig>(globalConfig);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isNailBotOpen, setIsNailBotOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;

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

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Dedicated Luxury Public Header */}
      <PublicHeader onOpenBooking={() => handleOpenBooking()} config={liveConfig} />

      {/* Main Public Web Landing */}
      <main style={{ flex: 1 }}>
        <PublicLanding
          onOpenBooking={handleOpenBooking}
          onOpenNailBot={() => setIsNailBotOpen(true)}
          onOpenPortal={() => navigate('/pwa')}
          config={liveConfig}
        />
      </main>

      {/* Floating AI Receptionist Trigger (hidden in studio preview iframe to prevent obstruction) */}
      {!isEmbedded && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 80 }}>
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
