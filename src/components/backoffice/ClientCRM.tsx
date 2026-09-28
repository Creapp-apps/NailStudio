import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, Heart, User, Phone, Mail, Award, Clock, FileText, Camera } from 'lucide-react';
import { ClientProfile, NailPlateCondition } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  clients: ClientProfile[];
}

export const ClientCRM: React.FC<Props> = ({ clients }) => {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(clients[0]);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(selectedClient?.technicianNotes || '');

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.referralCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectClient = (c: ClientProfile) => {
    setSelectedClient(c);
    setNotesValue(c.technicianNotes);
    setIsEditingNotes(false);
  };

  const handleSaveNotes = () => {
    const updated = {
      ...selectedClient,
      technicianNotes: notesValue
    };
    storage.updateClient(updated);
    setSelectedClient(updated);
    setIsEditingNotes(false);
  };

  const getConditionLabel = (condition: NailPlateCondition) => {
    switch (condition) {
      case 'thin_weak':
        return <span className="badge-luxury badge-rose">Lámina Delgada / Frágil</span>;
      case 'onychophagy':
        return <span className="badge-luxury" style={{ background: '#FFF5F5', color: '#E53E3E' }}>Onicofagia (Uñas Mordidas)</span>;
      case 'sensitive_lamp':
        return <span className="badge-luxury badge-gold">Sensible a Lámpara UV/LED</span>;
      default:
        return <span className="badge-luxury" style={{ background: '#EDF7F1', color: '#427A5B' }}>Lámina Saludable</span>;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem' }} className="animate-fade-in">
      {/* Sidebar List */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '700px'
      }}>
        {/* Search */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Buscar por nombre, tel o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 2rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Client Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.map(c => {
            const isSelected = selectedClient?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleSelectClient(c)}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.4rem',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--bg-card)' : 'transparent',
                  border: isSelected ? '1px solid var(--brand-terracotta)' : '1px solid transparent',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-espresso)' }}>{c.name}</span>
                  <span className="badge-luxury badge-gold" style={{ fontSize: '0.65rem' }}>{c.pointsBalance} pts</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.phone}</div>
                {c.allergiesHema && (
                  <div style={{ fontSize: '0.7rem', color: '#E53E3E', fontWeight: 700, marginTop: '0.2rem' }}>
                    ⚠️ ALERGIA HEMA
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main CRM Card: Ficha Técnica Ungueal */}
      {selectedClient ? (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '1.75rem',
          height: '700px',
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img
                src={selectedClient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={selectedClient.name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-terracotta)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--brand-espresso)' }}>{selectedClient.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {selectedClient.phone} • {selectedClient.email}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-luxury badge-gold">{selectedClient.tier}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Código: <strong>{selectedClient.referralCode}</strong>
              </div>
            </div>
          </div>

          {/* Critical Health Alerts */}
          {selectedClient.allergiesHema && (
            <div style={{
              background: '#FFF5F5',
              border: '1px solid #FEB2B2',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#9B2C2C',
              marginBottom: '1.5rem'
            }}>
              <AlertTriangle size={24} color="#E53E3E" />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>ALERTA CLÍNICA: Alergia al HEMA (Hidroxietil metacrilato)</strong>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>
                  Utilizar exclusivamente bases niveladoras, esmaltes y top coats con certificación <strong>HEMA-FREE</strong> para evitar dermatitis o picores.
                </p>
              </div>
            </div>
          )}

          {/* Nail Diagnostic Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Estado de la Lámina Ungueal
              </span>
              <div style={{ marginTop: '0.4rem' }}>
                {getConditionLabel(selectedClient.nailPlateCondition)}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Sensibilidad Térmica en Cabina
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-espresso)', marginTop: '0.3rem' }}>
                {selectedClient.lampHeatSensitivity === 'high' ? '🔥 Alta (Usar Modo Low Heat)' : selectedClient.lampHeatSensitivity === 'medium' ? 'Media' : 'Baja / Normal'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Visitas & Último Service
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-terracotta)', marginTop: '0.3rem' }}>
                {selectedClient.totalVisits} visitas • {selectedClient.lastVisitDate}
              </div>
            </div>
          </div>

          {/* Formulas and Technician Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--brand-espresso)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} /> Fórmulas y Notas Técnicas de la Manicurista
              </h4>
              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--brand-terracotta)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Editar Notas
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="btn-primary"
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Guardar
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                rows={3}
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem'
                }}
              />
            ) : (
              <div style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                lineHeight: 1.5
              }}>
                {selectedClient.technicianNotes || 'Sin notas registradas aún.'}
              </div>
            )}
          </div>

          {/* Preferred Color Swatches */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-espresso)', marginBottom: '0.5rem' }}>
              Colores & Tonos Frecuentes
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedClient.favoriteColors.map(color => (
                <span
                  key={color}
                  style={{
                    fontSize: '0.78rem',
                    background: 'var(--bg-card)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  💅 {color}
                </span>
              ))}
            </div>
          </div>

          {/* Photo Gallery of Sets */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-espresso)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Camera size={16} /> Registro Fotográfico de Sets Anteriores
            </h4>
            {selectedClient.setsHistory.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {selectedClient.setsHistory.map(set => (
                  <div key={set.id} style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <img src={set.photoUrl} alt={set.serviceName} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    <div style={{ padding: '0.5rem', background: 'var(--bg-card)', fontSize: '0.72rem' }}>
                      <div style={{ fontWeight: 700 }}>{set.date}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{set.nailArtTierName}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin registros fotográficos.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
