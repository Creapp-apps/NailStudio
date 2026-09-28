export type ServiceCategory = 'semipermanente' | 'kapping' | 'soft_gel' | 'esculpidas';

export interface NailService {
  id: string;
  title: string;
  category: ServiceCategory;
  basePrice: number;
  baseDurationMin: number;
  description: string;
  badge?: string;
  imageUrl: string;
  recommendedFor: string;
}

export type RemovalType = 'none' | 'own_studio' | 'other_salon';

export interface RemovalOption {
  id: RemovalType;
  label: string;
  description: string;
  additionalPrice: number;
  additionalDurationMin: number;
}

export interface NailArtTier {
  id: string;
  tierLevel: 0 | 1 | 2 | 3;
  name: string;
  price: number;
  additionalDurationMin: number;
  description: string;
  examples: string[];
  sampleImage: string;
}

export interface NailTechnician {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  commissionRate: number; // e.g. 0.50
}

export type AppointmentStatus = 'pending_deposit' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  techId: string;
  serviceId: string;
  removalId: RemovalType;
  nailArtTierId: string;
  totalDurationMin: number;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export type NailPlateCondition = 'healthy' | 'thin_weak' | 'onychophagy' | 'sensitive_lamp';

export interface PastSetRecord {
  id: string;
  date: string;
  serviceName: string;
  nailArtTierName: string;
  techName: string;
  photoUrl: string;
  notes: string;
  rating?: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  nailPlateCondition: NailPlateCondition;
  allergiesHema: boolean;
  lampHeatSensitivity: 'low' | 'medium' | 'high';
  favoriteColors: string[];
  technicianNotes: string;
  pointsBalance: number;
  tier: 'Silver' | 'Gold' | 'VIP Haute';
  referralCode: string;
  referredBy?: string;
  totalVisits: number;
  lastVisitDate: string; // YYYY-MM-DD
  setsHistory: PastSetRecord[];
}

export interface SupplyItem {
  id: string;
  name: string;
  category: 'quimicos' | 'geles_bases' | 'acrilicos' | 'descartables' | 'herramientas';
  currentStock: number;
  minStockAlert: number;
  unit: string;
  brand: string;
}
