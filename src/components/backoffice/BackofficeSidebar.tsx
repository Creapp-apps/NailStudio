import React, { useState, useEffect } from 'react';
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
  Palette,
  Link2,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useWebConfig } from '../../hooks/useWebConfig';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { PlatformTier, PLATFORM_TIERS, BackofficeSectionId } from '../../types/platformTiers';
import { PlatformTierSwitcher } from './PlatformTierSwitcher';

export type BackofficeSection = BackofficeSectionId;

interface Props {
  activeSection: BackofficeSection;
  onSelectSection: (section: BackofficeSection) => void;
  todayAppointmentsCount: number;
  pendingAppointmentsCount?: number;
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
  pendingAppointmentsCount = 0,
  lowStockCount,
  hemaAlertCount,
  retentionPendingCount,
  isMobileOpen,
  onCloseMobile
}) => {
  const { config } = useWebConfig();
  const { user, logout } = useAuth();
  const [currentTier, setCurrentTier] = useState<PlatformTier>(() => storage.getPlatformTier());

  useEffect(() => {
    const handleTierEvent = (e: any) => {
      if (e.detail) {
        setCurrentTier(e.detail);
      }
    };
    window.addEventListener('atelier-tier-changed', handleTierEvent);
    return () => window.removeEventListener('atelier-tier-changed', handleTierEvent);
  }, []);

  const handleTierChange = (newTier: PlatformTier) => {
    storage.setPlatformTier(newTier);
    setCurrentTier(newTier);
    window.dispatchEvent(new CustomEvent('atelier-tier-changed', { detail: newTier }));
    if (!PLATFORM_TIERS[newTier].allowedSections.includes(activeSection)) {
      onSelectSection('calendar');
    }
  };

  const rawNavigationGroups = [

    {
      rubro: 'DISEÑO & PERSONALIZACIÓN',
      items: [
        {
          id: 'web_studio' as BackofficeSection,
          label: 'Personalización de la Web',
          icon: <Palette className="size-4 text-pink-400" />
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
        },
        {
          id: 'integrations' as BackofficeSection,
          label: "Integraciones / API's",
          icon: <Link2 className="size-4 text-sky-400" />
        }
      ]
    }
  ];

  // Filter sections according to active Platform Tier
  const currentTierInfo = PLATFORM_TIERS[currentTier];
  const navigationGroups = rawNavigationGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => currentTierInfo.allowedSections.includes(item.id))
    }))
    .filter(group => group.items.length > 0);

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
        {/* Top Studio Switcher / Brand Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {config.customLogoUrl ? (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white/95 p-0.5 shadow-md shadow-pink-900/30 border border-pink-500/30">
                <img
                  src={config.customLogoUrl}
                  alt={config.brandName || 'Logo'}
                  className="size-full object-contain rounded-lg"
                  style={{
                    transform: `scale(${(config.customLogoScale || 100) / 100})`,
                    transition: 'transform 0.15s ease'
                  }}
                />
              </div>
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DE738F] to-[#4A1B28] text-lg font-bold text-white shadow-md shadow-pink-900/30">
                {config.logoEmoji || '💅'}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base font-semibold tracking-wide text-white truncate" title={config.brandName}>
                {config.brandName || 'Atelier Nails'}
              </span>
              <span className="text-[11px] text-pink-300/80 truncate" title={config.brandTagline}>
                {config.brandTagline || 'Recoleta Flagship'}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-pink-500/30 bg-pink-500/10 text-[10px] font-semibold tracking-wider text-pink-300 uppercase shrink-0"
          >
            Haute SaaS
          </Badge>
        </div>

        {/* Tier Selector / Switcher */}
        <div className="px-3 pt-3 pb-2 border-b border-white/5 bg-black/20">
          <PlatformTierSwitcher
            currentTier={currentTier}
            onSelectTier={handleTierChange}
            compact
          />
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

                      {item.id === 'calendar' && pendingAppointmentsCount > 0 ? (
                        <div
                          className="flex items-center gap-1.5 shrink-0"
                          title="TENES UN TURNO PENDIENTE PARA REVISAR"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white shadow-lg shadow-[#DE738F]/50 animate-pulse border border-white/20 tracking-wider">
                            <Sparkles size={10} className="text-amber-200 shrink-0" />
                            <span>{pendingAppointmentsCount} PENDIENTE{pendingAppointmentsCount > 1 ? 'S' : ''}</span>
                          </span>
                        </div>
                      ) : (
                        item.badge && (
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
                        )
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
                  {user?.user_metadata?.full_name ? user.user_metadata.full_name.slice(0, 2).toUpperCase() : 'DB'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden max-w-[125px]">
                <span className="text-xs font-semibold text-zinc-200 truncate" title={user?.user_metadata?.full_name || user?.email || 'Directora Belcalis'}>
                  {user?.user_metadata?.full_name || 'Directora Belcalis'}
                </span>
                <span className="text-[10px] text-pink-400/90 truncate">
                  {user?.email || 'admin@belcalisnails.com.ar'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Supabase Live Status Indicator */}
              <div
                className="flex size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"
                title="Supabase PostgreSQL Live Sync Conectado"
              />
              <button
                onClick={() => logout()}
                title="Cerrar Sesión de Staff"
                className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
