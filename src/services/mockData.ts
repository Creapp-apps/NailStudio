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

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'cli-1',
    name: 'Lucía Fernández',
    phone: '+54 9 11 4522-8901',
    email: 'lucia.fernandez@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    nailPlateCondition: 'thin_weak',
    allergiesHema: false,
    lampHeatSensitivity: 'medium',
    favoriteColors: ['#E6C2BF (Nude Rose)', '#C4977E (Caramel)', '#FFFFFF (French White)'],
    technicianNotes: 'Le gusta forma almendra corta. Suele tener levantamiento leve en índice derecho por uso de teclado. Recomendar base Rubber niveladora densa.',
    pointsBalance: 1250,
    tier: 'VIP Haute',
    referralCode: 'LUCIA-NAILS',
    totalVisits: 8,
    lastVisitDate: '2026-09-08',
    setsHistory: [
      {
        id: 'hist-1',
        date: '2026-09-08',
        serviceName: 'Kapping Gel Fortalecedor',
        nailArtTierName: 'Nivel 2: Glazed Donut Cromo',
        techName: 'Sofía Valenzuela',
        photoUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
        notes: 'Excelente adherencia. Se aplicó primer sin ácido.',
        rating: 5
      },
      {
        id: 'hist-2',
        date: '2026-08-16',
        serviceName: 'Kapping Gel Fortalecedor',
        nailArtTierName: 'Nivel 1: Micro French',
        techName: 'Valentina Rossi',
        photoUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80',
        notes: 'Crecimiento de 2mm impecable sin quiebres.',
        rating: 5
      }
    ]
  },
  {
    id: 'cli-2',
    name: 'Micaela Gómez',
    phone: '+54 9 11 5821-3312',
    email: 'mica.gomez@hotmail.com',
    nailPlateCondition: 'healthy',
    allergiesHema: false,
    lampHeatSensitivity: 'low',
    favoriteColors: ['#1A1A1A (Vampy Black)', '#800020 (Burgundy Chic)'],
    technicianNotes: 'Forma cuadrada recta perfecta. Prefiere colores oscuros invernales.',
    pointsBalance: 600,
    tier: 'Gold',
    referralCode: 'MICA-GLAM',
    totalVisits: 4,
    lastVisitDate: '2026-09-12',
    setsHistory: [
      {
        id: 'hist-3',
        date: '2026-09-12',
        serviceName: 'Soft Gel Extensions',
        nailArtTierName: 'Nivel 0: Liso Minimal',
        techName: 'Camila Méndez',
        photoUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&q=80',
        notes: 'Largo número 3. Retiro en 20 días.',
        rating: 5
      }
    ]
  },
  {
    id: 'cli-3',
    name: 'Carolina Varela',
    phone: '+54 9 11 3901-7744',
    email: 'caro.varela@outlook.com',
    nailPlateCondition: 'onychophagy',
    allergiesHema: true, // ALERGIA DETECTADA!
    lampHeatSensitivity: 'high',
    favoriteColors: ['#F3EBE1 (Milky Nude)', '#F5DFD5 (Soft Peach)'],
    technicianNotes: '⚠️ ATENCIÓN: Alérgica al HEMA. Usar exclusivamente línea hipoalergénica HEMA-FREE. Gran sensibilidad al calor en cabina; curar en modo Low Heat.',
    pointsBalance: 350,
    tier: 'Silver',
    referralCode: 'CARO-GLOW',
    totalVisits: 2,
    lastVisitDate: '2026-09-20',
    setsHistory: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    clientName: 'Lucía Fernández',
    clientPhone: '+54 9 11 4522-8901',
    clientEmail: 'lucia.fernandez@gmail.com',
    techId: 'tech-1',
    serviceId: 'srv-kapping',
    removalId: 'own_studio',
    nailArtTierId: 'art-2',
    totalDurationMin: 120, // 75 + 15 + 30
    totalPrice: 27000,
    depositAmount: 5000,
    depositPaid: true,
    scheduledDate: '2026-09-28',
    scheduledTime: '10:00',
    status: 'confirmed',
    notes: 'Service de Kapping con nuevo diseño cromo perlado.',
    createdAt: '2026-09-25T14:30:00Z'
  },
  {
    id: 'apt-102',
    clientName: 'Micaela Gómez',
    clientPhone: '+54 9 11 5821-3312',
    clientEmail: 'mica.gomez@hotmail.com',
    techId: 'tech-2',
    serviceId: 'srv-semipermanente',
    removalId: 'none',
    nailArtTierId: 'art-1',
    totalDurationMin: 75, // 60 + 0 + 15
    totalPrice: 17000,
    depositAmount: 5000,
    depositPaid: true,
    scheduledDate: '2026-09-28',
    scheduledTime: '11:30',
    status: 'in_progress',
    notes: 'Micro french vino tinto.',
    createdAt: '2026-09-26T09:15:00Z'
  },
  {
    id: 'apt-103',
    clientName: 'Carolina Varela',
    clientPhone: '+54 9 11 3901-7744',
    clientEmail: 'caro.varela@outlook.com',
    techId: 'tech-1',
    serviceId: 'srv-kapping',
    removalId: 'none',
    nailArtTierId: 'art-0',
    totalDurationMin: 75,
    totalPrice: 18500,
    depositAmount: 5000,
    depositPaid: true,
    scheduledDate: '2026-09-28',
    scheduledTime: '15:00',
    status: 'confirmed',
    notes: 'Recordar esmaltes HEMA-Free y modo baja temperatura.',
    createdAt: '2026-09-27T10:00:00Z'
  },
  {
    id: 'apt-104',
    clientName: 'Daniela Beltrán',
    clientPhone: '+54 9 11 6331-4455',
    clientEmail: 'dani.beltran@gmail.com',
    techId: 'tech-3',
    serviceId: 'srv-softgel',
    removalId: 'other_salon',
    nailArtTierId: 'art-3',
    totalDurationMin: 165, // 90 + 30 + 45
    totalPrice: 36000,
    depositAmount: 5000,
    depositPaid: false,
    scheduledDate: '2026-09-28',
    scheduledTime: '16:30',
    status: 'pending_deposit',
    notes: 'Requiere retiro complejo de acrílico de otro local.',
    createdAt: '2026-09-27T18:20:00Z'
  }
];

