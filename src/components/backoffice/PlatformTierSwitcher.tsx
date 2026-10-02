import React from 'react';
import { PlatformTier, PLATFORM_TIERS } from '../../types/platformTiers';
import { Sparkles, Shield, Crown, Check } from 'lucide-react';

interface Props {
  currentTier: PlatformTier;
  onSelectTier: (tier: PlatformTier) => void;
  compact?: boolean;
}

export const PlatformTierSwitcher: React.FC<Props> = ({
  currentTier,
  onSelectTier,
  compact = false
}) => {
  const activeDef = PLATFORM_TIERS[currentTier] || PLATFORM_TIERS.oro;

  if (compact) {
    return (
      <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <Sparkles size={11} className="text-[#DE738F]" />
            Nivel de Plataforma
          </span>
          <span className="text-[10px] font-extrabold text-[#DE738F]">
            {activeDef.icon} {activeDef.name}
          </span>
        </div>

        {/* 3 Tier Segmented Control */}
        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-black/40 border border-white/5">
          {(['bronce', 'silver', 'oro'] as PlatformTier[]).map(t => {
            const def = PLATFORM_TIERS[t];
            const isSelected = currentTier === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onSelectTier(t)}
                className={`py-1 px-1.5 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r ' + def.color.gradient + ' text-white shadow-sm ring-1 ring-white/30 scale-[1.02]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
                title={`${def.name}: ${def.tagline}`}
              >
                <span>{def.icon}</span>
                <span className="capitalize">{def.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-0.5">
          <span className="truncate">{activeDef.tagline}</span>
          <span className="text-[#DE738F] font-semibold shrink-0">
            {activeDef.allowedSections.length} herramientas
          </span>
        </div>
      </div>
    );
  }

  // Full Card View (for SalonSettingsView or Upgrade Modals)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {(['bronce', 'silver', 'oro'] as PlatformTier[]).map(t => {
        const def = PLATFORM_TIERS[t];
        const isSelected = currentTier === t;
        return (
          <div
            key={t}
            onClick={() => onSelectTier(t)}
            className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
              isSelected
                ? 'border-[#DE738F] bg-gradient-to-b from-[#DE738F]/10 via-rose-50/5 to-transparent ring-2 ring-[#DE738F]/40 shadow-md'
                : 'border-border bg-card/60 hover:border-[#DE738F]/40 hover:bg-muted/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{def.icon}</span>
                <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${def.color.bg} ${def.color.border} border`} style={{ color: def.color.text }}>
                  {def.badge}
                </span>
              </div>

              <h4 className="text-base font-bold text-foreground mb-0.5">
                Plan {def.name}
              </h4>
              <p className="text-xs font-semibold text-[#DE738F] mb-1">
                {def.tagline}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                {def.targetAudience}
              </p>
            </div>

            <div>
              <div className="pt-2.5 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {def.allowedSections.length} Módulos Activos
                </span>
                <button
                  type="button"
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#C45774] text-white shadow-2xs'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={11} strokeWidth={2.5} />
                      <span>Activo</span>
                    </>
                  ) : (
                    <span>Seleccionar</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
