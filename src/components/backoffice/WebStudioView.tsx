import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { WebCustomizationConfig, DEFAULT_WEB_CONFIG, WhyUsFeatureItem } from '../../types/webConfig';
import { useWebConfig } from '../../hooks/useWebConfig';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PublicHeader } from '../navigation/PublicHeader';
import { PublicLanding } from '../public/PublicLanding';
import { IPhoneMockup } from './IPhoneMockup';

type StudioCategory =
  | 'identidad'
  | 'colores'
  | 'tipografias'
  | 'glows'
  | 'hero'
  | 'cinta'
  | 'pilares'
  | 'contacto';

export const WebStudioView: React.FC = () => {
  const { config, updateConfig, resetConfig } = useWebConfig();
  const [draftConfig, setDraftConfig] = useState<WebCustomizationConfig>({ ...config });
  const [activeCategory, setActiveCategory] = useState<StudioCategory>('identidad');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Luxury Palettes
  const palettePresets = [
    {
      name: 'Rose Quartz & Gold',
      primary: '#DE738F',
      secondary: '#C45774',
      accent: '#E0C89E',
      theme: 'rose_quartz' as const
    },
    {
      name: 'Espresso & Champagne',
      primary: '#9C6644',
      secondary: '#7F4F24',
      accent: '#D4AF37',
      theme: 'dark_espresso' as const
    },
    {
      name: 'Noir Glamour & Velvet',
      primary: '#B8506C',
      secondary: '#8B2E48',
      accent: '#DDB892',
      theme: 'noir_gold' as const
    },
    {
      name: 'Burgundy & Gold Chic',
      primary: '#800020',
      secondary: '#5B061A',
      accent: '#E6C280',
      theme: 'rose_quartz' as const
    },
    {
      name: 'Lilac Dream & Chrome',
      primary: '#9B72CF',
      secondary: '#7851A9',
      accent: '#E8D7F1',
      theme: 'rose_quartz' as const
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

  const handleSave = () => {
    updateConfig(draftConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2800);
  };

  const handleReset = () => {
    if (confirm('¿Deseas restablecer todos los textos, colores y estética al diseño editorial original?')) {
      const def = resetConfig();
      setDraftConfig({ ...def });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Studio Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/95 p-4 shadow-sm backdrop-blur-md">
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
            onClick={handleReset}
            className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </Button>

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
        
        {/* Sub-Sidebar: Categories of Web Components (Cols 1-3) */}
        <div className="lg:col-span-3 space-y-1.5 rounded-2xl border border-rose-200/50 dark:border-rose-900/30 bg-card/85 backdrop-blur-md p-2.5 shadow-[0_10px_30px_-15px_rgba(222,115,143,0.08)]">
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
          <div className="relative rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-card/95 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(222,115,143,0.12),0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
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
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:bg-background focus:outline-none focus:ring-4 focus:ring-rose-500/15"
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
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/40 shadow-xs transition-all duration-200 hover:border-rose-400/80 focus:border-[#DE738F] focus:bg-background focus:outline-none focus:ring-4 focus:ring-rose-500/15"
                    />
                  </div>

                  {/* Logo Emoji / Monogram Stamp */}
                  <div className="rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-gradient-to-br from-rose-500/[0.05] via-transparent to-amber-500/[0.03] p-3.5 space-y-2.5">
                    <label className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-foreground/80">
                      <span>Sello o Ícono de Marca (Logo)</span>
                      <span className="text-[10px] lowercase font-normal text-muted-foreground">sello de cera</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DE738F] via-[#C45774] to-[#8C3A50] text-2xl shadow-md ring-4 ring-rose-200/40">
                        {draftConfig.logoEmoji}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <span className="text-[10px] text-muted-foreground block">Seleccioná un sello de alta costura o ingresá el tuyo:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {['💅', '✨', '💎', '🌸', '👑', '🪞', '🪄', '🌹'].map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleFieldChange('logoEmoji', emoji)}
                              className={`size-7 rounded-lg border text-sm transition-all duration-150 flex items-center justify-center ${
                                draftConfig.logoEmoji === emoji
                                  ? 'border-rose-500 bg-rose-500/10 shadow-xs scale-110'
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
                            className="w-12 h-7 rounded-lg border border-rose-200/70 bg-background text-center text-xs font-semibold focus:border-[#DE738F] focus:outline-none"
                            maxLength={4}
                            title="Ingresá emoji o letra"
                          />
                        </div>
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
                              themePreset: p.theme
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
                    <select
                      value={draftConfig.headingFont}
                      onChange={e => handleFieldChange('headingFont', e.target.value as any)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-serif font-bold text-foreground focus:border-[#DE738F] focus:outline-none"
                    >
                      <option value="Italiana">Italiana (Romance & Editorial Elegante)</option>
                      <option value="Cinzel">Cinzel (Clásica Romana Haute Couture)</option>
                      <option value="Cormorant Garamond">Cormorant Garamond (Elegancia Clásica)</option>
                      <option value="Playfair Display">Playfair Display (Vogue Style)</option>
                      <option value="Prata">Prata (Lujo Moderno)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.02]">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Muestra de Título Editorial</span>
                    <div style={{ fontFamily: draftConfig.headingFont, fontSize: '1.4rem' }} className="font-bold text-foreground leading-snug">
                      Arte, Precisión & Alta Costura
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Tipografía para Textos de Lectura (Sans-Serif)
                    </label>
                    <select
                      value={draftConfig.bodyFont}
                      onChange={e => handleFieldChange('bodyFont', e.target.value as any)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-sans text-foreground focus:border-[#DE738F] focus:outline-none"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Ultra Legible & Premium)</option>
                      <option value="Inter">Inter (Limpio & Tecnológico)</option>
                      <option value="Montserrat">Montserrat (Moderno & Geométrico)</option>
                      <option value="Outfit">Outfit (Contemporáneo Suave)</option>
                    </select>
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
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Título Principal (H1)
                    </label>
                    <textarea
                      rows={2}
                      value={draftConfig.heroTitle}
                      onChange={e => handleFieldChange('heroTitle', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs font-serif font-bold text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Bajada / Subtítulo
                    </label>
                    <input
                      type="text"
                      value={draftConfig.heroSubtitle}
                      onChange={e => handleFieldChange('heroSubtitle', e.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3.5 py-2.5 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                        Botón Reserva
                      </label>
                      <input
                        type="text"
                        value={draftConfig.ctaPrimaryText}
                        onChange={e => handleFieldChange('ctaPrimaryText', e.target.value)}
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                        Botón Nail-Bot
                      </label>
                      <input
                        type="text"
                        value={draftConfig.ctaSecondaryText}
                        onChange={e => handleFieldChange('ctaSecondaryText', e.target.value)}
                        className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-2 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="h-[1px] bg-rose-100 dark:bg-rose-900/30" />

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-foreground/80 block">
                      Fotografía de la Tarjeta 3D
                    </label>
                    <input
                      type="text"
                      value={draftConfig.heroCardImage}
                      onChange={e => handleFieldChange('heroCardImage', e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-background/90 px-3 py-2 text-xs font-mono text-foreground focus:border-[#DE738F] focus:outline-none"
                    />

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

                  <div className="space-y-2.5">
                    {draftConfig.whyUsFeatures.map((feat, index) => (
                      <div key={feat.id} className="p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/30 bg-rose-500/[0.03] space-y-2">
                        <span className="text-[10px] font-bold text-[#DE738F] uppercase tracking-wider">Pilar #{index + 1}</span>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={e => {
                            const updated = [...draftConfig.whyUsFeatures];
                            updated[index].title = e.target.value;
                            handleFieldChange('whyUsFeatures', updated);
                          }}
                          className="w-full font-semibold rounded-lg border border-rose-200/70 bg-background/90 px-2.5 py-1.5 text-xs text-foreground focus:border-[#DE738F] focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={feat.description}
                          onChange={e => {
                            const updated = [...draftConfig.whyUsFeatures];
                            updated[index].description = e.target.value;
                            handleFieldChange('whyUsFeatures', updated);
                          }}
                          className="w-full rounded-lg border border-rose-200/70 bg-background/90 px-2.5 py-1.5 text-[11px] text-foreground focus:border-[#DE738F] focus:outline-none"
                        />
                      </div>
                    ))}
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

        {/* Right Column: Real-Time Live Website Preview Frame (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Device Switcher & Status Bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 backdrop-blur-sm px-3.5 py-2 shadow-xs text-xs">
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
                  title="Vista Escritorio (Full)"
                >
                  <Laptop className="size-3.5" />
                  <span>Escritorio</span>
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
              <IPhoneMockup url="ateliernails.com">
                <PublicHeader onOpenBooking={() => {}} config={draftConfig} />
                <PublicLanding
                  onOpenBooking={() => {}}
                  onOpenNailBot={() => {}}
                  onOpenPortal={() => {}}
                  config={draftConfig}
                />
              </IPhoneMockup>
            </div>
          ) : (
            /* Desktop Preview Box */
            <div className="rounded-xl border border-border bg-[#140D10] shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#1E1216] px-3 py-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-500/80" />
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1 rounded-md border border-white/10 bg-black/40 px-3 py-0.5 text-[10px] text-zinc-300">
                  <span className="text-emerald-400">🔒</span>
                  <span>https://ateliernails.com</span>
                </div>
                <span className="text-[10px] text-zinc-500">v1.0 Desktop</span>
              </div>
              <div className="bg-[#FFF7FA] overflow-y-auto max-h-[780px]">
                <PublicHeader onOpenBooking={() => {}} config={draftConfig} />
                <PublicLanding
                  onOpenBooking={() => {}}
                  onOpenNailBot={() => {}}
                  onOpenPortal={() => {}}
                  config={draftConfig}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
