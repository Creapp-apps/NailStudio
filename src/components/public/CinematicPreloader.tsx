import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface CinematicPreloaderProps {
  onFinish: () => void;
  brandName?: string;
}

const PHRASES = [
  { threshold: 22, text: 'Esterilizando instrumental de precisión...' },
  { threshold: 46, text: 'Seleccionando geles & pigmentos de temporada...' },
  { threshold: 70, text: 'Nivelando estructura & base fortalecedora...' },
  { threshold: 90, text: 'Curando en cabina UV & esmaltado espejo...' },
  { threshold: 100, text: 'Toque de óleo aromático... ¡Bienvenida!' }
];

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({
  onFinish,
  brandName = 'Atelier Nails & Co.'
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(PHRASES[0].text);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3800; // ~3.8 seconds total cinematic build

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Organic cubic ease-out curve
      const easedProgress = Math.round((1 - Math.pow(1 - rawProgress, 2.5)) * 100);
      setProgress(easedProgress);

      // Select matching phrase
      const matched = PHRASES.find(p => easedProgress <= p.threshold) || PHRASES[PHRASES.length - 1];
      setCurrentPhrase(matched.text);

      if (rawProgress >= 1) {
        clearInterval(timer);
        // Brief pause at 100% to appreciate the welcome before curtain opens
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onFinish();
          }, 850); // Matches exit transition duration
        }, 400);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 350);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(circle at 50% 45%, #251219 0%, #15090E 60%, #0A0407 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        color: '#FFFFFF',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.04)' : 'scale(1)',
        filter: isExiting ? 'blur(10px)' : 'none',
        transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isExiting ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Ambient background glowing orbs */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(222, 115, 143, 0.22) 0%, rgba(224, 200, 158, 0.08) 50%, transparent 75%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          animation: 'cinematicSoftGlow 4s ease-in-out infinite'
        }}
      />

      {/* Top Skip Button */}
      <button
        onClick={handleSkip}
        type="button"
        style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.65)',
          padding: '0.4rem 0.9rem',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-couture)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          backdropFilter: 'blur(8px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.borderColor = 'rgba(224, 200, 158, 0.5)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}
      >
        Omitir intro ➔
      </button>

      {/* Center Cinematic Card Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '480px',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {/* Shimmering Emblem */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(222, 115, 143, 0.25) 0%, rgba(224, 200, 158, 0.25) 100%)',
            border: '1px solid rgba(224, 200, 158, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 0 35px rgba(222, 115, 143, 0.35)',
            position: 'relative'
          }}
        >
          <Sparkles size={28} color="#E0C89E" />
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: '1px dashed rgba(222, 115, 143, 0.35)',
              animation: 'spin 18s linear infinite'
            }}
          />
        </div>

        {/* Brand Couture Tag */}
        <div
          style={{
            fontFamily: 'var(--font-couture)',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: '#E0C89E',
            marginBottom: '0.45rem'
          }}
        >
          {brandName}
        </div>

        {/* Main Glam Title */}
        <h1
          style={{
            fontFamily: 'var(--font-serif-glam)',
            fontSize: '1.95rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: '#FFFFFF',
            margin: '0 0 1.25rem 0',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
          }}
        >
          Ingresando al atelier...
        </h1>

        {/* Cinematic Progress Bar */}
        <div
          style={{
            width: '280px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            position: 'relative',
            overflow: 'visible',
            marginBottom: '1rem'
          }}
        >
          {/* Animated Fill Bar */}
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #DE738F 0%, #E0C89E 50%, #F28DA7 100%)',
              borderRadius: '999px',
              boxShadow: '0 0 14px rgba(222, 115, 143, 0.8), 0 0 6px #E0C89E',
              transition: 'width 0.08s linear',
              position: 'relative'
            }}
          >
            {/* Glowing Leading Star Head */}
            <div
              style={{
                position: 'absolute',
                right: '-3px',
                top: '-3.5px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 0 12px 2px #E0C89E, 0 0 6px #DE738F',
                opacity: progress > 2 && progress < 100 ? 1 : 0,
                transition: 'opacity 0.2s ease'
              }}
            />
          </div>
        </div>

        {/* Dynamic Storytelling Phrase with Smooth Transition */}
        <div
          style={{
            minHeight: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.82rem',
            color: '#E8CCD5',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
            transition: 'opacity 0.25s ease',
            opacity: 0.95
          }}
        >
          {currentPhrase}
        </div>

        {/* Micro Numerical Counter */}
        <div
          style={{
            marginTop: '0.6rem',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            color: 'rgba(224, 200, 158, 0.7)'
          }}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
};
