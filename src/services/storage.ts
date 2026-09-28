import {
  NailService,
  NailTechnician,
  Appointment,
  ClientProfile,
  SupplyItem,
  AppointmentStatus,
  NailPlateCondition
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
  CURRENT_CLIENT_ID: 'atelier_current_client_id'
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
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TECHS)) {
      localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(NAIL_TECHNICIANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPPLIES)) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(INITIAL_SUPPLIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT_ID, 'cli-1');
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

      // 2. Technicians
      const { data: techData } = await supabase.from('nail_technicians').select('*');
      if (techData && techData.length > 0) {
        const mappedTechs: NailTechnician[] = techData.map(t => ({
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
      if (aptData && aptData.length > 0) {
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
      if (cliData && cliData.length > 0) {
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
      if (supData && supData.length > 0) {
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
    return raw ? JSON.parse(raw) : NAIL_TECHNICIANS;
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

export const storage = new StorageService();
