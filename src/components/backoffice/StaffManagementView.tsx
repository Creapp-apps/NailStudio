import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Star, Calendar, Clock, Plus, Trash2, UserPlus, X, Check, DollarSign } from 'lucide-react';
import { NailTechnician } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileImageUploader } from '../common/ProfileImageUploader';

interface Props {
  techs: NailTechnician[];
}

const AVAILABLE_SPECIALTIES = [
  'Manicura Rusa',
  'Kapping Gel',
  'Soft Gel Tips',
  'Polygel Sculpt',
  'Nail Art 3D',
  'Cromados & Efectos',
  'Cat Eye Magnético',
  'Esmaltado Semipermanente',
  'Recuperación Ungueal'
];

export const StaffManagementView: React.FC<Props> = ({ techs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Nail Artist & Especialista');
  const [avatar, setAvatar] = useState('');
  const [commissionRate, setCommissionRate] = useState(50);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    'Manicura Rusa',
    'Kapping Gel'
  ]);

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    storage.addTech({
      name: name.trim(),
      role: role.trim() || 'Nail Artist',
      avatar: avatar.trim() || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
      specialties: selectedSpecialties.length > 0 ? selectedSpecialties : ['Manicura Rusa'],
      rating: 5.0,
      reviewsCount: 0,
      commissionRate: commissionRate / 100
    });

    // Reset & close
    setName('');
    setRole('Nail Artist & Especialista');
    setAvatar('');
    setCommissionRate(50);
    setSelectedSpecialties(['Manicura Rusa', 'Kapping Gel']);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, techName: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar a ${techName} del equipo?`)) {
      storage.deleteTech(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Equipo de Manicuristas & Staff Técnico</h2>
          <p className="text-xs text-muted-foreground">
            Gestión de profesionales, asignación de mesas y esquema de comisiones por set
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground text-xs gap-1.5 shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>Agregar Especialista</span>
        </Button>
      </div>

      {techs.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-rose-200/80 bg-rose-50/20">
          <div className="max-w-md mx-auto space-y-4">
            <div className="size-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
              <UserPlus className="size-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">No hay especialistas registradas</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Agrega a las manicuristas de tu salón para habilitar la agenda por puestos de trabajo, cálculo de liquidaciones y asignación en turnos.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground text-xs gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Agregar Primera Especialista</span>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {techs.map((tech, idx) => (
            <Card key={tech.id} className="flex flex-col justify-between group hover:border-rose-300 transition-colors">
              <CardHeader className="pb-3.5">
                <div className="flex items-start justify-between">
                  <Avatar className="size-14 ring-2 ring-rose-300/80 ring-offset-2 ring-offset-white shadow-sm">
                    <AvatarImage src={tech.avatar} alt={tech.name} className="object-cover" />
                    <AvatarFallback className="font-bold text-sm bg-rose-100 text-rose-700">
                      {tech.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                      Mesa {idx + 1}
                    </span>
                    <button
                      onClick={() => handleDelete(tech.id, tech.name)}
                      className="p-1 text-muted-foreground/60 hover:text-red-600 rounded transition-colors opacity-80 group-hover:opacity-100"
                      title="Eliminar especialista"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <CardTitle className="text-base font-bold text-foreground">{tech.name}</CardTitle>
                  <CardDescription className="text-xs text-rose-600 font-medium">{tech.role}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-3.5 text-xs">
                <div className="rounded-xl bg-rose-500/[0.03] p-3 space-y-2 border border-rose-100">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-rose-500" /> Días de atención:</span>
                    <span className="font-semibold text-foreground">Mar a Sáb</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-rose-500" /> Horario habitual:</span>
                    <span className="font-semibold text-foreground">09:00 a 19:30 hs</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-rose-100/60">
                    <span className="flex items-center gap-1.5"><DollarSign className="size-3.5 text-emerald-600" /> Comisión pactada:</span>
                    <span className="font-bold text-emerald-700">{Math.round((tech.commissionRate || 0.5) * 100)}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Técnicas Habilitadas
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tech.specialties.map(spec => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-100/50 text-rose-900 border border-rose-200/60"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 pb-3 border-t border-rose-100/70 bg-rose-500/[0.02] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{tech.rating || 5.0}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">({tech.reviewsCount || 0} reviews)</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Activa en Salón
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Agregar Especialista (Central Floating Toast via Portal) */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(26, 17, 21, 0.55)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto',
            animation: 'modalBackdropFade 0.25s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '540px',
              boxShadow: '0 30px 80px -15px rgba(26, 17, 21, 0.35), 0 0 0 1px rgba(222, 115, 143, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'min(92vh, 720px)',
              margin: 'auto',
              animation: 'modalCardPop 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Modal Header (Fixed) */}
            <div className="p-4 sm:p-5 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-rose-100/80 flex items-center justify-center text-rose-600 shadow-xs">
                  <UserPlus className="size-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight">Nueva Especialista</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Alta de manicurista en el staff del salón</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-rose-100/60 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreate} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
                {/* Row 1: Nombre & Cargo (2 Cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block text-zinc-700">Nombre y Apellido *</label>
                    <input
                      required
                      placeholder="ej. Lucía Morales"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block text-zinc-700">Rol o Cargo *</label>
                    <input
                      required
                      placeholder="ej. Master Nail Artist & Rusa"
                      value={role}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    />
                  </div>
                </div>

                {/* Row 2: Comisión & Helper (2 Cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block text-zinc-700">% Comisión Manicurista</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={commissionRate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommissionRate(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white pr-7"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-1.5 h-[34px]">
                    <DollarSign className="size-3.5 text-emerald-600 shrink-0" />
                    <span>Calculado en liquidaciones</span>
                  </div>
                </div>

                {/* Row 3: Foto de Perfil (FULL WIDTH - Spaciously rendered with Drag & Drop + Calibrador) */}
                <div className="space-y-1.5">
                  <ProfileImageUploader
                    value={avatar}
                    onChange={(croppedUrl) => setAvatar(croppedUrl)}
                    label="Foto de Perfil (Drag & Drop + Calibrador Instagram)"
                  />
                </div>

                {/* Row 4: Técnicas & Especialidades */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block text-zinc-700">Técnicas & Especialidades</label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 border border-zinc-200/80 rounded-xl bg-zinc-50/50">
                    {AVAILABLE_SPECIALTIES.map(spec => {
                      const isSelected = selectedSpecialties.includes(spec);
                      return (
                        <button
                          type="button"
                          key={spec}
                          onClick={() => toggleSpecialty(spec)}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-600 font-semibold shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:border-rose-300'
                          }`}
                        >
                          {isSelected && <Check className="size-3 inline mr-1" />}
                          {spec}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer (Fixed) */}
              <div className="p-3.5 sm:p-4 border-t border-rose-100/80 bg-zinc-50/70 flex items-center justify-end gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground text-xs gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Guardar Especialista</span>
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