export const INITIAL_SUPPLIES: SupplyItem[] = [
  {
    id: 'sup-1',
    name: 'Base Rubber Niveladora Transparente (HEMA-Free)',
    category: 'geles_bases',
    currentStock: 3,
    minStockAlert: 5, // ALERTA!
    unit: 'Frascos 15ml',
    brand: 'Kodi Professional'
  },
  {
    id: 'sup-2',
    name: 'Top Coat No Wipe Ultra Gloss',
    category: 'geles_bases',
    currentStock: 8,
    minStockAlert: 4,
    unit: 'Frascos 15ml',
    brand: 'Victoria Vynn'
  },
  {
    id: 'sup-3',
    name: 'Alcohol Isopropílico 99% / Sanitizante',
    category: 'quimicos',
    currentStock: 2,
    minStockAlert: 3, // ALERTA!
    unit: 'Litros',
    brand: 'Atelier Labs'
  },
  {
    id: 'sup-4',
    name: 'Polvo Acrílico Cover Peach 50g',
    category: 'acrilicos',
    currentStock: 6,
    minStockAlert: 2,
    unit: 'Potes',
    brand: 'Mia Secret'
  },
  {
    id: 'sup-5',
    name: 'Limas Descartables Zebra 100/180',
    category: 'descartables',
    currentStock: 24,
    minStockAlert: 20,
    unit: 'Unidades',
    brand: 'OPI Pro'
  },
  {
    id: 'sup-6',
    name: 'Fresas Diamante Flama (Manicura Rusa)',
    category: 'herramientas',
    currentStock: 12,
    minStockAlert: 6,
    unit: 'Unidades',
    brand: 'Staleks Pro'
  }
];
