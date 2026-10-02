import React from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  value: string; // "HH:MM" format (24h)
  onChange: (val: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const LuxuryManualTimeInput: React.FC<Props> = ({
  value = '09:00',
  onChange,
  label,
  className = '',
  disabled = false
}) => {
  // Parse hour and minute from value (e.g., "09:00")
  const [hStr, mStr] = (value || '09:00').split(':');
  const hours = parseInt(hStr, 10) || 0;
  const minutes = parseInt(mStr, 10) || 0;

  const updateTime = (newH: number, newM: number) => {
    const clampedH = Math.max(0, Math.min(23, newH));
    const clampedM = Math.max(0, Math.min(59, newM));
    const formatted = `${String(clampedH).padStart(2, '0')}:${String(clampedM).padStart(2, '0')}`;
    onChange(formatted);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw === '') {
      updateTime(0, minutes);
      return;
    }
    const val = parseInt(raw, 10);
    if (!isNaN(val)) {
      updateTime(Math.min(23, val), minutes);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw === '') {
      updateTime(hours, 0);
      return;
    }
    const val = parseInt(raw, 10);
    if (!isNaN(val)) {
      updateTime(hours, Math.min(59, val));
    }
  };

  const stepHour = (delta: number) => {
    let nextH = hours + delta;
    if (nextH < 0) nextH = 23;
    if (nextH > 23) nextH = 0;
    updateTime(nextH, minutes);
  };

  const stepMinute = (delta: number) => {
    let nextM = minutes + delta;
    if (nextM < 0) nextM = 45;
    if (nextM > 59) nextM = 0;
    updateTime(hours, nextM);
  };

  // 12h representation for convenient reference
  const period = hours >= 12 ? 'PM' : 'AM';
  const display12 = hours % 12 === 0 ? 12 : hours % 12;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Clock className="size-3 text-[#DE738F]" />
          <span>{label}</span>
        </span>
      )}

      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-white/95 dark:bg-zinc-900/90 shadow-2xs hover:border-[#DE738F] focus-within:border-[#DE738F] focus-within:ring-2 focus-within:ring-[#DE738F]/20 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Clock className="size-3.5 text-[#C45774] shrink-0" />

        {/* Hour Input + Steppers */}
        <div className="flex items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={String(hours).padStart(2, '0')}
            onChange={handleHourChange}
            disabled={disabled}
            aria-label="Hora"
            className="w-7 text-center font-mono font-bold text-xs sm:text-sm text-foreground bg-transparent outline-none focus:text-[#C45774] select-all"
          />
          <div className="flex flex-col ml-0.5">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => stepHour(1)}
              disabled={disabled}
              className="text-muted-foreground hover:text-[#C45774] p-0.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
              title="Aumentar hora"
            >
              <ChevronUp size={10} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => stepHour(-1)}
              disabled={disabled}
              className="text-muted-foreground hover:text-[#C45774] p-0.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
              title="Disminuir hora"
            >
              <ChevronDown size={10} />
            </button>
          </div>
        </div>

        <span className="font-bold text-muted-foreground font-mono">:</span>

        {/* Minute Input + Steppers */}
        <div className="flex items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={String(minutes).padStart(2, '0')}
            onChange={handleMinuteChange}
            disabled={disabled}
            aria-label="Minutos"
            className="w-7 text-center font-mono font-bold text-xs sm:text-sm text-foreground bg-transparent outline-none focus:text-[#C45774] select-all"
          />
          <div className="flex flex-col ml-0.5">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => stepMinute(15)}
              disabled={disabled}
              className="text-muted-foreground hover:text-[#C45774] p-0.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
              title="+15 minutos"
            >
              <ChevronUp size={10} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => stepMinute(-15)}
              disabled={disabled}
              className="text-muted-foreground hover:text-[#C45774] p-0.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
              title="-15 minutos"
            >
              <ChevronDown size={10} />
            </button>
          </div>
        </div>

        {/* 12h Tag (AM / PM) */}
        <span className="ml-1 text-[10px] font-semibold text-[#C45774] bg-[#DE738F]/15 px-1.5 py-0.5 rounded-md shrink-0">
          {display12}:{String(minutes).padStart(2, '0')} {period}
        </span>
      </div>
    </div>
  );
};
