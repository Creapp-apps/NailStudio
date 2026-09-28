import React from 'react';
import { WebCustomizationConfig } from '../../types/webConfig';
import { useWebConfig } from '../../hooks/useWebConfig';

interface Props {
  config?: WebCustomizationConfig;
}

export const InfiniteCoutureMarquee: React.FC<Props> = ({ config: propConfig }) => {
  const { config: hookConfig } = useWebConfig();
  const config = propConfig || hookConfig;

  const marqueeItems = config.marqueePhrases && config.marqueePhrases.length > 0
    ? config.marqueePhrases
    : [
        'MANICURÍA RUSA COMBINADA',
        'PRODUCTOS BIOCOMPATIBLES LIBRES DE HEMA',
        'EFECTO CROMADO GLAZED DONUT',
        'DISEÑOS CON CRISTALES SWAROVSKI',
        'RETENCIÓN GARANTIZADA DE 21 DÍAS'
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
