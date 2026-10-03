import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Clock, Check, ChevronDown, Sparkles } from 'lucide-react';

interface Props {
  value: string; // 'HH:mm' e.g. '14:00'
  onChange: (time: string) => void;
  label?: string;
  required?: boolean;
  minHour?: number; // default 8
  maxHour?: number; // default 21
  minuteStep?: number; // default 15
  className?: string;
  placeholder?: string;
  align?: 'left' | 'right' | 'auto';
}

const COMMON_PRESETS = [
  { label: '09:00', time: '09:00' },
  { label: '10:30', time: '10:30' },
  { label: '12:00', time: '12:00' },
  { label: '14:00', time: '14:00' },
  { label: '15:30', time: '15:30' },
  { label: '17:00', time: '17:00' },
  { label: '18:30', time: '18:30' },
  { label: '20:00', time: '20:00' }
];

export const LuxuryTimePicker: React.FC<Props> = ({
  value,
  onChange,
  label,
  required = false,
  minHour = 8,
  maxHour = 21,
  minuteStep = 15,
  className = '',
  placeholder = 'Seleccionar hora',
  align = 'auto'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedAlign, setComputedAlign] = useState<'left' | 'right'>(align === 'right' ? 'right' : 'left');

  useEffect(() => {
    if (align && align !== 'auto') {
      setComputedAlign(align);
      return;
    }
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.left;
      if (spaceRight < 340 || rect.right > window.innerWidth - 100) {
        setComputedAlign('right');
      } else {
        setComputedAlign('left');
      }
    }
  }, [isOpen, align]);

  // Parse current hour & minute
  const { currentHour, currentMinute } = useMemo(() => {
    if (!value || !value.includes(':')) {
      return { currentHour: 10, currentMinute: 0 };
    }
    const [h, m] = value.split(':').map(n => parseInt(n, 10));
    return {
      currentHour: isNaN(h) ? 10 : h,
      currentMinute: isNaN(m) ? 0 : m
    };
  }, [value]);

  const [selectedHour, setSelectedHour] = useState<number>(currentHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(currentMinute);

  useEffect(() => {
    setSelectedHour(currentHour);
    setSelectedMinute(currentMinute);
  }, [currentHour, currentMinute]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Hours array
  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = minHour; h <= maxHour; h++) {
      list.push(h);
    }
    return list;
  }, [minHour, maxHour]);

  // Minutes array based on step
  const minutes = useMemo(() => {
    const list: number[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      list.push(m);
    }
    return list;
  }, [minuteStep]);

  const handleSelectHour = (h: number) => {
    setSelectedHour(h);
    const newTime = `${h.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange(newTime);
  };

  const handleSelectMinute = (m: number) => {
    setSelectedMinute(m);
    const newTime = `${selectedHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onChange(newTime);
  };

  const handleSelectPreset = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    setSelectedHour(h);
    setSelectedMinute(m);
    onChange(timeStr);
    setIsOpen(false);
  };

  // Formatted display text (e.g. 14:00 hs • 2:00 PM)
  const displayText = useMemo(() => {
    if (!value) return '';
    const h = selectedHour;
    const m = selectedMinute.toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h.toString().padStart(2, '0')}:${m} hs (${h12}:${m} ${period})`;
  }, [value, selectedHour, selectedMinute]);

  return (
    <div className={`relative flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Luxury Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer select-none bg-background text-foreground ${
          isOpen
            ? 'border-[#DE738F] ring-2 ring-[#DE738F]/20 shadow-sm'
            : 'border-input hover:border-[#DE738F]/50 hover:bg-muted/30'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-6 h-6 rounded-lg bg-[#DE738F]/15 flex items-center justify-center text-[#C45774] shrink-0">
            <Clock size={13} strokeWidth={2.4} />
          </div>
          <span className={`text-xs font-semibold truncate ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
            {value ? displayText : placeholder}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180 text-[#DE738F]' : ''
          }`}
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 top-full mt-1.5 w-72 sm:w-80 rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden animate-scale-up ${
            computedAlign === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'
          }`}
          style={{
            boxShadow: '0 16px 36px -6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(222, 115, 143, 0.2)'
          }}
        >
          {/* Header */}
          <div className="p-3 border-b border-border/70 bg-gradient-to-r from-rose-500/10 via-[#DE738F]/10 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[#C45774]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Seleccionar Horario
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DE738F]/15 text-[#C45774] font-bold">
              {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')} hs
            </span>
          </div>

          {/* Salon Quick Presets */}
          <div className="p-2.5 bg-muted/20 border-b border-border/50">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5 pl-0.5">
              Horarios Habituales
            </span>
            <div className="grid grid-cols-4 gap-1">
              {COMMON_PRESETS.map((preset) => {
                const isSelected = value === preset.time;
                return (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => handleSelectPreset(preset.time)}
                    className={`py-1 px-1 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer border ${
                      isSelected
                        ? 'bg-[#C45774] text-white border-[#C45774] shadow-xs'
                        : 'bg-background hover:bg-muted text-foreground border-border/60 hover:border-[#DE738F]/40'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hour & Minute Wheel / Columns */}
          <div className="p-3 grid grid-cols-2 gap-2 text-xs">
            {/* Hours Column */}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-center">
                Hora
              </span>
              <div className="max-h-44 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                {hours.map((h) => {
                  const isSelected = selectedHour === h;
                  const period = h >= 12 ? 'PM' : 'AM';
                  const h12 = h % 12 === 0 ? 12 : h % 12;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleSelectHour(h)}
                      className={`w-full py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white font-bold shadow-xs'
                          : 'text-foreground hover:bg-muted/70'
                      }`}
                    >
                      <span className="font-mono">{h.toString().padStart(2, '0')}:00</span>
                      <span className="text-[9px] opacity-75 font-normal">{h12} {period}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col border-l border-border/60 pl-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-center">
                Minutos
              </span>
              <div className="max-h-44 overflow-y-auto space-y-1">
                {minutes.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelectMinute(m)}
                      className={`w-full py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white font-bold shadow-xs'
                          : 'text-foreground hover:bg-muted/70'
                      }`}
                    >
                      <span className="font-mono">:{m.toString().padStart(2, '0')}</span>
                      {isSelected && <Check size={12} strokeWidth={2.6} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-2.5 border-t border-border/70 bg-muted/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const h = now.getHours();
                const m = Math.floor(now.getMinutes() / 15) * 15;
                setSelectedHour(h);
                setSelectedMinute(m);
                onChange(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
              }}
              className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Hora Actual
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white font-bold text-xs shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
