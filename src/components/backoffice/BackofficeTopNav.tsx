import React from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Sparkles,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackofficeSection } from './BackofficeSidebar';

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

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md lg:px-6">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleMobileMenu}
          className="lg:hidden"
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Backoffice</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-muted-foreground font-medium">{breadcrumb.rubro}</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-semibold text-foreground tracking-tight">{breadcrumb.title}</span>
        </div>
      </div>

      {/* Right: Search, Date Badge, CTA, Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Date Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground font-medium">
          <CalendarDays className="size-3.5 text-pink-500" />
          <span>Lunes, 28 Sep 2026</span>
        </div>

        {/* Sync Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Supabase Sync</span>
        </div>

        {/* Primary CTA: Nuevo Turno */}
        <Button
          onClick={onOpenNewBooking}
          className="bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white hover:opacity-90 shadow-sm shadow-pink-500/20 text-xs font-semibold px-3 py-1.5 h-8 gap-1.5"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Nuevo Turno</span>
        </Button>
      </div>
    </header>
  );
};
