export interface WhyUsFeatureItem {
  id: number;
  title: string;
  description: string;
  tag: string;
}

export interface ShowcaseWorkItem {
  id: string;
  title: string;
  category: 'kapping' | 'nail_art' | 'soft_gel' | 'rusa' | string;
  imageUrl: string;
  techniqueTag: string;
  description?: string;
  durationDays?: number;
}

export interface WebCustomizationConfig {
  // 1. Identidad & Branding
  brandName: string;
  brandTagline: string;
  badgeText: string;
  logoEmoji: string;
  customLogoUrl: string; // URL o Base64 (DataURL) del logo personal del cliente
  customLogoScale: number; // Escala / Zoom del logo (50 a 250%, default: 100)

  // 2. Colores & Paleta
  primaryColor: string;
  secondaryColor: string;
  accentGold: string;
  themePreset: 'dark_espresso' | 'rose_quartz' | 'noir_gold' | 'burgundy' | 'lilac' | 'porcelain_light' | string;
  glowColor: 'rose_quartz' | 'gold_glamour' | 'emerald_velvet' | 'celestial_silver' | 'custom';
  glowCustomColor: string;
  glowIntensity: number; // 0 to 100

  // 3. Tipografías
  headingFont: 'Italiana' | 'Cinzel' | 'Cormorant Garamond' | 'Playfair Display' | 'Prata';
  bodyFont: 'Plus Jakarta Sans' | 'Inter' | 'Montserrat' | 'Outfit';
  accentFont: 'Cinzel' | 'Italiana' | 'Cormorant Garamond';

  // 4. Efectos Visuales & Motion
  enableAmbientAurora: boolean;
  auroraSpeed: 'slow' | 'medium' | 'fast';
  enableSparkles: boolean;
  sparkleDensity: 'low' | 'medium' | 'high';
  enable3DTilt: boolean;

  // 5. Hero Section
  heroPill: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  heroCardImage: string;
  heroCardBadge: string;
  heroCardTitle: string;
  heroCardSubtitle: string;
  heroCardRating?: string;

  // 5.b Galería de Trabajos Destacados (Work Carousel)
  showcaseBadge: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  showcaseItems: ShowcaseWorkItem[];

  // 6. Cinta de Lujo (Marquee)
  marqueePhrases: string[];

  // 7. Sección ¿Por Qué Elegirnos?
  whyUsTitle: string;
  whyUsFeatures: WhyUsFeatureItem[];

  // 8. Manifiesto & Filosofía
  manifestoBadge: string;
  manifestoTitle: string;
  manifestoQuote: string;
  manifestoText: string;
  manifestoDays: string;
  manifestoMetricLabel: string;

  // 9. Contacto & Redes
  address: string;
  whatsapp: string;
  instagram: string;
  hours: string;
  footerCopyright: string;
}

