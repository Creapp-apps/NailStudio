import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Save,
  Eye,
  SlidersHorizontal,
  Flame,
  Layers,
  HeartHandshake,
  MessageCircle,
  HelpCircle,
  Plus,
  Trash2,
  Globe,
  UploadCloud,
  ImagePlus,
  X,
  ShieldCheck,
  Clock,
  Award,
  Gem,
  Star,
  UserCheck,
  ZoomIn,
  ZoomOut,
  Crop,
  Link as LinkIcon
} from 'lucide-react';
import { WebCustomizationConfig, DEFAULT_WEB_CONFIG, WhyUsFeatureItem, ShowcaseWorkItem } from '../../types/webConfig';
import { useWebConfig } from '../../hooks/useWebConfig';
import { syncDocumentBrand } from '../../utils/brandSync';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LuxurySelect } from '../common/LuxurySelect';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PublicHeader } from '../navigation/PublicHeader';
import { PublicLanding } from '../public/PublicLanding';
import { IPhoneMockup } from './IPhoneMockup';
import { MacBookMockup } from './MacBookMockup';

type StudioCategory =
  | 'identidad'
  | 'colores'
  | 'tipografias'
  | 'glows'
  | 'hero'
  | 'galeria'
  | 'cinta'
  | 'pilares'
  | 'contacto';

const PILAR_ICON_OPTIONS = [
  { key: 'heart', label: 'Atención', icon: HeartHandshake },
  { key: 'palette', label: 'Colorimetría', icon: Palette },
  { key: 'award', label: 'Técnicas', icon: Award },
  { key: 'shield', label: 'Durabilidad', icon: ShieldCheck },
  { key: 'sparkles', label: 'Brillo / Lujo', icon: Sparkles },
  { key: 'diamond', label: 'Alta Gama', icon: Gem },
  { key: 'clock', label: 'Puntualidad', icon: Clock },
  { key: 'star', label: 'Calidad VIP', icon: Star },
  { key: 'user', label: 'Personal', icon: UserCheck }
];

