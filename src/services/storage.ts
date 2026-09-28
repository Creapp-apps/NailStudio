import {
  NailService,
  NailTechnician,
  Appointment,
  ClientProfile,
  SupplyItem,
  SupplierOrder,
  AppointmentStatus,
  NailPlateCondition,
  SalonOperatingSettings,
  SalonIntegrationsConfig
} from '../types/nailStudio';
import {
  INITIAL_SERVICES,
  NAIL_TECHNICIANS,
  INITIAL_APPOINTMENTS,
  INITIAL_CLIENTS,
  INITIAL_SUPPLIES
} from './mockData';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  SERVICES: 'atelier_services',
  TECHS: 'atelier_techs',
  APPOINTMENTS: 'atelier_appointments',
  CLIENTS: 'atelier_clients',
  SUPPLIES: 'atelier_supplies',
  SUPPLIER_ORDERS: 'atelier_supplier_orders',
  CURRENT_CLIENT_ID: 'atelier_current_client_id',
  SALON_SETTINGS: 'atelier_salon_settings',
  INTEGRATIONS: 'atelier_integrations_config'
};

class StorageService {
  private listeners: Set<() => void> = new Set();
  public isSupabaseConnected: boolean = false;
  private isSyncing: boolean = false;

  constructor() {
    this.initDefaults();
    this.fetchFromSupabase();
    this.setupRealtimeSubscriptions();
  }