export const DEFAULT_WEB_CONFIG: WebCustomizationConfig = {
  // Identidad
  brandName: 'Belcalis Nails',
  brandTagline: 'HAUTE MANICURE & ESTUDIO DE ARTE UNGUEAL',
  badgeText: 'ESTUDIO DE ALTA MANICURÍA',
  logoEmoji: '💅',
  customLogoUrl: '',
  customLogoScale: 100,

  // Colores
  primaryColor: '#DE738F',
  secondaryColor: '#C45774',
  accentGold: '#E0C89E',
  themePreset: 'rose_quartz',
  glowColor: 'rose_quartz',
  glowCustomColor: '#DE738F',
  glowIntensity: 65,

  // Tipografías
  headingFont: 'Italiana',
  bodyFont: 'Plus Jakarta Sans',
  accentFont: 'Cinzel',

  // Efectos & Motion
  enableAmbientAurora: true,
  auroraSpeed: 'medium',
  enableSparkles: true,
  sparkleDensity: 'medium',
  enable3DTilt: true,

  // Hero Section
  heroPill: '✦ ESTUDIO EXCLUSIVO DE ALTA MANICURÍA ✦',
  heroTitle: 'ARTE, PRECISIÓN Y ALTA COSTURA PARA TUS UÑAS',
  heroSubtitle: '@ Belcalis Nails Studio • Buenos Aires',
  ctaPrimaryText: 'VER SERVICIOS Y RESERVAR',
  ctaSecondaryText: 'CONSULTAR CON NAIL-BOT IA',
  heroCardImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
  heroCardBadge: 'Tendencia 2026',
  heroCardTitle: 'Arquitectura Soft Gel & Kapping',
  heroCardSubtitle: 'Nivelación Rubber con Manicura Rusa',
  heroCardRating: '',

  // Galería de Trabajos Destacados (Work Carousel)
  showcaseBadge: '✦ OBRAS DE AUTOR & PORTFOLIO ✦',
  showcaseTitle: 'GALERÍA DE TRABAJOS DESTACADOS',
  showcaseSubtitle: 'Explorá nuestras técnicas más solicitadas: arquitectura estructural en Soft Gel, Kapping con Rubber hipoalergénico y Nail Art exclusivo de alta precisión.',
  showcaseItems: [
    {
      id: 'work-1',
      title: 'Glazed Donut & Cromado Perla',
      category: 'nail_art',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      techniqueTag: 'Cromado Espejo',
      description: 'Esmaltado semipermanente blanco translúcido con efecto perlado Aurora y manicuría rusa de corte limpio.',
      durationDays: 21
    },
    {
      id: 'work-2',
      title: 'Kapping Gel Ruso & Almendra',
      category: 'kapping',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      techniqueTag: 'Nivelación Rubber',
      description: 'Refuerzo de uña natural con rubber base biocompatible HEMA-free. Resistencia y flexibilidad extrema.',
      durationDays: 28
    },
    {
      id: 'work-3',
      title: 'Arquitectura Soft Gel Coffin',
      category: 'soft_gel',
      imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
      techniqueTag: 'Soft Gel Tips',
      description: 'Extensiones anatómicas completas adheridas con gel constructivo sin daño a la uña natural.',
      durationDays: 24
    },
    {
      id: 'work-4',
      title: 'Haute Nail Art & Cristales Swarovski',
      category: 'nail_art',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      techniqueTag: 'Cristales & 3D',
      description: 'Diseño de autor con micro-pedrería de corte diamante sellada con gel blindado de alto impacto.',
      durationDays: 21
    },
    {
      id: 'work-5',
      title: 'Manicuría Rusa Combinada & Nude Rosé',
      category: 'rusa',
      imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
      techniqueTag: 'Limpieza de Cutícula',
      description: 'Bolsillo de cutícula pulido a torno con fresas diamantadas y esmaltado bajo cutícula impecable.',
      durationDays: 21
    },
    {
      id: 'work-6',
      title: 'Cat Eye Magnético Velvet',
      category: 'nail_art',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      techniqueTag: 'Cat Eye 5D',
      description: 'Partículas magnéticas orientadas en multidimensión creando un efecto seda aterciopelada y brillante.',
      durationDays: 21
    }
  ],

  // Marquee
  marqueePhrases: [
    'MANICURÍA RUSA COMBINADA',
    'KAPPING CON RUBBER HEMA-FREE',
    'ESCULPIDAS EN POLYGEL',
    'SWAROVSKI CRYSTALS',
    'ESMALTADO INTELIGENTE 21 DÍAS',
    'ARQUITECTURA SOFT GEL'
  ],

  // Por Qué Elegirnos
  whyUsTitle: '¿POR QUÉ ELEGIRNOS?',
  whyUsFeatures: [
    {
      id: 0,
      title: 'TRATAMIENTOS DE AUTOR',
      description: 'Viví una experiencia exclusiva con nuestros tratamientos: manicuría rusa combinada, nivelación con gel Rubber y cuidado profundo de la uña.',
      tag: 'Técnica Rusa'
    },
    {
      id: 1,
      title: 'PRODUCTOS HIPOALERGÉNICOS',
      description: 'Utilizamos exclusivamente productos biocompatibles 100% libres de HEMA para garantizar un acabado impecable, seguro y sin alergias.',
      tag: '100% HEMA-Free'
    },
    {
      id: 2,
      title: 'MANICURISTAS EXPERTAS',
      description: 'Nuestras manicuristas maestras dominan la arquitectura ungueal, el corte milimétrico de cutículas y el diseño a mano alzada de precisión.',
      tag: 'Master Artists'
    },
    {
      id: 3,
      title: 'AMBIENTE BOUTIQUE',
      description: 'Relajate en un ambiente de spa exclusivo, pensado para brindarte tranquilidad, café de especialidad y desconexión absoluta.',
      tag: 'Experiencia Sensorial'
    }
  ],

  // Manifiesto
  manifestoBadge: 'NUESTRA FILOSOFÍA',
  manifestoTitle: 'NO HACEMOS UÑAS EN SERIE. CREAMOS PIEZAS DE ALTA COSTURA.',
  manifestoQuote: '"Cada lámina ungueal es un lienzo que merece salud celular, esterilización médica y diseño impecable."',
  manifestoText: 'Creemos que las uñas son la extensión más visible de tu elegancia personal. Nuestro protocolo combina la precisión milimétrica de la técnica rusa en seco con fórmulas no tóxicas que cuidan la integridad biológica de tus manos.',
  manifestoDays: '21 DÍAS',
  manifestoMetricLabel: 'Duración Intacta Garantizada',

  // Contacto & Footer
  address: 'Av. Alvear 1890, Recoleta, Buenos Aires',
  whatsapp: '+54 9 11 5821-3312',
  instagram: '@ateliernails.ba',
  hours: 'Martes a Sábados: 09:00 a 20:00 hs',
  footerCopyright: '© 2026 Belcalis Nails. Todos los derechos reservados.'
};
