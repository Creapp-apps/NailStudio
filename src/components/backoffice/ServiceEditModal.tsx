import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Clock,
  DollarSign,
  Tag,
  ImageIcon,
  Plus,
  Check
} from 'lucide-react';
import { NailService, ServiceCategory } from '../../types/nailStudio';

interface ServiceEditModalProps {
  service: NailService | null;
  onClose: () => void;
  onSave: (data: Omit<NailService, 'id'>) => void;
  existingCategories?: string[];
}

const DEFAULT_IMAGES = [
  {
    name: 'Kapping Gel Ruso',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Semipermanente Haute Gloss',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Soft Gel Press-On Tips',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Esculpidas Acrílico / Polygel',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
  }
];

export const ServiceEditModal: React.FC<ServiceEditModalProps> = ({
  service,
  onClose,
  onSave,
  existingCategories = []
}) => {
  const [title, setTitle] = useState(service?.title || '');

  // Category state
  const isInitialCustom = service?.category && !['kapping', 'semipermanente', 'soft_gel', 'esculpidas', 'otros'].includes(service.category);
  const [categoryType, setCategoryType] = useState<string>(isInitialCustom ? 'custom' : (service?.category || 'kapping'));
  const [customCategoryName, setCustomCategoryName] = useState(isInitialCustom ? (service?.category || '') : '');

  const [basePrice, setBasePrice] = useState<number>(service?.basePrice ?? 18500);
  const [baseDurationMin, setBaseDurationMin] = useState<number>(service?.baseDurationMin ?? 75);
  const [description, setDescription] = useState(service?.description || '');
  const [badge, setBadge] = useState(service?.badge || '');
  const [recommendedFor, setRecommendedFor] = useState(service?.recommendedFor || '');

  // Image tab and url state
  const [imageTab, setImageTab] = useState<'url' | 'upload' | 'preset'>('upload');
  const [imageUrl, setImageUrl] = useState(
    service?.imageUrl || DEFAULT_IMAGES[0].url
  );
  const [urlInputValue, setUrlInputValue] = useState(
    service?.imageUrl?.startsWith('http') ? service.imageUrl : ''
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      alert('Por favor ingresa un título para el servicio.');
      return;
    }

    const finalCategory: ServiceCategory =
      categoryType === 'custom'
        ? (customCategoryName.trim().toLowerCase().replace(/\s+/g, '_') || 'otros')
        : (categoryType as ServiceCategory);

    onSave({
      title: title.trim(),
      category: finalCategory,
      basePrice: Number(basePrice) || 0,
      baseDurationMin: Number(baseDurationMin) || 60,
      description: description.trim(),
      badge: badge.trim() || undefined,
      recommendedFor: recommendedFor.trim(),
      imageUrl: imageUrl.trim() || DEFAULT_IMAGES[0].url
    });
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
        background: 'radial-gradient(circle at center, rgba(222, 115, 143, 0.14) 0%, rgba(20, 10, 15, 0.65) 100%)',
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
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DE738F]/15 flex items-center justify-center text-[#DE738F]">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-serif">
                {service ? 'Editar Técnica Estructural' : 'Nueva Técnica Estructural'}
              </h3>
              <p className="text-xs text-muted-foreground">
                Configura los detalles visibles en la landing pública y el paso 1 de reserva.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Título del Servicio / Técnica *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Kapping Gel Fortalecedor (Manicura Rusa)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F] focus:ring-1 focus:ring-[#DE738F]"
            />
          </div>

          {/* Categoría / Tipo y Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Tipo / Categoría de Servicio
              </label>
              <select
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              >
                <option value="kapping">Kapping (Nivelación Rubber)</option>
                <option value="semipermanente">Semipermanente Haute Gloss</option>
                <option value="soft_gel">Soft Gel (Press-On Tips)</option>
                <option value="esculpidas">Esculpidas (Acrílico / Polygel)</option>
                <option value="otros">Otros / Tratamiento Especial</option>
                {existingCategories
                  .filter((cat) => !['kapping', 'semipermanente', 'soft_gel', 'esculpidas', 'otros'].includes(cat))
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ').toUpperCase()} (Personalizada)
                    </option>
                  ))}
                <option value="custom">➕ Crear nueva categoría personalizada...</option>
              </select>

              {categoryType === 'custom' && (
                <div className="mt-2 animate-fade-in">
                  <input
                    type="text"
                    required
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="Ej: Poligel Híbrido, Spa de Pies, Dual Forms..."
                    className="w-full px-3 py-2 rounded-xl border border-[#DE738F]/50 bg-background text-foreground text-xs outline-none focus:border-[#DE738F]"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Se creará como una nueva categoría filtrable en tu catálogo.
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Badge Destacado (Opcional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej: MÁS SOLICITADO, TENDENCIA 2026, VIP..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['MÁS SOLICITADO', 'TENDENCIA 2026', 'RECOMENDADO', 'VIP'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBadge(preset)}
                    className="text-[10px] px-2 py-0.5 rounded bg-muted hover:bg-[#DE738F]/10 text-muted-foreground hover:text-[#C45774] border border-border transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Precio y Duración */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Precio Base ($ ARS) *</span>
                <span className="text-xs font-extrabold text-[#C45774]">
                  ${Number(basePrice || 0).toLocaleString('es-AR')}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  $
                </span>
                <input
                  type="number"
                  required
                  min={0}
                  step={500}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Duración en Mesa *</span>
                <span className="text-xs text-muted-foreground">
                  <Clock size={12} className="inline mr-1" />
                  {baseDurationMin} min
                </span>
              </label>
              <input
                type="number"
                required
                min={15}
                step={5}
                value={baseDurationMin}
                onChange={(e) => setBaseDurationMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Descripción del Tratamiento
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué incluye la técnica (ej: Limpieza profunda de cutículas con torno y nivelación con gel Rubber...)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F] resize-none"
            />
          </div>

          {/* Recomendado para */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Recomendado para... (Consejo de Experta)
            </label>
            <input
              type="text"
              value={recommendedFor}
              onChange={(e) => setRecommendedFor(e.target.value)}
              placeholder="Ej: Uñas frágiles, quebradizas o personas que buscan crecimiento natural sin extensiones."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
            />
          </div>

          {/* Imagen / Foto de la Técnica */}
          <div className="p-3.5 bg-muted/30 rounded-2xl border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#DE738F]" />
                Foto de la Técnica (Portada en la Web)
              </label>

              <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    imageTab === 'upload'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Upload size={11} className="inline mr-1" /> Subir
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    imageTab === 'url'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LinkIcon size={11} className="inline mr-1" /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('preset')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    imageTab === 'preset'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Sparkles size={11} className="inline mr-1" /> Galería
                </button>
              </div>
            </div>

            {/* Preview & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Thumbnail Preview */}
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-border shrink-0 bg-muted relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-[10px]">
                    <ImageIcon size={22} className="opacity-40 mb-1" />
                    Sin foto
                  </div>
                )}
                {badge && (
                  <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur">
                    {badge}
                  </span>
                )}
              </div>

              {/* Input Area based on Tab */}
              <div className="flex-1 w-full">
                {imageTab === 'upload' && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#DE738F] bg-[#DE738F]/10'
                        : 'border-border hover:border-[#DE738F]/60 hover:bg-muted/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload size={20} className="mx-auto mb-1.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">
                      Arrastrá una foto o hacé clic para seleccionar
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      PNG, JPG, WebP hasta 3MB
                    </p>
                  </div>
                )}

                {imageTab === 'url' && (
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      value={urlInputValue}
                      onChange={(e) => {
                        setUrlInputValue(e.target.value);
                        if (e.target.value.trim().startsWith('http')) {
                          setImageUrl(e.target.value.trim());
                        }
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-[#DE738F]"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Pegá el enlace directo de una imagen de internet o Unsplash.
                    </p>
                  </div>
                )}

                {imageTab === 'preset' && (
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setUrlInputValue(preset.url);
                        }}
                        className={`p-1.5 rounded-lg border text-left text-[11px] transition-all flex items-center gap-2 cursor-pointer ${
                          imageUrl === preset.url
                            ? 'border-[#DE738F] bg-[#DE738F]/10 text-foreground font-bold'
                            : 'border-border bg-background hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-8 h-8 rounded object-cover shrink-0" />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#DE738F]/25 cursor-pointer hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Check size={16} />
              Guardar Técnica
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
