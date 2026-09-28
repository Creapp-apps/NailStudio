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
          <Scissors className="size-3.5 text-pink-500" />
          <span>Mesas Ocupadas Actualmente ({inProgressApps.length})</span>
        </h3>

        {inProgressApps.length === 0 ? (
          <Card className="p-6 text-center text-xs text-muted-foreground border-dashed">
            No hay servicios en mesa en este momento. Las manicuristas están disponibles.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressApps.map(app => {
              const tech = techs.find(t => t.id === app.techId);
              return (
                <Card key={app.id} className="border-pink-500/40 bg-pink-500/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-pink-600 text-white text-[10px] gap-1">
                        <span className="size-1.5 rounded-full bg-white animate-ping" />
                        <span>En Mesa Ahora</span>
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Turno #{app.id.substring(0, 6)}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold mt-2 text-foreground">
                      {app.clientName}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Tel: {app.clientPhone}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="rounded-lg bg-background/80 p-2.5 space-y-1 border border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Especialista:</span>
                        <span className="font-semibold text-foreground">{tech?.name || 'Asignada'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duración total estimada:</span>
                        <span className="font-semibold text-pink-600">{app.totalDurationMin} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Importe total:</span>
                        <span className="font-bold text-foreground">${app.totalPrice.toLocaleString('es-AR')}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFinish(app.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
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
          <Clock className="size-3.5 text-blue-500" />
          <span>Próximas en Llegar / Confirmadas ({confirmedApps.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {confirmedApps.map(app => {
            const tech = techs.find(t => t.id === app.techId);
            return (
              <Card key={app.id} className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 text-[10px]">
                      {app.scheduledTime} hs
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Seña paga</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-1">
                    {app.clientName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="text-muted-foreground">
                    Atiende: <span className="font-medium text-foreground">{tech?.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStart(app.id)}
                    className="w-full text-xs gap-1.5 text-pink-600 border-pink-500/30 hover:bg-pink-50"
                  >
                    <Play className="size-3" />
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
