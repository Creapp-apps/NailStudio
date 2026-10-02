export type PlatformTier = 'bronce' | 'silver' | 'oro';

export type BackofficeSectionId =
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
  | 'settings'
  | 'integrations';

export interface TierDefinition {
  id: PlatformTier;
  name: string;
  badge: string;
  tagline: string;
  icon: string;
  targetAudience: string;
  allowedSections: BackofficeSectionId[];
  color: {
    text: string;
    bg: string;
    border: string;
    gradient: string;
    icon: string;
  };
}

export const PLATFORM_TIERS: Record<PlatformTier, TierDefinition> = {
  bronce: {
    id: 'bronce',
    name: 'Bronce',
    badge: 'Starter',
    tagline: 'Solo Manicurista',
    icon: '🥉',
    targetAudience: 'Profesionales individuales independientes',
    allowedSections: [
      'calendar',
      'crm',
      'settings',
      'web_studio'
    ],
    color: {
      text: '#D97706',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      gradient: 'from-[#CD7F32] to-[#A0522D]',
      icon: '🥉'
    }
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    badge: 'Pro Growth',
    tagline: 'Estudio en Crecimiento',
    icon: '🥈',
    targetAudience: 'Estudios con gestión de stock, caja y fidelización',
    allowedSections: [
      'calendar',
      'crm',
      'settings',
      'web_studio',
      'health',
      'inventory',
      'loyalty',
      'finances'
    ],
    color: {
      text: '#94A3B8',
      bg: 'bg-slate-500/15',
      border: 'border-slate-400/30',
      gradient: 'from-[#C0C0C0] to-[#708090]',
      icon: '🥈'
    }
  },
  oro: {
    id: 'oro',
    name: 'Oro',
    badge: 'Luxury Suite',
    tagline: 'Atelier Flagship',
    icon: '👑',
    targetAudience: 'Salones integrales, multi-mesa, staff y WhatsApp bot',
    allowedSections: [
      'calendar',
      'crm',
      'settings',
      'web_studio',
      'health',
      'inventory',
      'loyalty',
      'finances',
      'waitlist',
      'orders',
      'automations',
      'commissions',
      'staff',
      'integrations'
    ],
    color: {
      text: '#EAB308',
      bg: 'bg-yellow-500/15',
      border: 'border-yellow-500/30',
      gradient: 'from-[#E5C158] via-[#DE738F] to-[#C45774]',
      icon: '👑'
    }
  }
};
