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
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const BackofficeSidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  todayAppointmentsCount,
  pendingAppointmentsCount = 0,
  lowStockCount,
  hemaAlertCount,
  retentionPendingCount = 0,
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
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

  const handleCycleTier = () => {
    const order: PlatformTier[] = ['bronce', 'silver', 'oro'];
    const nextIdx = (order.indexOf(currentTier) + 1) % order.length;
    handleTierChange(order[nextIdx]);
  };

  const rawNavigationGroups = [
    {
      rubro: 'PANEL PRINCIPAL',
      items: [
        {
          id: 'home' as BackofficeSection,
          label: 'Inicio (Home)',
          icon: <LayoutDashboard className="size-4 text-[#DE738F]" />
        }
      ]
    },
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
          id: 'services' as BackofficeSection,
          label: 'Carta de Servicios & Precios',
          icon: <Sparkles className="size-4 text-[#DE738F]" />
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

      {/* Main Floating Pill Sidebar Container */}
      <aside
        className={`transition-all duration-300 ease-in-out z-50 flex flex-col bg-[#140D10]/95 backdrop-blur-2xl text-zinc-100 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-72 border-r border-border'
            : 'fixed -translate-x-full lg:translate-x-0'
        } lg:static lg:self-start lg:sticky lg:top-3.5 lg:my-3.5 lg:ml-3.5 lg:h-fit lg:max-h-[calc(100vh-28px)] lg:rounded-[28px] lg:border lg:border-white/10 lg:shadow-2xl lg:shadow-black/70 lg:ring-1 lg:ring-white/10 lg:overflow-visible ${
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-72'
        }`}
      >
        {/* Top Studio Switcher / Brand Header */}
        <div className={`flex items-center border-b border-white/10 ${isCollapsed ? 'flex-col justify-center px-2 py-3 gap-2' : 'justify-between px-4 py-3.5'}`}>
          <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
            {config.customLogoUrl ? (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white/95 p-0.5 shadow-md shadow-pink-900/30 border border-pink-500/30">
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
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DE738F] to-[#4A1B28] text-base font-bold text-white shadow-md shadow-pink-900/30">
                {config.logoEmoji || '💅'}
              </div>
            )}
            
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-sm font-semibold tracking-wide text-white truncate" title={config.brandName}>
                  {config.brandName || 'Atelier Nails'}
                </span>
                <span className="text-[10px] text-pink-300/80 truncate" title={config.brandTagline}>
                  {config.brandTagline || 'Recoleta Flagship'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge
                variant="outline"
                className="border-pink-500/30 bg-pink-500/10 text-[9px] font-semibold tracking-wider text-pink-300 uppercase shrink-0 px-1.5 py-0"
              >
                Haute
              </Badge>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  title="Colapsar a Pill Dock"
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="size-4 text-pink-300/80 hover:text-pink-200" />
                </button>
              )}
            </div>
          ) : (
            onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Expandir barra lateral"
                className="size-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="size-3.5 text-pink-300/80 hover:text-pink-200" />
              </button>
            )
          )}
        </div>

        {/* Tier Selector / Switcher */}
        {!isCollapsed ? (
          <div className="px-3 pt-2.5 pb-2 border-b border-white/5 bg-black/20">
            <PlatformTierSwitcher
              currentTier={currentTier}
              onSelectTier={handleTierChange}
              compact
            />
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 px-1 border-b border-white/5 bg-black/20">
            <button
              onClick={handleCycleTier}
              title={`Nivel Actual: ${currentTierInfo.name} (${currentTierInfo.badge}) - Clic para alternar`}
              className={`relative group/tier flex size-9 items-center justify-center rounded-xl border ${currentTierInfo.color.border} ${currentTierInfo.color.bg} text-sm transition-transform active:scale-95 shadow-sm cursor-pointer`}
            >
              <span>{currentTierInfo.icon}</span>
              {/* Floating Tooltip */}
              <div className="pointer-events-none absolute left-full ml-3 hidden group-hover/tier:flex flex-col whitespace-nowrap rounded-xl border border-pink-500/30 bg-[#1C1115] px-3 py-1.5 text-xs text-white shadow-xl shadow-black/90 z-[100] animate-in fade-in zoom-in-95 duration-150">
                <span className="font-bold text-pink-300">Plan {currentTierInfo.name} ({currentTierInfo.badge})</span>
                <span className="text-[10px] text-zinc-400">Clic para cambiar de nivel</span>
              </div>
            </button>
          </div>
        )}

        {/* Navigation Sections (Dynamic Height hugging visible items) */}
        <div className={`overflow-y-auto py-2.5 space-y-3 scrollbar-none h-fit max-h-[calc(100vh-200px)] ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {navigationGroups.map((group) => (
            <div key={group.rubro} className="space-y-1">
              {/* Category Rubro Header (Hidden in collapsed mode or in Bronce for hyper-clean layout) */}
              {!isCollapsed && currentTier !== 'bronce' && (
                <div className="px-3 pb-0.5 text-[9px] font-bold tracking-widest text-pink-200/50 uppercase">
                  {group.rubro}
                </div>
              )}

              {/* Items in Rubro */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  
                  if (isCollapsed) {
                    // Collapsed Icon Button with Floating Luxury Tooltip
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectSection(item.id);
                          if (isMobileOpen) onCloseMobile();
                        }}
                        className={`relative group/dock flex size-10 w-full items-center justify-center rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-500/30 to-pink-500/10 text-pink-300 border border-pink-500/40 shadow-sm shadow-pink-900/30 font-semibold'
                            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                        }`}
                      >
                        <span className={`transition-colors ${isActive ? 'text-pink-400 scale-110' : 'text-zinc-400 group-hover/dock:text-zinc-200'}`}>
                          {item.icon}
                        </span>

                        {/* Red Ping Indicator for Pending Appointments */}
                        {item.id === 'calendar' && pendingAppointmentsCount > 0 && (
                          <span className="absolute top-1 right-1 flex size-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full size-2.5 bg-rose-500" />
                          </span>
                        )}

                        {/* Floating Tooltip in Collapsed Mode */}
                        <div className="pointer-events-none absolute left-full ml-3.5 hidden group-hover/dock:flex items-center gap-2 whitespace-nowrap rounded-xl border border-pink-500/30 bg-[#1C1115] px-3 py-1.5 text-xs font-semibold text-white shadow-2xl shadow-black/95 z-[100] animate-in fade-in zoom-in-95 duration-150">
                          <span>{item.label}</span>
                          {item.id === 'calendar' && pendingAppointmentsCount > 0 && (
                            <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-xs">
                              {pendingAppointmentsCount} PENDIENTE{pendingAppointmentsCount > 1 ? 'S' : ''}
                            </span>
                          )}
                          {item.badge && item.id !== 'calendar' && (
                            <Badge variant={item.badgeVariant} className="text-[9px] px-1 py-0 font-normal">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  }

                  // Expanded Mode
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSection(item.id);
                        if (isMobileOpen) onCloseMobile();
                      }}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
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
        <div className={`border-t border-white/10 bg-[#0F080B] lg:rounded-b-[28px] ${isCollapsed ? 'p-2 space-y-2' : 'p-3 space-y-3'}`}>
          {/* Quick External Route Links */}
          {!isCollapsed ? (
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
          ) : (
            <div className="flex flex-col gap-1 items-center">
              <Link
                to="/"
                title="Ir a Web Pública"
                className="relative group/link flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <Globe className="size-3.5 text-pink-400" />
                <div className="pointer-events-none absolute left-full ml-3 hidden group-hover/link:flex whitespace-nowrap rounded-lg border border-pink-500/30 bg-[#1C1115] px-2.5 py-1 text-[11px] text-white shadow-xl z-[100]">
                  Web Pública
                </div>
              </Link>
              <Link
                to="/pwa"
                title="Ir a Portal PWA"
                className="relative group/pwa flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <Smartphone className="size-3.5 text-pink-400" />
                <div className="pointer-events-none absolute left-full ml-3 hidden group-hover/pwa:flex whitespace-nowrap rounded-lg border border-pink-500/30 bg-[#1C1115] px-2.5 py-1 text-[11px] text-white shadow-xl z-[100]">
                  Portal PWA
                </div>
              </Link>
            </div>
          )}

          <Separator className="bg-white/10" />

          {/* User Profile Card & Supabase Status */}
          {!isCollapsed ? (
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
                <div
                  className="flex size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"
                  title="Supabase PostgreSQL Live Sync Conectado"
                />
                <button
                  onClick={() => logout()}
                  title="Cerrar Sesión de Staff"
                  className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="relative group/user cursor-pointer">
                <Avatar className="size-8 border border-pink-400/40">
                  <AvatarFallback className="bg-gradient-to-br from-pink-900 to-zinc-900 text-xs font-bold text-pink-200">
                    {user?.user_metadata?.full_name ? user.user_metadata.full_name.slice(0, 2).toUpperCase() : 'DB'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border border-black shadow-[0_0_6px_#10B981]"
                  title="Online"
                />
                <div className="pointer-events-none absolute left-full ml-3 hidden group-hover/user:flex flex-col whitespace-nowrap rounded-lg border border-pink-500/30 bg-[#1C1115] px-2.5 py-1 text-[11px] text-white shadow-xl z-[100]">
                  <span className="font-semibold">{user?.user_metadata?.full_name || 'Directora Belcalis'}</span>
                  <span className="text-[10px] text-pink-400">{user?.email || 'admin@belcalisnails.com.ar'}</span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                title="Cerrar Sesión"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
