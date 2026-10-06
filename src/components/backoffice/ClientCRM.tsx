import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Send,
  Key,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Trash2,
  Crown
} from 'lucide-react';
import { ClientProfile, NailPlateCondition } from '../../types/nailStudio';
import { storage } from '../../services/storage';
import { useWebConfig } from '../../hooks/useWebConfig';
import { LuxurySelect } from '../common/LuxurySelect';

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

  // Vitalicia State for selected client
  const [filterTab, setFilterTab] = useState<'all' | 'vitalicias'>('all');
  const [isVitalicia, setIsVitalicia] = useState(clients.length > 0 ? Boolean(clients[0].isVitalicia) : false);
  const [vitaliciaDiscount, setVitaliciaDiscount] = useState<number>(clients.length > 0 ? (clients[0].vitaliciaDiscountPercentage || 15) : 15);

  // New Client Modal State (Controlled by Salon Authority)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [newHemaAllergy, setNewHemaAllergy] = useState(false);
  const [newHeatSensitivity, setNewHeatSensitivity] = useState<'low' | 'medium' | 'high'>('low');
  const [newNailCondition, setNewNailCondition] = useState<NailPlateCondition>('healthy');
  const [newNotes, setNewNotes] = useState('');
  const [newIsVitalicia, setNewIsVitalicia] = useState(true); // Default true for clients loaded by Lu
  const [newVitaliciaDiscount, setNewVitaliciaDiscount] = useState(15);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const generateInitialPassword = () => {
    const cleanBrand = (brandName || 'Belcalis').replace(/[^a-zA-Z]/g, '') || 'Belcalis';
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${cleanBrand}${num}!`;
  };

  const handleOpenNewModal = () => {
    setNewPassword(generateInitialPassword());
    setShowNewPassword(false);
    setAuthError('');
    setIsNewModalOpen(true);
  };

  const handleRegeneratePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewPassword(generateInitialPassword());
  };

  const baseFiltered = clients
    .filter(c =>
      !c.id.startsWith('tenant_') &&
      c.name !== 'Staff Sync System' &&
      c.name !== 'Belcalis Nails'
    )
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      c.referralCode.toLowerCase().includes(search.toLowerCase())
    );

  const vitaliciasCount = baseFiltered.filter(c => c.isVitalicia).length;

  const filtered = filterTab === 'vitalicias'
    ? baseFiltered.filter(c => c.isVitalicia)
    : baseFiltered;

  const handleDeleteClient = (clientToDelete: ClientProfile) => {
    if (confirm(`¿Estás segura de que deseas eliminar la ficha de "${clientToDelete.name}"? Esta acción borrará permanentemente sus datos técnicos y de fidelización.`)) {
      storage.deleteClient(clientToDelete.id);
      if (selectedClient?.id === clientToDelete.id) {
        const remaining = filtered.filter(c => c.id !== clientToDelete.id);
        setSelectedClient(remaining[0] || null);
      }
    }
  };

  const handleSelectClient = (c: ClientProfile) => {
    setSelectedClient(c);
    setNotesValue(c.technicianNotes);
    setIsEditingNotes(false);
    setIsVitalicia(Boolean(c.isVitalicia));
    setVitaliciaDiscount(c.vitaliciaDiscountPercentage || 15);
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

  const handleSaveVitalicia = () => {
    if (!selectedClient) return;
    const updated = storage.setVitaliciaStatus(selectedClient.id, isVitalicia, vitaliciaDiscount);
    if (updated) {
      setSelectedClient(updated);
      setToastMessage(
        isVitalicia
          ? `👑 ¡Membresía Vitalicia guardada para ${updated.name}! Se le aplicará un ${vitaliciaDiscount}% OFF permanente en turnos y reservas.`
          : `Tarifa estándar asignada a ${updated.name} (Beneficio Vitalicia removido).`
      );
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    setIsSaving(true);
    setAuthError('');

    const cleanName = newName.trim();
    const cleanPhone = newPhone.trim();
    const cleanEmail = newEmail.trim().toLowerCase();
    const assignedPassword = newPassword.trim() || generateInitialPassword();

    const initials = cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 4);
    const brandSuffix = (brandName || 'BELCALIS').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
    const referralCode = `${initials}-${brandSuffix}`;

    let authUserId = `cli-${Date.now()}`;
    let emailSent = false;

    // 1. If email is provided, create real Supabase Auth user & send credentials email
    if (cleanEmail && cleanEmail.includes('@')) {
      try {
        const signupRes = await fetch('/api/auth-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password: assignedPassword,
            phone: cleanPhone,
            role: 'client',
            nail_plate_condition: newNailCondition,
            allergies_hema: newHemaAllergy,
            lamp_heat_sensitivity: newHeatSensitivity,
            technician_notes: newNotes.trim() || `Alta autorizada por personal de ${brandName}.`
          })
        });

        const signupData = await signupRes.json();
        if (!signupRes.ok) {
          setAuthError(signupData.error || 'Error al crear la cuenta en Supabase Auth.');
          setIsSaving(false);
          return;
        }

        if (signupData.user?.id) {
          authUserId = signupData.user.id;
        }
        emailSent = true;
      } catch (err: any) {
        console.warn('[ClientCRM] Error registering client auth:', err);
      }
    }

    const newClient: ClientProfile = {
      id: authUserId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      nailPlateCondition: newNailCondition,
      allergiesHema: newHemaAllergy,
      lampHeatSensitivity: newHeatSensitivity,
      favoriteColors: [],
      technicianNotes: newNotes.trim() || `Alta autorizada por encargada de ${brandName}.`,
      pointsBalance: 200,
      tier: 'Silver',
      referralCode: referralCode,
      totalVisits: 0,
      lastVisitDate: new Date().toISOString().split('T')[0],
      setsHistory: [],
      isVitalicia: newIsVitalicia,
      vitaliciaDiscountPercentage: newIsVitalicia ? newVitaliciaDiscount : undefined,
      vitaliciaAssignedAt: newIsVitalicia ? new Date().toISOString().split('T')[0] : undefined
    };

    // Save in local storage & sync to Supabase
    storage.createClient(newClient);
    setSelectedClient(newClient);

    setIsSaving(false);
    setIsNewModalOpen(false);

    // Success feedback
    setToastMessage(
      emailSent
        ? `✨ ¡Clienta ${cleanName} dada de alta! Se generaron sus credenciales de acceso y se le envió el email oficial con la marca ${brandName}.`
        : `✨ Clienta ${cleanName} registrada con 200 pts de bienvenida.`
    );

    // Reset inputs
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewPassword('');
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
              onClick={handleOpenNewModal}
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

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.5rem',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterTab === 'all' ? 'var(--brand-terracotta)' : 'var(--bg-card)',
                  color: filterTab === 'all' ? '#FFF' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                Todas ({baseFiltered.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('vitalicias')}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.5rem',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterTab === 'vitalicias' ? 'linear-gradient(135deg, #DE738F, #C45774)' : 'var(--bg-card)',
                  color: filterTab === 'vitalicias' ? '#FFF' : 'var(--brand-terracotta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.2s'
                }}
              >
                <Crown size={12} />
                <span>Vitalicias ({vitaliciasCount})</span>
              </button>
            </div>
          </div>

          {/* Client Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                {filterTab === 'vitalicias'
                  ? 'No hay clientas marcadas como Vitalicias aún.'
                  : 'No se encontraron clientas.'}
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
                    {c.isVitalicia && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '0.35rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.7), rgba(255, 228, 230, 0.7))',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        color: '#B45309',
                        fontSize: '0.67rem',
                        fontWeight: 800
                      }}>
                        <Crown size={10} />
                        <span>Vitalicia (-{c.vitaliciaDiscountPercentage || 15}%)</span>
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

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {selectedClient.isVitalicia && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, #F59E0B, #DE738F)',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      boxShadow: '0 2px 8px rgba(222, 115, 143, 0.35)'
                    }}>
                      <Crown size={12} />
                      <span>Vitalicia -{selectedClient.vitaliciaDiscountPercentage || 15}%</span>
                    </span>
                  )}
                  <span className="badge-luxury badge-gold">{selectedClient.tier}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Código: <strong>{selectedClient.referralCode}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteClient(selectedClient)}
                  title="Eliminar Ficha de Clienta"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(229, 62, 62, 0.35)',
                    color: '#E53E3E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    marginTop: '0.3rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 62, 62, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Trash2 size={12} />
                  <span>Eliminar Ficha</span>
                </button>
              </div>
            </div>

            {/* 👑 VIP VITALICIA / TARIFA PROTEGIDA CARD */}
            <div style={{
              background: isVitalicia
                ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(255, 228, 230, 0.45) 100%)'
                : 'var(--bg-card)',
              border: isVitalicia
                ? '1px solid rgba(245, 158, 11, 0.45)'
                : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              boxShadow: isVitalicia ? '0 4px 20px -2px rgba(222, 115, 143, 0.12)' : 'none',
              transition: 'all 0.25s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: isVitalicia ? 'linear-gradient(135deg, #F59E0B, #DE738F)' : 'var(--bg-card-subtle)',
                    color: isVitalicia ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isVitalicia ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
                  }}>
                    <Crown size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--brand-espresso)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Membresía Vitalicia (Tarifa Protegida Lu)
                      {isVitalicia ? (
                        <span style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          color: '#B45309',
                          fontSize: '0.68rem',
                          fontWeight: 800
                        }}>
                          ACTIVA • {vitaliciaDiscount}% OFF
                        </span>
                      ) : (
                        <span style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          fontSize: '0.68rem',
                          fontWeight: 600
                        }}>
                          TARIFA ESTÁNDAR
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {isVitalicia
                        ? `Clienta histórica. Al agendar turnos se le descuenta de forma automática y permanente un ${vitaliciaDiscount}%.`
                        : 'Abonará el precio completo de lista cuando reserve o se le carguen turnos.'}
                    </div>
                  </div>
                </div>

                {/* Toggle Action */}
                <button
                  type="button"
                  onClick={() => setIsVitalicia(!isVitalicia)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    border: isVitalicia ? '1px solid rgba(222, 115, 143, 0.4)' : '1px solid var(--border-strong)',
                    background: isVitalicia ? '#FFFFFF' : 'var(--bg-surface)',
                    color: isVitalicia ? '#C45774' : 'var(--brand-espresso)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Crown size={14} color={isVitalicia ? '#DE738F' : '#888'} />
                  <span>{isVitalicia ? 'Desactivar Vitalicia' : '⭐ Activar como Vitalicia'}</span>
                </button>
              </div>

              {isVitalicia && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px dashed rgba(245, 158, 11, 0.35)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-espresso)', textTransform: 'uppercase' }}>
                      % Descuento:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={vitaliciaDiscount}
                        onChange={(e) => setVitaliciaDiscount(Number(e.target.value) || 15)}
                        style={{
                          width: '70px',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-strong)',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          background: '#FFFFFF'
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>% OFF</span>
                    </div>
                  </div>

                  <div style={{
                    flex: 1,
                    minWidth: '260px',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(222, 115, 143, 0.25)'
                  }}>
                    💡 <strong>Ejemplo en vivo:</strong> En un ticket nuevo de <strong>$40.000</strong>, pagará automáticamente <strong>${Math.round(40000 * (1 - vitaliciaDiscount / 100)).toLocaleString('es-AR')}</strong> (-${Math.round(40000 * (vitaliciaDiscount / 100)).toLocaleString('es-AR')} de beneficio).
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveVitalicia}
                    style={{
                      padding: '0.5rem 1.1rem',
                      fontSize: '0.8rem',
                      background: 'linear-gradient(135deg, #DE738F 0%, #C45774 100%)',
                      border: 'none',
                      color: '#FFF',
                      borderRadius: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(222, 115, 143, 0.3)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Guardar Beneficio
                  </button>
                </div>
              )}
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
              onClick={handleOpenNewModal}
              className="btn-satin-pink"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={15} />
              <span>Alta de Clienta VIP</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL: ALTA DE CLIENTA VIP (SALON AUTHORITY CONTROLLED) */}
      {isNewModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'radial-gradient(circle at center, rgba(222, 115, 143, 0.12) 0%, rgba(20, 10, 15, 0.55) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
            animation: 'modalBackdropFade 0.2s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewModalOpen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid rgba(222, 115, 143, 0.3)',
              boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(222, 115, 143, 0.2)',
              overflow: 'hidden',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalCardPop 0.25s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
            <form onSubmit={handleCreateClient} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Salon Authority & Anti-Fraud Security Notice */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                fontSize: '0.76rem',
                color: '#6B4E00',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                lineHeight: 1.45
              }}>
                <ShieldCheck size={18} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Control de Autoridad Activo:</strong> Solo el personal de {brandName} puede dar de alta cuentas para evitar fraudes con promociones de bienvenida y múltiples registros falsos.
                </div>
              </div>

              {/* Error Message */}
              {authError && (
                <div style={{
                  background: '#FFF5F5',
                  border: '1px solid #FEB2B2',
                  color: '#C53030',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

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
                    Correo Electrónico (Para envío de accesos)
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

              {/* Password Assignment (Generated by Salon Authority) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-espresso)' }}>
                    Contraseña Asignada para Portal PWA / Billetera
                  </label>
                  <button
                    type="button"
                    onClick={handleRegeneratePassword}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-pink-dark)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <RefreshCw size={12} /> Generar otra
                  </button>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={15} color="var(--brand-pink-dark)" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Contraseña inicial"
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.5rem 0.65rem 2.2rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-strong)',
                      fontSize: '0.88rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      outline: 'none',
                      background: '#FFFDFD'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0 }}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>
                  Esta contraseña se incluirá en el correo de bienvenida oficial de {brandName} para que la clienta inicie sesión sin auto-registros.
                </p>
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
                  Se emitirá automáticamente el <strong>email de bienvenida oficial de {brandName}</strong> con sus credenciales, 200 puntos acreditados y código de referidos.
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
                      <LuxurySelect
                        value={newNailCondition}
                        onChange={(val) => setNewNailCondition(val as NailPlateCondition)}
                        options={[
                          { value: 'healthy', label: 'Saludable / Normal' },
                          { value: 'thin_weak', label: 'Delgada / Frágil' },
                          { value: 'onychophagy', label: 'Onicofagia (Mordida)' },
                          { value: 'sensitive_lamp', label: 'Sensible' }
                        ]}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Sensibilidad Lámpara UV
                      </label>
                      <LuxurySelect
                        value={newHeatSensitivity}
                        onChange={(val) => setNewHeatSensitivity(val as 'low' | 'medium' | 'high')}
                        options={[
                          { value: 'low', label: 'Baja / Normal' },
                          { value: 'medium', label: 'Media' },
                          { value: 'high', label: 'Alta (Modo Low Heat)' }
                        ]}
                      />
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

                  {/* 👑 Membresía Vitalicia Option */}
                  <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: newIsVitalicia
                      ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(255, 228, 230, 0.5) 100%)'
                      : 'var(--bg-card-subtle)',
                    border: newIsVitalicia
                      ? '1px solid rgba(245, 158, 11, 0.45)'
                      : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: 'var(--brand-espresso)' }}>
                      <input
                        type="checkbox"
                        checked={newIsVitalicia}
                        onChange={(e) => setNewIsVitalicia(e.target.checked)}
                        style={{ width: '17px', height: '17px', accentColor: '#DE738F', cursor: 'pointer' }}
                      />
                      <span>👑 Asignar como Clienta Vitalicia (Tarifa Protegida Lu)</span>
                    </label>
                    {newIsVitalicia && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <span>Descuento permanente:</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={newVitaliciaDiscount}
                          onChange={(e) => setNewVitaliciaDiscount(Number(e.target.value) || 15)}
                          style={{
                            width: '65px',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-strong)',
                            fontWeight: 800,
                            textAlign: 'center',
                            background: '#FFFFFF'
                          }}
                        />
                        <span style={{ fontWeight: 700 }}>% OFF automático en reservas</span>
                      </div>
                    )}
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
        </div>,
        document.body
      )}
    </div>
  );
};
