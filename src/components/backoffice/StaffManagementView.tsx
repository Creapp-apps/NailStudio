import React from 'react';
import { Sparkles, Star, Calendar, Clock, Award, ShieldCheck, Plus } from 'lucide-react';
import { NailTechnician } from '../../types/nailStudio';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  techs: NailTechnician[];
}

export const StaffManagementView: React.FC<Props> = ({ techs }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Equipo de Manicuristas & Staff Técnico</h2>
          <p className="text-xs text-muted-foreground">
            Especialistas certificadas en manicuría rusa, nivelación con rubber y extensiones soft gel
          </p>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5">
          <Plus className="size-3.5" />
          <span>Agregar Especialista</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {techs.map(tech => (
          <Card key={tech.id} className="flex flex-col justify-between">
            <CardHeader className="pb-3.5">
              <div className="flex items-start justify-between">
                <Avatar className="size-14 ring-2 ring-rose-300/80 ring-offset-2 ring-offset-white shadow-sm">
                  <AvatarImage src={tech.avatar} alt={tech.name} className="object-cover" />
                  <AvatarFallback className="font-bold text-sm bg-rose-100 text-rose-700">
                    {tech.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                  Mesa {tech.id === 'tech-sofia' ? '1 (Master)' : tech.id === 'tech-valentina' ? '2 (Rusa)' : '3 (Sculpt)'}
                </span>
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
                  <span className="font-semibold text-foreground">
                    Mar, Mié, Jue, Vie, Sáb
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-rose-500" /> Horario habitual:</span>
                  <span className="font-semibold text-foreground">09:00 a 19:30 hs</span>
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
                <span>{tech.rating}</span>
                <span className="text-[10px] text-muted-foreground font-normal">({tech.reviewsCount} reviews)</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Activa en Salón
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
