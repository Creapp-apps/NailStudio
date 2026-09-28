export interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionPayload?: {
    type: 'open_booking';
    serviceId?: string;
  };
}

export function generateBotResponse(input: string): BotMessage {
  const lower = input.toLowerCase();

  // 1. Weak / bitten / brittle nails
  if (lower.includes('quebradiz') || lower.includes('debil') || lower.includes('mordid') || lower.includes('morder') || lower.includes('onicofagia')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: 'Para uñas frágiles, delgadas o con antecedente de morderse, nuestra recomendación estrella es el **Kapping Gel con Manicura Rusa**. Aplica una capa de gel Rubber nivelador que protege tu queratina natural y permite que crezcan sin quebrarse. ¿Te gustaría agendar una sesión de recuperación?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionPayload: {
        type: 'open_booking',
        serviceId: 'srv-kapping'
      }
    };
  }

  // 2. Length / Extensions
  if (lower.includes('largo') || lower.includes('extension') || lower.includes('alargar') || lower.includes('evento') || lower.includes('fiesta')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: 'Si buscas largo inmediato con acabado ultra natural y ligero, te recomendamos **Soft Gel Extensions (Press-On de Gel)**. Si buscas formas personalizadas o largo extremo, las **Esculpidas en Acrílico** son ideales. Ambas duran 21 días perfectas.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionPayload: {
        type: 'open_booking',
        serviceId: 'srv-softgel'
      }
    };
  }

  // 3. Nail Art / Designs / Deco
  if (lower.includes('deco') || lower.includes('diseño') || lower.includes('nail art') || lower.includes('cromo') || lower.includes('francesita') || lower.includes('3d')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: 'En Atelier Nails clasificamos el Nail Art en 4 niveles para calcular el tiempo justo y no apurar a la manicurista:\n\n• **Nivel 0:** Liso / Monocromo (0 min extra)\n• **Nivel 1:** Francesitas y glitter (+15 min)\n• **Nivel 2:** Glazed donut cromo, mármol o cat eye (+30 min)\n• **Nivel 3:** Cristales 3D y arte a mano alzada (+45 min)\n\nPodrás seleccionar el nivel en el paso 3 de tu reserva.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 4. Retiro / Removal
  if (lower.includes('retiro') || lower.includes('sacar') || lower.includes('otro salon') || lower.includes('service')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: '¡Por supuesto! Hacemos retiros suaves al 100% con fresas de carburo alemanas y técnica rusa. Si el set anterior fue hecho en nuestro estudio, el retiro demora solo 15 minutos; si vienes con producto de otro salón, reservamos 30 minutos para analizar y proteger tu lámina ungueal.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 5. Alergia / HEMA / Embarazo
  if (lower.includes('alergia') || lower.includes('hema') || lower.includes('embarazo') || lower.includes('sensible')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: '¡Cuidamos mucho tu salud! Contamos con bases y colores de formulación **HEMA-FREE y 9-Free** aprobadas para pieles sensibles y embarazo. Además, nuestras cabinas LED disponen de modo *Low Heat* para evitar cualquier molestia térmica.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Default fallback
  return {
    id: `bot-${Date.now()}`,
    sender: 'bot',
    text: 'Hola, soy Nail-Bot, tu asistente inteligente de Atelier Nails & Co. Puedo recomendarte la técnica ideal según el estado de tus uñas, explicarte tiempos de Nail Art o ayudarte a reservar tu turno con la especialista de tu preferencia. ¿Qué tienes en mente para tus uñas hoy?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actionPayload: {
      type: 'open_booking'
    }
  };
}