  private initDefaults() {
    // Purge legacy mock data if present
    const storedApts = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!storedApts || storedApts.includes('apt-101') || storedApts.includes('Lucía Fernández')) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    }
    const storedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!storedClients || storedClients.includes('cli-1') || storedClients.includes('Lucía Fernández')) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
    }
    const storedSupplies = localStorage.getItem(STORAGE_KEYS.SUPPLIES);
    if (!storedSupplies || storedSupplies.includes('sup-1')) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify([]));
    }
    const storedTechs = localStorage.getItem(STORAGE_KEYS.TECHS);
    if (!storedTechs || storedTechs.includes('tech-1') || storedTechs.includes('Sofía Valenzuela') || storedTechs.includes('Valentina Rossi') || storedTechs.includes('Camila Méndez')) {
      localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TECHS)) {
      localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT_ID, '');
    }
  }

  // --- Realtime Subscriptions from Supabase ---
  private setupRealtimeSubscriptions() {
    try {
      supabase
        .channel('public-atelier-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
          this.fetchFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_profiles' }, () => {
          this.fetchFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'supplies' }, () => {
          this.fetchFromSupabase();
        })
        .subscribe();
    } catch {
      // Realtime fallback to polling / local
    }
  }

  // --- Hydrate from Supabase ---
  public async fetchFromSupabase(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      // 1. Services
      const { data: srvData } = await supabase.from('nail_services').select('*');
      if (srvData && srvData.length > 0) {
        const mappedServices: NailService[] = srvData.map(s => ({
          id: s.id,
          title: s.title,
          category: s.category,
          basePrice: Number(s.base_price),
          baseDurationMin: Number(s.base_duration_min),
          description: s.description || '',
          badge: s.badge || undefined,
          imageUrl: s.image_url || '',
          recommendedFor: s.recommended_for || ''
        }));
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mappedServices));
      }

      // 2. Technicians (Filter out mock data)
      const { data: techData } = await supabase.from('nail_technicians').select('*');
      if (techData && techData.length > 0) {
        const filtered = techData.filter(t =>
          !['tech-1', 'tech-2', 'tech-3'].includes(t.id) &&
          !['Sofía Valenzuela', 'Valentina Rossi', 'Camila Méndez'].includes(t.name)
        );
        const mappedTechs: NailTechnician[] = filtered.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          avatar: t.avatar || '',
          specialties: t.specialties || [],
          rating: Number(t.rating || 5.0),
          reviewsCount: Number(t.reviews_count || 0),
          commissionRate: Number(t.commission_rate || 0.50)
        }));
        localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(mappedTechs));
      }

      // 3. Appointments
      const { data: aptData } = await supabase.from('appointments').select('*').order('scheduled_date', { ascending: false });
      if (aptData) {
        const mappedApts: Appointment[] = aptData.map(a => ({
          id: a.id,
          clientName: a.client_name,
          clientPhone: a.client_phone,
          clientEmail: a.client_email || '',
          techId: a.tech_id,
          serviceId: a.service_id,
          removalId: a.removal_id,
          nailArtTierId: a.nail_art_tier_id,
          totalDurationMin: Number(a.total_duration_min),
          totalPrice: Number(a.total_price),
          depositAmount: Number(a.deposit_amount || 5000),
          depositPaid: Boolean(a.deposit_paid),
          scheduledDate: a.scheduled_date,
          scheduledTime: a.scheduled_time,
          status: a.status,
          notes: a.notes || '',
          createdAt: a.created_at || new Date().toISOString()
        }));
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(mappedApts));
      }

      // 4. Clients
      const { data: cliData } = await supabase.from('client_profiles').select('*');
      if (cliData) {
        const mappedClients: ClientProfile[] = cliData.map(c => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email || '',
          avatar: c.avatar || undefined,
          nailPlateCondition: (c.nail_plate_condition || 'healthy') as NailPlateCondition,
          allergiesHema: Boolean(c.allergies_hema),
          lampHeatSensitivity: c.lamp_heat_sensitivity || 'low',
          favoriteColors: c.favorite_colors || [],
          technicianNotes: c.technician_notes || '',
          pointsBalance: Number(c.points_balance || 0),
          tier: c.tier || 'Silver',
          referralCode: c.referral_code,
          referredBy: c.referred_by || undefined,
          totalVisits: Number(c.total_visits || 0),
          lastVisitDate: c.last_visit_date || '2026-09-20',
          setsHistory: []
        }));
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(mappedClients));
      }

      // 5. Supplies
      const { data: supData } = await supabase.from('supplies').select('*');
      if (supData) {
        const mappedSupplies: SupplyItem[] = supData.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          currentStock: Number(s.current_stock),
          minStockAlert: Number(s.min_stock_alert),
          unit: s.unit,
          brand: s.brand || ''
        }));
        localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(mappedSupplies));
      }

      this.isSupabaseConnected = true;
      this.notify();
    } catch (err) {
      console.warn('Error fetching from Supabase, using local state:', err);
      this.isSupabaseConnected = false;
    } finally {
      this.isSyncing = false;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Services & Techs ---
  public getServices(): NailService[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return raw ? JSON.parse(raw) : INITIAL_SERVICES;
  }

  public getTechs(): NailTechnician[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TECHS);
    if (!raw) return [];
    try {
      const parsed: NailTechnician[] = JSON.parse(raw);
      return parsed.filter(t =>
        !['tech-1', 'tech-2', 'tech-3'].includes(t.id) &&
        !['Sofía Valenzuela', 'Valentina Rossi', 'Camila Méndez'].includes(t.name)
      );
    } catch {
      return [];
    }
  }

  public addTech(tech: Omit<NailTechnician, 'id'>): NailTechnician {
    const current = this.getTechs();
    const created: NailTechnician = {
      ...tech,
      id: `tech-${Date.now()}`
    };
    const updated = [...current, created];
    localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(updated));
    this.pushTechToSupabase(created);
    this.notify();
    return created;
  }

  public updateTech(updatedTech: NailTechnician): void {
    const current = this.getTechs();
    const idx = current.findIndex(t => t.id === updatedTech.id);
    if (idx !== -1) {
      current[idx] = updatedTech;
      localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(current));
      this.pushTechToSupabase(updatedTech);
      this.notify();
    }
  }

  public deleteTech(id: string): void {
    const current = this.getTechs();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(updated));
    this.deleteTechFromSupabase(id);
    this.notify();
  }

  private async pushTechToSupabase(tech: NailTechnician) {
    try {
      await supabase.from('nail_technicians').upsert({
        id: tech.id,
        name: tech.name,
        role: tech.role,
        avatar: tech.avatar || '',
        specialties: tech.specialties || [],
        rating: tech.rating || 5.0,
        reviews_count: tech.reviewsCount || 0,
        commission_rate: tech.commissionRate || 0.50
      });
    } catch (err) {
      console.warn('Sync tech to Supabase fallback:', err);
    }
  }

  private async deleteTechFromSupabase(id: string) {
    try {
      await supabase.from('nail_technicians').delete().eq('id', id);
    } catch (err) {
      console.warn('Delete tech from Supabase fallback:', err);
    }
  }

  // --- Appointments ---
  public getAppointments(): Appointment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public createAppointment(newApt: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const apts = this.getAppointments();
    const created: Appointment = {
      ...newApt,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [created, ...apts];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));

    // Link points
    const clients = this.getClients();
    const client = clients.find(c => c.phone === newApt.clientPhone || c.email === newApt.clientEmail);
    if (client) {
      client.pointsBalance += Math.floor(newApt.totalPrice * 0.05); // 5% cashback
      this.updateClient(client);
    }

    // Persist to Supabase
    this.pushAppointmentToSupabase(created);

    this.notify();
    return created;
  }

  private async pushAppointmentToSupabase(created: Appointment) {
    try {
      await supabase.from('appointments').insert([{
        id: created.id,
        client_name: created.clientName,
        client_phone: created.clientPhone,
        client_email: created.clientEmail,
        tech_id: created.techId,
        service_id: created.serviceId,
        removal_id: created.removalId,
        nail_art_tier_id: created.nailArtTierId,
        total_duration_min: created.totalDurationMin,
        total_price: created.totalPrice,
        deposit_amount: created.depositAmount,
        deposit_paid: created.depositPaid,
        scheduled_date: created.scheduledDate,
        scheduled_time: created.scheduledTime,
        status: created.status,
        notes: created.notes
      }]);
    } catch (err) {
      console.error('Error pushing appointment to Supabase:', err);
    }
  }

  public updateAppointmentStatus(id: string, status: AppointmentStatus): void {
    const apts = this.getAppointments();
    const idx = apts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      apts[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));

      this.updateAppointmentInSupabase(id, status);
      this.notify();
    }
  }

  private async updateAppointmentInSupabase(id: string, status: AppointmentStatus) {
    try {
      await supabase.from('appointments').update({ status }).eq('id', id);
    } catch (err) {
      console.error('Error updating appointment in Supabase:', err);
    }
  }

  // --- Clients ---
  public getClients(): ClientProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public getCurrentClient(): ClientProfile {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT_ID) || 'cli-1';
    const clients = this.getClients();
    return clients.find((c) => c.id === currentId) || clients[0];
  }

  public setCurrentClientId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT_ID, id);
    this.notify();
  }

  public createClient(client: ClientProfile): void {
    const clients = this.getClients();
    const updated = [client, ...clients.filter(c => c.id !== client.id)];
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
    this.notify();
  }

  public updateClient(updatedClient: ClientProfile): void {
    const clients = this.getClients();
    const idx = clients.findIndex((c) => c.id === updatedClient.id);
    if (idx !== -1) {
      clients[idx] = updatedClient;
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));

      this.updateClientInSupabase(updatedClient);
      this.notify();
    }
  }

  private async updateClientInSupabase(updatedClient: ClientProfile) {
    try {
      await supabase.from('client_profiles').update({
        technician_notes: updatedClient.technicianNotes,
        points_balance: updatedClient.pointsBalance,
        tier: updatedClient.tier
      }).eq('id', updatedClient.id);
    } catch (err) {
      console.error('Error updating client in Supabase:', err);
    }
  }

  // --- Supplies ---
  public getSupplies(): SupplyItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIES);
    return raw ? JSON.parse(raw) : INITIAL_SUPPLIES;
  }

  public updateSupplyStock(id: string, newStock: number): void {
    const supplies = this.getSupplies();
    const idx = supplies.findIndex((s) => s.id === id);
    if (idx !== -1) {
      supplies[idx].currentStock = Math.max(0, newStock);
      localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies));

      this.updateSupplyInSupabase(id, Math.max(0, newStock));
      this.notify();
    }
  }

  private async updateSupplyInSupabase(id: string, currentStock: number) {
    try {
      await supabase.from('supplies').update({ current_stock: currentStock }).eq('id', id);
    } catch (err) {
      console.error('Error updating supply in Supabase:', err);
    }
  }

  public addSupply(item: Omit<SupplyItem, 'id'>): SupplyItem {
    const supplies = this.getSupplies();
    const created: SupplyItem = {
      ...item,
      id: `sup-${Date.now()}`
    };
    const updated = [...supplies, created];
    localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(updated));
    this.notify();
    return created;
  }

  public deleteSupply(id: string): void {
    const supplies = this.getSupplies().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies));
    this.notify();
  }

  // --- Supplier Orders (Pedidos a Proveedores) ---
  public getSupplierOrders(): SupplierOrder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIER_ORDERS);
    return raw ? JSON.parse(raw) : [];
  }

  public createSupplierOrder(orderData: Omit<SupplierOrder, 'id' | 'orderNumber' | 'createdAt'>): SupplierOrder {
    const orders = this.getSupplierOrders();
    const count = orders.length + 1;
    const year = new Date().getFullYear();
    const orderNumber = `ORD-${year}-${String(count).padStart(3, '0')}`;
    const newOrder: SupplierOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEYS.SUPPLIER_ORDERS, JSON.stringify(updated));
    this.notify();
    return newOrder;
  }

  public updateSupplierOrderStatus(id: string, status: SupplierOrder['status']): void {
    const orders = this.getSupplierOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      if (status === 'received') {
        orders[idx].receivedAt = new Date().toISOString();
        // Acreditar automáticamente stock a los insumos correspondientes en el inventario
        const currentSupplies = this.getSupplies();
        let changed = false;
        orders[idx].items.forEach(item => {
          if (item.supplyId) {
            const sIdx = currentSupplies.findIndex(s => s.id === item.supplyId);
            if (sIdx !== -1) {
              currentSupplies[sIdx].currentStock += item.quantity;
              changed = true;
            }
          }
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(currentSupplies));
        }
      }
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_ORDERS, JSON.stringify(orders));
      this.notify();
    }
  }

  public deleteSupplierOrder(id: string): void {
    const orders = this.getSupplierOrders().filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUPPLIER_ORDERS, JSON.stringify(orders));
    this.notify();
  }

  // --- Salon Operating Settings ---
  public getSalonSettings(): SalonOperatingSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SALON_SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SALON_SETTINGS;
  }

  public saveSalonSettings(settings: SalonOperatingSettings): void {
    localStorage.setItem(STORAGE_KEYS.SALON_SETTINGS, JSON.stringify(settings));
    this.notify();
  }

  // --- Integrations & APIs ---
  public getIntegrations(): SalonIntegrationsConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    return raw ? JSON.parse(raw) : DEFAULT_INTEGRATIONS_CONFIG;
  }

  public saveIntegrations(integrations: SalonIntegrationsConfig): void {
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
    this.notify();
  }

  // --- Force Reload from Cloud ---
  public async syncNow(): Promise<void> {
    await this.fetchFromSupabase();
  }

  // --- Reset to Initial Seed ---
  public resetToSeed(): void {
    localStorage.clear();
    this.initDefaults();
    this.fetchFromSupabase();
  }
}

