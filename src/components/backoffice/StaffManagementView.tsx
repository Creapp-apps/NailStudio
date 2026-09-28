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
          <Card key={tech.id} className="border-border shadow-sm overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Avatar className="size-14 border-2 border-pink-500/20 shadow-sm">
                  <AvatarImage src={tech.avatar} alt={tech.name} className="object-cover" />
                  <AvatarFallback className="font-bold text-sm bg-pink-100 text-pink-700">
                    {tech.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="outline" className="border-pink-500/30 text-pink-600 text-[10px] font-semibold">
                  Mesa {tech.id === 'tech-sofia' ? '1 (Master)' : tech.id === 'tech-valentina' ? '2 (Rusa)' : '3 (Sculpt)'}
                </Badge>
              </div>

              <div className="mt-3">
                <CardTitle className="text-base font-bold text-foreground">{tech.name}</CardTitle>
                <CardDescription className="text-xs text-pink-600 font-medium">{tech.role}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="rounded-lg bg-muted/40 p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="size-3 text-pink-500" /> Días de atención:</span>
                  <span className="font-semibold text-foreground">
                    Mar, Mié, Jue, Vie, Sáb
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="size-3 text-pink-500" /> Horario habitual:</span>
                  <span className="font-semibold text-foreground">09:00 a 19:30 hs</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Técnicas Habilitadas
                </div>
                <div className="flex flex-wrap gap-1">
                  {tech.specialties.map(spec => (
                    <Badge key={spec} variant="secondary" className="text-[10px] py-0 px-2">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>{tech.rating}</span>
                <span className="text-[10px] text-muted-foreground font-normal">({tech.reviewsCount} reviews)</span>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                Activa en Salón
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
