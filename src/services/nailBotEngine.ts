import { calculateTodayHotSlots } from './hotSlotsService';
import { storage } from './storage';
import { INITIAL_SERVICES, REMOVAL_OPTIONS } from './mockData';

export interface BotOption {
  id: string;
  label: string;
  actionType:
    | 'select_service'
    | 'select_removal'
    | 'open_hot_slots'
    | 'open_booking'
    | 'send_query'
    | 'show_menu'
    | 'show_prices'
    | 'show_location';
  serviceId?: string;
  removalId?: string;
  queryText?: string;
  menuTarget?: string;
}

export interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: BotOption[];
  actionPayload?: {
    type: 'open_booking' | 'open_hot_slots';
    serviceId?: string;
    removalId?: string;
  };
}

interface EngineContext {
  assistantName?: string;
  salonName?: string;
  currentServiceId?: string;
  currentRemovalId?: string;
}

export function getInitialBotMessage(ctx?: EngineContext): BotMessage {
  const settings = storage.getSalonSettings();
  const assistantName = ctx?.assistantName || settings.assistantName || 'Lucía Altieri';
  const salonName = ctx?.salonName || settings.salonName || 'Belcalis Nails & Co.';

  return {
    id: 'welcome-init',
    sender: 'bot',
    text: `¡Hola! 💅 Bienvenida a **${salonName}**. Soy **${assistantName}**, tu especialista y recepcionista virtual.\n\nEstoy aquí para guiarte paso a paso: puedes consultar qué técnica te conviene, ver turnos libres para hoy o agendar tu cita en un instante. ✨\n\n¿Cómo te gustaría comenzar?`,
    timestamp: 'Ahora',
    options: [
      {
        id: 'opt-book',
        label: '📅 Agendar turno nuevo',
        actionType: 'show_menu',
        menuTarget: 'services'
      },
      {
        id: 'opt-hot-slots',
        label: '⚡ Ver huecos libres para hoy',
        actionType: 'open_hot_slots'
      },
      {
        id: 'opt-advice',
        label: '✨ ¿Qué técnica me recomiendas?',
        actionType: 'show_menu',
        menuTarget: 'advice'
      },
      {
        id: 'opt-prices',
        label: '💰 Lista de precios y tiempos',
        actionType: 'show_prices'
      },
      {
        id: 'opt-location',
        label: '📍 Ubicación y señas',
        actionType: 'show_location'
      }
    ]
  };
}

