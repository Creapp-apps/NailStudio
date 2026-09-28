import {
  NailService,
  NailTechnician,
  Appointment,
  ClientProfile,
  SupplyItem,
  AppointmentStatus
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

  constructor() {
    this.initDefaults();
    this.trySyncSupabase();
  }

  private initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TECHS)) {
      localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(NAIL_TECHNICIANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPPLIES)) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(INITIAL_SUPPLIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT_ID, 'cli-1'); // Default to Lucía Fernández
    }
  }

  private async trySyncSupabase() {
    try {
      const { data, error } = await supabase.from('nail_services').select('*');
      if (!error && data && data.length > 0) {
        this.isSupabaseConnected = true;
        this.notify();
      }
    } catch {
      this.isSupabaseConnected = false;
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
    return raw ? JSON.parse(raw) : INITIAL_APPOINTMENTS;
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

    // Link to client points if client exists
    const clients = this.getClients();
    const client = clients.find(c => c.phone === newApt.clientPhone || c.email === newApt.clientEmail);
    if (client) {
      client.pointsBalance += Math.floor(newApt.totalPrice * 0.05); // 5% cashback in points
      this.updateClient(client);
    }

    // Async push to Supabase if connected
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
    } catch {
      // Ignored if table not migrated yet
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
    } catch {
      // Ignored if table not migrated yet
    }
  }

  // --- Clients ---
  public getClients(): ClientProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return raw ? JSON.parse(raw) : INITIAL_CLIENTS;
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
    } catch {
      // Ignored if table not migrated yet
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
    } catch {
      // Ignored if table not migrated yet
    }
  }

  // --- Reset to Initial Seed ---
  public resetToSeed(): void {
    localStorage.clear();
    this.initDefaults();
    this.notify();
  }
}

export const storage = new StorageService();