export const WebStudioView: React.FC = () => {
  const { config, updateConfig, resetConfig } = useWebConfig();
  const [draftConfig, setDraftConfig] = useState<WebCustomizationConfig>({ ...config });
  const [activeCategory, setActiveCategory] = useState<StudioCategory>('identidad');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  const desktopIframeRef = useRef<HTMLIFrameElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const [logoInputTab, setLogoInputTab] = useState<'upload' | 'url'>(
    draftConfig.customLogoUrl?.startsWith('http') ? 'url' : 'upload'
  );
  const [logoUrlInputValue, setLogoUrlInputValue] = useState(
    draftConfig.customLogoUrl?.startsWith('http') ? draftConfig.customLogoUrl : ''
  );

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná un archivo de imagen válido (PNG, SVG, JPG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('El archivo no debe superar los 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleFieldChange('customLogoUrl', result);
        setLogoUrlInputValue('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Hero Card Image Upload & Drag-and-Drop state
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [heroImageTab, setHeroImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [heroImageUrlInputValue, setHeroImageUrlInputValue] = useState(
    draftConfig.heroCardImage?.startsWith('http') ? draftConfig.heroCardImage : ''
  );
  const [isDraggingHeroImg, setIsDraggingHeroImg] = useState(false);

  const processHeroImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná un archivo de imagen válido (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleFieldChange('heroCardImage', result);
        setHeroImageUrlInputValue('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processHeroImageFile(file);
    }
  };

  const handleHeroDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingHeroImg(true);
  };

  const handleHeroDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingHeroImg(true);
  };

  const handleHeroDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingHeroImg(false);
  };

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingHeroImg(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processHeroImageFile(file);
    }
  };

  // Broadcast real-time config updates to the preview iframes and document title/tab
  useEffect(() => {
    syncDocumentBrand(draftConfig);

    const payload = {
      type: 'STUDIO_CONFIG_UPDATE',
      config: draftConfig
    };
    if (mobileIframeRef.current?.contentWindow) {
      mobileIframeRef.current.contentWindow.postMessage(payload, '*');
    }
    if (desktopIframeRef.current?.contentWindow) {
      desktopIframeRef.current.contentWindow.postMessage(payload, '*');
    }
  }, [draftConfig]);

  // Quick Luxury Palettes
  const palettePresets = [
    {
      name: 'Rose Quartz & Gold',
      primary: '#DE738F',
      secondary: '#C45774',
      accent: '#E0C89E',
      theme: 'rose_quartz' as const,
      glow: 'rose_quartz' as const
    },
    {
      name: 'Espresso & Champagne',
      primary: '#9C6644',
      secondary: '#5C3826',
      accent: '#D4AF37',
      theme: 'dark_espresso' as const,
      glow: 'gold_glamour' as const
    },
    {
      name: 'Noir Glamour & Velvet',
      primary: '#B83A58',
      secondary: '#6B1D30',
      accent: '#DDB892',
      theme: 'noir_gold' as const,
      glow: 'rose_quartz' as const
    },
    {
      name: 'Burgundy & Gold Chic',
      primary: '#800020',
      secondary: '#4A0213',
      accent: '#E6C280',
      theme: 'burgundy' as const,
      glow: 'gold_glamour' as const
    },
    {
      name: 'Lilac Dream & Chrome',
      primary: '#8A58DC',
      secondary: '#5E2FB8',
      accent: '#C0C2DE',
      theme: 'lilac' as const,
      glow: 'celestial_silver' as const
    }
  ];

  // Quick Curated Nail Art Photography Presets
  const imagePresets = [
    {
      title: 'Kapping Gel Ruso & Almendra',
      url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Glazed Donut & Cromado Perla',
      url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Soft Gel Minimal Chic',
      url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Esculpidas Cristales Swarovski',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleFieldChange = <K extends keyof WebCustomizationConfig>(key: K, value: WebCustomizationConfig[K]) => {
    setDraftConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleWorkImageUpload = (workId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná un archivo de imagen válido (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen no debe superar los 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        updateWorkItem(workId, { imageUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const updateWorkItem = (id: string, partial: Partial<ShowcaseWorkItem>) => {
    const current = draftConfig.showcaseItems || DEFAULT_WEB_CONFIG.showcaseItems;
    const updated = current.map(item =>
      item.id === id ? { ...item, ...partial } : item
    );
    handleFieldChange('showcaseItems', updated);
  };

  const removeWorkItem = (id: string) => {
    const current = draftConfig.showcaseItems || DEFAULT_WEB_CONFIG.showcaseItems;
    const updated = current.filter(item => item.id !== id);
    handleFieldChange('showcaseItems', updated);
  };

  const addWorkItem = () => {
    const current = draftConfig.showcaseItems || DEFAULT_WEB_CONFIG.showcaseItems;
    const newItem: ShowcaseWorkItem = {
      id: `work-${Date.now()}`,
      title: 'Nuevo Set de Alta Manicuría',
      category: 'kapping',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      techniqueTag: 'Kapping Rubber',
      description: 'Nivelación con gel hipoalergénico y acabado brillante de 21 días.',
      badgeInfo: 'Duración intacta 21+ días • HEMA-Free',
      durationDays: 21,
      estimatedTime: '~60 - 80m',
      formula: '100% Segura',
      maintenance: '21 a 28 días'
    };
    handleFieldChange('showcaseItems', [...current, newItem]);
  };

  const resetShowcasePresets = () => {
    handleFieldChange('showcaseItems', DEFAULT_WEB_CONFIG.showcaseItems);
  };

  const addPilarItem = () => {
    const current = draftConfig.whyUsFeatures || DEFAULT_WEB_CONFIG.whyUsFeatures;
    const nextId = current.length > 0 ? Math.max(...current.map(c => Number(c.id) || 0)) + 1 : 1;
    const newItem: WhyUsFeatureItem = {
      id: nextId,
      title: 'NUEVO PILAR EXCLUSIVO',
      description: 'Detalle o beneficio diferencial que tus clientas disfrutarán en su experiencia.',
      tag: 'EXCLUSIVIDAD',
      icon: 'sparkles'
    };
    handleFieldChange('whyUsFeatures', [...current, newItem]);
  };

  const removePilarItem = (id: string | number) => {
    const current = draftConfig.whyUsFeatures || DEFAULT_WEB_CONFIG.whyUsFeatures;
    if (current.length <= 1) return;
    const updated = current.filter(item => item.id !== id);
    handleFieldChange('whyUsFeatures', updated);
  };

  const updatePilarItem = (index: number, partial: Partial<WhyUsFeatureItem>) => {
    const current = [...(draftConfig.whyUsFeatures || DEFAULT_WEB_CONFIG.whyUsFeatures)];
    current[index] = { ...current[index], ...partial };
    handleFieldChange('whyUsFeatures', current);
  };

  const resetPilarPresets = () => {
    handleFieldChange('whyUsFeatures', DEFAULT_WEB_CONFIG.whyUsFeatures);
  };

  const handleSave = () => {
    updateConfig(draftConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2800);
  };

  const handleReset = () => {
    if (confirm('¿Deseas restablecer todos los textos, colores y estética al diseño editorial original?')) {
      const def = resetConfig();
      setDraftConfig({ ...def });
      setLogoUrlInputValue('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Studio Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground font-serif">
              Personalización de la Web & Editor en Vivo
            </h1>
            <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/20 text-[10px] font-semibold">
              Live Preview 0ms
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Ajustá la identidad, tipografías, colores, portadas 3D y manifiesto editorial con vista previa en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs gap-1 py-1">
              <CheckCircle2 className="size-3.5" />
              <span>¡Cambios Guardados!</span>
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/', '_blank')}
            className="text-xs gap-1.5"
          >
            <ExternalLink className="size-3.5 text-pink-500" />
            <span className="hidden sm:inline">Ver Web Pública</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white hover:opacity-90 shadow-sm text-xs font-semibold gap-1.5"
          >
            <Save className="size-3.5" />
            <span>Guardar Cambios</span>
          </Button>
        </div>
      </div>

      {/* Main Studio View: Left Sub-Sidebar + Middle Form Controls + Right Real-Time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Sub-Sidebar: Categories of Web Components (Cols 1-3 on mobile, 1-2 on desktop preview) */}
        <div className={`${previewDevice === 'desktop' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-1.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card p-3 shadow-md`}>
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center justify-between">
            <span>Secciones del Sitio</span>
            <span className="text-[9px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">8 Módulos</span>
          </div>

          <button
            onClick={() => setActiveCategory('identidad')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'identidad'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="size-4 text-pink-500" />
              <span>Identidad & Marca</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-normal">Logo / Naming</span>
          </button>

          <button
            onClick={() => setActiveCategory('colores')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'colores'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Palette className="size-4 text-amber-500" />
              <span>Colores & Paletas</span>
            </div>
            <div
              className="size-3.5 rounded-full border border-black/10 ring-2 ring-rose-300/40"
              style={{ background: draftConfig.primaryColor }}
            />
          </button>

          <button
            onClick={() => setActiveCategory('tipografias')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'tipografias'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Type className="size-4 text-purple-500" />
              <span>Tipografías & Fuentes</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{draftConfig.headingFont}</span>
          </button>

          <button
            onClick={() => setActiveCategory('glows')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'glows'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-pink-400" />
              <span>Fondo, Glows & Motion</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{draftConfig.glowIntensity}%</span>
          </button>

          <button
            onClick={() => setActiveCategory('hero')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'hero'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layout className="size-4 text-rose-500" />
              <span>Hero & Portada 3D</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Principal</span>
          </button>

          <button
            onClick={() => setActiveCategory('galeria')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'galeria'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="size-4 text-pink-500" />
              <span>Galería de Trabajos</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{(draftConfig.showcaseItems || []).length} fotos</span>
          </button>

          <button
            onClick={() => setActiveCategory('cinta')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'cinta'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="size-4 text-indigo-500" />
              <span>Cinta & Manifiesto</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Marquee</span>
          </button>

          <button
            onClick={() => setActiveCategory('pilares')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'pilares'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="size-4 text-emerald-500" />
              <span>¿Por Qué Elegirnos?</span>
            </div>
            <span className="text-[10px] text-muted-foreground">4 Pilares</span>
          </button>

          <button
            onClick={() => setActiveCategory('contacto')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeCategory === 'contacto'
                ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30 shadow-xs'
                : 'text-muted-foreground hover:bg-rose-500/5 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="size-4 text-emerald-600" />
              <span>Contacto & Redes</span>
            </div>
            <span className="text-[10px] text-muted-foreground">WhatsApp / IG</span>
          </button>
        </div>

        {/* Middle Column: Active Category Controls (Cols 4-7) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card shadow-xl overflow-hidden">
            {/* Ambient Haute Couture Top Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#DE738F] via-[#E0C89E] to-[#C45774]" />

            {/* Haute Couture Card Header */}
            <div className="border-b border-rose-100/80 dark:border-rose-900/30 bg-gradient-to-b from-rose-500/[0.04] to-transparent px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 border border-rose-200/70 shadow-xs">
                    {activeCategory === 'identidad' && <Globe className="size-4 text-[#DE738F]" />}
                    {activeCategory === 'colores' && <Palette className="size-4 text-amber-500" />}
                    {activeCategory === 'tipografias' && <Type className="size-4 text-purple-500" />}
                    {activeCategory === 'glows' && <Sparkles className="size-4 text-pink-400" />}
                    {activeCategory === 'hero' && <Layout className="size-4 text-rose-500" />}
                    {activeCategory === 'galeria' && <ImageIcon className="size-4 text-pink-500" />}
                    {activeCategory === 'cinta' && <SlidersHorizontal className="size-4 text-indigo-500" />}
                    {activeCategory === 'pilares' && <HeartHandshake className="size-4 text-emerald-500" />}
                    {activeCategory === 'contacto' && <MessageCircle className="size-4 text-emerald-600" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground font-serif tracking-tight">
                      {activeCategory === 'identidad' && 'Identidad & Naming del Atelier'}
                      {activeCategory === 'colores' && 'Paleta Cromática & Estilo de Marca'}
                      {activeCategory === 'tipografias' && 'Tipografías Editoriales & Lectura'}
                      {activeCategory === 'glows' && 'Fondo Sensorial, Glows & Efectos'}
                      {activeCategory === 'hero' && 'Portada de Inicio & Tarjeta 3D'}
                      {activeCategory === 'galeria' && 'Galería de Trabajos Destacados'}
                      {activeCategory === 'cinta' && 'Cinta Continua & Manifiesto'}
                      {activeCategory === 'pilares' && 'Pilares de Diferenciación'}
                      {activeCategory === 'contacto' && 'Redes, WhatsApp & Ubicación'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Personalización directa en tiempo real</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>En vivo</span>
                </div>
              </div>
            </div>

            {/* Haute Couture Card Content Body */}
            <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
              
              {/* 1. IDENTIDAD */}
              {activeCategory === 'identidad' && (
                <div className="space-y-4 text-xs">
                  {/* Brand Name Input */}
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-foreground/80">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3 text-[#DE738F]" />
                        Nombre Comercial del Atelier
                      </span>
                      <span className="text-[10px] lowercase font-normal text-muted-foreground">cabecera y footer</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={draftConfig.brandName}
                        onChange={e => handleFieldChange('brandName', e.target.value)}
                        placeholder="Ej: Atelier Nails & Co."
                        className="w-full rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/15"
                      />
                    </div>
                  </div>

                  {/* Brand Tagline */}
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-foreground/80">
                      <span className="flex items-center gap-1.5">
                        <Type className="size-3 text-[#DE738F]" />
                        Eslogan / Subtítulo de Marca
                      </span>
                      <span className="text-[10px] lowercase font-normal text-muted-foreground">manifiesto</span>
                    </label>
                    <input
                      type="text"
                      value={draftConfig.brandTagline}
                      onChange={e => handleFieldChange('brandTagline', e.target.value)}
                      placeholder="Ej: HAUTE MANICURE & ESTUDIO DE ARTE UNGUEAL"
                      className="w-full rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/15"
                    />
                  </div>

                  {/* Identidad Visual: Logo Personal & Sello de Respaldo */}
                  <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-[#FFF9FB] dark:bg-card p-4 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-2.5">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="size-4 text-[#DE738F]" />
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider font-serif">
                          Logo & Sello de Marca
                        </span>
                      </div>
                      {draftConfig.customLogoUrl ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="size-3 text-emerald-500" />
                          Logo personal activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                          <Sparkles className="size-3 text-[#DE738F]" />
                          Sello predefinido activo
                        </span>
                      )}
                    </div>

                    {/* Live Badge Preview */}
                    <div className="flex items-center gap-3.5 bg-white dark:bg-card p-3 rounded-xl border border-rose-200/80 dark:border-rose-900/40 shadow-xs">
                      <div className="relative shrink-0">
                        {draftConfig.customLogoUrl ? (
                          <div className="size-14 rounded-full overflow-hidden bg-white shadow-md border-2 border-white ring-2 ring-emerald-500/30 flex items-center justify-center p-1">
                            <img
                              src={draftConfig.customLogoUrl}
                              alt="Logo Personal Atelier"
                              className="size-full object-contain"
                              style={{
                                transform: `scale(${(draftConfig.customLogoScale || 100) / 100})`,
                                transition: 'transform 0.1s ease'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DE738F] via-[#C45774] to-[#8C3A50] text-3xl shadow-md ring-4 ring-rose-200/40 select-none">
                            {draftConfig.logoEmoji}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-background flex items-center justify-center text-[10px] bg-card shadow-xs">
                          {draftConfig.customLogoUrl ? '✨' : '🎨'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-foreground truncate">
                          {draftConfig.customLogoUrl ? 'Logo Propio del Atelier' : 'Sello de Alta Costura'}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                          {draftConfig.customLogoUrl
                            ? 'Este logo se inyecta directamente en la barra de navegación y pie de página de la web.'
                            : 'Al no tener un logo personal cargado, se utiliza este sello editorial como distintivo de marca.'}
                        </p>
                      </div>
                    </div>

                    {/* VISOR DE PERFIL CIRCULAR & ENCUADRE DE LOGO (ZOOM IN / OUT) */}
                    {draftConfig.customLogoUrl && (
                      <div className="rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-background/80 p-4 space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                            <Crop className="size-3.5 text-[#DE738F]" />
                            <span>Visor de Perfil Circular & Encuadre</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-rose-600 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                            {draftConfig.customLogoScale || 100}% Zoom
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Ajustá el zoom con el control deslizante para que tu logo encaje con precisión dentro del visor circular, tal como se apreciará en la cabecera y footer de tu web:
                        </p>

                        {/* Circular Viewfinder Window */}
                        <div className="flex flex-col items-center justify-center py-2">
                          <div className="relative size-44 rounded-2xl bg-[#140D10] border border-rose-200/30 shadow-inner flex items-center justify-center overflow-hidden">
                            {/* Ambient checkered pattern for transparent PNGs */}
                            <div
                              className="absolute inset-0 opacity-15"
                              style={{
                                backgroundImage: `radial-gradient(circle, #DE738F 1px, transparent 1px)`,
                                backgroundSize: '12px 12px'
                              }}
                            />

                            {/* Scaled Logo Image */}
                            <div
                              className="relative size-full flex items-center justify-center p-3 transition-transform duration-75"
                              style={{
                                transform: `scale(${(draftConfig.customLogoScale || 100) / 100})`,
                                transformOrigin: 'center center'
                              }}
                            >
                              <img
                                src={draftConfig.customLogoUrl}
                                alt="Encuadre Logo"
                                className="max-h-full max-w-full object-contain pointer-events-none select-none drop-shadow-md"
                              />
                            </div>

                            {/* Circular Mask Reticle Guide Overlay */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <div className="size-32 rounded-full border-2 border-dashed border-[#DE738F] shadow-[0_0_0_9999px_rgba(15,10,12,0.68)] ring-1 ring-white/20 relative">
                                {/* Subtle crosshair centering aids */}
                                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-rose-300/30 pointer-events-none" />
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-rose-300/30 pointer-events-none" />
                              </div>
                            </div>

                            <div className="absolute bottom-1.5 inset-x-0 text-center">
                              <span className="text-[9px] font-semibold text-white/80 bg-black/70 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">
                                Área Visible en Web
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Zoom Controls: Buttons, Slider & Presets */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-xs text-foreground font-medium">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Sliders className="size-3 text-rose-500" />
                              Control de Escala / Zoom:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleFieldChange('customLogoScale', 100)}
                              className="text-[10px] text-rose-600 hover:underline flex items-center gap-1 font-medium"
                            >
                              <RotateCcw className="size-2.5" />
                              Restablecer (100%)
                            </button>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleFieldChange('customLogoScale', Math.max(40, (draftConfig.customLogoScale || 100) - 5))}
                              className="p-1.5 rounded-lg border border-border/70 hover:bg-rose-500/10 hover:border-rose-400 text-muted-foreground hover:text-foreground transition-colors"
                              title="Alejar / Zoom Out (-5%)"
                            >
                              <ZoomOut className="size-3.5" />
                            </button>

                            <input
                              type="range"
                              min={40}
                              max={220}
                              step={1}
                              value={draftConfig.customLogoScale || 100}
                              onChange={e => handleFieldChange('customLogoScale', Number(e.target.value))}
                              className="flex-1 h-2 rounded-lg bg-rose-200/40 dark:bg-rose-950/60 accent-rose-500 cursor-pointer"
                            />

                            <button
                              type="button"
                              onClick={() => handleFieldChange('customLogoScale', Math.min(220, (draftConfig.customLogoScale || 100) + 5))}
                              className="p-1.5 rounded-lg border border-border/70 hover:bg-rose-500/10 hover:border-rose-400 text-muted-foreground hover:text-foreground transition-colors"
                              title="Acercar / Zoom In (+5%)"
                            >
                              <ZoomIn className="size-3.5" />
                            </button>
                          </div>

                          {/* Quick Presets */}
                          <div className="flex items-center justify-between gap-1 pt-1">
                            <span className="text-[10px] text-muted-foreground">Preajustes rápidos:</span>
                            <div className="flex items-center gap-1">
                              {[60, 80, 100, 125, 150].map(val => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleFieldChange('customLogoScale', val)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                                    (draftConfig.customLogoScale || 100) === val
                                      ? 'bg-rose-500 text-white font-bold shadow-2xs'
                                      : 'bg-muted/70 hover:bg-rose-500/10 text-muted-foreground'
                                  }`}
                                >
                                  {val}%
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inyección de Logo Personal: Subir Archivo o URL Web */}
                    <div className="space-y-3 rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-background/60 p-3.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-foreground/90 uppercase tracking-wider">
                          1. Inyectar Logo Personal del Atelier
                        </label>
                        {draftConfig.customLogoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              handleFieldChange('customLogoUrl', '');
                              setLogoUrlInputValue('');
                            }}
                            className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="size-3" />
                            Quitar logo personal
                          </button>
                        )}
                      </div>

                      {/* Selector de Método: Archivo vs URL */}
                      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
                        <button
                          type="button"
                          onClick={() => setLogoInputTab('upload')}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            logoInputTab === 'upload'
                              ? 'bg-background shadow-xs text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <UploadCloud className="size-3.5" />
                          <span>Subir Archivo de Imagen</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoInputTab('url')}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            logoInputTab === 'url'
                              ? 'bg-background shadow-xs text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <LinkIcon className="size-3.5" />
                          <span>Inyección por Link / URL</span>
                        </button>
                      </div>

                      {/* Vista según método seleccionado */}
                      {logoInputTab === 'upload' ? (
                        <div className="space-y-2 pt-1">
                          <input
                            type="file"
                            ref={logoFileInputRef}
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            onChange={handleLogoFileUpload}
                            className="hidden"
                          />
                          <div
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => logoFileInputRef.current?.click()}
                            className={`relative w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 transition-all duration-200 cursor-pointer text-center select-none overflow-hidden group ${
                              isDraggingLogo
                                ? 'border-[#DE738F] bg-rose-500/20 scale-[1.02] shadow-[0_0_30px_rgba(222,115,143,0.35)] ring-4 ring-rose-400/30'
                                : 'border-rose-300 dark:border-rose-800 bg-rose-500/[0.04] hover:bg-rose-500/[0.09] hover:border-rose-400 shadow-2xs'
                            }`}
                          >
                            {/* Ambient animated ripple when dragging */}
                            {isDraggingLogo && (
                              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 animate-pulse pointer-events-none" />
                            )}

                            <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xs ${
                              isDraggingLogo
                                ? 'bg-rose-500 text-white scale-125 rotate-3'
                                : 'bg-rose-500/15 text-rose-600 group-hover:scale-110'
                            }`}>
                              <UploadCloud className="size-5" />
                            </div>

                            <div className="space-y-1 relative z-10">
                              <span className={`text-xs font-bold block transition-colors ${
                                isDraggingLogo ? 'text-rose-600 dark:text-rose-300 text-sm' : 'text-foreground'
                              }`}>
                                {isDraggingLogo
                                  ? '¡Soltá tu logo aquí para cargarlo!'
                                  : 'Arrastrá y soltá tu logo aquí'}
                              </span>
                              {!isDraggingLogo && (
                                <span className="text-[11px] font-semibold text-rose-600 hover:underline block">
                                  o hacé click para elegir archivo de tu computadora
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-center pt-1 text-[10px] text-muted-foreground relative z-10">
                              <span className="px-1.5 py-0.5 rounded bg-background/80 border border-border/60 font-mono">PNG</span>
                              <span className="px-1.5 py-0.5 rounded bg-background/80 border border-border/60 font-mono">SVG</span>
                              <span className="px-1.5 py-0.5 rounded bg-background/80 border border-border/60 font-mono">JPG</span>
                              <span className="px-1.5 py-0.5 rounded bg-background/80 border border-border/60 font-mono">WebP</span>
                              <span>• Máx 2MB</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                            Enlace Web Directo de la Imagen (URL):
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <Globe className="size-3.5 text-rose-500/70" />
                            </div>
                            <input
                              type="url"
                              value={logoUrlInputValue}
                              onChange={e => {
                                setLogoUrlInputValue(e.target.value);
                                handleFieldChange('customLogoUrl', e.target.value);
                              }}
                              placeholder="https://tudominio.com/assets/logo.png"
                              className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 pl-9 pr-8 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 shadow-xs focus:border-[#DE738F] focus:outline-none"
                            />
                            {logoUrlInputValue && (
                              <button
                                type="button"
                                onClick={() => {
                                  setLogoUrlInputValue('');
                                  handleFieldChange('customLogoUrl', '');
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                                title="Limpiar URL"
                              >
                                <X className="size-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Pegá el link directo a la imagen de tu logo alojada en tu servidor, CDN o web. Se inyectará al instante en el visor y en la vista previa.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Opción 2: Sello o Ícono Predefinido (Fallback de App) */}
                    <div className="space-y-2 rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-background/60 p-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="size-3.5 text-amber-500" />
                          <span>2. Sello Editorial Predefinido (Fallback de App)</span>
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                          {draftConfig.customLogoUrl ? 'Respaldo en espera' : 'Activo actualmente'}
                        </span>
                      </div>

                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {draftConfig.customLogoUrl
                          ? '✦ Tu logo personal está activo. Si en algún momento lo quitás, el sitio web utilizará automáticamente este sello predefinido:'
                          : '✦ Seleccioná un sello de alta costura o ingresá tu propio emoji / monograma:'}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['💅', '✨', '💎', '🌸', '👑', '🪞', '🪄', '🌹'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleFieldChange('logoEmoji', emoji)}
                            className={`size-8 rounded-lg border text-sm transition-all duration-150 flex items-center justify-center ${
                              draftConfig.logoEmoji === emoji
                                ? 'border-rose-500 bg-rose-500/15 shadow-xs scale-105 font-bold'
                                : 'border-rose-200/60 hover:border-rose-400 bg-background/80'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                        <input
                          type="text"
                          value={draftConfig.logoEmoji}
                          onChange={e => handleFieldChange('logoEmoji', e.target.value)}
                          className="w-14 h-8 rounded-lg border border-rose-200/70 bg-background text-center text-xs font-semibold focus:border-[#DE738F] focus:outline-none"
                          maxLength={4}
                          title="Ingresá emoji o monograma"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Header Badge */}
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-foreground/80">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3 text-[#DE738F]" />
                        Badge de Cabecera
                      </span>
                      <span className="text-[10px] lowercase font-normal text-muted-foreground">arriba del h1</span>
                    </label>
                    <input
                      type="text"
                      value={draftConfig.badgeText}
                      onChange={e => handleFieldChange('badgeText', e.target.value)}
                      placeholder="Ej: ESTUDIO DE ALTA MANICURÍA"
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:bg-background focus:outline-none focus:ring-4 focus:ring-rose-500/15"
                    />
                  </div>
                </div>
              )}

              {/* 2. COLORES */}
              {activeCategory === 'colores' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block mb-2">Paletas Editoriales Recomendadas</span>
                    <div className="grid grid-cols-1 gap-2">
                      {palettePresets.map(p => (
                        <button
                          key={p.name}
                          onClick={() => {
                            setDraftConfig(prev => ({
                              ...prev,
                              primaryColor: p.primary,
                              secondaryColor: p.secondary,
                              accentGold: p.accent,
                              themePreset: p.theme,
                              glowColor: p.glow
                            }));
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                            draftConfig.primaryColor === p.primary
                              ? 'border-rose-500 bg-rose-500/10 shadow-xs ring-1 ring-rose-500/20'
                              : 'border-rose-200/60 dark:border-rose-900/30 hover:bg-rose-500/5'
                          }`}
                        >
                          <span className="font-semibold text-xs text-foreground">{p.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="size-5 rounded-full border border-black/10 shadow-xs ring-1 ring-white/40" style={{ background: p.primary }} />
                            <span className="size-5 rounded-full border border-black/10 shadow-xs ring-1 ring-white/40" style={{ background: p.secondary }} />
                            <span className="size-5 rounded-full border border-black/10 shadow-xs ring-1 ring-white/40" style={{ background: p.accent }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] bg-rose-100 dark:bg-rose-900/30" />

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block mb-1.5">Color Primario (Botones, Acentos y Luces)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={draftConfig.primaryColor}
                          onChange={e => handleFieldChange('primaryColor', e.target.value)}
                          className="size-9 rounded-xl border border-rose-200/70 cursor-pointer p-0.5 bg-background shadow-xs"
                        />
                        <input
                          type="text"
                          value={draftConfig.primaryColor}
                          onChange={e => handleFieldChange('primaryColor', e.target.value)}
                          className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-2 text-xs font-mono font-medium focus:border-[#DE738F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block mb-1.5">Color Secundario (Gradientes y Textos Glam)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={draftConfig.secondaryColor}
                          onChange={e => handleFieldChange('secondaryColor', e.target.value)}
                          className="size-9 rounded-xl border border-rose-200/70 cursor-pointer p-0.5 bg-background shadow-xs"
                        />
                        <input
                          type="text"
                          value={draftConfig.secondaryColor}
                          onChange={e => handleFieldChange('secondaryColor', e.target.value)}
                          className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-2 text-xs font-mono font-medium focus:border-[#DE738F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block mb-1.5">Dorado Acento (Sellos & Club Privilege)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={draftConfig.accentGold}
                          onChange={e => handleFieldChange('accentGold', e.target.value)}
                          className="size-9 rounded-xl border border-rose-200/70 cursor-pointer p-0.5 bg-background shadow-xs"
                        />
                        <input
                          type="text"
                          value={draftConfig.accentGold}
                          onChange={e => handleFieldChange('accentGold', e.target.value)}
                          className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-2 text-xs font-mono font-medium focus:border-[#DE738F] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TIPOGRAFÍAS */}
              {activeCategory === 'tipografias' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Tipografía para Títulos (Serif Glamour)
                    </label>
                    <LuxurySelect
                      value={draftConfig.headingFont}
                      onChange={val => handleFieldChange('headingFont', val as any)}
                      options={[
                        { value: 'Italiana', label: 'Italiana (Romance & Editorial Elegante)' },
                        { value: 'Cinzel', label: 'Cinzel (Clásica Romana Haute Couture)' },
                        { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Elegancia Clásica)' },
                        { value: 'Playfair Display', label: 'Playfair Display (Vogue Style)' },
                        { value: 'Prata', label: 'Prata (Lujo Moderno)' }
                      ]}
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.02] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">
                        Muestra de Título Editorial (H1 Editable)
                      </span>
                      <span className="text-[9px] text-[#DE738F] font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                        En Vivo
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={draftConfig.heroTitle}
                      onChange={e => handleFieldChange('heroTitle', e.target.value)}
                      placeholder="ARTE, PRECISIÓN Y ALTA COSTURA PARA TUS UÑAS..."
                      style={{ fontFamily: draftConfig.headingFont, fontSize: '1.25rem' }}
                      className="w-full font-bold text-foreground leading-snug bg-background/90 rounded-xl p-3 border border-rose-200/70 dark:border-rose-900/40 focus:border-[#DE738F] focus:outline-none resize-none transition-all shadow-xs"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Podés tipear tu propio título aquí en tiempo real; se actualiza automáticamente en toda la web.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Tipografía para Textos de Lectura (Sans-Serif)
                    </label>
                    <LuxurySelect
                      value={draftConfig.bodyFont}
                      onChange={val => handleFieldChange('bodyFont', val as any)}
                      options={[
                        { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Ultra Legible & Premium)' },
                        { value: 'Inter', label: 'Inter (Limpio & Tecnológico)' },
                        { value: 'Montserrat', label: 'Montserrat (Moderno & Geométrico)' },
                        { value: 'Outfit', label: 'Outfit (Contemporáneo Suave)' }
                      ]}
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-background/60 space-y-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">
                      Muestra de Texto de Lectura (Bajada Editable)
                    </span>
                    <input
                      type="text"
                      value={draftConfig.heroSubtitle}
                      onChange={e => handleFieldChange('heroSubtitle', e.target.value)}
                      placeholder="Subtítulo o bajada editorial..."
                      style={{ fontFamily: draftConfig.bodyFont }}
                      className="w-full text-xs text-foreground/90 bg-background/90 rounded-lg px-3 py-2 border border-rose-200/70 dark:border-rose-900/40 focus:border-[#DE738F] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* 4. GLOWS & MOTION */}
              {activeCategory === 'glows' && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-gradient-to-br from-rose-500/[0.04] to-transparent p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80">
                        Intensidad del Resplandor (Glow)
                      </label>
                      <span className="font-bold text-xs text-[#DE738F] bg-rose-500/10 px-2 py-0.5 rounded-full">
                        {draftConfig.glowIntensity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={draftConfig.glowIntensity}
                      onChange={e => handleFieldChange('glowIntensity', Number(e.target.value))}
                      className="w-full accent-[#DE738F] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div
                      onClick={() => handleFieldChange('enableAmbientAurora', !draftConfig.enableAmbientAurora)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        draftConfig.enableAmbientAurora
                          ? 'border-rose-500 bg-rose-500/10 shadow-xs'
                          : 'border-rose-200/60 dark:border-rose-900/30 bg-background/80 hover:bg-rose-500/5'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-xs block text-foreground">Aurora Líquida Sensorial</span>
                        <span className="text-[10px] text-muted-foreground">Malla degradada animada en el fondo</span>
                      </div>
                      <div className={`size-5 rounded-md flex items-center justify-center border text-white text-xs ${
                        draftConfig.enableAmbientAurora ? 'bg-[#DE738F] border-[#DE738F]' : 'border-zinc-300'
                      }`}>
                        {draftConfig.enableAmbientAurora && '✓'}
                      </div>
                    </div>

                    <div
                      onClick={() => handleFieldChange('enableSparkles', !draftConfig.enableSparkles)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        draftConfig.enableSparkles
                          ? 'border-rose-500 bg-rose-500/10 shadow-xs'
                          : 'border-rose-200/60 dark:border-rose-900/30 bg-background/80 hover:bg-rose-500/5'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-xs block text-foreground">Destellos Swarovski</span>
                        <span className="text-[10px] text-muted-foreground">Partículas y estela reactiva al cursor</span>
                      </div>
                      <div className={`size-5 rounded-md flex items-center justify-center border text-white text-xs ${
                        draftConfig.enableSparkles ? 'bg-[#DE738F] border-[#DE738F]' : 'border-zinc-300'
                      }`}>
                        {draftConfig.enableSparkles && '✓'}
                      </div>
                    </div>

                    <div
                      onClick={() => handleFieldChange('enable3DTilt', !draftConfig.enable3DTilt)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        draftConfig.enable3DTilt
                          ? 'border-rose-500 bg-rose-500/10 shadow-xs'
                          : 'border-rose-200/60 dark:border-rose-900/30 bg-background/80 hover:bg-rose-500/5'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-xs block text-foreground">Perspectiva Holográfica 3D Tilt</span>
                        <span className="text-[10px] text-muted-foreground">Inclinación interactiva de la tarjeta del Hero</span>
                      </div>
                      <div className={`size-5 rounded-md flex items-center justify-center border text-white text-xs ${
                        draftConfig.enable3DTilt ? 'bg-[#DE738F] border-[#DE738F]' : 'border-zinc-300'
                      }`}>
                        {draftConfig.enable3DTilt && '✓'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. HERO & PORTADA */}
              {activeCategory === 'hero' && (
                <div className="space-y-4 text-xs">
                  {/* 1. Titulares Principales */}
                  <div className="rounded-xl border border-rose-200/80 dark:border-rose-900/40 p-3 bg-[#FFF9FB] dark:bg-card space-y-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-foreground/90 block">
                      1. Titulares & Botones del Hero
                    </span>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80 block">
                        Título Principal (H1)
                      </label>
                      <textarea
                        rows={2}
                        value={draftConfig.heroTitle}
                        onChange={e => handleFieldChange('heroTitle', e.target.value)}
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs font-serif font-bold text-foreground focus:border-[#DE738F] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80 block">
                        Bajada / Subtítulo
                      </label>
                      <input
                        type="text"
                        value={draftConfig.heroSubtitle}
                        onChange={e => handleFieldChange('heroSubtitle', e.target.value)}
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80 block">
                          Botón Reserva
                        </label>
                        <input
                          type="text"
                          value={draftConfig.ctaPrimaryText}
                          onChange={e => handleFieldChange('ctaPrimaryText', e.target.value)}
                          className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-1.5 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80 block">
                          Botón Nail-Bot
                        </label>
                        <input
                          type="text"
                          value={draftConfig.ctaSecondaryText}
                          onChange={e => handleFieldChange('ctaSecondaryText', e.target.value)}
                          className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-1.5 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Información de la Tarjeta 3D ("Tendencia 2026") */}
                  <div className="rounded-xl border border-rose-200/80 dark:border-rose-900/40 p-3 bg-[#FFF9FB] dark:bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-wider uppercase text-foreground/90 block">
                        2. Textos de la Tarjeta 3D ("Tendencia 2026")
                      </span>
                      <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[9px] font-semibold">
                        Pie Flotante 3D
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80 block">
                        Etiqueta Superior (Badge)
                      </label>
                      <input
                        type="text"
                        value={draftConfig.heroCardBadge}
                        onChange={e => handleFieldChange('heroCardBadge', e.target.value)}
                        placeholder="Ej: TENDENCIA 2026, TÉCNICA ESTRELLA..."
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs font-couture tracking-wider text-foreground focus:border-[#DE738F] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80 block">
                        Título de la Técnica o Set
                      </label>
                      <input
                        type="text"
                        value={draftConfig.heroCardTitle}
                        onChange={e => handleFieldChange('heroCardTitle', e.target.value)}
                        placeholder="Ej: Arquitectura Soft Gel & Kapping"
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs font-semibold text-foreground focus:border-[#DE738F] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80 block">
                        Detalle / Subtítulo Técnico (Opcional)
                      </label>
                      <input
                        type="text"
                        value={draftConfig.heroCardSubtitle || ''}
                        onChange={e => handleFieldChange('heroCardSubtitle', e.target.value)}
                        placeholder="Ej: Nivelación Rubber con Manicura Rusa"
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. Fotografía de la Portada 3D */}
                  <div className="rounded-xl border border-rose-200/80 dark:border-rose-900/40 p-3 bg-[#FFF9FB] dark:bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-wider uppercase text-foreground/90 block">
                        3. Fotografía de la Portada 3D
                      </span>
                      <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                        <button
                          type="button"
                          onClick={() => setHeroImageTab('upload')}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            heroImageTab === 'upload' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Subir Foto
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroImageTab('url')}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            heroImageTab === 'url' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Enlace URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroImageTab('presets')}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            heroImageTab === 'presets' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Catálogo
                        </button>
                      </div>
                    </div>

                    {/* Vista Previa de la foto activa */}
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-background/80 border border-border/80">
                      <div className="size-14 rounded-lg overflow-hidden border border-border shrink-0 bg-muted/30">
                        <img
                          src={draftConfig.heroCardImage}
                          alt="Portada 3D actual"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold text-foreground block truncate">
                          Foto Activa en Tarjeta 3D
                        </span>
                        <span className="text-[9px] text-muted-foreground block truncate">
                          {draftConfig.heroCardImage.startsWith('data:') ? 'Imagen propia subida desde tu dispositivo' : draftConfig.heroCardImage}
                        </span>
                      </div>
                    </div>

                    {/* Tab: Subir Archivo / Drag & Drop */}
                    {heroImageTab === 'upload' && (
                      <div
                        onDragOver={handleHeroDragOver}
                        onDragEnter={handleHeroDragEnter}
                        onDragLeave={handleHeroDragLeave}
                        onDrop={handleHeroDrop}
                        onClick={() => heroFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                          isDraggingHeroImg
                            ? 'border-rose-500 bg-rose-500/10 scale-[1.01]'
                            : 'border-rose-200/80 dark:border-rose-900/40 hover:border-rose-400/80 bg-background/50'
                        }`}
                      >
                        <input
                          ref={heroFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleHeroFileUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <div className="size-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                            <UploadCloud className="size-4" />
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-foreground block">
                              Arrastrá tu foto de Nail Art aquí
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              o hacé clic para explorar desde tu dispositivo (PNG, JPG, WebP hasta 5MB)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab: URL */}
                    {heroImageTab === 'url' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={heroImageUrlInputValue}
                            onChange={e => setHeroImageUrlInputValue(e.target.value)}
                            placeholder="https://images.unsplash.com/... o link directo de foto"
                            className="flex-1 rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-2 text-xs font-mono text-foreground focus:border-[#DE738F] focus:outline-none"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              if (heroImageUrlInputValue.trim()) {
                                handleFieldChange('heroCardImage', heroImageUrlInputValue.trim());
                              }
                            }}
                            className="text-xs bg-rose-500 hover:bg-rose-600 text-white"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Tab: Presets de Catálogo */}
                    {heroImageTab === 'presets' && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-muted-foreground block">O seleccioná una foto de estudio de alta resolución:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {imagePresets.map(img => (
                            <div
                              key={img.title}
                              onClick={() => handleFieldChange('heroCardImage', img.url)}
                              className={`group cursor-pointer rounded-xl border p-1 text-center transition-all ${
                                draftConfig.heroCardImage === img.url
                                  ? 'border-rose-500 bg-rose-500/10 shadow-xs ring-1 ring-rose-500/30'
                                  : 'border-rose-200/60 dark:border-rose-900/30 hover:border-rose-300'
                              }`}
                            >
                              <img src={img.url} alt={img.title} className="h-16 w-full object-cover rounded-lg" />
                              <span className="text-[10px] text-muted-foreground font-medium block truncate mt-1">
                                {img.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5.b GALERÍA DE TRABAJOS DESTACADOS */}
              {activeCategory === 'galeria' && (
                <div className="space-y-4 text-xs">
                  {/* Eyebrow / Badge */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 flex items-center justify-between">
                      <span>Insignia Superior (Badge)</span>
                      <span className="text-[10px] lowercase font-normal text-muted-foreground">cabecera</span>
                    </label>
                    <input
                      type="text"
                      value={draftConfig.showcaseBadge || ''}
                      onChange={e => handleFieldChange('showcaseBadge', e.target.value)}
                      placeholder="✦ OBRAS DE AUTOR & PORTFOLIO ✦"
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Título Principal de la Galería
                    </label>
                    <input
                      type="text"
                      value={draftConfig.showcaseTitle || ''}
                      onChange={e => handleFieldChange('showcaseTitle', e.target.value)}
                      placeholder="GALERÍA DE TRABAJOS DESTACADOS"
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Bajada Descriptiva / Filosofía
                    </label>
                    <textarea
                      rows={2}
                      value={draftConfig.showcaseSubtitle || ''}
                      onChange={e => handleFieldChange('showcaseSubtitle', e.target.value)}
                      placeholder="Explorá nuestras técnicas más solicitadas: arquitectura estructural en Soft Gel, Kapping con Rubber..."
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="border-t border-rose-200/60 dark:border-rose-900/30 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Trabajos en Exhibición ({(draftConfig.showcaseItems || []).length})
                        </h4>
                        <p className="text-[10px] text-muted-foreground">Podés subir fotos desde tu dispositivo o pegar URLs</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={addWorkItem}
                          className="px-2.5 py-1 text-[10px] font-bold text-white rounded-lg bg-[#DE738F] hover:bg-[#C45774] shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="size-3" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>

                    {/* Cards list */}
                    <div className="space-y-3">
                      {(draftConfig.showcaseItems || []).map((work, index) => (
                        <div
                          key={work.id || index}
                          className="p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 space-y-2.5"
                        >
                          <div className="flex items-start gap-3">
                            {/* Photo Thumbnail + Quick Upload */}
                            <div className="relative group shrink-0">
                              <img
                                src={work.imageUrl}
                                alt={work.title}
                                className="size-16 rounded-lg object-cover border border-rose-200/80 dark:border-rose-800 shadow-xs"
                              />
                              <label
                                className="absolute inset-0 bg-black/55 text-white rounded-lg opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[9px] font-semibold"
                                title="Subir foto propia desde dispositivo"
                              >
                                <UploadCloud className="size-4 mb-0.5" />
                                <span>Subir</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleWorkImageUpload(work.id, file);
                                  }}
                                />
                              </label>
                            </div>

                            {/* Main Details */}
                            <div className="flex-1 space-y-1.5 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={work.title}
                                  onChange={(e) => updateWorkItem(work.id, { title: e.target.value })}
                                  placeholder="Título del set (ej: Kapping Ruso)"
                                  className="w-full text-xs font-bold text-foreground bg-transparent border-b border-rose-200/50 focus:border-[#DE738F] focus:outline-none pb-0.5"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeWorkItem(work.id)}
                                  className="text-muted-foreground hover:text-rose-600 p-1 rounded-md hover:bg-rose-100/50 transition-colors"
                                  title="Eliminar este trabajo"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block">Categoría</label>
                                  <LuxurySelect
                                    value={work.category}
                                    onChange={(val) => updateWorkItem(work.id, { category: String(val) })}
                                    options={[
                                      { value: 'kapping', label: 'Kapping Gel' },
                                      { value: 'nail_art', label: 'Nail Art & Efectos' },
                                      { value: 'soft_gel', label: 'Soft Gel' },
                                      { value: 'rusa', label: 'Manicuría Rusa' }
                                    ]}
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block">Técnica (Pill)</label>
                                  <input
                                    type="text"
                                    value={work.techniqueTag}
                                    onChange={(e) => updateWorkItem(work.id, { techniqueTag: e.target.value })}
                                    placeholder="Ej: Nivelación Rubber"
                                    className="w-full text-[10px] rounded-lg border border-border bg-background px-2 py-1 text-foreground"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description, Badge & Image URL input */}
                          <div className="space-y-1.5 pt-1">
                            <input
                              type="text"
                              value={work.description || ''}
                              onChange={(e) => updateWorkItem(work.id, { description: e.target.value })}
                              placeholder="Breve descripción o detalle técnico del set..."
                              className="w-full text-[11px] rounded-lg border border-border bg-background px-2.5 py-1 text-foreground placeholder:text-muted-foreground/40"
                            />

                            {/* Texto Informativo / Durabilidad (Badge con escudo) */}
                            <div className="flex items-center gap-1.5 bg-background/60 p-1.5 rounded-lg border border-border/60">
                              <ShieldCheck className="size-3.5 text-rose-500 shrink-0 ml-1" />
                              <div className="flex-1 min-w-0">
                                <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block leading-none mb-1">
                                  Texto Informativo / Garantía
                                </label>
                                <input
                                  type="text"
                                  value={work.badgeInfo ?? (work.durationDays ? `Duración intacta ${work.durationDays}+ días • HEMA-Free` : 'Duración intacta 21+ días • HEMA-Free')}
                                  onChange={(e) => updateWorkItem(work.id, { badgeInfo: e.target.value })}
                                  placeholder="Ej: Duración intacta 28+ días • HEMA-Free"
                                  className="w-full text-[11px] font-medium text-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/40"
                                />
                              </div>
                            </div>

                            {/* Ficha Técnica / Modal (Tiempo Estimado, Fórmula, Mantenimiento) */}
                            <div className="rounded-lg bg-pink-50/50 dark:bg-rose-950/20 p-2 border border-pink-100 dark:border-rose-900/30 space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-rose-500/80 font-bold block">
                                Ficha Técnica (Modal al hacer Click)
                              </span>
                              <div className="grid grid-cols-3 gap-1.5">
                                <div>
                                  <label className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1 mb-0.5">
                                    <Clock className="size-2.5 text-pink-500" />
                                    <span>Tiempo</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={work.estimatedTime ?? '~60 - 80m'}
                                    onChange={(e) => updateWorkItem(work.id, { estimatedTime: e.target.value })}
                                    placeholder="~60 - 80m"
                                    className="w-full text-[10px] font-medium rounded-md border border-border/70 bg-background/90 px-1.5 py-1 text-foreground focus:outline-none focus:border-[#DE738F]"
                                  />
                                </div>

                                <div>
                                  <label className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1 mb-0.5">
                                    <ShieldCheck className="size-2.5 text-emerald-600" />
                                    <span>Fórmula</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={work.formula ?? '100% Segura'}
                                    onChange={(e) => updateWorkItem(work.id, { formula: e.target.value })}
                                    placeholder="100% Segura"
                                    className="w-full text-[10px] font-medium rounded-md border border-border/70 bg-background/90 px-1.5 py-1 text-foreground focus:outline-none focus:border-[#DE738F]"
                                  />
                                </div>

                                <div>
                                  <label className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1 mb-0.5">
                                    <CheckCircle2 className="size-2.5 text-pink-500" />
                                    <span>Mantenimiento</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={work.maintenance ?? (work.durationDays ? `${work.durationDays} días` : '21 a 28 días')}
                                    onChange={(e) => updateWorkItem(work.id, { maintenance: e.target.value })}
                                    placeholder="21 a 28 días"
                                    className="w-full text-[10px] font-medium rounded-md border border-border/70 bg-background/90 px-1.5 py-1 text-foreground focus:outline-none focus:border-[#DE738F]"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <LinkIcon className="size-3 text-muted-foreground shrink-0" />
                              <input
                                type="text"
                                value={work.imageUrl.startsWith('data:') ? 'Imagen subida desde tu dispositivo (Base64)' : work.imageUrl}
                                onChange={(e) => {
                                  if (!e.target.value.startsWith('Imagen subida')) {
                                    updateWorkItem(work.id, { imageUrl: e.target.value });
                                  }
                                }}
                                placeholder="https://..."
                                className="w-full text-[10px] text-muted-foreground bg-transparent border-none focus:outline-none truncate"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. CINTA & MANIFIESTO */}
              {activeCategory === 'cinta' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block mb-2">
                      Frases de la Cinta Continua (Marquee)
                    </label>
                    <div className="space-y-2">
                      {draftConfig.marqueePhrases.map((phrase, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={phrase}
                            onChange={e => {
                              const updated = [...draftConfig.marqueePhrases];
                              updated[idx] = e.target.value;
                              handleFieldChange('marqueePhrases', updated);
                            }}
                            className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const updated = draftConfig.marqueePhrases.filter((_, i) => i !== idx);
                              handleFieldChange('marqueePhrases', updated);
                            }}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Eliminar frase"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleFieldChange('marqueePhrases', [...draftConfig.marqueePhrases, 'NUEVO TRATAMIENTO DE LUJO']);
                        }}
                        className="text-xs w-full gap-1.5 h-8 rounded-xl border-dashed border-rose-300 hover:border-rose-500 hover:bg-rose-500/5 text-rose-700 dark:text-rose-300 font-semibold"
                      >
                        <Plus className="size-3.5" />
                        <span>Agregar Frase a la Cinta</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. PILARES */}
              {activeCategory === 'pilares' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Título de la Sección
                    </label>
                    <input
                      type="text"
                      value={draftConfig.whyUsTitle}
                      onChange={e => handleFieldChange('whyUsTitle', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs font-serif font-bold text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="h-[1px] bg-rose-100 dark:bg-rose-900/30" />

                  <div className="space-y-3.5">
                    {(draftConfig.whyUsFeatures || DEFAULT_WEB_CONFIG.whyUsFeatures).map((feat, index) => {
                      const currentIconKey = feat.icon || (
                        index === 0 ? 'heart' : index === 1 ? 'palette' : index === 2 ? 'award' : 'shield'
                      );

                      return (
                        <div key={feat.id || index} className="p-3.5 rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-950/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DE738F]/10 text-[#DE738F] uppercase tracking-wider">
                              Pilar #{index + 1}
                            </span>
                            {(draftConfig.whyUsFeatures?.length || 0) > 1 && (
                              <button
                                type="button"
                                onClick={() => removePilarItem(feat.id)}
                                className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                title="Eliminar este pilar"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-muted-foreground">Título del Pilar</label>
                            <input
                              type="text"
                              value={feat.title}
                              onChange={e => updatePilarItem(index, { title: e.target.value })}
                              placeholder="Ej: ATENCIÓN PERSONALIZADA"
                              className="w-full font-semibold rounded-lg border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-2.5 py-1.5 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="text-[10px] font-medium text-muted-foreground flex items-center justify-between">
                              <span>Ícono Representativo</span>
                              <span className="text-[9px] text-[#DE738F] font-semibold">
                                {PILAR_ICON_OPTIONS.find(o => o.key === currentIconKey)?.label || currentIconKey}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {PILAR_ICON_OPTIONS.map(opt => {
                                const IconComp = opt.icon;
                                const isSelected = currentIconKey === opt.key;
                                return (
                                  <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => updatePilarItem(index, { icon: opt.key })}
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all text-left border ${
                                      isSelected
                                        ? 'bg-[#DE738F]/15 border-[#DE738F] text-[#DE738F] shadow-xs'
                                        : 'bg-background/80 border-rose-200/50 dark:border-rose-900/30 text-muted-foreground hover:border-rose-300 hover:text-foreground'
                                    }`}
                                  >
                                    <IconComp className={`size-3.5 shrink-0 ${isSelected ? 'text-[#DE738F]' : 'text-muted-foreground'}`} />
                                    <span className="truncate">{opt.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-muted-foreground">Descripción Detallada</label>
                            <textarea
                              rows={3}
                              value={feat.description}
                              onChange={e => updatePilarItem(index, { description: e.target.value })}
                              placeholder="Describe la exclusividad, propuesta de valor y beneficios de este pilar..."
                              className="w-full rounded-lg border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-2.5 py-1.5 text-[11px] leading-relaxed text-foreground focus:border-[#DE738F] focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-1 flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPilarItem}
                        className="text-xs w-full gap-1.5 h-8 rounded-xl border-dashed border-rose-300 hover:border-rose-500 hover:bg-rose-500/5 text-rose-700 dark:text-rose-300 font-semibold"
                      >
                        <Plus className="size-3.5" />
                        <span>Agregar Nuevo Pilar</span>
                      </Button>

                      <button
                        type="button"
                        onClick={resetPilarPresets}
                        className="text-[10px] text-muted-foreground hover:text-[#DE738F] text-center transition-colors underline decoration-dotted"
                      >
                        Restaurar los 4 pilares predeterminados de alta gama
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. CONTACTO & FOOTER */}
              {activeCategory === 'contacto' && (
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Dirección del Salón / Estudio
                    </label>
                    <input
                      type="text"
                      value={draftConfig.address}
                      onChange={e => handleFieldChange('address', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      WhatsApp de Atención
                    </label>
                    <input
                      type="text"
                      value={draftConfig.whatsapp}
                      onChange={e => handleFieldChange('whatsapp', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Instagram (@usuario)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.instagram}
                      onChange={e => handleFieldChange('instagram', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Horarios de Atención
                    </label>
                    <input
                      type="text"
                      value={draftConfig.hours}
                      onChange={e => handleFieldChange('hours', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Leyenda de Copyright
                    </label>
                    <input
                      type="text"
                      value={draftConfig.footerCopyright}
                      onChange={e => handleFieldChange('footerCopyright', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Live Website Preview Frame (Cols 8-12 on mobile, 7-12 on desktop) */}
        <div className={`${previewDevice === 'desktop' ? 'lg:col-span-6' : 'lg:col-span-5'} space-y-3`}>
          {/* Device Switcher & Status Bar */}
          <div className="flex items-center justify-between rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-card px-3.5 py-2 shadow-xs text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Preview:</span>
              <div className="flex items-center rounded-lg border border-border/80 p-0.5 bg-muted/40">
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-all ${
                    previewDevice === 'mobile'
                      ? 'bg-background shadow-xs text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Mockup iPhone 16 Pro"
                >
                  <Smartphone className="size-3.5 text-rose-500" />
                  <span>iPhone 16 Pro</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-all ${
                    previewDevice === 'desktop'
                      ? 'bg-background shadow-xs text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Mockup MacBook Pro (Escritorio)"
                >
                  <Laptop className="size-3.5" />
                  <span>MacBook Pro</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Live Sync</span>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Abrir sitio web completo en nueva pestaña"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Device Preview Container */}
          {previewDevice === 'mobile' ? (
            <div className="flex justify-center py-1">
              <IPhoneMockup
                iframeSrc="/?preview=true"
                iframeRef={mobileIframeRef}
                url="ateliernails.com"
              />
            </div>
          ) : (
            /* Desktop MacBook Pro Mockup */
            <div className="flex justify-center py-1 w-full">
              <MacBookMockup
                iframeSrc="/?preview=true"
                iframeRef={desktopIframeRef}
                url="ateliernails.com"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
