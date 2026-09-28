import React from 'react';

export const InfiniteCoutureMarquee: React.FC = () => {
  const marqueeItems = [
    'RUSSIAN MANICURE PRECISION',
    'BIOCOMPATIBLE HEMA-FREE',
    'GLAZED DONUT CHROME',
    '3D SWAROVSKI NAIL ART',
    '21-DAY RETENTION GUARANTEE',
    'KAPPING RUBBER GEL LEVELING',
    'HAUTE SOFT GEL EXTENSIONS',
    'ATELIER PRIVILEGE REWARDS'
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
