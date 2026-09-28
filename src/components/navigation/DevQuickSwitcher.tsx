import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Smartphone, Settings, Layers, ChevronUp, ChevronDown } from 'lucide-react';

export const DevQuickSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentPath = location.pathname;

  const views = [
    {
      path: '/',
      label: 'Web Pública',
      icon: <Globe size={14} />,
      badge: 'Editorial'
    },
    {
      path: '/pwa',
      label: 'PWA Clientas',
      icon: <Smartphone size={14} />,
      badge: 'Club Privilege'
    },
    {
      path: '/backoffice',
      label: 'Backoffice',
      icon: <Settings size={14} />,
      badge: 'Gestión & Agenda'
    }
  ];

  const currentView = views.find(v => v.path === currentPath) || views[0];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 9999,
      fontFamily: 'var(--font-sans)',
      fontSize: '0.8rem'
    }}>
      {isExpanded ? (
        <div style={{
          background: 'rgba(30, 18, 22, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(222, 115, 143, 0.4)',
          borderRadius: '16px',
          padding: '0.6rem',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
          minWidth: '220px',
          color: '#FFF'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem 0.6rem 0.6rem 0.6rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--brand-pink-satin)', textTransform: 'uppercase' }}>
              <Layers size={13} /> Vistas Separadas
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex'
              }}
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {views.map(view => {
              const isActive = currentPath === view.path;
              return (
                <button
                  key={view.path}
                  onClick={() => {
                    navigate(view.path);
                    setIsExpanded(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    border: isActive ? '1px solid var(--brand-pink-satin)' : '1px solid transparent',
                    background: isActive ? 'rgba(222, 115, 143, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#FFF' : '#E2D8DD',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: isActive ? 'var(--brand-pink-satin)' : '#FFF' }}>{view.icon}</span>
                    <span style={{ fontWeight: isActive ? 700 : 500 }}>{view.label}</span>
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    background: isActive ? 'var(--brand-pink-satin)' : 'rgba(255,255,255,0.1)',
                    color: isActive ? '#FFF' : '#AAA',
                    padding: '2px 6px',
                    borderRadius: '6px'
                  }}>
                    {view.path}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'rgba(30, 18, 22, 0.88)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(222, 115, 143, 0.35)',
            color: '#FFFFFF',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.25s ease'
          }}
          title="Alternar entre vistas independientes (Web, PWA, Backoffice)"
        >
          <span style={{ color: 'var(--brand-pink-satin)', display: 'flex' }}>
            {currentView.icon}
          </span>
          <span style={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.02em' }}>
            {currentView.label}
          </span>
          <span style={{ fontSize: '0.65rem', color: '#D9BAC4', opacity: 0.8 }}>
            ({currentView.path})
          </span>
          <ChevronUp size={13} style={{ opacity: 0.7 }} />
        </button>
      )}
    </div>
  );
};
