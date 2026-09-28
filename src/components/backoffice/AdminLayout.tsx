import React, { useState } from 'react';
import { Appointment, NailTechnician, ClientProfile, SupplyItem } from '../../types/nailStudio';
import { BackofficeSidebar, BackofficeSection } from './BackofficeSidebar';
import { BackofficeTopNav } from './BackofficeTopNav';
import { MultiTechCalendar } from './MultiTechCalendar';
import { ClientCRM } from './ClientCRM';
import { InventoryManager } from './InventoryManager';
import { SupplierOrdersView } from './SupplierOrdersView';
import { FinancialSummary } from './FinancialSummary';
import { AutomationsHub } from './AutomationsHub';
import { LoyaltyClubView } from './LoyaltyClubView';
import { HealthDiagnosticsView } from './HealthDiagnosticsView';
import { CommissionsView } from './CommissionsView';
import { StaffManagementView } from './StaffManagementView';
import { LiveDeskView } from './LiveDeskView';
import { WebStudioView } from './WebStudioView';
import { SalonSettingsView } from './SalonSettingsView';
import { IntegrationsApiView } from './IntegrationsApiView';
import { BookingModal } from '../booking/BookingModal';
import { storage } from '../../services/storage';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
  clients: ClientProfile[];
  supplies: SupplyItem[];
}

export const AdminLayout: React.FC<Props> = ({ appointments, techs, clients, supplies }) => {
  const [activeSection, setActiveSection] = useState<BackofficeSection>('web_studio');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Computed metrics for badges
  const todayAppointments = appointments.filter(a => a.scheduledDate === '2026-09-28');
  const lowStockSupplies = supplies.filter(s => s.currentStock <= s.minStockAlert);
  const hemaAllergies = clients.filter(c => c.allergiesHema);
  const retentionPending = clients.filter(c => {
    // Days since last appointment >= 18
    const lastApp = appointments
      .filter(a => a.clientPhone === c.phone || a.clientName.toLowerCase() === c.name.toLowerCase())
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0];
    if (!lastApp) return true;
    const diffDays = Math.floor((new Date('2026-09-28').getTime() - new Date(lastApp.scheduledDate).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 18;
  });

  const handleResetData = () => {
    if (confirm('¿Deseas reiniciar los datos de demostración a su estado original?')) {
      storage.resetToSeed();
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/20 font-sans text-foreground">
      {/* 1. High-End Elegant SaaS Sidebar */}
      <BackofficeSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        todayAppointmentsCount={todayAppointments.length}
        lowStockCount={lowStockSupplies.length}
        hemaAlertCount={hemaAllergies.length}
        retentionPendingCount={retentionPending.length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <BackofficeTopNav
          activeSection={activeSection}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
          onOpenNewBooking={() => setIsBookingModalOpen(true)}
          onResetData={handleResetData}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {/* PERSONALIZACIÓN & WEB STUDIO */}
            {activeSection === 'web_studio' && (
              <WebStudioView />
            )}

            {/* OPERACIONES */}
            {activeSection === 'calendar' && (
              <MultiTechCalendar appointments={appointments} techs={techs} />
            )}
            {activeSection === 'waitlist' && (
              <LiveDeskView appointments={appointments} techs={techs} />
            )}

            {/* CLIENTELA & SALUD UNGUEAL */}
            {activeSection === 'crm' && (
              <ClientCRM clients={clients} />
            )}
            {activeSection === 'health' && (
              <HealthDiagnosticsView clients={clients} />
            )}

            {/* LOGÍSTICA & STOCK */}
            {activeSection === 'inventory' && (
              <InventoryManager supplies={supplies} />
            )}
            {activeSection === 'orders' && (
              <SupplierOrdersView supplies={supplies} />
            )}

            {/* MARKETING & FIDELIZACIÓN */}
            {activeSection === 'automations' && (
              <AutomationsHub clients={clients} />
            )}
            {activeSection === 'loyalty' && (
              <LoyaltyClubView clients={clients} />
            )}

            {/* FINANZAS */}
            {activeSection === 'finances' && (
              <FinancialSummary appointments={appointments} techs={techs} />
            )}
            {activeSection === 'commissions' && (
              <CommissionsView appointments={appointments} techs={techs} />
            )}

            {/* SISTEMA & STAFF */}
            {activeSection === 'staff' && (
              <StaffManagementView techs={techs} />
            )}
            {activeSection === 'settings' && (
              <SalonSettingsView />
            )}
            {activeSection === 'integrations' && (
              <IntegrationsApiView />
            )}
          </div>
        </main>
      </div>

      {/* Manual Booking Modal Triggered from SaaS Header */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};
