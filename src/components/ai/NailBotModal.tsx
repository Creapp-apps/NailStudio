import React, { useState } from 'react';
import { X, Send, Sparkles, Calendar, MessageSquare, Bot } from 'lucide-react';
import { BotMessage, generateBotResponse } from '../../services/nailBotEngine';
import { useWebConfig } from '../../hooks/useWebConfig';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const NailBotModal: React.FC<Props> = ({ isOpen, onClose, onOpenBooking }) => {
  const { config } = useWebConfig();
  const brand = config.brandName || 'Atelier Nails & Co.';
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `¡Hola! 💅 Soy **Nail-Bot**, la recepcionista inteligente de ${brand}. ¿Tienes dudas sobre qué técnica elegir (Kapping, Soft Gel, Semipermanente) o quieres calcular tu turno con Nail Art?`,
      timestamp: 'Ahora'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');

  if (!isOpen) return null;

  const handleSend = (text?: string) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!text) setInputValue('');

    // Simulate thinking delay
    setTimeout(() => {
      const response = generateBotResponse(query);
      setMessages(prev => [...prev, response]);
    }, 450);
  };

  const quickChips = [
    'Tengo uñas quebradizas y cortas',
    '¿Cuánto tarda el Kapping vs Soft Gel?',
    '¿Qué nivel de Nail Art elijo para Francesita?',
    '¿Tienen productos HEMA-Free para alergias?'
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '90%',
      maxWidth: '420px',
      height: '580px',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 20px 50px rgba(35, 25, 22, 0.25)',
      border: '1px solid var(--border-strong)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 90,
      overflow: 'hidden'
    }} className="animate-fade-in">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2D1E1B 0%, #1A1210 100%)',
        color: '#FFFFFF',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(212, 175, 122, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--brand-terracotta)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(166, 93, 78, 0.6)'
          }}>
            <Sparkles size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
              Nail-Bot IA
            </div>
            <div style={{ fontSize: '0.72rem', color: '#D99B8B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#48BB78', display: 'inline-block' }} />
              Especialista en Manicura Online
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '50%'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        background: 'var(--bg-app)'
      }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            <div style={{
              background: m.sender === 'user' ? 'var(--brand-terracotta)' : 'var(--bg-surface)',
              color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
              padding: '0.85rem 1rem',
              borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              whiteSpace: 'pre-line'
            }}>
              {m.text}

              {m.actionPayload && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => {
                      onOpenBooking(m.actionPayload?.serviceId);
                      onClose();
                    }}
                    style={{
                      background: 'var(--brand-terracotta)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Calendar size={14} /> Reservar este Servicio con Descuento
                  </button>
                </div>
              )}
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              marginTop: '0.2rem',
              textAlign: m.sender === 'user' ? 'right' : 'left',
              paddingLeft: '0.4rem'
            }}>
              {m.timestamp}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Quick Question Chips */}
      <div style={{
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '0.4rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {quickChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            style={{
              fontSize: '0.72rem',
              padding: '0.3rem 0.65rem',
              background: '#F5EDE6',
              border: '1px solid #E6D8CC',
              borderRadius: 'var(--radius-full)',
              color: 'var(--brand-terracotta-dark)',
              cursor: 'pointer'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          placeholder="Escribe tu consulta sobre uñas..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-strong)',
            fontSize: '0.85rem',
            outline: 'none',
            background: 'var(--bg-card-subtle)'
          }}
        />
        <button
          onClick={() => handleSend()}
          style={{
            background: 'var(--brand-terracotta)',
            color: '#FFFFFF',
            border: 'none',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