const DEFAULT_SALON_SETTINGS: SalonOperatingSettings = {
  salonName: 'Atelier Nails',
  branchName: 'Recoleta Flagship',
  address: 'Av. Alvear 1850, Recoleta, CABA',
  googleMapsUrl: 'https://maps.google.com/?q=Av.+Alvear+1850,+CABA',
  phoneWhatsapp: '+54 9 11 5820-9911',
  openingTime: '09:00',
  closingTime: '20:00',
  slotBufferMin: 15,
  openDays: {
    monday: false,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  },
  simultaneousTablesCount: 3,
  depositAmount: 5000,
  depositRequired: true,
  cancellationHoursTolerance: 24,
  bookingWindowDays: 30,
  bankAlias: 'ATELIER.NAILS.BA',
  bankCbu: '0070123400000012345678',
  bankAccountHolder: 'Atelier Nails Studio S.R.L.',
  bankName: 'Banco Galicia'
};

const DEFAULT_INTEGRATIONS_CONFIG: SalonIntegrationsConfig = {
  metaWhatsapp: {
    enabled: true,
    phoneNumberId: '108492048591823',
    wabaId: '294819401829104',
    accessToken: 'EAAG...wh78X91Kls902aZbP',
    webhookVerifyToken: 'atelier_secure_webhook_2026',
    sendReminders24h: true,
    sendRetentionDay18: true
  },
  mercadoPago: {
    enabled: true,
    sandboxMode: false,
    publicKey: 'APP_USR-78192a01-4921-4891-91a2',
    accessToken: 'APP_USR-91829102-1829-4819-b291',
    autoDepositCheckout: true
  },
  googleCalendar: {
    enabled: false,
    calendarId: 'c_atelier.nails.turnos@gmail.com',
    syncTechs: true
  },
  instagram: {
    enabled: true,
    igUserId: '178414002910291',
    autoReplyBookings: true
  }
};

export const storage = new StorageService();