export function generateBotResponse(
  input: string,
  ctx?: EngineContext
): BotMessage {
  const settings = storage.getSalonSettings();
  const assistantName = ctx?.assistantName || settings.assistantName || 'Lucía Altieri';
  const salonName = ctx?.salonName || settings.salonName || 'Belcalis Nails & Co.';
  const lower = input.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Weak / bitten / brittle nails
  if (
    lower.includes('quebradiz') ||
    lower.includes('debil') ||
    lower.includes('débil') ||
    lower.includes('mordid') ||
    lower.includes('morder') ||
    lower.includes('onicofagia')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Para uñas frágiles, delgadas o con antecedente de morderse, mi recomendación estrella es el **Kapping Gel con Manicura Rusa**.\n\nAplicamos una nivelación con base Rubber que amortigua golpes, protege la queratina natural y permite un crecimiento uniforme sin quebrarse ni levantarse. Dura más de 21 días intacto. ✨\n\n¿Deseas agendar tu sesión de Kapping?`,
      timestamp,
      options: [
        {
          id: 'opt-choose-kapping',
          label: '💅 Elegir Kapping ($18.500)',
          actionType: 'select_service',
          serviceId: 'srv-kapping'
        },
        {
          id: 'opt-today-kapping',
          label: '⚡ Ver si hay hueco hoy',
          actionType: 'open_hot_slots'
        },
        {
          id: 'opt-other-srvs',
          label: '👀 Ver otros servicios',
          actionType: 'show_menu',
          menuTarget: 'services'
        }
      ],
      actionPayload: {
        type: 'open_booking',
        serviceId: 'srv-kapping'
      }
    };
  }

  // 2. Length / Extensions
  if (
    lower.includes('largo') ||
    lower.includes('extension') ||
    lower.includes('extensión') ||
    lower.includes('alargar') ||
    lower.includes('press on') ||
    lower.includes('evento') ||
    lower.includes('fiesta')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Si buscas alargar tus uñas de inmediato, disponemos de dos técnicas exclusivas:\n\n• **Soft Gel Extensions (Press-On de Gel):** Tips de gel ultraligeros adheridos con base estructural. Súper naturales y flexibles (90 min).\n• **Esculpidas en Acrílico / Polygel:** Estructura artesanal esculpida sobre molde para corregir imperfecciones o lograr largos extremos (110 min).\n\n¿Cuál de las dos te atrae más?`,
      timestamp,
      options: [
        {
          id: 'opt-choose-softgel',
          label: '💎 Soft Gel Extensions ($22.000)',
          actionType: 'select_service',
          serviceId: 'srv-softgel'
        },
        {
          id: 'opt-choose-esculpidas',
          label: '👑 Esculpidas Acrílico ($26.000)',
          actionType: 'select_service',
          serviceId: 'srv-esculpidas'
        },
        {
          id: 'opt-back-menu',
          label: '↩️ Ver todas las técnicas',
          actionType: 'show_menu',
          menuTarget: 'services'
        }
      ]
    };
  }

  // 3. Hot slots / Today / Urgent
  if (
    lower.includes('hoy') ||
    lower.includes('hueco') ||
    lower.includes('urgente') ||
    lower.includes('disponib') ||
    lower.includes('ahora')
  ) {
    const hotSlotsSummary = calculateTodayHotSlots();
    const count = hotSlotsSummary.freeSlots.length;

    if (count > 0) {
      const topTimes = hotSlotsSummary.freeSlots.slice(0, 4).map(s => s.time).join(' • ');
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `¡Sí! Tenemos **${count} turnos express disponibles para hoy** 🔥:\n\n⏰ Horarios libres: **${topTimes}**\n\nEstos turnos tienen confirmación prioritaria para completar la jornada. ¿Quieres reservar tu lugar ahora mismo?`,
        timestamp,
        options: [
          {
            id: 'opt-express-reserve',
            label: '⚡ Ver y reservar turno de hoy',
            actionType: 'open_hot_slots'
          },
          {
            id: 'opt-calendar',
            label: '📅 Prefiero agendar para otro día',
            actionType: 'open_booking'
          }
        ],
        actionPayload: {
          type: 'open_hot_slots'
        }
      };
    } else {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Para el día de hoy ya tenemos la agenda 100% completa 💖 (¡muchas gracias por la preferencia!).\n\nSin embargo, puedes asegurar tu turno para mañana o cualquier día de esta semana para no quedarte sin tu lugar:`,
        timestamp,
        options: [
          {
            id: 'opt-book-other-day',
            label: '📅 Abrir calendario y elegir día',
            actionType: 'open_booking'
          },
          {
            id: 'opt-see-prices',
            label: '💰 Consultar precios',
            actionType: 'show_prices'
          }
        ],
        actionPayload: {
          type: 'open_booking'
        }
      };
    }
  }

  // 4. Nail Art / Designs / Deco
  if (
    lower.includes('deco') ||
    lower.includes('diseño') ||
    lower.includes('nail art') ||
    lower.includes('cromo') ||
    lower.includes('francesita') ||
    lower.includes('3d') ||
    lower.includes('glitter')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `En ${salonName} organizamos el Nail Art en 4 niveles para garantizar el tiempo de dedicación que tus manos merecen:\n\n• **Nivel 0 (Liso):** Color monocromo elegante (0 min extra)\n• **Nivel 1:** Francesitas finas, baby boomer o glitter accent (+15 min)\n• **Nivel 2:** Glazed donut chrome, mármol o cat eye (+30 min)\n• **Nivel 3:** Cristales 3D, arte a mano alzada y mix de texturas (+45 min)\n\nPodrás elegir el nivel de diseño exacto durante tu reserva. ¿Comenzamos con la elección del servicio?`,
      timestamp,
      options: [
        {
          id: 'opt-art-kapping',
          label: '💅 Kapping Gel con Nail Art',
          actionType: 'select_service',
          serviceId: 'srv-kapping'
        },
        {
          id: 'opt-art-softgel',
          label: '💎 Soft Gel con Nail Art',
          actionType: 'select_service',
          serviceId: 'srv-softgel'
        },
        {
          id: 'opt-art-all',
          label: '📅 Ver todos los servicios',
          actionType: 'show_menu',
          menuTarget: 'services'
        }
      ]
    };
  }

  // 5. Retiro / Removal
  if (
    lower.includes('retiro') ||
    lower.includes('sacar') ||
    lower.includes('otro salon') ||
    lower.includes('otro salón') ||
    lower.includes('service') ||
    lower.includes('remover')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `¡Por supuesto! Realizamos retiros 100% seguros con fresas de carburo alemanas y técnica rusa que preservan íntegra la queratina de tus uñas:\n\n• **Retiro de nuestro Atelier:** Demora solo 15 min ($2.500).\n• **Retiro de otro salón:** Dedicamos 30 min ($4.500) para remover el producto previo sin limados abrasivos.\n• **Uñas vírgenes / limpias:** Sin cargo ni tiempo adicional.\n\n¿Quieres agendar tu turno indicando si traes producto?`,
      timestamp,
      options: [
        {
          id: 'opt-book-with-removal',
          label: '📅 Agendar turno con retiro',
          actionType: 'show_menu',
          menuTarget: 'services'
        },
        {
          id: 'opt-back-main',
          label: '↩️ Volver al menú',
          actionType: 'show_menu',
          menuTarget: 'welcome'
        }
      ]
    };
  }

  // 6. Prices / Values
  if (
    lower.includes('precio') ||
    lower.includes('cuanto') ||
    lower.includes('cuánto') ||
    lower.includes('tarifa') ||
    lower.includes('costo') ||
    lower.includes('valor')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Aquí tienes los valores actualizados de nuestros servicios principales en ${salonName}:\n\n• **Kapping Gel Fortalecedor (Rusa):** $18.500 (75 min)\n• **Esmaltado Semipermanente Haute Gloss:** $14.000 (60 min)\n• **Soft Gel Extensions (Press-On):** $22.000 (90 min)\n• **Esculpidas en Acrílico / Polygel:** $26.000 (110 min)\n\nTodos los servicios incluyen manicura rusa de alta precisión y finalización con aceites nutritivos orgánicos. ¿Qué servicio te gustaría elegir?`,
      timestamp,
      options: [
        {
          id: 'opt-p-kapping',
          label: '💅 Kapping Gel ($18.500)',
          actionType: 'select_service',
          serviceId: 'srv-kapping'
        },
        {
          id: 'opt-p-semi',
          label: '✨ Semipermanente ($14.000)',
          actionType: 'select_service',
          serviceId: 'srv-semipermanente'
        },
        {
          id: 'opt-p-softgel',
          label: '💎 Soft Gel ($22.000)',
          actionType: 'select_service',
          serviceId: 'srv-softgel'
        },
        {
          id: 'opt-p-esculpidas',
          label: '👑 Esculpidas ($26.000)',
          actionType: 'select_service',
          serviceId: 'srv-esculpidas'
        }
      ]
    };
  }

  // 7. Ubicacion / Seña / Metodos de pago
  if (
    lower.includes('ubicacion') ||
    lower.includes('ubicación') ||
    lower.includes('donde') ||
    lower.includes('dónde') ||
    lower.includes('direccion') ||
    lower.includes('dirección') ||
    lower.includes('seña') ||
    lower.includes('senia') ||
    lower.includes('pago') ||
    lower.includes('transferencia')
  ) {
    const depositStr = settings.depositAmount ? `$${settings.depositAmount.toLocaleString('es-AR')}` : '$5.000';
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `📍 **Ubicación:** ${settings.address || 'Av. Alvear 1850, Recoleta'}\n⏰ **Horarios:** Lunes a Sábados de ${settings.openingTime || '09:00'} a ${settings.closingTime || '20:00'} hs.\n\n💳 **Reserva y Seña:**\nPara congelar el turno se abona una seña de **${depositStr}** por transferencia o Mercado Pago (se descuenta del total el día de tu cita).\n\n¿Quieres consultar la disponibilidad de fechas?`,
      timestamp,
      options: [
        {
          id: 'opt-loc-book',
          label: '📅 Agendar mi turno',
          actionType: 'open_booking'
        },
        {
          id: 'opt-loc-today',
          label: '⚡ Ver huecos de hoy',
          actionType: 'open_hot_slots'
        }
      ]
    };
  }

  // 8. Alergia / HEMA / Embarazo
  if (
    lower.includes('alergia') ||
    lower.includes('hema') ||
    lower.includes('embarazo') ||
    lower.includes('sensible') ||
    lower.includes('quimico')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `¡Tu salud es nuestra prioridad absoluta! 🌿\n\nTrabajamos con líneas **HEMA-Free y 9-Free**, libres de monómeros agresivos, ideales para personas alérgicas o en período de gestación. Además, nuestras cabinas LED cuentan con modo *Low Heat* para evitar cualquier pico de temperatura en tu uña.\n\n¿Te gustaría asegurar tu cita con atención especializada?`,
      timestamp,
      options: [
        {
          id: 'opt-hema-book',
          label: '📅 Reservar turno seguro',
          actionType: 'show_menu',
          menuTarget: 'services'
        },
        {
          id: 'opt-hema-back',
          label: '↩️ Volver al menú principal',
          actionType: 'show_menu',
          menuTarget: 'welcome'
        }
      ]
    };
  }

  // Default fallback response
  return {
    id: `bot-${Date.now()}`,
    sender: 'bot',
    text: `Como recepcionista de ${salonName}, estoy atenta para coordinar tu cita o responderte cualquier consulta técnica. ✨\n\nPuedes elegir una opción para que te guíe directo a tu reserva:`,
    timestamp,
    options: [
      {
        id: 'opt-def-book',
        label: '📅 Agendar un turno nuevo',
        actionType: 'show_menu',
        menuTarget: 'services'
      },
      {
        id: 'opt-def-today',
        label: '⚡ Ver huecos para hoy',
        actionType: 'open_hot_slots'
      },
      {
        id: 'opt-def-prices',
        label: '💰 Precios y servicios',
        actionType: 'show_prices'
      }
    ]
  };
}

