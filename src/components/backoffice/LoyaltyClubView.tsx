import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Crown,
  Sparkles,
  Gift,
  Users,
  Search,
  Plus,
  Coins,
  Share2,
  Send,
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ClientProfile } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { LuxurySelect } from '../common/LuxurySelect';

interface Props {
  clients: ClientProfile[];
}

export const LoyaltyClubView: React.FC<Props> = ({ clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 'VIP Haute' | 'Gold' | 'Silver'>('all');
  const [adjustModalClient, setAdjustModalClient] = useState<ClientProfile | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState<number>(500);
  const [adjustmentReason, setAdjustmentReason] = useState('Bonificación Fidelidad / Cumpleaños');

  // Salon Loyalty Parameters
  const [cashbackPercent, setCashbackPercent] = useState(5); // 5% in points
  const [pointValuePesos, setPointValuePesos] = useState(1); // 1 point = $1 ARS
  const [referralBonus, setReferralBonus] = useState(1000); // 1000 points for referral

  // Stats calculation
  const totalPointsCirculating = clients.reduce((sum, c) => sum + (c.pointsBalance || 0), 0);
  const vipCount = clients.filter(c => c.tier === 'VIP Haute').length;
  const goldCount = clients.filter(c => c.tier === 'Gold').length;
  const silverCount = clients.filter(c => c.tier === 'Silver' || !c.tier).length;

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.referralCode && c.referralCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = selectedTierFilter === 'all' || (c.tier || 'Silver') === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  const handleApplyPointsAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalClient) return;

    const newBalance = Math.max(0, (adjustModalClient.pointsBalance || 0) + Number(pointsAdjustment));
    
    // Auto upgrade tier based on points or visits
    let newTier = adjustModalClient.tier;
    if (newBalance >= 5000 || adjustModalClient.totalVisits >= 10) {
      newTier = 'VIP Haute';
    } else if (newBalance >= 2000 || adjustModalClient.totalVisits >= 5) {
      newTier = 'Gold';
    }

    const updated: ClientProfile = {
      ...adjustModalClient,
      pointsBalance: newBalance,
      tier: newTier,
      technicianNotes: `${adjustModalClient.technicianNotes || ''}\n[Puntos: ${pointsAdjustment > 0 ? '+' : ''}${pointsAdjustment} pts - ${adjustmentReason}]`.trim()
    };

    storage.updateClient(updated);
    setAdjustModalClient(null);
  };

  const handleSendPwaWalletLink = (client: ClientProfile) => {
    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    const pointsValue = (client.pointsBalance || 0) * pointValuePesos;
    const message = `*ATELIER NAILS & CO. - CLUB PRIVILEGE* 👑\n\n` +
      `¡Hola ${client.name}! Tenés acumulados *${(client.pointsBalance || 0).toLocaleString('es-AR')} Nail Points* ` +
      `(equivalentes a *$${pointsValue.toLocaleString('es-AR')}* de descuento en tus services).\n\n` +
      `✦ Nivel Actual: *${client.tier || 'Silver'}*\n` +
      `✦ Tu Código de Referida: *${client.referralCode}* (¡invitá amigas y ganá ${referralBonus} pts extra!)\n\n` +
      `Consultá tu tarjeta VIP y canjes disponibles desde tu billetera digital:\n` +
      `https://atelier-nails.app/pwa`;

    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="size-5 text-amber-500" />
            <h2 className="text-xl font-bold font-serif-glam text-foreground tracking-wide">
              Club Privilege & Programa de Puntos
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fidelizá a tus clientas con billetera de puntos digitales, niveles de membresía (Silver, Gold, VIP) y recompensas.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <div className="px-3.5 py-2 rounded-xl bg-muted text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Coins className="size-4 text-amber-500" />
            <span>Valor: <strong>1 PT = ${pointValuePesos} ARS</strong></span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Puntos en Circulación</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <Coins className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-foreground mt-2">
            {totalPointsCirculating.toLocaleString('es-AR')}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Equivale a ${ (totalPointsCirculating * pointValuePesos).toLocaleString('es-AR') } ARS
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">VIP Haute Members</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Crown className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {vipCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Clientas de máxima frecuencia (10+ visitas)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tier Gold</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Award className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2">
            {goldCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            5 a 9 visitas acumuladas
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tier Silver</span>
            <div className="p-2 rounded-lg bg-zinc-500/10 text-zinc-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {silverCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Primeras visitas (1 a 4 servicios)
          </div>
        </div>
      </div>

      {/* Program Parameters & Rules Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/5 via-primary/5 to-purple-500/5 border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Reglas de Fidelización Activas en el Salón</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
            Automático en Turnos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-card/80 border border-border/80">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Percent className="size-3.5 text-primary" />
              <span>Cashback en Puntos por Turno</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Al finalizar el turno, la clienta recibe el <strong>{cashbackPercent}% del importe</strong> directo a su billetera digital.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-card/80 border border-border/80">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Gift className="size-3.5 text-amber-500" />
              <span>Bono Referir Amiga</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Cada clienta tiene su código único. Al traer a una nueva amiga, ambas acreditan <strong>+{referralBonus} PTS</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-card/80 border border-border/80">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Crown className="size-3.5 text-purple-500" />
              <span>Subida Automática de Tier</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Las clientas ascienden de Silver a <strong>Gold</strong> (5 turnos) y <strong>VIP Haute</strong> (10 turnos) desbloqueando regalos.
            </p>
          </div>
        </div>
      </div>

      {/* Clients Directory & Points Management */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Clientas & Billeteras Digitales</h3>
            <span className="text-xs text-muted-foreground font-mono">({filteredClients.length})</span>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, tel o código..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs w-60 focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Tier Filter Tabs */}
            <div className="flex items-center gap-1">
              {(['all', 'VIP Haute', 'Gold', 'Silver'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTierFilter(tier)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedTierFilter === tier
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tier === 'all' ? 'Todos' : tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-2xs">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase border-b border-border tracking-wider">
            <div className="col-span-4">Clienta / Contacto</div>
            <div className="col-span-2 text-center">Nivel / Tier</div>
            <div className="col-span-2 text-right">Saldo de Puntos</div>
            <div className="col-span-2 text-center">Código Referida</div>
            <div className="col-span-2 text-center">Acciones</div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Users className="size-8 text-muted-foreground/60 mx-auto" />
              <p className="text-xs text-muted-foreground">No se encontraron clientas en esta búsqueda o filtro.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredClients.map(client => {
                const tier = client.tier || 'Silver';
                const isVip = tier === 'VIP Haute';
                const isGold = tier === 'Gold';

                return (
                  <div
                    key={client.id}
                    className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center text-xs hover:bg-muted/20 transition-colors"
                  >
                    <div className="col-span-4">
                      <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <span>{client.name}</span>
                        {isVip && <Crown className="size-3.5 text-purple-500 fill-purple-500/20" />}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{client.phone}</span>
                        {client.email && <span>• {client.email}</span>}
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isVip
                          ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                          : isGold
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                          : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {isVip ? '👑 VIP Haute' : isGold ? '⭐ Gold' : '💎 Silver'}
                      </span>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {client.totalVisits || 0} visita(s)
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="text-base font-extrabold font-mono text-amber-600 dark:text-amber-400">
                        {(client.pointsBalance || 0).toLocaleString('es-AR')} <span className="text-[10px] font-sans font-bold">PTS</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        = ${((client.pointsBalance || 0) * pointValuePesos).toLocaleString('es-AR')} ARS
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {client.referralCode || 'SIN CÓDIGO'}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setAdjustModalClient(client)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        title="Bonificar o canjear puntos"
                      >
                        + Puntos
                      </button>
                      <button
                        onClick={() => handleSendPwaWalletLink(client)}
                        className="p-1.5 text-muted-foreground hover:text-emerald-600 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer"
                        title="Enviar billetera digital por WhatsApp"
                      >
                        <Send className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Acreditar / Canjear Puntos */}
      {adjustModalClient && typeof document !== 'undefined' && createPortal(
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
            if (e.target === e.currentTarget) setAdjustModalClient(null);
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 30px 80px -15px rgba(26, 17, 21, 0.35), 0 0 0 1px rgba(222, 115, 143, 0.2)',
              overflowY: 'auto',
              maxHeight: 'min(92vh, 680px)',
              margin: 'auto',
              animation: 'modalCardPop 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold font-serif-glam text-foreground">
                  Acreditar o Descontar Puntos
                </h3>
                <p className="text-xs text-muted-foreground">
                  Clienta: <strong>{adjustModalClient.name}</strong> ({adjustModalClient.pointsBalance || 0} PTS actuales)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalClient(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyPointsAdjustment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Cantidad de Puntos (Positivo suma, negativo resta)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pointsAdjustment}
                    onChange={(e) => setPointsAdjustment(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm font-mono font-bold"
                    required
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPointsAdjustment(500)}
                      className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                    >
                      +500
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointsAdjustment(1000)}
                      className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                    >
                      +1000
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Motivo / Concepto</label>
                <LuxurySelect
                  value={adjustmentReason}
                  onChange={(val) => setAdjustmentReason(String(val))}
                  options={[
                    { value: 'Bonificación Fidelidad / Cumpleaños', label: 'Bonificación Fidelidad / Cumpleaños' },
                    { value: 'Recompensa por Referir Amiga', label: 'Recompensa por Referir Amiga (+1000 pts)' },
                    { value: 'Canje por Servicio en Mesa', label: 'Canje por Servicio en Mesa (Descuento)' },
                    { value: 'Compensación de Salón', label: 'Compensación de Salón' },
                    { value: 'Ajuste Manual Administrativo', label: 'Ajuste Manual Administrativo' }
                  ]}
                />
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground">
                Nuevo saldo proyectado: <strong className="text-foreground">{Math.max(0, (adjustModalClient.pointsBalance || 0) + Number(pointsAdjustment))} PTS</strong>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setAdjustModalClient(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
