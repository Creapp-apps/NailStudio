import React, { useState, useRef } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { WebCustomizationConfig } from '../../types/webConfig';
import { useWebConfig } from '../../hooks/useWebConfig';

interface Props {
  config?: WebCustomizationConfig;
}

export const Hero3DTiltCard: React.FC<Props> = ({ config: propConfig }) => {
  const { config: hookConfig } = useWebConfig();
  const config = propConfig || hookConfig;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlareStyle({ x: glareX, y: glareY, opacity: 0.7 });
  };

  const handleMouseLeave = () => {
    setTransformStyle('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      className="tilt-card-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* 3D Tilt Wrapper */}
      <div
        ref={cardRef}
        className="tilt-card-inner"
        style={{
          transform: transformStyle,
          maxWidth: '460px',
          width: '100%',
          aspectRatio: '4/5',
          border: '2px solid rgba(255, 255, 255, 0.9)',
          position: 'relative',
          cursor: 'grab'
        }}
      >
        {/* High-Fashion Almond Sculpted Nails with Violet & Crystals */}
        <img
          src={config.heroCardImage || "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85"}
          alt={config.heroCardTitle || "Haute Manicure Nails"}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />

        {/* Dynamic Holographic Specular Glare Overlay */}
        {config.enable3DTilt && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.75) 0%, ${config.primaryColor}66 30%, ${config.accentGold}40 55%, transparent 75%)`,
              opacity: glareStyle.opacity,
              mixBlendMode: 'color-dodge',
              pointerEvents: 'none',
              transition: 'opacity 0.25s ease'
            }}
          />
        )}

        {/* Ambient Vignette Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(222, 115, 143, 0.05) 0%, rgba(30, 18, 22, 0.4) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* 3D Parallax Floating Card Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(14px)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.9rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            transform: config.enable3DTilt ? 'translateZ(30px)' : 'none'
          }}
        >
          <div>
            <div style={{
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: config.secondaryColor || 'var(--brand-pink-dark)',
              fontWeight: 700,
              fontFamily: 'var(--font-couture)'
            }}>
              {config.heroCardBadge}
            </div>
            <div style={{ fontSize: '0.925rem', color: 'var(--brand-espresso)', fontWeight: 600 }}>
              {config.heroCardTitle}
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            background: `${config.primaryColor}22`,
            color: config.secondaryColor || 'var(--brand-pink-dark)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Sparkles size={13} /> {config.heroCardRating || 'Efecto 3D'}
          </div>
        </div>
      </div>
    </div>
  );
};
