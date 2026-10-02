import React from 'react';
import { Appointment, NailTechnician } from '../../types/nailStudio';
import { AgendaGoogleCalendarView } from './agenda/AgendaGoogleCalendarView';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
}

export const MultiTechCalendar: React.FC<Props> = ({ appointments, techs }) => {
  return <AgendaGoogleCalendarView appointments={appointments} techs={techs} />;
};

export { AgendaGoogleCalendarView };
