import React, { useState } from 'react';
import { DollarSign, Percent, User, CheckCircle2, Download, TrendingUp } from 'lucide-react';
import { Appointment, NailTechnician } from '../../types/nailStudio';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
}

export const CommissionsView: React.FC<Props> = ({ appointments, techs }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'current_week' | 'month'>('month');

  // Calculate liquidation per tech
  const techCommissions = techs.map(tech => {
    const techApps = appointments.filter(a => a.techId === tech.id);
    const totalGross = techApps.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const commissionRate = tech.commissionRate || 0.55; // default 55% for the nail artist
    const techPayout = totalGross * commissionRate;
    const studioMargin = totalGross * (1 - commissionRate);

    return {
      tech,
      appointmentsCount: techApps.length,
      totalGross,
      commissionRate,
      techPayout,
      studioMargin
    };
  });

  const grandTotalGross = techCommissions.reduce((acc, c) => acc + c.totalGross, 0);
  const grandTotalPayout = techCommissions.reduce((acc, c) => acc + c.techPayout, 0);
  const grandStudioMargin = techCommissions.reduce((acc, c) => acc + c.studioMargin, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Facturación Bruta (Período)
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              ${grandTotalGross.toLocaleString('es-AR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="size-3.5 text-emerald-500" />
            <span>Generado en mesa por todas las especialistas</span>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.04] to-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              Total a Liquidar a Manicuristas
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-950 dark:text-emerald-100">
              ${grandTotalPayout.toLocaleString('es-AR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Equivalente al 55% promedio de comisión técnica
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Margen Neto Atelier Nails
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              ${grandStudioMargin.toLocaleString('es-AR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Margen del 45% post insumos y costos operativos de salón
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Planilla de Liquidación por Especialista
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Cálculo automatizado de turnos realizados y porcentaje asignado
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Download className="size-3.5" />
              <span>Exportar Liquidaciones</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Manicurista</TableHead>
                <TableHead className="text-xs">Especialidad</TableHead>
                <TableHead className="text-xs">Turnos</TableHead>
                <TableHead className="text-xs">Facturado Bruto</TableHead>
                <TableHead className="text-xs">% Comisión</TableHead>
                <TableHead className="text-xs font-bold text-right">A Cobrar</TableHead>
                <TableHead className="text-xs text-right">Margen Estudio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {techCommissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                    No hay profesionales registradas actualmente. Da de alta a tu equipo en <strong>Staff & Especialistas</strong> para calcular sus liquidaciones.
                  </TableCell>
                </TableRow>
              ) : (
                techCommissions.map(item => (
                  <TableRow key={item.tech.id}>
                    <TableCell className="font-semibold text-xs">
                      <div className="flex items-center gap-2">
                        {item.tech.avatar ? (
                          <img
                            src={item.tech.avatar}
                            alt={item.tech.name}
                            className="size-7 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="size-7 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {item.tech.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span>{item.tech.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.tech.role}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      <Badge variant="secondary" className="text-[10px]">
                        {item.appointmentsCount} servicios
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      ${item.totalGross.toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-[10px] border-pink-500/30 text-pink-600">
                        {Math.round(item.commissionRate * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-right text-emerald-600">
                      ${item.techPayout.toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell className="text-xs text-right text-muted-foreground">
                      ${item.studioMargin.toLocaleString('es-AR')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