/**
 * Generates structured conversational responses based on interactive chip actions
 */
export function handleOptionAction(
  option: BotOption,
  ctx?: EngineContext
): BotMessage {
  const settings = storage.getSalonSettings();
  const assistantName = ctx?.assistantName || settings.assistantName || 'Lucía Altieri';
  const salonName = ctx?.salonName || settings.salonName || 'Belcalis Nails & Co.';
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Show Services Menu
  if (option.actionType === 'show_menu' && option.menuTarget === 'services') {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `¡Perfecto! 🥰 Para asegurarte el mejor resultado y tiempo de trabajo, cuéntame: **¿qué técnica te gustaría realizarte?**`,
      timestamp,
      options: [
        {
          id: 'opt-srv-kapping',
          label: '💅 Kapping Gel Rusa ($18.500)',
          actionType: 'select_service',
          serviceId: 'srv-kapping'
        },
        {
          id: 'opt-srv-softgel',
          label: '💎 Soft Gel Extensions ($22.000)',
          actionType: 'select_service',
          serviceId: 'srv-softgel'
        },
        {
          id: 'opt-srv-semi',
          label: '✨ Semipermanente ($14.000)',
          actionType: 'select_service',
          serviceId: 'srv-semipermanente'
        },
        {
          id: 'opt-srv-esculpidas',
          label: '👑 Esculpidas Acrílico ($26.000)',
          actionType: 'select_service',
          serviceId: 'srv-esculpidas'
        }
      ]
    };
  }

  // 2. Select Service -> Ask about removal
  if (option.actionType === 'select_service' && option.serviceId) {
    const services = storage.getServices();
    const srv = services.find(s => s.id === option.serviceId) || services[0];
    const removals = storage.getRemovals();
    const activeRemovals = removals.filter(r => r.isActive !== false);

    const removalChips: BotOption[] = activeRemovals.map(r => ({
      id: `opt-rem-${r.id}`,
      label: r.additionalPrice > 0 ? `${r.label} (+$${r.additionalPrice.toLocaleString('es-AR')})` : r.label,
      actionType: 'select_removal',
      serviceId: srv.id,
      removalId: r.id
    }));

    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Excelente elección: **${srv.title}** ($${srv.basePrice.toLocaleString('es-AR')} • ${srv.baseDurationMin} min) ✨\n\n¿Tienes actualmente material previo en tus uñas que necesitemos retirar?`,
      timestamp,
      options: removalChips.length > 0 ? removalChips : [
        {
          id: 'opt-rem-none',
          label: '🌿 Sin retiro previo',
          actionType: 'select_removal',
          serviceId: srv.id,
          removalId: 'none'
        }
      ],
      actionPayload: {
        type: 'open_booking',
        serviceId: srv.id
      }
    };
  }

  // 3. Select Removal -> Finalize and invite to schedule
  if (option.actionType === 'select_removal') {
    const services = storage.getServices();
    const srv = services.find(s => s.id === option.serviceId) || services[0];
    const removals = storage.getRemovals();
    const rem = removals.find(r => r.id === option.removalId) || removals[0];

    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `¡Anotado! 📋 Tu reserva queda configurada con:\n• **Técnica:** ${srv.title}\n• **Condición:** ${rem.label}\n\n¿Prefieres ver si tenemos huecos libres hoy con descuento o elegir un día en el calendario?`,
      timestamp,
      options: [
        {
          id: 'opt-hot-slots-final',
          label: '⚡ Ver huecos de hoy (Express)',
          actionType: 'open_hot_slots',
          serviceId: srv.id
        },
        {
          id: 'opt-open-booking-modal',
          label: '📅 Abrir calendario y confirmar',
          actionType: 'open_booking',
          serviceId: srv.id,
          removalId: rem.id
        },
        {
          id: 'opt-change-service',
          label: '↩️ Cambiar servicio',
          actionType: 'show_menu',
          menuTarget: 'services'
        }
      ],
      actionPayload: {
        type: 'open_booking',
        serviceId: srv.id,
        removalId: rem.id
      }
    };
  }

  // 4. Show Prices
  if (option.actionType === 'show_prices') {
    return generateBotResponse('precios', ctx);
  }

  // 5. Show Location
  if (option.actionType === 'show_location') {
    return generateBotResponse('ubicacion', ctx);
  }

  // 6. Advice menu
  if (option.actionType === 'show_menu' && option.menuTarget === 'advice') {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Con gusto te asesoro para encontrar el tratamiento perfecto para tus uñas. 💖\n\n¿Cuál describe mejor tu situación actual?`,
      timestamp,
      options: [
        {
          id: 'adv-fragile',
          label: '🩹 Se me quiebran o son delgadas',
          actionType: 'send_query',
          queryText: 'Tengo uñas quebradizas y debiles'
        },
        {
          id: 'adv-short',
          label: '📏 Quiero uñas largas ya mismo',
          actionType: 'send_query',
          queryText: 'Quiero extensiones largas para fiesta'
        },
        {
          id: 'adv-art',
          label: '🎨 Busco diseño o Nail Art',
          actionType: 'send_query',
          queryText: 'Quiero francesita o diseño nail art'
        },
        {
          id: 'adv-sensitive',
          label: '🌿 Piel sensible / Alergias',
          actionType: 'send_query',
          queryText: 'Tienen productos para alergias HEMA free'
        }
      ]
    };
  }

  // 7. Welcome menu
  if (option.actionType === 'show_menu' && option.menuTarget === 'welcome') {
    return getInitialBotMessage(ctx);
  }

  return getInitialBotMessage(ctx);
}
