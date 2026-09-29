import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  Heart,
  User,
  Phone,
  Mail,
  Award,
  Clock,
  FileText,
  Camera,
  Plus,
  Sparkles,
  CheckCircle2,
  X,
  Send
} from 'lucide-react';
import { ClientProfile, NailPlateCondition } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { useWebConfig } from '../../hooks/useWebConfig';

interface Props {
  clients: ClientProfile[];
}

export const ClientCRM: React.FC<Props> = ({ clients }) => {
  const { config } = useWebConfig();
  const brandName = config.brandName || 'Belcalis Nails';

  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(clients.length > 0 ? clients[0] : null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(clients.length > 0 ? (clients[0].technicianNotes || '') : '');

  // New Client Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newHemaAllergy, setNewHemaAllergy] = useState(false);
  const [newHeatSensitivity, setNewHeatSensitivity] = useState<'low' | 'medium' | 'high'>('low');
  const [newNailCondition, setNewNailCondition] = useState<NailPlateCondition>('healthy');
  const [newNotes, setNewNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    if (!selectedClient) return;
    const updated: ClientProfile = {
      ...selectedClient,
      technicianNotes: notesValue
    };
    storage.updateClient(updated);
    setSelectedClient(updated);
    setIsEditingNotes(false);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    setIsSaving(true);
    const cleanName = newName.trim();
    const initials = cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 4);
    const brandSuffix = (brandName || 'BELCALIS').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
    const referralCode = `${initials}-${brandSuffix}`;

    const newClient: ClientProfile = {
      id: `cli-${Date.now()}`,
      name: cleanName,
      phone: newPhone.trim(),
      email: newEmail.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      nailPlateCondition: newNailCondition,
      allergiesHema: newHemaAllergy,
      lampHeatSensitivity: newHeatSensitivity,
      favoriteColors: [],
      technicianNotes: newNotes.trim() || `Alta registrada en Atelier ${brandName}.`,
      pointsBalance: 200,
      tier: 'Silver',
      referralCode: referralCode,
      totalVisits: 0,
      lastVisitDate: new Date().toISOString().split('T')[0],
      setsHistory: []
    };

    // 1. Save in local storage & sync to Supabase
    storage.createClient(newClient);
    setSelectedClient(newClient);

    // 2. Dispatch automated welcome email if email provided
    let emailSent = false;
    if (newEmail.trim() && newEmail.includes('@')) {
      try {
        const emailRes = await fetch('/api/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: newClient.name,
            clientEmail: newClient.email,
            clientPhone: newClient.phone,
            pointsBalance: 200,
            referralCode: referralCode,
            tenantConfig: config
          })
        });
        if (emailRes.ok) {
          emailSent = true;
        }
      } catch (err) {
        console.warn('Error triggering welcome email:', err);
      }
    }

    setIsSaving(false);
    setIsNewModalOpen(false);

    // Success feedback
    setToastMessage(
      emailSent
        ? `✨ ¡Clienta ${cleanName} dada de alta! Se envió el email de bienvenida con la identidad de ${brandName} a ${newEmail}.`
        : `✨ Clienta ${cleanName} registrada con 200 pts de bienvenida.`
    );

    // Reset inputs
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewHemaAllergy(false);
    setNewHeatSensitivity('low');
    setNewNailCondition('healthy');
    setNewNotes('');

    setTimeout(() => setToastMessage(null), 6000);
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
    <div style={{ position: 'relative' }}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #2E1E1E 0%, #1A0F12 100%)',
          color: '#FFFFFF',
          padding: '1rem 1.4rem',
          borderRadius: '14px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.3), 0 0 0 1px rgba(222,115,143,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          maxWidth: '440px',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>{toastMessage}</div>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'transparent', border: 'none', color: '#A09093', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Grid */}
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
          {/* Top Actions: Search + CTA */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="btn-satin-pink"
              style={{
                width: '100%',
                padding: '0.55rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Plus size={15} />
              <span>Alta de Clienta VIP</span>
            </button>

            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Buscar por nombre, tel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.5rem 0.45rem 2rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.82rem'
                }}
              />
            </div>
          </div>

          {/* Client Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No se encontraron clientas.
              </div>
            ) : (
              filtered.map(c => {
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
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--brand-espresso)' }}>{c.name}</span>
                      <span className="badge-luxury badge-gold" style={{ fontSize: '0.65rem' }}>{c.pointsBalance} pts</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{c.phone}</div>
                    {c.email && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.email}
                      </div>
                    )}
                    {c.allergiesHema && (
                      <div style={{ fontSize: '0.7rem', color: '#E53E3E', fontWeight: 700, marginTop: '0.2rem' }}>
                        ⚠️ ALERGIA HEMA
                      </div>
                    )}
                  </div>
                );
              })
            )}
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
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--brand-espresso)', fontWeight: 700 }}>{selectedClient.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {selectedClient.phone} {selectedClient.email ? `• ${selectedClient.email}` : ''}
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
                <h4 style={{ fontSize: '1rem', color: 'var(--brand-espresso)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
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
              <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-espresso)', marginBottom: '0.5rem', fontWeight: 700 }}>
                Colores & Tonos Frecuentes
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedClient.favoriteColors && selectedClient.favoriteColors.length > 0 ? (
                  selectedClient.favoriteColors.map(color => (
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
                  ))
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Aún no se han configurado tonos frecuentes.</span>
                )}
              </div>
            </div>

            {/* Photo Gallery of Sets */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-espresso)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <Camera size={16} /> Registro Fotográfico de Sets Anteriores
              </h4>
              {selectedClient.setsHistory && selectedClient.setsHistory.length > 0 ? (
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
        ) : (
          <div className="rounded-2xl border border-dashed border-rose-200/80 bg-white/95 p-12 text-center text-muted-foreground shadow-sm animate-fade-in">
            <User className="size-10 mx-auto text-rose-400 mb-3 opacity-60" />
            <h3 className="text-base font-bold text-foreground font-serif">Seleccioná o registrá una clienta</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
              Podés registrar una nueva clienta para emitir su ficha clínica y enviarle su correo de bienvenida oficial con branding {brandName}.
            </p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="btn-satin-pink"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={15} />
              <span>Alta de Clienta VIP</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL: ALTA DE CLIENTA VIP */}
      {isNewModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(46, 30, 30, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid rgba(222, 115, 143, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(46, 30, 30, 0.25)',
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }} className="animate-fade-in">
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(135deg, rgba(222, 115, 143, 0.08) 0%, rgba(200, 150, 136, 0.12) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-pink-dark)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <Sparkles size={12} /> Ficha Clínica & Club Privilege
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif-glam)', fontSize: '1.35rem', color: 'var(--brand-espresso)', margin: '0.2rem 0 0 0', fontWeight: 700 }}>
                  Alta de Clienta • {brandName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateClient} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.35rem' }}>
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lucía Benítez"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.35rem' }}>
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11 5566-7788"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)', marginBottom: '0.35rem' }}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="lucia@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Email dispatch notice */}
              <div style={{
                background: 'rgba(222, 115, 143, 0.08)',
                border: '1px solid rgba(222, 115, 143, 0.25)',
                borderRadius: '10px',
                padding: '0.7rem 0.9rem',
                fontSize: '0.76rem',
                color: 'var(--brand-espresso)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Send size={15} color="var(--brand-pink-dark)" style={{ flexShrink: 0 }} />
                <span>
                  Al registrar el correo, se emitirá automáticamente el <strong>email de bienvenida oficial de {brandName}</strong> con 200 puntos acreditados y su código de referidos.
                </span>
              </div>

              {/* Health Diagnostic Inputs */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Diagnóstico Clínico Inicial
                </span>

                <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* HEMA check */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#9B2C2C' }}>
                    <input
                      type="checkbox"
                      checked={newHemaAllergy}
                      onChange={(e) => setNewHemaAllergy(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#E53E3E' }}
                    />
                    <span>⚠️ Alergia diagnosticada al HEMA (requiere esmaltado HEMA-FREE)</span>
                  </label>

                  {/* Nail condition */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Lámina Ungueal
                      </label>
                      <select
                        value={newNailCondition}
                        onChange={(e) => setNewNailCondition(e.target.value as NailPlateCondition)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.8rem', background: '#FFFFFF' }}
                      >
                        <option value="healthy">Saludable / Normal</option>
                        <option value="thin_weak">Delgada / Frágil</option>
                        <option value="onychophagy">Onicofagia (Mordida)</option>
                        <option value="sensitive_lamp">Sensible</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Sensibilidad Lámpara UV
                      </label>
                      <select
                        value={newHeatSensitivity}
                        onChange={(e) => setNewHeatSensitivity(e.target.value as 'low' | 'medium' | 'high')}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.8rem', background: '#FFFFFF' }}
                      >
                        <option value="low">Baja / Normal</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta (Modo Low Heat)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      Notas Técnicas de la Manicurista
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Observaciones de curvatura C, largo deseado, cutículas..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-strong)',
                    background: '#FFFFFF',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-satin-pink"
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: isSaving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSaving ? (
                    <span>Registrando y emitiendo email...</span>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Dar de Alta & Enviar Bienvenida</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
