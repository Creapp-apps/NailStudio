import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Calendar,
  ShieldCheck,
  Clock,
  Heart,
  ChevronRight,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ShowcaseWorkItem } from '../../types/webConfig';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: ShowcaseWorkItem | null;
  onBookDesign: (item: ShowcaseWorkItem) => void;
  brandName?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const DesignDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  item,
  onBookDesign,
  brandName = 'Atelier Nails',
  primaryColor = '#DE738F',
  secondaryColor = '#C45774'
}) => {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleBookClick = () => {
    onBookDesign(item);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="design-modal-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(18, 10, 14, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={onClose}
    >
      {/* Toast Modal Floating Box */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95"
        style={{
          boxShadow: '0 25px 70px -10px rgba(50, 15, 25, 0.4), 0 0 0 1px rgba(222, 115, 143, 0.25)',
          background: 'linear-gradient(160deg, #FFFFFF 0%, #FFF8FA 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Visual Showcase Container */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* Luxury subtle gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(26,12,18,0.7) 100%)'
            }}
          />

          {/* Floating Close Button */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal de diseño"
            className="absolute right-3.5 top-3.5 z-20 flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/70 focus:outline-none"
          >
            <X className="size-4" />
          </button>

          {/* Technique Badges Floating on Image */}
          <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: secondaryColor,
                border: '1px solid rgba(222, 115, 143, 0.3)'
              }}
            >
              <Sparkles className="size-3" />
              {item.techniqueTag}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="size-3 text-emerald-400" />
              HEMA-Free
            </span>
          </div>
        </div>

        {/* Modal Body / Information & Captation */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3
              id="design-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900"
              style={{ fontFamily: 'var(--font-serif-glam, Italiana, serif)' }}
            >
              {item.title}
            </h3>
          </div>

          {/* Detailed Narrative Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {item.description ||
              'Procedimiento de alta costura ungueal con arquitectura milimétrica, sellado ultra brillante y pigmentos de máxima pureza. Cuidado profundo de cutículas con técnica combinada para garantizar un crecimiento armónico y sin quiebres.'}
          </p>

          {/* Technical Specifications Bar */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-pink-50/50 p-3 border border-pink-100 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                Tiempo Estimado
              </span>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-neutral-800">
                <Clock className="size-3 text-pink-500" />
                <span>{item.estimatedTime || '~60 - 80m'}</span>
              </div>
            </div>

            <div className="space-y-0.5 border-x border-pink-200/60 px-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                Fórmula
              </span>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700">
                <ShieldCheck className="size-3 text-emerald-600" />
                <span>{item.formula || '100% Segura'}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                Mantenimiento
              </span>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-neutral-800">
                <CheckCircle2 className="size-3 text-pink-500" />
                <span>{item.maintenance || (item.durationDays ? `${item.durationDays} días` : '21 a 28 días')}</span>
              </div>
            </div>
          </div>



          {/* High Conversion CTA Section */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handleBookClick}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 px-5 font-bold text-white shadow-xl transition-all duration-200 hover:opacity-95 hover:shadow-2xl active:scale-[0.99] text-sm tracking-wide"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                boxShadow: `0 10px 25px -4px rgba(222, 115, 143, 0.45)`
              }}
            >
              <Calendar className="size-4 transition-transform group-hover:scale-110" />
              <span>Agendar Turno Para Este Diseño</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full text-center text-xs font-medium text-neutral-400 hover:text-neutral-700 py-1 transition-colors"
            >
              Seguir explorando la galería de trabajos
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
