import React, { useState, useEffect } from 'react';
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
import { HomeDashboardView } from './HomeDashboardView';
import { SalonSettingsView } from './SalonSettingsView';
import { ServicesCatalogView } from './ServicesCatalogView';
import { IntegrationsApiView } from './IntegrationsApiView';
import { BookingModal } from '../booking/BookingModal';
import { IncomingAppointmentModal } from './IncomingAppointmentModal';
import { storage } from '../../services/storage';
import { PlatformTier, PLATFORM_TIERS } from '../../types/platformTiers';
import { format } from 'date-fns';

interface Props {
  appointments: Appointment[];
  techs: NailTechnician[];
  clients: ClientProfile[];
  supplies: SupplyItem[];
}

export const AdminLayout: React.FC<Props> = ({ appointments, techs, clients, supplies }) => {
  const [currentTier, setCurrentTier] = useState<PlatformTier>(() => storage.getPlatformTier());
  const [activeSection, setActiveSection] = useState<BackofficeSection>(() => {
    const tier = storage.getPlatformTier();
    const defaultSec: BackofficeSection = 'home';
    return PLATFORM_TIERS[tier].allowedSections.includes(defaultSec) ? defaultSec : 'calendar';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('atelier_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [incomingAppointment, setIncomingAppointment] = useState<Appointment | null>(null);

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('atelier_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    // 0. Listen for platform tier changes
    const handleTierChange = (e: any) => {
      if (e.detail) {
        const nextTier = e.detail as PlatformTier;
        setCurrentTier(nextTier);
        if (!PLATFORM_TIERS[nextTier].allowedSections.includes(activeSection)) {
          setActiveSection('calendar');
        }
      }
    };
    window.addEventListener('atelier-tier-changed', handleTierChange);

    // 1. Listen for window custom event
    const handleNewApt = (e: any) => {
      if (e.detail) {
        setIncomingAppointment(e.detail);
      }
    };
    window.addEventListener('atelier-new-appointment', handleNewApt);

    // 2. Listen for multi-tab BroadcastChannel
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel('atelier_realtime_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_APPOINTMENT_RECEIVED' && event.data?.appointment) {
            setIncomingAppointment(event.data.appointment);
          }
        };
      } catch {}
    }

    // 3. Storage event for cross-tab localStorage fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'atelier_latest_incoming_apt' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.apt) {
            setIncomingAppointment(parsed.apt);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('atelier-tier-changed', handleTierChange);
      window.removeEventListener('atelier-new-appointment', handleNewApt);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
    };
  }, [activeSection]);

  // Computed metrics for badges
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(a => a.scheduledDate === todayStr || a.scheduledDate === '2026-09-28');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const pendingAppointmentsCount = pendingAppointments.length;
  const lowStockSupplies = supplies.filter(s => s.currentStock <= s.minStockAlert);
  const hemaAllergies = clients.filter(c => c.allergiesHema);
  const retentionPending = clients.filter(c => {
    // Days since last appointment >= 18
    const lastApp = appointments
      .filter(a => a.clientPhone === c.phone || a.clientName.toLowerCase() === c.name.toLowerCase())
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0];
    if (!lastApp) return true;
    const diffDays = Math.floor((new Date().getTime() - new Date(lastApp.scheduledDate).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 18;
  });

  const handleResetData = () => {
    if (confirm('¿Deseas reiniciar los datos de demostración a su estado original?')) {
      storage.resetToSeed();
    }
  };

  return (
    <div className="flex min-h-screen items-start bg-transparent font-sans text-foreground">
      {/* 1. High-End Elegant SaaS Floating Pill Sidebar */}
      <BackofficeSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        todayAppointmentsCount={todayAppointments.length}
        pendingAppointmentsCount={pendingAppointmentsCount}
        lowStockCount={lowStockSupplies.length}
        hemaAlertCount={hemaAllergies.length}
        retentionPendingCount={retentionPending.length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-screen w-full">
        {/* Top Navbar */}
        <BackofficeTopNav
          activeSection={activeSection}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
          onOpenNewBooking={() => setIsBookingModalOpen(true)}
          onResetData={handleResetData}
        />

        {/* Content Viewport: Fullscreen Section for Calendar, Contained for Settings/CRM */}
        {activeSection === 'calendar' ? (
          <main className="flex-1 w-full h-[calc(100vh-60px)] flex flex-col p-0 m-0 overflow-hidden bg-background">
            <MultiTechCalendar appointments={appointments} techs={techs} />
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              {/* HOME (DASHBOARD PRINCIPAL DE LA PLATAFORMA) */}
              {activeSection === 'home' && (
                <HomeDashboardView
                  appointments={appointments}
                  techs={techs}
                  clients={clients}
                  supplies={supplies}
                  onNavigate={setActiveSection}
                  onOpenNewBooking={() => setIsBookingModalOpen(true)}
                />
              )}

              {/* PERSONALIZACIÓN & WEB STUDIO */}
              {activeSection === 'web_studio' && (
                <WebStudioView />
              )}

              {/* OPERACIONES */}
              {activeSection === 'services' && (
                <ServicesCatalogView onOpenBookingPreview={() => setIsBookingModalOpen(true)} />
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
      )}
    </div>

      {/* Manual Booking Modal Triggered from SaaS Header */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {/* Real-time Central Floating Toast: Turno Recibido */}
      <IncomingAppointmentModal
        appointment={incomingAppointment}
        onClose={() => setIncomingAppointment(null)}
        onGoToCalendar={() => {
          setActiveSection('calendar');
        }}
        techs={techs}
      />
    </div>
  );
};
