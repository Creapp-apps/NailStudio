import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
  disabled?: boolean;
}

interface Props<T = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  searchable?: boolean;
}

export const LuxurySelect = <T extends string | number = string | number>({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar opción...',
  label,
  required = false,
  icon,
  className = '',
  disabled = false,
  size = 'md',
  searchable = false
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return options.find(o => String(o.value) === String(value)) || null;
  }, [options, value]);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
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

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  // Filtered options if search is enabled or more than 7 options
  const isSearchActive = searchable || options.length > 7;
  const filteredOptions = useMemo(() => {
    if (!isSearchActive || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      o => o.label.toLowerCase().includes(q) || (o.description && o.description.toLowerCase().includes(q))
    );
  }, [options, searchQuery, isSearchActive]);

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const isSmall = size === 'sm';

  return (
    <div className={`relative flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Luxury Trigger Box */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full text-left flex items-center justify-between transition-all select-none rounded-xl border bg-background text-foreground cursor-pointer ${
          isSmall ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs'
        } ${
          isOpen
            ? 'border-[#DE738F] ring-2 ring-[#DE738F]/20 shadow-sm'
            : 'border-input hover:border-[#DE738F]/50 hover:bg-muted/30'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <div className="truncate">
            <span className={`font-semibold truncate ${selectedOption ? 'text-foreground' : 'text-muted-foreground'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          {selectedOption?.badge && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#DE738F]/15 text-[#C45774] font-bold shrink-0 ml-1">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          size={isSmall ? 12 : 14}
          className={`text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-[#DE738F]' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu (Haute Glam Popover) */}
      {isOpen && (
        <div
          className="absolute z-50 top-full left-0 right-0 min-w-[200px] mt-1.5 rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden animate-scale-up"
          style={{
            boxShadow: '0 18px 40px -8px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(222, 115, 143, 0.22)'
          }}
        >
          {/* Search bar inside dropdown if many options */}
          {isSearchActive && (
            <div className="p-2 border-b border-border/60 bg-muted/20 flex items-center gap-2">
              <Search size={13} className="text-muted-foreground shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar opción..."
                className="w-full bg-transparent border-none text-xs text-foreground focus:outline-none placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-muted-foreground/20">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No se encontraron resultados
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(value) === String(opt.value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500/15 via-[#DE738F]/15 to-rose-500/15 text-[#C45774] dark:text-rose-200 font-bold border border-[#DE738F]/30 shadow-2xs'
                        : 'text-foreground hover:bg-muted/70 hover:text-foreground'
                    } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="truncate">
                        <span className="block truncate">{opt.label}</span>
                        {opt.description && (
                          <span className="block text-[10px] text-muted-foreground truncate font-normal">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {opt.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#DE738F]/15 text-[#C45774] font-semibold">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check size={13} strokeWidth={2.6} className="text-[#C45774]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
