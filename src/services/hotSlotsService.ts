import { format } from 'date-fns';
import { Appointment, NailTechnician, DayOfWeekKey, TimeRangeBlock } from '../types/nailStudio';
import { storage, DEFAULT_SCHEDULE_BY_DAY } from './storage';

export interface HotSlot {
  time: string; // e.g. "14:30"
  minutes: number; // e.g. 870
  isPast: boolean;
  availableTechs: NailTechnician[];
}

export interface HotSlotsSummary {
  todayStr: string;
  totalSlots: number;
  freeSlots: HotSlot[];
  bookedAppointmentsCount: number;
  potentialProfitLoss: number; // in ARS (e.g. freeSlots.length * 18000)
  shareableStoryCopy: string;
  shareableUrl: string;
}

const DAY_KEYS: DayOfWeekKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Calculates remaining available (unbooked) time slots for TODAY.
 * Filtered by salon working hours, active technicians, and existing non-cancelled bookings.
 */
export function calculateTodayHotSlots(options?: {
  averageTicket?: number;
  slotDurationMin?: number;
  ignorePastHoursForTesting?: boolean;
}): HotSlotsSummary {
  const avgTicket = options?.averageTicket || 18000;
  const slotDuration = options?.slotDurationMin || 75; // Average appointment length in minutes
  const ignorePast = options?.ignorePastHoursForTesting || false;

  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  const salonSettings = storage.getSalonSettings();
  const allAppointments = storage.getAppointments();
  const allTechs = storage.getTechs();
  const activeTechs: NailTechnician[] = allTechs.length > 0 ? allTechs : [{
    id: 'tech-1',
    name: 'Lucia Altieri',
    role: 'Especialista',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    specialties: [],
    rating: 5.0,
    reviewsCount: 0,
    commissionRate: 0.5
  }];

  // Appointments for today
  const todayAppointments = allAppointments.filter(
    a => a.scheduledDate === todayStr && a.status !== 'cancelled'
  );

  // Determine working hour ranges for today
  const dayKey = DAY_KEYS[now.getDay()];
  const sched = salonSettings?.scheduleByDay || DEFAULT_SCHEDULE_BY_DAY;
  let ranges: TimeRangeBlock[] = sched[dayKey]?.ranges || [];

  // Fallback to standard daytime ranges if day is marked closed or ranges are empty
  if (!sched[dayKey]?.enabled || ranges.length === 0) {
    ranges = [
      { id: 'fallback-morn', startTime: '10:00', endTime: '13:00' },
      { id: 'fallback-aft', startTime: '14:30', endTime: '20:30' }
    ];
  }

  const toMinutes = (timeStr: string): number => {
    const [h, m] = (timeStr || '00:00').split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const toTimeString = (totalMin: number): string => {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const candidateSlots: { time: string; minutes: number }[] = [];
  const stepMin = 60; // Step every 60 min for realistic slot distribution

  ranges.forEach(range => {
    const startM = toMinutes(range.startTime);
    const endM = toMinutes(range.endTime);

    for (let m = startM; m + slotDuration <= endM; m += stepMin) {
      const timeStr = toTimeString(m);
      if (!candidateSlots.some(s => s.time === timeStr)) {
        candidateSlots.push({ time: timeStr, minutes: m });
      }
    }
  });

  // Evaluate each candidate slot
  const freeSlots: HotSlot[] = [];

  candidateSlots.forEach(slot => {
    const slotStart = slot.minutes;
    const slotEnd = slotStart + slotDuration;
    const isPast = slotStart <= currentTotalMinutes;

    // Check which technicians are free during this slot
    const freeTechsForSlot = activeTechs.filter(tech => {
      const techCollisions = todayAppointments.filter(apt => {
        if (apt.techId && apt.techId !== tech.id && activeTechs.length > 1) {
          return false;
        }
        const aptStart = toMinutes(apt.scheduledTime);
        const aptEnd = aptStart + (apt.totalDurationMin || 60);
        // Overlap test
        return Math.max(slotStart, aptStart) < Math.min(slotEnd, aptEnd);
      });
      return techCollisions.length === 0;
    });

    // If at least one tech has this time slot free
    if (freeTechsForSlot.length > 0) {
      freeSlots.push({
        time: slot.time,
        minutes: slot.minutes,
        isPast,
        availableTechs: freeTechsForSlot
      });
    }
  });

  // Filter out past slots unless all slots for today are past (e.g. salon checking at night)
  const activeAvailableSlots = freeSlots.filter(s => ignorePast || !s.isPast);
  const displaySlots = activeAvailableSlots.length > 0 ? activeAvailableSlots : freeSlots.slice(0, 4);

  const potentialProfitLoss = displaySlots.length * avgTicket;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareableUrl = `${origin}/?flash=hoy`;

  const brandName = salonSettings?.salonName || 'Belcalis Nails';

  // Eye-catching Instagram Stories & WhatsApp copy
  const slotsBulletList = displaySlots.length > 0
    ? displaySlots.map(s => `⚡️ ${s.time} hs`).join('\n')
    : '⚡️ Consultanos por cupos de último momento';

  const shareableStoryCopy = `💅 ¡HUECOS DE ÚLTIMO MOMENTO PARA HOY EN ${brandName.toUpperCase()}!

Liberamos turnos exclusivos para hoy con agendamiento express:
${slotsBulletList}

👉 Tocá el link para reservar tu lugar directo en 30 segundos:
${shareableUrl}

¡Aprovechá antes de que se ocupen! ✨`;

  return {
    todayStr,
    totalSlots: candidateSlots.length,
    freeSlots: displaySlots,
    bookedAppointmentsCount: todayAppointments.length,
    potentialProfitLoss,
    shareableStoryCopy,
    shareableUrl
  };
}
