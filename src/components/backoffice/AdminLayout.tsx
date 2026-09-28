import React, { useState } from 'react';
import { Calendar, Users, Package, DollarSign, MessageSquare, Sparkles } from 'lucide-react';
import { Appointment, NailTechnician, ClientProfile, SupplyItem } from '../../types/nailStudio';
import { MultiTechCalendar } from './MultiTechCalendar';
import { ClientCRM } from './ClientCRM';
import { InventoryManager } from './InventoryManager';
import { FinancialSummary } from './FinancialSummary';
import { AutomationsHub } from './AutomationsHub';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
  clients: ClientProfile[];
  supplies: SupplyItem[];
}

export const AdminLayout: React.FC<Props> = ({ appointments, techs, clients, supplies }) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'crm' | 'inventory' | 'finances' | 'automations'>('calendar');

  const lowStock = supplies.filter(s => s.currentStock <= s.minStockAlert).length;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Backoffice Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span className="badge-luxury badge-rose" style={{ marginBottom: '0.25rem' }}>
            Atelier Management Studio
          </span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--brand-espresso)' }}>
            Panel de Operaciones & Backoffice
          </h2>
        </div>

        {/* Tab Navigation Pills */}
        <div className="tab-pills" style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`tab-pill-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Calendar size={15} /> Agenda de Mesas
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`tab-pill-btn ${activeTab === 'crm' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Users size={15} /> Ficha Técnica CRM
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`tab-pill-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Package size={15} /> Insumos {lowStock > 0 && <span style={{ background: '#E53E3E', color: '#FFF', borderRadius: '50%', padding: '1px 5px', fontSize: '0.65rem' }}>{lowStock}</span>}
          </button>
          <button
            onClick={() => setActiveTab('finances')}
            className={`tab-pill-btn ${activeTab === 'finances' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <DollarSign size={15} /> Finanzas & Liquidación
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`tab-pill-btn ${activeTab === 'automations' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <MessageSquare size={15} /> Retención & WhatsApp
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'calendar' && (
        <MultiTechCalendar appointments={appointments} techs={techs} />
      )}

      {activeTab === 'crm' && (
        <ClientCRM clients={clients} />
      )}

      {activeTab === 'inventory' && (
        <InventoryManager supplies={supplies} />
      )}

      {activeTab === 'finances' && (
        <FinancialSummary appointments={appointments} techs={techs} />
      )}

      {activeTab === 'automations' && (
        <AutomationsHub clients={clients} />
      )}
    </div>
  );
};
