import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ImageIcon,
  Check
} from 'lucide-react';
import { ShowcaseWorkItem, ShowcaseCategoryItem } from '../../types/webConfig';
import { LuxurySelect } from '../common/LuxurySelect';

interface ShowcaseWorkEditModalProps {
  work: ShowcaseWorkItem | null;
  categories: ShowcaseCategoryItem[];
  defaultCategory?: string;
  onClose: () => void;
  onSave: (data: Omit<ShowcaseWorkItem, 'id'>, existingId?: string) => void;
}

const PRESET_SHOWCASE_IMAGES = [
  {
    name: 'Glazed Donut & Cromado Perla',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Kapping Gel Ruso & Almendra',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Arquitectura Soft Gel Coffin',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Haute Nail Art & Cristales',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Manicuría Rusa Combinada',
    url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cat Eye Magnético Velvet',
    url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80'
  }
];

export const ShowcaseWorkEditModal: React.FC<ShowcaseWorkEditModalProps> = ({
  work,
  categories,
  defaultCategory,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(work);

  const initialCat = work?.category || (
    defaultCategory && categories.some(c => c.id === defaultCategory)
      ? defaultCategory
      : (categories[0]?.id || 'kapping')
  );

  const [title, setTitle] = useState(work?.title || '');
  const [category, setCategory] = useState<string>(initialCat);
  const [techniqueTag, setTechniqueTag] = useState(work?.techniqueTag || 'Kapping Rubber');
  const [description, setDescription] = useState(work?.description || '');
  const [badgeInfo, setBadgeInfo] = useState(
    work?.badgeInfo ?? (work?.durationDays ? `Duración intacta ${work.durationDays}+ días • HEMA-Free` : 'Duración intacta 21+ días • HEMA-Free')
  );
  const [estimatedTime, setEstimatedTime] = useState(work?.estimatedTime || '~60 - 80m');
  const [formula, setFormula] = useState(work?.formula || '100% Segura');
  const [maintenance, setMaintenance] = useState(
    work?.maintenance ?? (work?.durationDays ? `${work.durationDays} días` : '21 a 28 días')
  );

  // Image handling
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'preset'>(
    work?.imageUrl?.startsWith('data:') ? 'upload' : 'upload'
  );
  const [imageUrl, setImageUrl] = useState(
    work?.imageUrl || PRESET_SHOWCASE_IMAGES[0].url
  );
  const [urlInputValue, setUrlInputValue] = useState(
    work?.imageUrl?.startsWith('http') ? work.imageUrl : ''
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná una imagen válida (PNG, JPG, WebP, SVG).');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('El archivo no debe superar los 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImageUrl(result);
        setUrlInputValue('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor ingresá un título para el trabajo.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        techniqueTag: techniqueTag.trim() || 'Técnica Exclusiva',
        description: description.trim(),
        badgeInfo: badgeInfo.trim() || 'Duración intacta 21+ días • HEMA-Free',
        estimatedTime: estimatedTime.trim() || '~60 - 80m',
        formula: formula.trim() || '100% Segura',
        maintenance: maintenance.trim() || '21 a 28 días',
        imageUrl: imageUrl.trim() || PRESET_SHOWCASE_IMAGES[0].url,
        durationDays: work?.durationDays || 21,
        objectPosition: work?.objectPosition || 'center center'
      },
      work?.id
    );
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'radial-gradient(circle at center, rgba(222, 115, 143, 0.16) 0%, rgba(20, 10, 15, 0.72) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(222, 115, 143, 0.25)'
        }}
        className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-[#DE738F]/15 border border-[#DE738F]/30 flex items-center justify-center text-[#C45774]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground font-serif tracking-tight">
                {isEditing ? 'Editar Trabajo en Exhibición' : 'Nuevo Trabajo en Exhibición'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Personalizá la foto, categoría, técnica y ficha técnica visible en la galería pública.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* FOTO DEL TRABAJO (Image Selector) */}
          <div className="p-3.5 bg-muted/30 rounded-2xl border border-border/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="size-3.5 text-[#DE738F]" />
                <span>Foto de Portada del Trabajo</span>
              </label>

              {/* Image Tabs */}
              <div className="flex rounded-lg bg-background p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    imageTab === 'upload'
                      ? 'bg-[#DE738F] text-white shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Upload className="size-2.5" />
                  <span>Subir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    imageTab === 'url'
                      ? 'bg-[#DE738F] text-white shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LinkIcon className="size-2.5" />
                  <span>Enlace Web</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('preset')}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    imageTab === 'preset'
                      ? 'bg-[#DE738F] text-white shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Sparkles className="size-2.5" />
                  <span>Presets</span>
                </button>
              </div>
            </div>

            {/* Preview and Source Inputs */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Image Preview Box */}
              <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden border-2 border-rose-200/80 dark:border-rose-900/50 shadow-md shrink-0 bg-background group">
                <img
                  src={imageUrl}
                  alt={title || 'Vista previa del set'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold pointer-events-none">
                  Vista Previa
                </div>
              </div>

              {/* Tab: Upload */}
              {imageTab === 'upload' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 w-full flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
                    isDragging
                      ? 'border-[#DE738F] bg-[#DE738F]/10'
                      : 'border-border/80 hover:border-[#DE738F]/50 bg-background/60 hover:bg-background'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload className="size-5 text-[#DE738F] mb-1" />
                  <p className="text-[11px] font-semibold text-foreground">
                    Arrastrá una foto o hacé click para explorar
                  </p>
                  <p className="text-[9.5px] text-muted-foreground mt-0.5">
                    Formatos JPG, PNG o WebP (hasta 3MB)
                  </p>
                </div>
              )}

              {/* Tab: URL */}
              {imageTab === 'url' && (
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-[10px] text-muted-foreground font-medium block">
                    URL directa de imagen (ej: Unsplash, CDN o hosting)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={urlInputValue}
                      onChange={(e) => setUrlInputValue(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:border-[#DE738F]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (urlInputValue.trim()) {
                          setImageUrl(urlInputValue.trim());
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#DE738F] hover:bg-[#C45774] text-white font-semibold text-xs cursor-pointer transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Presets */}
              {imageTab === 'preset' && (
                <div className="flex-1 w-full grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {PRESET_SHOWCASE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`relative rounded-xl overflow-hidden border aspect-video transition-all cursor-pointer ${
                        imageUrl === preset.url
                          ? 'border-[#DE738F] ring-2 ring-[#DE738F]/30'
                          : 'border-border/60 hover:border-[#DE738F]/50 opacity-80 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {imageUrl === preset.url && (
                        <div className="absolute top-1 right-1 size-3.5 rounded-full bg-[#DE738F] text-white flex items-center justify-center">
                          <Check className="size-2" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TÍTULO DEL TRABAJO */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Título del Set de Uñas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Glazed Donut & Cromado Perla"
              className="w-full text-xs font-semibold rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:border-[#DE738F]"
            />
          </div>

          {/* CATEGORÍA Y TÉCNICA (Pill) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Categoría / Pestaña <span className="text-rose-500">*</span>
              </label>
              <LuxurySelect
                value={category}
                onChange={(val) => setCategory(String(val))}
                options={categories.map(cat => ({
                  value: cat.id,
                  label: cat.label
                }))}
                size="sm"
              />
              <span className="text-[9.5px] text-muted-foreground mt-1 block">
                Determina bajo qué pestaña del filtro se agrupará este trabajo.
              </span>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Técnica / Etiqueta Visual (Pill)
              </label>
              <div className="relative">
                <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                <input
                  type="text"
                  value={techniqueTag}
                  onChange={(e) => setTechniqueTag(e.target.value)}
                  placeholder="Ej: Nivelación Rubber, Soft Gel Tips..."
                  className="w-full text-xs font-medium rounded-xl border border-border bg-background pl-7 pr-3 py-2 text-foreground focus:outline-none focus:border-[#DE738F]"
                />
              </div>
              <span className="text-[9.5px] text-muted-foreground mt-1 block">
                Badge flotante que aparece sobre la foto en la tarjeta.
              </span>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Descripción o Detalle Técnico de Autor
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Esmaltado semipermanente blanco translúcido con efecto perlado Aurora y manicuría rusa de corte limpio..."
              className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:border-[#DE738F] resize-none leading-relaxed"
            />
          </div>

          {/* TEXTO INFORMATIVO / GARANTÍA */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3 text-rose-500" />
              <span>Insignia de Durabilidad / Garantía</span>
            </label>
            <input
              type="text"
              value={badgeInfo}
              onChange={(e) => setBadgeInfo(e.target.value)}
              placeholder="Ej: Duración intacta 21+ días • HEMA-Free"
              className="w-full text-xs font-medium rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:border-[#DE738F]"
            />
          </div>

          {/* FICHA TÉCNICA (Modal al hacer click en la web) */}
          <div className="rounded-2xl bg-pink-50/40 dark:bg-rose-950/20 p-3.5 border border-pink-100 dark:border-rose-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#C45774] dark:text-rose-300 font-bold block">
                Ficha Técnica (Ventana de Detalle al Clickear)
              </span>
              <span className="text-[9px] text-muted-foreground">
                Aparece al hacer click en "Quiero Este Diseño"
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1 mb-0.5">
                  <Clock className="size-2.5 text-pink-500" />
                  <span>Tiempo Estimado</span>
                </label>
                <input
                  type="text"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="~60 - 80m"
                  className="w-full text-[11px] font-medium rounded-lg border border-border/80 bg-background px-2 py-1.5 text-foreground focus:outline-none focus:border-[#DE738F]"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1 mb-0.5">
                  <ShieldCheck className="size-2.5 text-emerald-600" />
                  <span>Fórmula / Gel</span>
                </label>
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="100% Segura / HEMA-Free"
                  className="w-full text-[11px] font-medium rounded-lg border border-border/80 bg-background px-2 py-1.5 text-foreground focus:outline-none focus:border-[#DE738F]"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1 mb-0.5">
                  <CheckCircle2 className="size-2.5 text-pink-500" />
                  <span>Mantenimiento</span>
                </label>
                <input
                  type="text"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  placeholder="21 a 28 días"
                  className="w-full text-[11px] font-medium rounded-lg border border-border/80 bg-background px-2 py-1.5 text-foreground focus:outline-none focus:border-[#DE738F]"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] hover:opacity-95 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Trabajo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
