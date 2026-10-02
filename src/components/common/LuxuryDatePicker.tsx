import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { format, parseISO, isValid, isBefore, startOfDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  value: string; // 'YYYY-MM-DD'
  onChange: (date: string) => void;
  minDate?: string; // 'YYYY-MM-DD'
  label?: string;
  className?: string;
  isDateDisabled?: (date: Date) => boolean;
}

export const LuxuryDatePicker: React.FC<Props> = ({
  value,
  onChange,
  minDate,
  label,
  className = '',
  isDateDisabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date
  const selectedDate = useMemo(() => {
    if (!value) return new Date();
    try {
      const parsed = parseISO(value);
      return isValid(parsed) ? parsed : new Date();
    } catch {
      return new Date();
    }
  }, [value]);

  // Calendar month view navigation state
  const [viewYear, setViewYear] = useState<number>(() => selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => selectedDate.getMonth()); // 0-indexed

  // Keep view in sync when value changes from outside
  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  // Generate days matrix
  const daysInMonth = useMemo(() => {
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    // In JavaScript, 0 is Sunday. Let's make Monday index 0:
    const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    return { totalDays, firstDayOfWeek };
  }, [viewYear, viewMonth]);

  const monthTitle = useMemo(() => {
    const d = new Date(viewYear, viewMonth, 1);
    const m = format(d, 'MMMM', { locale: es });
    return `${m.charAt(0).toUpperCase() + m.slice(1)} ${viewYear}`;
  }, [viewYear, viewMonth]);

  const formattedDisplay = useMemo(() => {
    if (!value) return 'Seleccionar fecha';
    try {
      const parsed = parseISO(value);
      if (!isValid(parsed)) return value;
      const dayFormatted = format(parsed, "EEEE d 'de' MMMM", { locale: es });
      return dayFormatted.charAt(0).toUpperCase() + dayFormatted.slice(1);
    } catch {
      return value;
    }
  }, [value]);

  const minDateParsed = useMemo(() => {
    if (!minDate) return null;
    try {
      const p = parseISO(minDate);
      return isValid(p) ? startOfDay(p) : null;
    } catch {
      return null;
    }
  }, [minDate]);

  const handleSelectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${m}-${d}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const isDaySelected = (day: number) => {
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  const isDayDisabled = (day: number) => {
    const current = startOfDay(new Date(viewYear, viewMonth, day));
    if (minDateParsed && isBefore(current, minDateParsed)) return true;
    if (isDateDisabled && isDateDisabled(current)) return true;
    return false;
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="text-[0.72rem] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
          {label}
        </label>
      )}

      {/* Luxury Date Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full px-3 py-2.5 rounded-xl border border-[#DE738F]/30 bg-white hover:border-[#DE738F]/60 text-xs sm:text-sm font-semibold text-[#2B181C] flex items-center justify-between gap-2 shadow-2xs transition-all cursor-pointer text-left outline-none focus:ring-2 focus:ring-[#DE738F]/20"
      >
        <div className="flex items-center gap-2 truncate">
          <div className="w-6 h-6 rounded-lg bg-[#DE738F]/10 flex items-center justify-center text-[#C45774] shrink-0">
            <CalendarIcon size={14} />
          </div>
          <span className="truncate">{formattedDisplay}</span>
        </div>
        <span className="text-[0.7rem] font-bold text-[#C45774] uppercase tracking-wider shrink-0 bg-[#DE738F]/10 px-2 py-0.5 rounded-md">
          Cambiar
        </span>
      </button>

      {/* Floating Haute Glam Calendar Popover */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 right-0 sm:right-auto sm:w-[320px] top-[calc(100%+6px)] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#DE738F]/30 p-3.5 animate-fade-in text-[#2B181C]"
          style={{
            boxShadow: '0 20px 50px rgba(43, 24, 28, 0.18), 0 0 0 1px rgba(222, 115, 143, 0.2)'
          }}
        >
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full border border-stone-200 hover:border-[#DE738F]/40 hover:bg-[#DE738F]/10 flex items-center justify-center text-stone-600 transition-all cursor-pointer"
              title="Mes anterior"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="font-serif-glam text-sm sm:text-base font-bold text-[#2B181C] tracking-wide">
              {monthTitle}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full border border-stone-200 hover:border-[#DE738F]/40 hover:bg-[#DE738F]/10 flex items-center justify-center text-stone-600 transition-all cursor-pointer"
              title="Mes siguiente"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((d, i) => (
              <span key={i} className="text-[0.62rem] font-bold text-stone-400 tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before first day */}
            {Array.from({ length: daysInMonth.firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8" />
            ))}

            {/* Actual day numbers */}
            {Array.from({ length: daysInMonth.totalDays }).map((_, i) => {
              const day = i + 1;
              const selected = isDaySelected(day);
              const today = isToday(day);
              const disabled = isDayDisabled(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(day)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    disabled
                      ? 'text-stone-300 opacity-40 cursor-not-allowed'
                      : selected
                        ? 'bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white font-extrabold shadow-md shadow-[#C45774]/30 scale-105'
                        : today
                          ? 'border border-[#C45774] font-bold text-[#C45774] bg-[#DE738F]/10 hover:bg-[#DE738F]/20'
                          : 'text-[#2B181C] hover:bg-[#DE738F]/15 hover:text-[#C45774]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Presets & Footer */}
          <div className="mt-3 pt-2.5 border-t border-dashed border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const todayStr = format(new Date(), 'yyyy-MM-dd');
                  onChange(todayStr);
                  setIsOpen(false);
                }}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-[#DE738F]/15 hover:text-[#C45774] text-[0.68rem] font-bold transition-all text-stone-600"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => {
                  const tomStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
                  onChange(tomStr);
                  setIsOpen(false);
                }}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-[#DE738F]/15 hover:text-[#C45774] text-[0.68rem] font-bold transition-all text-stone-600"
              >
                Mañana
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[0.68rem] font-bold text-stone-400 hover:text-stone-600 px-2 py-1 rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
