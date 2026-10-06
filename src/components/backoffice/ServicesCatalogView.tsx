import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  AlertCircle,
  HelpCircle,
  Tag,
  Image as ImageIcon,
  RotateCcw,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Star,
  Filter,
  Save,
  Loader2
} from 'lucide-react';
import { NailService, RemovalOption, NailArtTier, ServiceCategory } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { INITIAL_SERVICES, REMOVAL_OPTIONS, NAIL_ART_TIERS } from '../../services/mockData';
import { ServiceEditModal } from './ServiceEditModal';

interface Props {
  onOpenBookingPreview?: () => void;
}

type TabKey = 'services' | 'removals' | 'nail_art';

export const ServicesCatalogView: React.FC<Props> = ({ onOpenBookingPreview }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('services');

  // Storage states
  const [services, setServices] = useState<NailService[]>(() => storage.getServices());
  const [removals, setRemovals] = useState<RemovalOption[]>(() => storage.getRemovals());
  const [nailArtTiers, setNailArtTiers] = useState<NailArtTier[]>(() => storage.getNailArtTiers());

  // Filter for services tab
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');

  // Modals for Create/Edit
  const [editingService, setEditingService] = useState<NailService | null>(null);
  const [isCreatingService, setIsCreatingService] = useState<boolean>(false);

  const [editingRemoval, setEditingRemoval] = useState<RemovalOption | null>(null);
  const [isCreatingRemoval, setIsCreatingRemoval] = useState<boolean>(false);

  const [editingTier, setEditingTier] = useState<NailArtTier | null>(null);
  const [isCreatingTier, setIsCreatingTier] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    storage.saveServices(services);
    storage.saveRemovals(removals);
    storage.saveNailArtTiers(nailArtTiers);
    const ok = await storage.pushCatalogToSupabase();
    setIsSaving(false);
    if (ok) {
      setSavedSuccess(true);
      showToast('✓ Todo el catálogo fue guardado y sincronizado con éxito en la nube');
      setTimeout(() => setSavedSuccess(false), 3500);
    } else {
      showToast('Cambios guardados localmente');
    }
  };

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setServices(storage.getServices());
      setRemovals(storage.getRemovals());
      setNailArtTiers(storage.getNailArtTiers());
    });
    return unsub;
  }, []);

  // --- Handlers: Services ---
  const handleSaveService = (serviceData: Omit<NailService, 'id'>, existingId?: string) => {
    if (existingId) {
      storage.updateService({ ...serviceData, id: existingId });
      showToast('Técnica base actualizada con éxito');
    } else {
      storage.addService(serviceData);
      showToast('Nueva técnica agregada al modal de reservas');
    }
    setEditingService(null);
    setIsCreatingService(false);
  };

  const handleDeleteService = (id: string, title: string) => {
    if (confirm(`¿Estás segura de eliminar la técnica "${title}" del modal de reserva?`)) {
      storage.deleteService(id);
      showToast(`Técnica "${title}" eliminada`);
    }
  };

  const handleToggleServiceActive = (srv: NailService) => {
    const updated = { ...srv, isActive: srv.isActive === false ? true : false };
    storage.updateService(updated);
    showToast(updated.isActive ? `"${srv.title}" ahora está visible` : `"${srv.title}" fue pausado`);
  };

  // --- Handlers: Reordering Services ---
  const handleMoveService = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= services.length) return;
    const updated = [...services];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    storage.saveServices(updated);
    setServices(updated);
    showToast(`Posición actualizada: "${moved.title}" ahora está en lugar #${toIndex + 1}`);
  };

  const handleMoveServiceToTop = (fromIndex: number) => {
    if (fromIndex === 0) return;
    const updated = [...services];
    const [moved] = updated.splice(fromIndex, 1);
    updated.unshift(moved);
    storage.saveServices(updated);
    setServices(updated);
    showToast(`⭐ "${moved.title}" ahora es la 1° técnica visible en la web`);
  };

  const handleMoveServiceToPosition = (fromIndex: number, targetPos: number) => {
    const toIndex = targetPos - 1;
    if (toIndex < 0 || toIndex >= services.length || toIndex === fromIndex) return;
    const updated = [...services];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    storage.saveServices(updated);
    setServices(updated);
    showToast(`Posición actualizada: "${moved.title}" ahora está en lugar #${targetPos}`);
  };

  // --- Handlers: Removals ---
  const handleSaveRemoval = (remData: Omit<RemovalOption, 'id'>, existingId?: string) => {
    if (existingId) {
      storage.updateRemoval({ ...remData, id: existingId });
      showToast('Opción de retiro actualizada con éxito');
    } else {
      storage.addRemoval(remData);
      showToast('Nueva opción de retiro agregada al Paso 2');
    }
    setEditingRemoval(null);
    setIsCreatingRemoval(false);
  };

  const handleDeleteRemoval = (id: string, label: string) => {
    if (confirm(`¿Estás segura de eliminar "${label}"?`)) {
      storage.deleteRemoval(id);
      showToast(`Opción "${label}" eliminada`);
    }
  };

  const handleToggleRemovalActive = (rem: RemovalOption) => {
    const updated = { ...rem, isActive: rem.isActive === false ? true : false };
    storage.updateRemoval(updated);
    showToast(updated.isActive ? `"${rem.label}" ahora está visible` : `"${rem.label}" fue pausado`);
  };

  // --- Handlers: Nail Art Tiers ---
  const handleSaveTier = (tierData: Omit<NailArtTier, 'id'>, existingId?: string) => {
    if (existingId) {
      storage.updateNailArtTier({ ...tierData, id: existingId });
      showToast('Nivel de Nail Art actualizado con éxito');
    } else {
      storage.addNailArtTier(tierData);
      showToast('Nuevo nivel de Nail Art agregado al Paso 3');
    }
    setEditingTier(null);
    setIsCreatingTier(false);
  };

  const handleDeleteTier = (id: string, name: string) => {
    if (confirm(`¿Estás segura de eliminar "${name}"?`)) {
      storage.deleteNailArtTier(id);
      showToast(`Nivel "${name}" eliminado`);
    }
  };

  const handleToggleTierActive = (tier: NailArtTier) => {
    const updated = { ...tier, isActive: tier.isActive === false ? true : false };
    storage.updateNailArtTier(updated);
    showToast(updated.isActive ? `"${tier.name}" ahora está visible` : `"${tier.name}" fue pausado`);
  };

  const handleResetToDefaults = () => {
    if (confirm('¿Deseas restablecer todos los servicios, retiros y niveles de Nail Art a sus valores predeterminados de fábrica?')) {
      storage.saveServices(INITIAL_SERVICES);
      storage.saveRemovals(REMOVAL_OPTIONS);
      storage.saveNailArtTiers(NAIL_ART_TIERS);
      showToast('Catálogo restablecido a valores predeterminados');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-foreground pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[99999] bg-[#2A151C] text-white border border-[#DE738F]/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-[#34D399]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#241318] via-[#1B0F13] to-[#2D161E] border border-[#DE738F]/25 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DE738F]/20 text-[#FFAEC0] border border-[#DE738F]/30 flex items-center gap-1.5">
                <Sparkles size={13} /> Embudo de Reserva
              </span>
              <span className="text-xs text-rose-200/70">Paso a Paso Interactivo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white mb-2">
              Carta de Servicios & Tratamientos
            </h1>
            <p className="text-sm text-rose-100/80 max-w-2xl leading-relaxed">
              Administra los precios, tiempos en cabina y descripciones que se le ofrecen a la clienta en cada paso del modal de reserva pública. Los cambios se sincronizan en tiempo real con la agenda y el Nail-Bot.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {savedSuccess && (
              <span className="px-3.5 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 animate-fade-in">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>¡Cambios Guardados en Nube!</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 hover:shadow-emerald-700/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>

            {onOpenBookingPreview && (
              <button
                type="button"
                onClick={onOpenBookingPreview}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold border border-white/20 shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye size={16} /> Ver Modal de Reserva en Vivo
              </button>
            )}

            <button
              type="button"
              onClick={handleResetToDefaults}
              title="Restablecer valores de fábrica"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-rose-200/70 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#DE738F]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Funnel Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-card/60 backdrop-blur border border-border/80 rounded-2xl overflow-x-auto shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#DE738F] text-white shadow-md shadow-[#DE738F]/25'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
          <span>Paso 1: Técnicas Base</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-bold">
            {services.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('removals')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'removals'
              ? 'bg-[#DE738F] text-white shadow-md shadow-[#DE738F]/25'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
          <span>Paso 2: Retiro Previo</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-bold">
            {removals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nail_art')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'nail_art'
              ? 'bg-[#DE738F] text-white shadow-md shadow-[#DE738F]/25'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">3</span>
          <span>Paso 3: Nail Art & Efectos</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-bold">
            {nailArtTiers.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TÉCNICAS BASE (SERVICIOS) */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (() => {
        const uniqueCategories = Array.from(new Set(services.map(s => s.category).filter(Boolean)));
        const categoryLabels: Record<string, string> = {
          kapping: 'Kapping Gel',
          semipermanente: 'Semipermanente',
          soft_gel: 'Soft Gel',
          esculpidas: 'Esculpidas',
          otros: 'Otros'
        };
        const displayedServices = serviceCategoryFilter === 'all'
          ? services
          : services.filter(s => s.category === serviceCategoryFilter);

        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Paso 1: Técnicas Estructurales Base
                </h2>
                <p className="text-xs text-muted-foreground">
                  Organiza el orden de aparición en la landing web y el modal de reservas. El primer servicio (#1) se destaca en el inicio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingService(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#DE738F]/20 flex items-center gap-2 hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus size={16} /> Nueva Técnica / Servicio
              </button>
            </div>

            {/* Category / Type Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-muted/40 rounded-2xl border border-border/80">
              <button
                type="button"
                onClick={() => setServiceCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  serviceCategoryFilter === 'all'
                    ? 'bg-[#DE738F] text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                Todos los tipos ({services.length})
              </button>
              {uniqueCategories.map(cat => {
                const count = services.filter(s => s.category === cat).length;
                const label = categoryLabels[cat] || cat.replace(/_/g, ' ').toUpperCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setServiceCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      serviceCategoryFilter === cat
                        ? 'bg-[#DE738F] text-white shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedServices.map((srv) => {
                const masterIndex = services.findIndex(s => s.id === srv.id);
                const isFirst = masterIndex === 0;
                const isLast = masterIndex === services.length - 1;
                const isPaused = srv.isActive === false;

                return (
                  <div
                    key={srv.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between bg-card ${
                      isPaused
                        ? 'opacity-60 border-dashed border-border'
                        : 'border-border/80 hover:border-[#DE738F]/50 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top Bar: Order & Position Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-muted/50 border border-border/60 mb-3.5">
                        <div className="flex items-center gap-2">
                          {isFirst ? (
                            <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                              <Star size={11} className="fill-amber-400 text-amber-500" />
                              1° Lugar • Se muestra primero en la web
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-muted-foreground bg-background px-2.5 py-0.5 rounded-full border border-border">
                              Posición #{masterIndex + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!isFirst && (
                            <button
                              type="button"
                              onClick={() => handleMoveServiceToTop(masterIndex)}
                              title="Mover este servicio al 1° lugar"
                              className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Star size={10} className="fill-amber-400" />
                              Poner primero
                            </button>
                          )}

                          {/* Direct Position Selector */}
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span>Posición:</span>
                            <select
                              value={masterIndex + 1}
                              onChange={(e) => handleMoveServiceToPosition(masterIndex, Number(e.target.value))}
                              className="text-[11px] font-bold bg-background text-foreground border border-border rounded px-1.5 py-0.5 outline-none cursor-pointer"
                            >
                              {services.map((_, pIdx) => (
                                <option key={pIdx} value={pIdx + 1}>
                                  {pIdx + 1}° {pIdx === 0 ? '(Primero)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveService(masterIndex, 'up')}
                            title="Subir de posición"
                            className="p-1 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <ArrowUp size={13} />
                          </button>

                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveService(masterIndex, 'down')}
                            title="Bajar de posición"
                            className="p-1 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Main Info: Thumbnail + Details */}
                      <div className="flex gap-3.5 mb-3">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-border/80 bg-muted relative">
                          <img
                            src={srv.imageUrl || 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80'}
                            alt={srv.title}
                            className="w-full h-full object-cover"
                          />
                          {srv.badge && (
                            <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded bg-black/70 text-white backdrop-blur text-center truncate">
                              {srv.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C45774] bg-[#DE738F]/10 px-2 py-0.5 rounded-md border border-[#DE738F]/25 truncate">
                              {categoryLabels[srv.category] || srv.category.replace(/_/g, ' ').toUpperCase()}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleServiceActive(srv)}
                              title={isPaused ? 'Click para activar en la web' : 'Click para pausar en la web'}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                                isPaused
                                  ? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {isPaused ? 'Pausado' : '● Activo en Web'}
                            </button>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1 mb-1 font-serif">
                            {srv.title}
                          </h3>

                          <div className="flex items-center gap-3">
                            <span className="text-base sm:text-lg font-extrabold text-[#C45774]">
                              ${srv.basePrice.toLocaleString('es-AR')}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={12} /> {srv.baseDurationMin} min
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {srv.description}
                      </p>

                      {/* Recommendation note */}
                      {srv.recommendedFor && (
                        <div className="text-[11px] text-rose-800 dark:text-rose-200/80 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200/50 dark:border-rose-900/30 mb-3">
                          <span className="font-semibold">Recomendado:</span> {srv.recommendedFor}
                        </div>
                      )}
                    </div>

                    {/* Footer Row: Actions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        {srv.badge ? `Badge: ${srv.badge}` : 'Sin badge destacado'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingService(srv)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#C45774] hover:bg-[#DE738F]/10 border border-[#DE738F]/30 transition-all flex items-center gap-1 cursor-pointer"
                          title="Editar técnica"
                        >
                          <Edit2 size={13} />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id, srv.title)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Eliminar técnica"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TAB 2: RETIRO DE PRODUCTO PREVIO */}
      {/* ========================================================================= */}
      {activeTab === 'removals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Paso 2: Retiro de Producto Previo
              </h2>
              <p className="text-xs text-muted-foreground">
                Define las opciones de retiro (service propio, uña natural sin retiro, o retiro cuidadoso de otro salón).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingRemoval(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#DE738F]/20 flex items-center gap-2 hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus size={16} /> Nueva Opción de Retiro
            </button>
          </div>

          <div className="space-y-3">
            {removals.map((rem) => {
              const isPaused = rem.isActive === false;
              return (
                <div
                  key={rem.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card ${
                    isPaused
                      ? 'opacity-60 border-dashed border-border'
                      : 'border-border/80 hover:border-[#DE738F]/50 shadow-sm'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {rem.label}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleToggleRemovalActive(rem)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                          isPaused
                            ? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isPaused ? 'Pausado' : '● Activo'}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {rem.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-bold text-[#C45774]">
                        {rem.additionalPrice === 0 ? 'Sin costo' : `+$${rem.additionalPrice.toLocaleString('es-AR')}`}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 sm:justify-end">
                        <Clock size={12} /> {rem.additionalDurationMin === 0 ? '0 min' : `+${rem.additionalDurationMin} min`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingRemoval(rem)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-[#C45774] hover:bg-[#DE738F]/10 transition-all cursor-pointer"
                        title="Editar opción de retiro"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRemoval(rem.id, rem.label)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Eliminar opción de retiro"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: NIVELES DE NAIL ART & EFECTOS */}
      {/* ========================================================================= */}
      {activeTab === 'nail_art' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Paso 3: Niveles de Nail Art & Efectos
              </h2>
              <p className="text-xs text-muted-foreground">
                Configura los 4 niveles de arte, sus precios adicionales y ejemplos de técnicas para calcular el tiempo justo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingTier(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#DE738F]/20 flex items-center gap-2 hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus size={16} /> Nuevo Nivel de Nail Art
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nailArtTiers.map((tier) => {
              const isPaused = tier.isActive === false;
              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl border p-5 transition-all flex flex-col justify-between bg-card ${
                    isPaused
                      ? 'opacity-60 border-dashed border-border'
                      : 'border-border/80 hover:border-[#DE738F]/50 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: Level & Price */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C45774] bg-[#DE738F]/10 px-2.5 py-0.5 rounded-full border border-[#DE738F]/25">
                          Nivel {tier.tierLevel}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {tier.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleTierActive(tier)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                          isPaused
                            ? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isPaused ? 'Pausado' : '● Activo'}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {tier.description}
                    </p>

                    {/* Example Techniques Chips */}
                    {tier.examples && tier.examples.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tier.examples.map((ex, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Additional Time */}
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-[#C45774]">
                        {tier.price === 0 ? 'Incluido' : `+$${tier.price.toLocaleString('es-AR')}`}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {tier.additionalDurationMin === 0 ? '0 min' : `+${tier.additionalDurationMin} min`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingTier(tier)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-[#C45774] hover:bg-[#DE738F]/10 transition-all cursor-pointer"
                        title="Editar nivel"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTier(tier.id, tier.name)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Eliminar nivel"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / CREATE SERVICE */}
      {/* ========================================================================= */}
      {(isCreatingService || editingService) && (
        <ServiceEditModal
          service={editingService}
          existingCategories={Array.from(new Set(services.map(s => s.category).filter(Boolean)))}
          onClose={() => {
            setEditingService(null);
            setIsCreatingService(false);
          }}
          onSave={(data) => handleSaveService(data, editingService?.id)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / CREATE REMOVAL */}
      {/* ========================================================================= */}
      {(isCreatingRemoval || editingRemoval) && (
        <RemovalEditModal
          removal={editingRemoval}
          onClose={() => {
            setEditingRemoval(null);
            setIsCreatingRemoval(false);
          }}
          onSave={(data) => handleSaveRemoval(data, editingRemoval?.id)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / CREATE NAIL ART TIER */}
      {/* ========================================================================= */}
      {(isCreatingTier || editingTier) && (
        <NailArtTierEditModal
          tier={editingTier}
          onClose={() => {
            setEditingTier(null);
            setIsCreatingTier(false);
          }}
          onSave={(data) => handleSaveTier(data, editingTier?.id)}
        />
      )}
    </div>
  );
};

// ============================================================================
// SUB-MODALS FOR EDITING
// ============================================================================

interface RemovalModalProps {
  removal: RemovalOption | null;
  onClose: () => void;
  onSave: (data: Omit<RemovalOption, 'id'>) => void;
}

const RemovalEditModal: React.FC<RemovalModalProps> = ({ removal, onClose, onSave }) => {
  const [label, setLabel] = useState(removal?.label || '');
  const [description, setDescription] = useState(removal?.description || '');
  const [additionalPrice, setAdditionalPrice] = useState<number>(removal?.additionalPrice ?? 2500);
  const [additionalDurationMin, setAdditionalDurationMin] = useState<number>(removal?.additionalDurationMin ?? 15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return alert('Por favor ingresa un título para la opción de retiro.');
    onSave({
      label: label.trim(),
      description: description.trim(),
      additionalPrice: Number(additionalPrice) || 0,
      additionalDurationMin: Number(additionalDurationMin) || 0
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
        background: 'radial-gradient(circle at center, rgba(222, 115, 143, 0.12) 0%, rgba(20, 10, 15, 0.55) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
        animation: 'modalBackdropFade 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          animation: 'modalCardPop 0.25s ease-out',
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(222, 115, 143, 0.2)'
        }}
        className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <h3 className="text-lg font-bold text-foreground font-serif">
            {removal ? 'Editar Opción de Retiro (Paso 2)' : 'Nueva Opción de Retiro (Paso 2)'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Título / Etiqueta *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: Retiro de nuestro Atelier (Service habitual)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Descripción explicativa
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Requiere remoción cuidadosa con torno ruso para no dañar la lámina ungueal."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Costo Adicional ($ ARS)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={additionalPrice}
                onChange={(e) => setAdditionalPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Coloca 0 si es sin costo (uñas vírgenes).
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Tiempo Adicional (Minutos)
              </label>
              <input
                type="number"
                min={0}
                step={5}
                value={additionalDurationMin}
                onChange={(e) => setAdditionalDurationMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Se suma automáticamente a la agenda.
              </span>
            </div>
          </div>

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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer hover:opacity-95"
            >
              Guardar Retiro
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

interface NailArtTierModalProps {
  tier: NailArtTier | null;
  onClose: () => void;
  onSave: (data: Omit<NailArtTier, 'id'>) => void;
}

const NailArtTierEditModal: React.FC<NailArtTierModalProps> = ({ tier, onClose, onSave }) => {
  const [tierLevel, setTierLevel] = useState<number>(tier?.tierLevel ?? 1);
  const [name, setName] = useState(tier?.name || '');
  const [price, setPrice] = useState<number>(tier?.price ?? 3000);
  const [additionalDurationMin, setAdditionalDurationMin] = useState<number>(tier?.additionalDurationMin ?? 15);
  const [description, setDescription] = useState(tier?.description || '');
  const [examplesInput, setExamplesInput] = useState(tier?.examples ? tier.examples.join(', ') : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Por favor ingresa un nombre para el nivel de Nail Art.');
    const examples = examplesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      tierLevel: Number(tierLevel),
      name: name.trim(),
      price: Number(price) || 0,
      additionalDurationMin: Number(additionalDurationMin) || 0,
      description: description.trim(),
      examples,
      sampleImage: tier?.sampleImage || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80'
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
        background: 'radial-gradient(circle at center, rgba(222, 115, 143, 0.12) 0%, rgba(20, 10, 15, 0.55) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
        animation: 'modalBackdropFade 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          animation: 'modalCardPop 0.25s ease-out',
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(222, 115, 143, 0.2)'
        }}
        className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <h3 className="text-lg font-bold text-foreground font-serif">
            {tier ? `Editar Nivel ${tier.tierLevel} (Paso 3)` : 'Nuevo Nivel de Nail Art (Paso 3)'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Nivel Numérico
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={tierLevel}
                onChange={(e) => setTierLevel(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Nombre / Título del Nivel *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Nivel 1: Sutil & Clásico"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Precio Adicional ($ ARS)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                0 si está incluido (ej. Nivel 0 monocromo).
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Tiempo Adicional (Minutos)
              </label>
              <input
                type="number"
                min={0}
                step={5}
                value={additionalDurationMin}
                onChange={(e) => setAdditionalDurationMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Se adiciona al turno en agenda.
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Descripción del Nivel
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Detalles delicados en 2 a 4 uñas o francesita fina contemporánea."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Técnicas de Ejemplo (separadas por comas)
            </label>
            <input
              type="text"
              value={examplesInput}
              onChange={(e) => setExamplesInput(e.target.value)}
              placeholder="Francesita, Glitter degradé, Foil dorado, Línea minimal"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Se mostrarán como etiquetas debajo de la card en el Paso 3.
            </span>
          </div>

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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer hover:opacity-95"
            >
              Guardar Nivel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
