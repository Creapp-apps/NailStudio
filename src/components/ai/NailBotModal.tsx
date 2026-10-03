import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Calendar, Zap, MessageSquare, RotateCcw, ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  BotMessage,
  BotOption,
  getInitialBotMessage,
  generateBotResponse,
  handleOptionAction
} from '../../services/nailBotEngine';
import { storage } from '../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenHotSlots?: () => void;
}

export const NailBotModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenHotSlots
}) => {
  const [salonSettings, setSalonSettings] = useState(() => storage.getSalonSettings());
  const assistantName = salonSettings.assistantName || 'Lucía Altieri';
  const salonName = salonSettings.salonName || 'Belcalis Nails & Co.';

  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync settings when opened
  useEffect(() => {
    if (isOpen) {
      const current = storage.getSalonSettings();
      setSalonSettings(current);
      if (messages.length === 0) {
        setMessages([getInitialBotMessage({ assistantName: current.assistantName, salonName: current.salonName })]);
      }
    }
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSendText = (text?: string) => {
    const query = (text || inputValue).trim();
    if (!query) return;

    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!text) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(query, {
        assistantName,
        salonName,
        currentServiceId: selectedServiceId
      });
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 450);
  };

  const handleOptionClick = (option: BotOption) => {
    // 1. Direct external actions
    if (option.actionType === 'open_booking') {
      onOpenBooking(option.serviceId || selectedServiceId);
      onClose();
      return;
    }

    if (option.actionType === 'open_hot_slots') {
      if (onOpenHotSlots) {
        onOpenHotSlots();
        onClose();
      } else {
        onOpenBooking(option.serviceId);
        onClose();
      }
      return;
    }

    // 2. Query actions
    if (option.actionType === 'send_query' && option.queryText) {
      handleSendText(option.queryText);
      return;
    }

    // 3. Service selection state tracking
    if (option.actionType === 'select_service' && option.serviceId) {
      setSelectedServiceId(option.serviceId);
    }

    // Add user chip selection as an answer message
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: option.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = handleOptionAction(option, {
        assistantName,
        salonName,
        currentServiceId: option.serviceId || selectedServiceId
      });
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 400);
  };

  const handleResetChat = () => {
    setSelectedServiceId(undefined);
    setMessages([getInitialBotMessage({ assistantName, salonName })]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: 'calc(100% - 40px)',
        maxWidth: '430px',
        height: '600px',
        maxHeight: 'calc(100vh - 40px)',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        boxShadow: '0 24px 70px -10px rgba(45, 30, 27, 0.4), 0 0 0 1px rgba(222, 115, 143, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 99999,
        overflow: 'hidden'
      }}
      className="animate-fade-in"
    >
      {/* Header with Professional's identity */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2A171D 0%, #1A0E13 100%)',
          color: '#FFFFFF',
          padding: '0.95rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(222, 115, 143, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DE738F 0%, #B84D6B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(222, 115, 143, 0.45)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)'
              }}
            >
              {assistantName.charAt(0)}
            </div>
            {/* Online Pulse Indicator */}
            <span
              style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: '#10B981',
                border: '2px solid #1A0E13'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.02em',
                  color: '#FFFFFF'
                }}
              >
                {assistantName}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  background: 'rgba(222, 115, 143, 0.25)',
                  color: '#FFAEC0',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  border: '1px solid rgba(222, 115, 143, 0.4)'
                }}
              >
                RECEPCIÓN IA
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#D9AAB7', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1px' }}>
              <span>{salonName}</span>
              <span>•</span>
              <span style={{ color: '#34D399', fontWeight: 500 }}>En línea ahora</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={handleResetChat}
            title="Reiniciar conversación"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#D9AAB7',
              cursor: 'pointer',
              padding: '0.45rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={onClose}
            title="Cerrar chat"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.45rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          padding: '1.1rem 1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.95rem',
          background: 'var(--bg-app)'
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Sender label for bot */}
              {!isUser && (
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.25rem', paddingLeft: '0.35rem', fontWeight: 600 }}>
                  {assistantName} • Recepción
                </div>
              )}

              {/* Message Bubble */}
              <div
                style={{
                  background: isUser
                    ? 'linear-gradient(135deg, #DE738F 0%, #C45573 100%)'
                    : 'var(--bg-surface)',
                  color: isUser ? '#FFFFFF' : 'var(--text-main)',
                  padding: '0.85rem 1rem',
                  borderRadius: isUser ? '18px 18px 3px 18px' : '18px 18px 18px 3px',
                  fontSize: '0.84rem',
                  lineHeight: 1.55,
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: isUser
                    ? '0 4px 15px rgba(222, 115, 143, 0.3)'
                    : '0 2px 10px rgba(0, 0, 0, 0.04)',
                  whiteSpace: 'pre-line'
                }}
              >
                {m.text}

                {/* Direct Action CTA inside the bubble */}
                {m.actionPayload && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: isUser ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)' }}>
                    {m.actionPayload.type === 'open_hot_slots' ? (
                      <button
                        onClick={() => {
                          if (onOpenHotSlots) {
                            onOpenHotSlots();
                          } else {
                            onOpenBooking(m.actionPayload?.serviceId);
                          }
                          onClose();
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '0.6rem 0.95rem',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          width: '100%',
                          justifyContent: 'center',
                          boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)'
                        }}
                      >
                        <Zap size={14} /> Reservar Hueco Express de Hoy
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onOpenBooking(m.actionPayload?.serviceId || selectedServiceId);
                          onClose();
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #DE738F 0%, #C45573 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '0.6rem 0.95rem',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          width: '100%',
                          justifyContent: 'center',
                          boxShadow: '0 4px 14px rgba(222, 115, 143, 0.35)'
                        }}
                      >
                        <Calendar size={14} /> Abrir Calendario y Confirmar Turno
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <div
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.2rem',
                  paddingLeft: isUser ? '0' : '0.4rem',
                  paddingRight: isUser ? '0.4rem' : '0'
                }}
              >
                {m.timestamp}
              </div>

              {/* Interactive Option Chips below the bubble */}
              {m.options && m.options.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    marginTop: '0.55rem',
                    width: '100%'
                  }}
                >
                  {m.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt)}
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        padding: '0.45rem 0.8rem',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--brand-terracotta)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-strong)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '0.65rem 0.95rem',
              borderRadius: '18px 18px 18px 3px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{assistantName} está escribiendo</span>
            <span className="flex gap-1 items-center ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse delay-150" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <input
          type="text"
          placeholder="Escribe tu consulta o pide un turno..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          style={{
            flex: 1,
            padding: '0.65rem 0.95rem',
            borderRadius: '999px',
            border: '1px solid var(--border-strong)',
            fontSize: '0.82rem',
            outline: 'none',
            background: 'var(--bg-app)',
            color: 'var(--text-main)'
          }}
        />
        <button
          onClick={() => handleSendText()}
          disabled={!inputValue.trim()}
          style={{
            background: inputValue.trim()
              ? 'linear-gradient(135deg, #DE738F 0%, #C45573 100%)'
              : 'var(--border-strong)',
            color: '#FFFFFF',
            border: 'none',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputValue.trim() ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'background 0.2s',
            boxShadow: inputValue.trim() ? '0 4px 12px rgba(222, 115, 143, 0.35)' : 'none'
          }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};
