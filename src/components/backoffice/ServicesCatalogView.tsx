import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { NailService, RemovalOption, NailArtTier, ServiceCategory } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { INITIAL_SERVICES, REMOVAL_OPTIONS, NAIL_ART_TIERS } from '../../services/mockData';

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

  // Modals for Create/Edit
  const [editingService, setEditingService] = useState<NailService | null>(null);
  const [isCreatingService, setIsCreatingService] = useState<boolean>(false);

  const [editingRemoval, setEditingRemoval] = useState<RemovalOption | null>(null);
  const [isCreatingRemoval, setIsCreatingRemoval] = useState<boolean>(false);

  const [editingTier, setEditingTier] = useState<NailArtTier | null>(null);
  const [isCreatingTier, setIsCreatingTier] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
            {onOpenBookingPreview && (
              <button
                type="button"
                onClick={onOpenBookingPreview}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#DE738F] to-[#C45774] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#DE738F]/30 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
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
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Paso 1: Técnicas Estructurales Base
              </h2>
              <p className="text-xs text-muted-foreground">
                Es la elección inicial de la clienta al agendar (Kapping, Semipermanente, Soft Gel, Esculpidas).
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => {
              const isPaused = srv.isActive === false;
              return (
                <div
                  key={srv.id}
                  className={`rounded-2xl border p-5 transition-all flex flex-col justify-between bg-card ${
                    isPaused
                      ? 'opacity-60 border-dashed border-border'
                      : 'border-border/80 hover:border-[#DE738F]/50 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: Category & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C45774] bg-[#DE738F]/10 px-2 py-0.5 rounded-md border border-[#DE738F]/25">
                          {srv.category}
                        </span>
                        {srv.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#DE738F] bg-[#DE738F]/15 px-2 py-0.5 rounded-full border border-[#DE738F]/30">
                            {srv.badge}
                          </span>
                        )}
                      </div>

                      {/* Active Status Badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleServiceActive(srv)}
                        title={isPaused ? 'Click para activar' : 'Click para pausar'}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                          isPaused
                            ? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isPaused ? 'Pausado' : '● Activo en Web'}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground mb-1">
                      {srv.title}
                    </h3>

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

                  {/* Price & Duration Row */}
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold text-[#C45774]">
                        ${srv.basePrice.toLocaleString('es-AR')}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {srv.baseDurationMin} min
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingService(srv)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-[#C45774] hover:bg-[#DE738F]/10 transition-all cursor-pointer"
                        title="Editar técnica"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv.id, srv.title)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Eliminar técnica"
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

interface ServiceModalProps {
  service: NailService | null;
  onClose: () => void;
  onSave: (data: Omit<NailService, 'id'>) => void;
}

const ServiceEditModal: React.FC<ServiceModalProps> = ({ service, onClose, onSave }) => {
  const [title, setTitle] = useState(service?.title || '');
  const [category, setCategory] = useState<ServiceCategory>(service?.category || 'kapping');
  const [basePrice, setBasePrice] = useState<number>(service?.basePrice || 18500);
  const [baseDurationMin, setBaseDurationMin] = useState<number>(service?.baseDurationMin || 75);
  const [description, setDescription] = useState(service?.description || '');
  const [badge, setBadge] = useState(service?.badge || '');
  const [recommendedFor, setRecommendedFor] = useState(service?.recommendedFor || '');
  const [imageUrl, setImageUrl] = useState(
    service?.imageUrl ||
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Por favor ingresa un título para el servicio.');
    onSave({
      title: title.trim(),
      category,
      basePrice: Number(basePrice) || 0,
      baseDurationMin: Number(baseDurationMin) || 60,
      description: description.trim(),
      badge: badge.trim() || undefined,
      recommendedFor: recommendedFor.trim(),
      imageUrl: imageUrl.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-3xl border border-border shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <h3 className="text-lg font-bold text-foreground font-serif">
            {service ? 'Editar Técnica Base (Paso 1)' : 'Nueva Técnica Base (Paso 1)'}
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
              Título del Servicio / Técnica *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Kapping Gel Fortalecedor (Manicura Rusa)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              >
                <option value="kapping">Kapping (Nivelación Rubber)</option>
                <option value="semipermanente">Semipermanente</option>
                <option value="soft_gel">Soft Gel (Press-On Tips)</option>
                <option value="esculpidas">Esculpidas (Acrílico / Polygel)</option>
                <option value="otros">Otros / Tratamientos Especiales</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Badge Destacado (Opcional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej: Más Solicitado, Tendencia 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Precio Base ($ ARS) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={500}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Duración Base (Minutos en Mesa) *
              </label>
              <input
                type="number"
                required
                min={15}
                step={15}
                value={baseDurationMin}
                onChange={(e) => setBaseDurationMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Descripción del Tratamiento
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué incluye la técnica (ej. limpieza profunda de cutículas con torno y nivelación con gel Rubber...)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Recomendado para...
            </label>
            <input
              type="text"
              value={recommendedFor}
              onChange={(e) => setRecommendedFor(e.target.value)}
              placeholder="Ej: Uñas frágiles, quebradizas o personas que buscan crecimiento natural."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-[#DE738F]"
            />
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
              Guardar Técnica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 sm:p-7">
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
    </div>
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

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 sm:p-7">
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
    </div>
  );
};
