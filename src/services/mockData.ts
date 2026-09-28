import { NailService, RemovalOption, NailArtTier, NailTechnician, ClientProfile, Appointment, SupplyItem } from '../types/nailStudio';

export const INITIAL_SERVICES: NailService[] = [
  {
    id: 'srv-kapping',
    title: 'Kapping Gel Fortalecedor (Manicura Rusa)',
    category: 'kapping',
    basePrice: 18500,
    baseDurationMin: 75,
    description: 'Limpieza profunda de cutículas con torno y nivelación con gel Rubber sobre la uña natural para evitar quiebres y permitir que crezca fuerte.',
    badge: 'Más Solicitado',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    recommendedFor: 'Uñas frágiles, quebradizas o personas que buscan crecimiento natural sin extensiones.'
  },
  {
    id: 'srv-semipermanente',
    title: 'Esmaltado Semipermanente Haute Gloss',
    category: 'semipermanente',
    basePrice: 14000,
    baseDurationMin: 60,
    description: 'Manicura combinada y esmaltado de máxima duración con brillo espejo ultra resistente por 21 días.',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    recommendedFor: 'Uñas de base sana que desean color impecable y prolijidad duradera.'
  },
  {
    id: 'srv-softgel',
    title: 'Soft Gel Extensions (Press-On de Gel)',
    category: 'soft_gel',
    basePrice: 22000,
    baseDurationMin: 90,
    description: 'Extensiones de tip de gel completo adheridas con base estructural. Ligeras, flexibles y con apariencia 100% natural.',
    badge: 'Tendencia 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
    recommendedFor: 'Largo instantáneo sin la rigidez del acrílico tradicional.'
  },
  {
    id: 'srv-esculpidas',
    title: 'Esculpidas en Acrílico o Polygel',
    category: 'esculpidas',
    basePrice: 26000,
    baseDurationMin: 110,
    description: 'Arquitectura artesanal con molde para corregir formas ungueales, lograr largos extremos o rescatar uñas mordidas (onicofagia).',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    recommendedFor: 'Estructuras largas, uñas con onicofagia severa o eventos de gala.'
  }
];

export const REMOVAL_OPTIONS: RemovalOption[] = [
  {
    id: 'none',
    label: 'Uñas limpias (Sin retiro previo)',
    description: 'Mis uñas están totalmente al natural.',
    additionalPrice: 0,
    additionalDurationMin: 0
  },
  {
    id: 'own_studio',
    label: 'Retiro de nuestro Atelier (Service habitual)',
    description: 'Tengo material colocado en Atelier Nails & Co.',
    additionalPrice: 2500,
    additionalDurationMin: 15
  },
  {
    id: 'other_salon',
    label: 'Retiro de otro salón o producto desconocido',
    description: 'Requiere remoción cuidadosa para no dañar la lámina ungueal.',
    additionalPrice: 4500,
    additionalDurationMin: 30
  }
];

export const NAIL_ART_TIERS: NailArtTier[] = [
  {
    id: 'art-0',
    tierLevel: 0,
    name: 'Nivel 0: Liso Minimal / Nude Chic',
    price: 0,
    additionalDurationMin: 0,
    description: 'Color pleno, brillo espejo o acabado mate satinado en todas las uñas.',
    examples: ['Esmaltado monocromo', 'Top Matte', 'Leche de coco'],
    sampleImage: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-1',
    tierLevel: 1,
    name: 'Nivel 1: Sutil & Clásico (+15 min)',
    price: 3000,
    additionalDurationMin: 15,
    description: 'Detalles delicados en 2 a 4 uñas o francesita fina contemporánea.',
    examples: ['Francesita clásica / micro-french', 'Glitter degradé', 'Foil dorado sutil', 'Línea orgánica minimal'],
    sampleImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-2',
    tierLevel: 2,
    name: 'Nivel 2: Efectos & Diseño Creativo (+30 min)',
    price: 6000,
    additionalDurationMin: 30,
    description: 'Efectos en tendencia en todas las uñas o nail art a mano alzada en 4+ uñas.',
    examples: ['Cromado Glazed Donut / Espejo', 'Ojo de Gato (Cat Eye magnético)', 'Efecto Mármol / Cuarzo', 'Flores a mano alzada'],
    sampleImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-3',
    tierLevel: 3,
    name: 'Nivel 3: Haute Couture / 3D & Charms (+45 min)',
    price: 9500,
    additionalDurationMin: 45,
    description: 'Arte complejo full set: elementos en relieve 3D, pedrería Swarovski, encapsulados o diseño temático detallado.',
    examples: ['Gemas y cristales 3D', 'Relieves de gel acrílico', 'Encapsulado de pan de oro y glitter', 'Arte ilustrado personalizado'],
    sampleImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'
  }
];

export const NAIL_TECHNICIANS: NailTechnician[] = [
  {
    id: 'tech-1',
    name: 'Sofía Valenzuela',
    role: 'Master Educator & Nail Artist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    specialties: ['Soft Gel', 'Nail Art 3D', 'Cromados'],
    rating: 4.98,
    reviewsCount: 142,
    commissionRate: 0.55
  },
  {
    id: 'tech-2',
    name: 'Valentina Rossi',
    role: 'Especialista en Manicura Rusa & Kapping',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    specialties: ['Kapping Gel', 'Manicura Rusa', 'Recuperación de Uñas'],
    rating: 4.95,
    reviewsCount: 98,
    commissionRate: 0.50
  },
  {
    id: 'tech-3',
    name: 'Camila Méndez',
    role: 'Senior Sculptor & Polygel Tech',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    specialties: ['Esculpidas Acrílico', 'Diseño Francés', 'Cat Eye'],
    rating: 4.92,
    reviewsCount: 87,
    commissionRate: 0.50
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_SUPPLIES: SupplyItem[] = [];

