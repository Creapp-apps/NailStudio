import React from 'react';
import {
  Menu,
  Plus,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackofficeSection } from './BackofficeSidebar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  activeSection: BackofficeSection;
  onToggleMobileMenu: () => void;
  onOpenNewBooking: () => void;
  onResetData?: () => void;
}

export const BackofficeTopNav: React.FC<Props> = ({
  activeSection,
  onToggleMobileMenu,
  onOpenNewBooking
}) => {
  const getBreadcrumb = (section: BackofficeSection) => {
    switch (section) {
      case 'home':
        return { rubro: 'Centro de Mando', title: 'Home & Jornada de Hoy' };
      case 'web_studio':
        return { rubro: 'Diseño Web', title: 'Personalización & Editor en Vivo' };
      case 'calendar':
        return { rubro: 'Operaciones', title: 'Agenda de Mesas & Turnos' };
      case 'waitlist':
        return { rubro: 'Operaciones', title: 'Sala de Espera & Check-in' };
      case 'crm':
        return { rubro: 'Clientela', title: 'Fichas Técnicas & CRM' };
      case 'health':
        return { rubro: 'Clínica Ungueal', title: 'Alergias HEMA & Diagnóstico' };
      case 'inventory':
        return { rubro: 'Logística', title: 'Control de Insumos & Geles' };
      case 'orders':
        return { rubro: 'Logística', title: 'Pedidos & Reposición' };
      case 'automations':
        return { rubro: 'Marketing', title: 'Retención WhatsApp (Día 18)' };
      case 'loyalty':
        return { rubro: 'Marketing', title: 'Club Privilege & Puntos' };
      case 'finances':
        return { rubro: 'Finanzas', title: 'Caja Diaria & Facturación' };
      case 'commissions':
        return { rubro: 'Finanzas', title: 'Liquidación de Manicuristas' };
      case 'staff':
        return { rubro: 'Sistema', title: 'Staff & Especialistas' };
      case 'settings':
        return { rubro: 'Sistema', title: 'Parámetros del Salón & Centro de Mando' };
      case 'integrations':
        return { rubro: 'Sistema', title: "Integraciones / API's & Webhooks" };
      default:
        return { rubro: 'Panel', title: 'Operaciones' };
    }
  };

  const breadcrumb = getBreadcrumb(activeSection);

  // Dynamic formatted Spanish date (e.g. "Sábado, 3 de Octubre")
  const rawDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const displayDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  return (
    <header className="sticky top-3 z-30 flex w-full items-center justify-between px-3.5 lg:px-6 pointer-events-none mb-2">
      {/* 1. Left: Floating Navigation Pill */}
      <div className="flex items-center gap-2 rounded-full border border-rose-200/80 dark:border-rose-900/40 bg-white/95 dark:bg-[#140D10]/95 px-4 py-2 text-xs shadow-lg shadow-rose-950/5 backdrop-blur-xl ring-1 ring-black/5 pointer-events-auto transition-all">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleMobileMenu}
          className="lg:hidden -ml-1.5 mr-1 size-7 rounded-full text-foreground hover:bg-rose-50 dark:hover:bg-white/10"
        >
          <Menu className="size-4" />
        </Button>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground/70 font-medium text-[10px] sm:text-[11px] uppercase tracking-wider">Backoffice</span>
          <span className="text-rose-300 dark:text-rose-800 font-light">/</span>
          <span className="text-muted-foreground/90 font-medium hidden sm:inline">{breadcrumb.rubro}</span>
          <span className="text-rose-300 dark:text-rose-800 font-light hidden sm:inline">/</span>
          <span className="font-semibold text-foreground tracking-tight">{breadcrumb.title}</span>
        </div>
      </div>

      {/* 2. Right: Floating Date Badge & Action Pills (Ocultos en la Agenda para evitar duplicidad con sus controles nativos) */}
      {activeSection !== 'calendar' && (
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Floating Date Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-rose-200/80 dark:border-rose-900/40 bg-white/95 dark:bg-[#140D10]/95 px-3.5 py-2 text-xs text-foreground font-medium shadow-lg shadow-rose-950/5 backdrop-blur-xl ring-1 ring-black/5">
            <CalendarDays className="size-3.5 text-[#DE738F]" />
            <span>{displayDate}</span>
          </div>

          {/* Floating Action Pill: + Nuevo Turno */}
          <button
            type="button"
            onClick={onOpenNewBooking}
            className="group relative flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#DE738F] via-[#D86280] to-[#C45774] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-pink-500/35 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/30 cursor-pointer"
          >
            <Plus className="size-3.5 transition-transform duration-200 group-hover:rotate-90" />
            <span className="hidden sm:inline">Nuevo Turno</span>
            <span className="sm:hidden">Turno</span>
          </button>
        </div>
      )}
    </header>
  );
};
