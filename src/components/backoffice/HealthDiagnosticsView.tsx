import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, FileText, Activity, HeartPulse } from 'lucide-react';
import { ClientProfile } from '../../types/nailStudio';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Props {
  clients: ClientProfile[];
}

export const HealthDiagnosticsView: React.FC<Props> = ({ clients }) => {
  const allergyClients = clients.filter(c => c.allergiesHema);
  const onychophagyClients = clients.filter(c => c.nailPlateCondition === 'onychophagy');

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'onychophagy': return 'Onicofagia / Mordida';
      case 'thin_weak': return 'Lámina Fina y Frágil';
      case 'sensitive_lamp': return 'Sensibilidad Térmica';
      default: return 'Placa Saludable';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-amber-800 dark:text-amber-300 font-semibold text-xs uppercase tracking-wider">
                Protocolo HEMA-Free
              </CardDescription>
              <ShieldAlert className="size-5 text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-950 dark:text-amber-100">
              {allergyClients.length} Clientas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-amber-800/80 dark:text-amber-300/80">
            Requieren productos hipoalergénicos biocompatibles certificados sin monómeros volátiles HEMA.
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tratamientos de Onicofagia
              </CardDescription>
              <HeartPulse className="size-5 text-pink-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {onychophagyClients.length} Casos Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Plan de recuperación ungueal con kapping estructurado cada 15 a 18 días.
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Registros Clínicos
              </CardDescription>
              <Activity className="size-5 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {clients.length} Fichas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Fichas diagnósticas con consentimiento de salud firmado digitalmente.
          </CardContent>
        </Card>
      </div>

      {/* Table of Health Alerts */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Auditoría de Alergias & Diagnósticos Ungueales
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Alertas activadas automáticamente en la agenda al momento de atender
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {allergyClients.length} con protocolo HEMA-Free
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Clienta</TableHead>
                <TableHead className="text-xs">Alergias Detectadas</TableHead>
                <TableHead className="text-xs">Diagnóstico & Lámina</TableHead>
                <TableHead className="text-xs">Protocolo Obligatorio</TableHead>
                <TableHead className="text-xs">Sensibilidad Lámpara</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => {
                const hasAllergy = client.allergiesHema;
                return (
                  <TableRow key={client.id} className={hasAllergy ? 'bg-amber-500/5' : undefined}>
                    <TableCell className="font-semibold text-xs">
                      <div>{client.name}</div>
                      <div className="text-[11px] text-muted-foreground">{client.phone}</div>
                    </TableCell>
                    <TableCell>
                      {hasAllergy ? (
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="destructive" className="text-[10px] py-0 px-1.5 font-bold">
                            ⚠️ Alergia HEMA
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin alergias HEMA</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs max-w-[280px]">
                      <div className="font-medium">{getConditionLabel(client.nailPlateCondition)}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{client.technicianNotes || 'Sin notas'}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {hasAllergy ? (
                        <span className="text-amber-800 dark:text-amber-300 font-semibold">
                          Línea Biocompatible HEMA-Free + Curado Lento
                        </span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400">
                          Protocolo Regular Rubber Leveling
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {client.lampHeatSensitivity === 'high' ? '🔥 Alta' : client.lampHeatSensitivity === 'medium' ? '⚡ Media' : '❄️ Baja'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
