import React from 'react';

export const InfiniteCoutureMarquee: React.FC = () => {
  const marqueeItems = [
    'MANICURÍA RUSA COMBINADA',
    'PRODUCTOS BIOCOMPATIBLES LIBRES DE HEMA',
    'EFECTO CROMADO GLAZED DONUT',
    'DISEÑOS CON CRISTALES SWAROVSKI',
    'RETENCIÓN GARANTIZADA DE 21 DÍAS',
    'KAPPING Y NIVELACIÓN CON GEL RUBBER',
    'ESCULPIDAS EN SOFT GEL',
    'CLUB DE BENEFICIOS EXCLUSIVOS PRIVILEGE'
  ];

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {marqueeItems.concat(marqueeItems).map((item, index) => (
          <span key={index} className="marquee-item">
            <span style={{ color: 'var(--brand-pink-satin)', fontSize: '0.9rem' }}>✦</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
      <div className="marquee-track" aria-hidden="true">
        {marqueeItems.concat(marqueeItems).map((item, index) => (
          <span key={`dup-${index}`} className="marquee-item">
            <span style={{ color: 'var(--brand-pink-satin)', fontSize: '0.9rem' }}>✦</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
