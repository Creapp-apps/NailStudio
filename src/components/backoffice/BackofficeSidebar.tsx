import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Package,
  DollarSign,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  Clock,
  Award,
  Scissors,
  Settings,
  ChevronDown,
  Globe,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Building2,
  TrendingUp,
  Percent,
  Palette
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export type BackofficeSection =
  | 'web_studio'
  | 'calendar'
  | 'waitlist'
  | 'crm'
  | 'health'
  | 'inventory'
  | 'orders'
  | 'automations'
  | 'loyalty'
  | 'finances'
  | 'commissions'
  | 'staff'
  | 'settings';

interface Props {
  activeSection: BackofficeSection;
  onSelectSection: (section: BackofficeSection) => void;
  todayAppointmentsCount: number;
  lowStockCount: number;
  hemaAlertCount: number;
  retentionPendingCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const BackofficeSidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  todayAppointmentsCount,
  lowStockCount,
  hemaAlertCount,
  retentionPendingCount,
  isMobileOpen,
  onCloseMobile
}) => {
  const navigationGroups = [
    {
      rubro: 'DISEÑO & PERSONALIZACIÓN',
      items: [
        {
          id: 'web_studio' as BackofficeSection,
          label: 'Personalización de la Web',
          icon: <Palette className="size-4 text-pink-400" />,
          badge: 'En Vivo',
          badgeVariant: 'outline' as const
        }
      ]
    },
    {
      rubro: 'OPERACIONES & SALÓN',
      items: [
        {
          id: 'calendar' as BackofficeSection,
          label: 'Agenda de Mesas',
          icon: <Calendar className="size-4" />,
          badge: todayAppointmentsCount > 0 ? `${todayAppointmentsCount}` : undefined,
          badgeVariant: 'secondary' as const
        },
        {
          id: 'waitlist' as BackofficeSection,
          label: 'En Mesa & Check-in',
          icon: <Clock className="size-4" />,
          badge: 'Live',
          badgeVariant: 'outline' as const
        }
      ]
    },
    {
      rubro: 'CLIENTAS & CLÍNICA UNGUEAL',
      items: [
        {
          id: 'crm' as BackofficeSection,
          label: 'Fichas Técnicas & CRM',
          icon: <Users className="size-4" />
        },
        {
          id: 'health' as BackofficeSection,
          label: 'Alergias HEMA & Diagnóstico',
          icon: <ShieldAlert className="size-4 text-amber-500" />,
          badge: hemaAlertCount > 0 ? `${hemaAlertCount} Alertas` : undefined,
          badgeVariant: 'destructive' as const
        }
      ]
    },
    {
      rubro: 'LOGÍSTICA & STOCK',
      items: [
        {
          id: 'inventory' as BackofficeSection,
          label: 'Stock de Geles & Esmaltes',
          icon: <Package className="size-4" />,
          badge: lowStockCount > 0 ? `${lowStockCount} Bajo` : undefined,
          badgeVariant: 'destructive' as const
        },
        {
          id: 'orders' as BackofficeSection,
          label: 'Pedidos a Proveedores',
          icon: <Scissors className="size-4" />
        }
      ]
    },
    {
      rubro: 'MARKETING & FIDELIZACIÓN',
      items: [
        {
          id: 'automations' as BackofficeSection,
          label: 'Retención WhatsApp (Día 18)',
          icon: <MessageSquare className="size-4 text-emerald-500" />,
          badge: retentionPendingCount > 0 ? `${retentionPendingCount}` : undefined,
          badgeVariant: 'secondary' as const
        },
        {
          id: 'loyalty' as BackofficeSection,
          label: 'Club Privilege & Puntos',
          icon: <Award className="size-4 text-yellow-500" />
        }
      ]
    },
    {
      rubro: 'FINANZAS & COMISIONES',
      items: [
        {
          id: 'finances' as BackofficeSection,
          label: 'Caja Diaria & Facturación',
          icon: <DollarSign className="size-4 text-emerald-500" />
        },
        {
          id: 'commissions' as BackofficeSection,
          label: 'Liquidación de Manicuristas',
          icon: <Percent className="size-4" />
        }
      ]
    },
    {
      rubro: 'SISTEMA & AJUSTES',
      items: [
        {
          id: 'staff' as BackofficeSection,
          label: 'Staff & Especialistas',
          icon: <Sparkles className="size-4 text-pink-400" />
        },
        {
          id: 'settings' as BackofficeSection,
          label: 'Parámetros del Salón',
          icon: <Settings className="size-4" />
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-[#140D10] text-zinc-100 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Studio Switcher */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#DE738F] to-[#4A1B28] text-lg font-bold text-white shadow-md shadow-pink-900/30">
              💅
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-semibold tracking-wide text-white">
                Atelier Nails
              </span>
              <span className="text-[11px] text-pink-300/80">
                Recoleta Flagship
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-pink-500/30 bg-pink-500/10 text-[10px] font-semibold tracking-wider text-pink-300 uppercase"
          >
            Haute SaaS
          </Badge>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {navigationGroups.map((group) => (
            <div key={group.rubro} className="space-y-1">
              {/* Category Rubro Header */}
              <div className="px-3 pb-1 text-[10px] font-bold tracking-widest text-pink-200/50 uppercase">
                {group.rubro}
              </div>

              {/* Items in Rubro */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSection(item.id);
                        if (isMobileOpen) onCloseMobile();
                      }}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500/20 to-pink-500/5 text-white font-semibold shadow-sm border-l-2 border-pink-500'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`transition-colors ${
                            isActive ? 'text-pink-400' : 'text-zinc-400 group-hover:text-zinc-200'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className={`px-1.5 py-0.2 text-[10px] ${
                            isActive
                              ? 'bg-pink-500 text-white'
                              : 'bg-white/10 text-zinc-300'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 bg-[#0F080B] p-3 space-y-3">
          {/* Quick External Route Links */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1.5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all text-center"
            >
              <Globe className="size-3 text-pink-400" />
              <span>Web Pública</span>
            </Link>
            <Link
              to="/pwa"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1.5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all text-center"
            >
              <Smartphone className="size-3 text-pink-400" />
              <span>Portal PWA</span>
            </Link>
          </div>

          <Separator className="bg-white/10" />

          {/* User Profile Card & Supabase Status */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8 border border-pink-400/40">
                <AvatarFallback className="bg-gradient-to-br from-pink-900 to-zinc-900 text-xs font-bold text-pink-200">
                  SV
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200">
                  Sofía Valenzuela
                </span>
                <span className="text-[10px] text-zinc-400">
                  Directora Técnica
                </span>
              </div>
            </div>

            {/* Supabase Live Status Indicator */}
            <div
              className="flex size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"
              title="Supabase PostgreSQL Live Sync Conectado"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
