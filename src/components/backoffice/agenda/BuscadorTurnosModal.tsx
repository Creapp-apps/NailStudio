import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Calendar as CalendarIcon,
  User,
  Clock,
  X,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Appointment, NailTechnician } from '../../../types/nailStudio';
import { INITIAL_SERVICES } from '../../../services/mockData';
import { storage } from '../../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  techs: NailTechnician[];
  onSelectAppointment: (appointment: Appointment) => void;
}

type FilterPreset = 'todos' | 'hoy' | 'en_mesa' | 'confirmados' | 'pendientes';

export const BuscadorTurnosModal: React.FC<Props> = ({
  isOpen,
  onClose,
  appointments,
  techs,
  onSelectAppointment
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterPreset>('todos');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const services = useMemo(() => {
    const s = storage.getServices();
    return s.length > 0 ? s : INITIAL_SERVICES;
  }, []);

  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    // Filter preset
    if (filter === 'hoy') {
      list = list.filter(a => a.scheduledDate === todayStr);
    } else if (filter === 'en_mesa') {
      list = list.filter(a => a.status === 'in_progress');
    } else if (filter === 'confirmados') {
      list = list.filter(a => a.status === 'confirmed');
    } else if (filter === 'pendientes') {
      list = list.filter(a => a.status === 'pending_deposit' || a.status === 'pending');
    }

    // Query filter
    if (query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter(a => {
        const srv = services.find(s => s.id === a.serviceId);
        const tech = techs.find(t => t.id === a.techId);
        return (
          a.clientName.toLowerCase().includes(q) ||
          a.clientPhone.includes(q) ||
          (a.clientEmail && a.clientEmail.toLowerCase().includes(q)) ||
          a.scheduledDate.includes(q) ||
          (srv && srv.title.toLowerCase().includes(q)) ||
          (tech && tech.name.toLowerCase().includes(q))
        );
      });
    }

    return list.sort((a, b) => `${b.scheduledDate} ${b.scheduledTime}`.localeCompare(`${a.scheduledDate} ${a.scheduledTime}`));
  }, [appointments, query, filter, todayStr, services, techs]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por clienta, teléfono, servicio o fecha (ej: Sofía, 28/09)..."
            className="flex-1 bg-transparent border-none text-foreground text-sm focus:outline-none placeholder:text-muted-foreground/60"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground text-xs p-1"
            >
              Borrar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/60 bg-background/50 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter('todos')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              filter === 'todos' ? 'bg-[#DE738F] text-white shadow-xs' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            Todos ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('hoy')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              filter === 'hoy' ? 'bg-[#DE738F] text-white shadow-xs' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setFilter('en_mesa')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              filter === 'en_mesa' ? 'bg-amber-500 text-white shadow-xs' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            En Mesa
          </button>
          <button
            onClick={() => setFilter('confirmados')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              filter === 'confirmados' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            Confirmados
          </button>
          <button
            onClick={() => setFilter('pendientes')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              filter === 'pendientes' ? 'bg-rose-500 text-white shadow-xs' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            Pendiente Seña
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
          {filteredAppointments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-1">
              <CalendarIcon className="size-8 mx-auto opacity-40 mb-2" />
              <p className="font-semibold text-foreground text-sm">No se encontraron turnos</p>
              <p className="text-xs">Intentá con otro nombre de clienta o cambiá los filtros.</p>
            </div>
          ) : (
            filteredAppointments.map(apt => {
              const srv = services.find(s => s.id === apt.serviceId);
              const tech = techs.find(t => t.id === apt.techId);

              return (
                <div
                  key={apt.id}
                  onClick={() => {
                    onSelectAppointment(apt);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-border/70 hover:border-[#DE738F] bg-card hover:bg-rose-500/[0.04] cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm group-hover:text-[#DE738F] transition-colors truncate">
                        {apt.clientName}
                      </span>
                      {apt.status === 'in_progress' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">
                          En Mesa
                        </span>
                      )}
                      {apt.status === 'confirmed' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                          Confirmado
                        </span>
                      )}
                      {apt.status === 'pending_deposit' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/30">
                          Seña Pendiente
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                      <span>{srv?.title || 'Servicio de Manicuría'}</span>
                      <span>•</span>
                      <span>{tech?.name || 'Manicurista'}</span>
                      <span>•</span>
                      <span>{apt.totalDurationMin} min</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-foreground text-sm block">
                      {apt.scheduledTime} hs
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {apt.scheduledDate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
