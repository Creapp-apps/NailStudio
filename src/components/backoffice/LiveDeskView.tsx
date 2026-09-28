import React from 'react';
import { Clock, Play, CheckCircle2, AlertCircle, Sparkles, User, Scissors } from 'lucide-react';
import { Appointment, NailTechnician } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
}

export const LiveDeskView: React.FC<Props> = ({ appointments, techs }) => {
  const inProgressApps = appointments.filter(a => a.status === 'in_progress');
  const confirmedApps = appointments.filter(a => a.status === 'confirmed');

  const handleFinish = (id: string) => {
    storage.updateAppointmentStatus(id, 'completed');
  };

  const handleStart = (id: string) => {
    storage.updateAppointmentStatus(id, 'in_progress');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Control de Mesas & Sala de Espera en Vivo</h2>
          <p className="text-xs text-muted-foreground">
            Monitoreo en tiempo real de servicios en ejecución y próximas clientas ingresando al salón
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 gap-1 text-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Salón en Operación</span>
          </Badge>
        </div>
      </div>

      {/* Mesas en Servicio Activo */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Scissors className="size-3.5 text-rose-500" />
          <span>Mesas Ocupadas Actualmente ({inProgressApps.length})</span>
        </h3>

        {inProgressApps.length === 0 ? (
          <Card className="p-8 text-center text-xs text-muted-foreground border-dashed border-rose-200/80 bg-rose-500/[0.02]">
            No hay servicios en mesa en este momento. Las manicuristas están disponibles.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressApps.map(app => {
              const tech = techs.find(t => t.id === app.techId);
              return (
                <Card key={app.id} className="border-rose-300/80 bg-gradient-to-br from-rose-500/[0.04] via-white to-pink-500/[0.02] shadow-[0_12px_32px_-8px_rgba(222,115,143,0.18)]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] gap-1 px-2.5 py-0.5 shadow-xs border-0">
                        <span className="size-1.5 rounded-full bg-white animate-ping" />
                        <span className="font-semibold">En Mesa Ahora</span>
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        Turno #{app.id.substring(0, 6)}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold mt-2 text-foreground">
                      {app.clientName}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Tel: {app.clientPhone}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="rounded-xl bg-white/90 p-3.5 space-y-2 border border-rose-200/70 shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Especialista:</span>
                        <span className="font-semibold text-foreground">{tech?.name || 'Asignada'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Duración total estimada:</span>
                        <span className="font-semibold text-rose-600">{app.totalDurationMin} min</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-rose-100">
                        <span className="text-muted-foreground font-medium">Importe total:</span>
                        <span className="font-bold text-foreground text-sm">${app.totalPrice.toLocaleString('es-AR')}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFinish(app.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm hover:shadow-md transition-all font-medium py-2 rounded-xl"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Finalizar Servicio & Registrar Pago</span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Clientas Próximas / Check-in */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Clock className="size-3.5 text-rose-500" />
          <span>Próximas en Llegar / Confirmadas ({confirmedApps.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {confirmedApps.map(app => {
            const tech = techs.find(t => t.id === app.techId);
            return (
              <Card key={app.id}>
                <CardHeader className="pb-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      {app.scheduledTime} hs
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-700 border border-rose-200/60">
                      Seña paga
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground mt-2">
                    {app.clientName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="text-muted-foreground flex items-center justify-between">
                    <span>Atiende:</span>
                    <span className="font-semibold text-foreground">{tech?.name || 'Sin asignar'}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStart(app.id)}
                    className="w-full text-xs gap-1.5 font-medium bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-sm hover:shadow-md transition-all rounded-xl py-2"
                  >
                    <Play className="size-3 fill-white" />
                    <span>Hacer Check-in & Pasar a Mesa</span>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
