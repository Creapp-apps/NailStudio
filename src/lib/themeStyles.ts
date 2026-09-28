import { WebCustomizationConfig } from '../types/webConfig';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  primaryRgb: string;
  secondaryRgb: string;
  accentRgb: string;
  bgApp: string;
  bgSurface: string;
  bgCard: string;
  bgCardSubtle: string;
  bgCardHover: string;
  borderSubtle: string;
  borderStrong: string;
  borderFocus: string;
  heroGradient: string;
  marqueeBg: string;
  statementBg: string;
  subnavBg: string;
  buttonGradient: string;
  buttonShadow: string;
  orb1Rgb: string;
  orb2Rgb: string;
  orb3Rgb: string;
  stardustRgb: string;
}

export const hexToRgb = (hex: string, defaultRgb = '222, 115, 143'): string => {
  if (!hex) return defaultRgb;
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return `${r}, ${g}, ${b}`;
    }
  }
  return defaultRgb;
};

// Preset detailed atmosphere definitions
interface AtmosphereDef {
  bgApp: string;
  bgCard: string;
  bgCardSubtle: string;
  bgCardHover: string;
  orb1Rgb: string;
  orb2Rgb: string;
  orb3Rgb: string;
  stardustRgb: string;
}

const PRESET_ATMOSPHERES: Record<string, AtmosphereDef> = {
  rose_quartz: {
    bgApp: '#FFF7FA',
    bgCard: '#FFF1F5',
    bgCardSubtle: '#FFF9FB',
    bgCardHover: '#FEE8EF',
    orb1Rgb: '255, 185, 208',
    orb2Rgb: '255, 235, 205',
    orb3Rgb: '235, 210, 255',
    stardustRgb: '222, 115, 143'
  },
  dark_espresso: {
    bgApp: '#FAF6F0',
    bgCard: '#F4ECE1',
    bgCardSubtle: '#FAF4EC',
    bgCardHover: '#EBDDCB',
    orb1Rgb: '190, 145, 115',
    orb2Rgb: '220, 185, 130',
    orb3Rgb: '140, 95, 65',
    stardustRgb: '156, 102, 68'
  },
  noir_gold: {
    bgApp: '#F8F3F5',
    bgCard: '#F2E6E9',
    bgCardSubtle: '#FAF2F4',
    bgCardHover: '#E8D5DA',
    orb1Rgb: '210, 90, 120',
    orb2Rgb: '225, 190, 160',
    orb3Rgb: '139, 46, 72',
    stardustRgb: '184, 80, 108'
  },
  burgundy: {
    bgApp: '#FAF4F2',
    bgCard: '#F5E8E4',
    bgCardSubtle: '#FDF7F5',
    bgCardHover: '#ECD7D1',
    orb1Rgb: '180, 40, 70',
    orb2Rgb: '230, 194, 128',
    orb3Rgb: '128, 0, 32',
    stardustRgb: '128, 0, 32'
  },
  lilac: {
    bgApp: '#F6F4FC',
    bgCard: '#EFEBF9',
    bgCardSubtle: '#FAF8FE',
    bgCardHover: '#E2DAF4',
    orb1Rgb: '170, 130, 230',
    orb2Rgb: '195, 195, 225',
    orb3Rgb: '120, 80, 185',
    stardustRgb: '155, 114, 207'
  }
};

export const getThemeFromConfig = (config: Partial<WebCustomizationConfig>): ThemeColors => {
  const primary = config.primaryColor || '#DE738F';
  const secondary = config.secondaryColor || '#C45774';
  const accent = config.accentGold || '#E0C89E';

  const primaryRgb = hexToRgb(primary, '222, 115, 143');
  const secondaryRgb = hexToRgb(secondary, '196, 87, 116');
  const accentRgb = hexToRgb(accent, '224, 200, 158');

  // Detect atmosphere based on preset or primary color hue
  let atmosphere: AtmosphereDef = PRESET_ATMOSPHERES.rose_quartz;

  if (config.themePreset && PRESET_ATMOSPHERES[config.themePreset]) {
    atmosphere = PRESET_ATMOSPHERES[config.themePreset];
  } else {
    // Dynamic fallback based on color RGB values
    const [r, g, b] = primaryRgb.split(',').map(s => parseInt(s.trim(), 10));
    if (b > g && b > 140 && r > 100) {
      atmosphere = PRESET_ATMOSPHERES.lilac;
    } else if (r > 100 && g > 55 && b < 85) {
      atmosphere = PRESET_ATMOSPHERES.dark_espresso;
    } else if (r > 90 && g < 40 && b < 60) {
      atmosphere = PRESET_ATMOSPHERES.burgundy;
    } else if (r > 130 && g < 75 && b < 110) {
      atmosphere = PRESET_ATMOSPHERES.noir_gold;
    }
  }

  const { bgApp, bgCard, bgCardSubtle, bgCardHover, orb1Rgb, orb2Rgb, orb3Rgb, stardustRgb } = atmosphere;

  return {
    primary,
    secondary,
    accent,
    primaryRgb,
    secondaryRgb,
    accentRgb,
    bgApp,
    bgSurface: '#FFFFFF',
    bgCard,
    bgCardSubtle,
    bgCardHover,
    borderSubtle: `rgba(${primaryRgb}, 0.18)`,
    borderStrong: `rgba(${primaryRgb}, 0.35)`,
    borderFocus: primary,
    heroGradient: `radial-gradient(circle at 75% 25%, rgba(${primaryRgb}, 0.22) 0%, rgba(${secondaryRgb}, 0.08) 45%, ${bgApp} 100%)`,
    marqueeBg: `linear-gradient(90deg, rgba(${primaryRgb}, 0.12) 0%, rgba(${accentRgb}, 0.22) 50%, rgba(${primaryRgb}, 0.12) 100%)`,
    statementBg: `linear-gradient(135deg, rgba(${primaryRgb}, 0.08) 0%, rgba(${accentRgb}, 0.16) 100%)`,
    subnavBg: `rgba(255, 255, 255, 0.94)`,
    buttonGradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
    buttonShadow: `0 8px 24px rgba(${primaryRgb}, 0.35)`,
    orb1Rgb,
    orb2Rgb,
    orb3Rgb,
    stardustRgb
  };
};
