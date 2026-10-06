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
  SalonIntegrationsConfig,
  ScheduleByDay,
  TimeRangeBlock,
  RemovalOption,
  NailArtTier
} from '../types/nailStudio';
import {
  INITIAL_SERVICES,
  REMOVAL_OPTIONS,
  NAIL_ART_TIERS,
  NAIL_TECHNICIANS,
  INITIAL_APPOINTMENTS,
  INITIAL_CLIENTS,
  INITIAL_SUPPLIES
} from './mockData';
import { supabase } from './supabaseClient';
import { PlatformTier } from '../types/platformTiers';

const STORAGE_KEYS = {
  SERVICES: 'atelier_services',
  REMOVALS: 'atelier_removals',
  NAIL_ART_TIERS: 'atelier_nail_art_tiers',
  TECHS: 'atelier_techs',
  APPOINTMENTS: 'atelier_appointments',
  CLIENTS: 'atelier_clients',
  SUPPLIES: 'atelier_supplies',
  SUPPLIER_ORDERS: 'atelier_supplier_orders',
  CURRENT_CLIENT_ID: 'atelier_current_client_id',
  SALON_SETTINGS: 'atelier_salon_settings',
  INTEGRATIONS: 'atelier_integrations_config',
  PLATFORM_TIER: 'atelier_platform_tier'
};

export const DEFAULT_STAFF: NailTechnician[] = [
  {
    id: 'tech-1',
    name: 'Lucia Altieri',
    role: 'Jefa & Master Educator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    specialties: ['Manicura Rusa', 'Kapping Gel', 'Soft Gel Tips', 'Polygel Sculpt', 'Cat Eye Magnético', 'Recuperación Ungueal'],
    rating: 5.0,
    reviewsCount: 18,
    commissionRate: 0.50
  }
];

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
    // 1. Appointments: safely clean only legacy mock
    const storedApts = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (storedApts) {
      try {
        const parsed = JSON.parse(storedApts);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(a => a.id !== 'apt-101' && a.clientName !== 'Lucía Fernández');
          localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(cleaned));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    }

    // 2. Clients: safely clean only legacy mock
    const storedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (storedClients) {
      try {
        const parsed = JSON.parse(storedClients);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(c =>
            !['cli-1', 'cli-2', 'cli-3'].includes(c.id) &&
            !c.id.startsWith('tenant_') &&
            c.name !== 'Staff Sync System' &&
            c.name !== 'Belcalis Nails' &&
            !['Lucía Fernández', 'Camila De La Torre', 'Valentina Albarracín', 'Lucía Santillán', 'Valentina Rossi'].includes(c.name)
          );
          localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(cleaned));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
    }

    // 3. Supplies: safely clean only legacy mock
    const storedSupplies = localStorage.getItem(STORAGE_KEYS.SUPPLIES);
    if (storedSupplies) {
      try {
        const parsed = JSON.parse(storedSupplies);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(s => !['sup-1', 'sup-2', 'sup-3'].includes(s.id));
          localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(cleaned));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify([]));
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify([]));
    }

    // 4. Technicians: ensure real staff (Lucia Altieri) is never lost
    const storedTechs = localStorage.getItem(STORAGE_KEYS.TECHS);
    if (storedTechs) {
      try {
        const parsed = JSON.parse(storedTechs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter(t =>
            !['Sofía Valenzuela', 'Valentina Rossi', 'Camila Méndez'].includes(t.name)
          );
          localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(cleaned.length > 0 ? cleaned : DEFAULT_STAFF));
        } else {
          localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(DEFAULT_STAFF));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(DEFAULT_STAFF));
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(DEFAULT_STAFF));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload: any) => {
          this.fetchFromSupabase();
          if (payload?.eventType === 'INSERT' && payload?.new) {
            try {
              const apt: Appointment = {
                id: payload.new.id,
                clientName: payload.new.client_name,
                clientPhone: payload.new.client_phone,
                clientEmail: payload.new.client_email || '',
                techId: payload.new.tech_id,
                serviceId: payload.new.service_id,
                removalId: payload.new.removal_id,
                nailArtTierId: payload.new.nail_art_tier_id,
                totalDurationMin: payload.new.total_duration_min,
                totalPrice: payload.new.total_price,
                depositAmount: payload.new.deposit_amount || 5000,
                depositPaid: payload.new.deposit_paid ?? true,
                scheduledDate: payload.new.scheduled_date,
                scheduledTime: payload.new.scheduled_time,
                status: payload.new.status || 'confirmed',
                notes: payload.new.notes || '',
                createdAt: payload.new.created_at || new Date().toISOString()
              };
              window.dispatchEvent(new CustomEvent('atelier-new-appointment', { detail: apt }));
              if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('atelier_realtime_channel');
                channel.postMessage({ type: 'NEW_APPOINTMENT_RECEIVED', appointment: apt });
              }
            } catch {}
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_profiles' }, () => {
          this.fetchFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'supplies' }, () => {
          this.fetchFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'nail_technicians' }, () => {
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
      // 1. Services & Full Catalog (from tenant_catalog_config or fallback to nail_services)
      try {
        const { data: catalogConfig } = await supabase
          .from('client_profiles')
          .select('technician_notes')
          .eq('id', 'tenant_catalog_config')
          .maybeSingle();

        if (catalogConfig && catalogConfig.technician_notes) {
          const parsed = JSON.parse(catalogConfig.technician_notes);
          if (Array.isArray(parsed.services) && parsed.services.length > 0) {
            localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(parsed.services));
          }
          if (Array.isArray(parsed.removals) && parsed.removals.length > 0) {
            localStorage.setItem(STORAGE_KEYS.REMOVALS, JSON.stringify(parsed.removals));
          }
          if (Array.isArray(parsed.nailArtTiers) && parsed.nailArtTiers.length > 0) {
            localStorage.setItem(STORAGE_KEYS.NAIL_ART_TIERS, JSON.stringify(parsed.nailArtTiers));
          }
        } else {
          // Fallback to nail_services table if tenant_catalog_config doesn't exist yet
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
              recommendedFor: s.recommended_for || '',
              isActive: (s as any).is_active ?? true
            }));
            localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mappedServices));
            // Initialize tenant_catalog_config in Supabase
            this.pushCatalogToSupabase();
          }
        }
      } catch (err) {
        console.warn('Could not sync catalog config from Supabase:', err);
      }

      // 2. Technicians (Sync staff from tenant_staff_config or fallback)
      try {
        const { data: staffConfig } = await supabase
          .from('client_profiles')
          .select('technician_notes')
          .eq('id', 'tenant_staff_config')
          .maybeSingle();

        if (staffConfig && staffConfig.technician_notes) {
          const parsed = JSON.parse(staffConfig.technician_notes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(parsed));
          }
        } else {
          // If not in Supabase yet, push current local techs
          const currentTechs = this.getTechs();
          this.pushTechToSupabase();
        }
      } catch (err) {
        console.warn('Could not sync staff config from Supabase:', err);
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
        const filtered = cliData.filter(c =>
          !['cli-1', 'cli-2', 'cli-3'].includes(c.id) &&
          !c.id.startsWith('tenant_') &&
          c.name !== 'Staff Sync System' &&
          c.name !== 'Belcalis Nails' &&
          !['Camila De La Torre', 'Valentina Albarracín', 'Lucía Santillán', 'Lucía Fernández', 'Valentina Rossi'].includes(c.name)
        );
        const mappedClients: ClientProfile[] = filtered.map(c => ({
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
          referralCode: c.referral_code || `CLI-${c.id.slice(0, 6)}`,
          referredBy: c.referred_by || undefined,
          totalVisits: Number(c.total_visits || 0),
          lastVisitDate: c.last_visit_date || '2026-09-20',
          setsHistory: [],
          isVitalicia: Boolean((c as any).is_vitalicia ?? (c as any).isVitalicia ?? false),
          vitaliciaDiscountPercentage: Number((c as any).vitalicia_discount_percentage ?? (c as any).vitaliciaDiscountPercentage ?? 15),
          vitaliciaAssignedAt: (c as any).vitalicia_assigned_at || (c as any).vitaliciaAssignedAt || undefined
        }));
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(mappedClients));

        // Purge mock clients from Supabase in background
        supabase.from('client_profiles').delete().in('name', ['Camila De La Torre', 'Valentina Albarracín', 'Lucía Santillán', 'Lucía Fernández', 'Valentina Rossi']).then(() => {});
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

  // --- Services, Removals & Nail Art Tiers (Step-by-Step Booking Funnel) ---
  public getServices(): NailService[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!raw) return INITIAL_SERVICES;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  }

  public saveServices(services: NailService[]): void {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    this.notify();
    this.pushCatalogToSupabase();
  }

  public addService(service: Omit<NailService, 'id'>): NailService {
    const current = this.getServices();
    const created: NailService = {
      ...service,
      id: `srv-${Date.now()}`
    };
    this.saveServices([...current, created]);
    return created;
  }

  public updateService(updated: NailService): void {
    const current = this.getServices();
    const idx = current.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      current[idx] = updated;
      this.saveServices(current);
    }
  }

  public deleteService(id: string): void {
    const current = this.getServices();
    this.saveServices(current.filter(s => s.id !== id));
  }

  public getRemovals(): RemovalOption[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REMOVALS);
    if (!raw) return REMOVAL_OPTIONS;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : REMOVAL_OPTIONS;
    } catch {
      return REMOVAL_OPTIONS;
    }
  }

  public saveRemovals(removals: RemovalOption[]): void {
    localStorage.setItem(STORAGE_KEYS.REMOVALS, JSON.stringify(removals));
    this.notify();
    this.pushCatalogToSupabase();
  }

  public addRemoval(removal: Omit<RemovalOption, 'id'>): RemovalOption {
    const current = this.getRemovals();
    const created: RemovalOption = {
      ...removal,
      id: `rem-${Date.now()}`
    };
    this.saveRemovals([...current, created]);
    return created;
  }

  public updateRemoval(updated: RemovalOption): void {
    const current = this.getRemovals();
    const idx = current.findIndex(r => r.id === updated.id);
    if (idx !== -1) {
      current[idx] = updated;
      this.saveRemovals(current);
    }
  }

  public deleteRemoval(id: string): void {
    const current = this.getRemovals();
    this.saveRemovals(current.filter(r => r.id !== id));
  }

  public getNailArtTiers(): NailArtTier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NAIL_ART_TIERS);
    if (!raw) return NAIL_ART_TIERS;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : NAIL_ART_TIERS;
    } catch {
      return NAIL_ART_TIERS;
    }
  }

  public saveNailArtTiers(tiers: NailArtTier[]): void {
    localStorage.setItem(STORAGE_KEYS.NAIL_ART_TIERS, JSON.stringify(tiers));
    this.notify();
    this.pushCatalogToSupabase();
  }

  public addNailArtTier(tier: Omit<NailArtTier, 'id'>): NailArtTier {
    const current = this.getNailArtTiers();
    const created: NailArtTier = {
      ...tier,
      id: `art-${Date.now()}`
    };
    this.saveNailArtTiers([...current, created]);
    return created;
  }

  public updateNailArtTier(updated: NailArtTier): void {
    const current = this.getNailArtTiers();
    const idx = current.findIndex(t => t.id === updated.id);
    if (idx !== -1) {
      current[idx] = updated;
      this.saveNailArtTiers(current);
    }
  }

  public deleteNailArtTier(id: string): void {
    const current = this.getNailArtTiers();
    this.saveNailArtTiers(current.filter(t => t.id !== id));
  }

  // --- Push Catalog to Supabase (Services, Removals, Nail Art Tiers) ---
  public async pushCatalogToSupabase(): Promise<boolean> {
    try {
      const services = this.getServices();
      const removals = this.getRemovals();
      const nailArtTiers = this.getNailArtTiers();
      const payload = {
        services,
        removals,
        nailArtTiers,
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase.from('client_profiles').upsert({
        id: 'tenant_catalog_config',
        name: 'Catalog Sync System',
        phone: '+5491100000000',
        referral_code: 'SYS_CATALOG_SYNC',
        technician_notes: JSON.stringify(payload)
      }, { onConflict: 'id' });

      if (error) {
        console.warn('Could not sync catalog config to Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Sync catalog config to Supabase fallback:', err);
      return false;
    }
  }

  public getTechs(): NailTechnician[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TECHS);
    if (!raw) return DEFAULT_STAFF;
    try {
      const parsed: NailTechnician[] = JSON.parse(raw);
      const filtered = parsed.filter(t =>
        !['Sofía Valenzuela', 'Valentina Rossi', 'Camila Méndez'].includes(t.name)
      );
      return filtered.length > 0 ? filtered : DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
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
    localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(updated.length > 0 ? updated : DEFAULT_STAFF));
    this.deleteTechFromSupabase(id);
    this.notify();
  }

  private async pushTechToSupabase(_tech?: NailTechnician) {
    try {
      const allTechs = this.getTechs();
      await supabase.from('client_profiles').upsert({
        id: 'tenant_staff_config',
        name: 'Staff Sync System',
        phone: '+5491100000000',
        referral_code: 'SYS_STAFF_SYNC',
        technician_notes: JSON.stringify(allTechs)
      }, { onConflict: 'id' });
    } catch (err) {
      console.warn('Sync staff to Supabase fallback:', err);
    }
  }

  private async deleteTechFromSupabase(id: string) {
    try {
      const allTechs = this.getTechs().filter(t => t.id !== id);
      await supabase.from('client_profiles').upsert({
        id: 'tenant_staff_config',
        name: 'Staff Sync System',
        phone: '+5491100000000',
        referral_code: 'SYS_STAFF_SYNC',
        technician_notes: JSON.stringify(allTechs)
      }, { onConflict: 'id' });
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

    // Realtime notification broadcast across tabs and windows
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('atelier-new-appointment', { detail: created }));
        if (typeof BroadcastChannel !== 'undefined') {
          const channel = new BroadcastChannel('atelier_realtime_channel');
          channel.postMessage({ type: 'NEW_APPOINTMENT_RECEIVED', appointment: created });
        }
        localStorage.setItem('atelier_latest_incoming_apt', JSON.stringify({ apt: created, time: Date.now() }));
      }
    } catch (e) {
      console.warn('Realtime broadcast error:', e);
    }

    return created;
  }

  private async pushAppointmentToSupabase(created: Appointment) {
    try {
      // Validate foreign key for Supabase nail_technicians table
      const validTechIds = ['tech-1', 'tech-2', 'tech-3'];
      const safeTechId = validTechIds.includes(created.techId) ? created.techId : 'tech-1';

      const { error } = await supabase.from('appointments').insert([{
        id: created.id,
        client_name: created.clientName,
        client_phone: created.clientPhone,
        client_email: created.clientEmail,
        tech_id: safeTechId,
        service_id: created.serviceId,
        removal_id: created.removalId || 'none',
        nail_art_tier_id: created.nailArtTierId || 'art-0',
        total_duration_min: created.totalDurationMin,
        total_price: created.totalPrice,
        deposit_amount: created.depositAmount || 5000,
        deposit_paid: created.depositPaid,
        scheduled_date: created.scheduledDate,
        scheduled_time: created.scheduledTime,
        status: created.status || 'pending',
        notes: created.notes ? `${created.notes} [Tech: ${created.techId}]` : `[Tech: ${created.techId}]`
      }]);

      if (error) {
        console.error('Error inserting appointment into Supabase:', error);
      }
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

  public confirmDepositPaid(id: string, paymentMethodNotes?: string): void {
    const apts = this.getAppointments();
    const idx = apts.findIndex(a => a.id === id);
    if (idx !== -1) {
      apts[idx].depositPaid = true;
      apts[idx].status = 'confirmed';
      if (paymentMethodNotes) {
        const existing = apts[idx].notes || '';
        apts[idx].notes = existing ? `${existing} | ${paymentMethodNotes}` : paymentMethodNotes;
      }
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));
      try {
        supabase.from('appointments').update({
          deposit_paid: true,
          status: 'confirmed',
          notes: apts[idx].notes
        }).eq('id', id).then();
      } catch (e) {
        console.error('Error confirming deposit in Supabase:', e);
      }
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

  public updateAppointment(updatedApt: Appointment): void {
    const apts = this.getAppointments();
    const idx = apts.findIndex(a => a.id === updatedApt.id);
    if (idx !== -1) {
      apts[idx] = updatedApt;
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));
      try {
        supabase.from('appointments').update({
          client_name: updatedApt.clientName,
          client_phone: updatedApt.clientPhone,
          client_email: updatedApt.clientEmail,
          tech_id: updatedApt.techId,
          service_id: updatedApt.serviceId,
          removal_id: updatedApt.removalId,
          nail_art_tier_id: updatedApt.nailArtTierId,
          total_duration_min: updatedApt.totalDurationMin,
          total_price: updatedApt.totalPrice,
          deposit_amount: updatedApt.depositAmount,
          deposit_paid: updatedApt.depositPaid,
          scheduled_date: updatedApt.scheduledDate,
          scheduled_time: updatedApt.scheduledTime,
          status: updatedApt.status,
          notes: updatedApt.notes
        }).eq('id', updatedApt.id).then();
      } catch (e) {
        console.warn('Update appointment fallback:', e);
      }
      this.notify();
    }
  }

  public deleteAppointment(id: string): void {
    const apts = this.getAppointments();
    const updated = apts.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    try {
      supabase.from('appointments').delete().eq('id', id).then();
    } catch (e) {
      console.warn('Delete appointment fallback:', e);
    }
    this.notify();
  }

  // --- Clients ---
  public getClients(): ClientProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) return [];
    try {
      const parsed: ClientProfile[] = JSON.parse(raw);
      return parsed.filter(c =>
        !['cli-1', 'cli-2', 'cli-3'].includes(c.id) &&
        !['Camila De La Torre', 'Valentina Albarracín', 'Lucía Santillán', 'Lucía Fernández', 'Valentina Rossi'].includes(c.name)
      );
    } catch {
      return [];
    }
  }

  public getCurrentClient(): ClientProfile | null {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT_ID);
    const clients = this.getClients();
    if (clients.length === 0) return null;
    if (currentId) {
      const found = clients.find((c) => c.id === currentId);
      if (found) return found;
    }
    return clients[0] || null;
  }

  public getClientByPhone(phone: string): ClientProfile | undefined {
    const clean = phone.replace(/\D/g, '');
    if (!clean || clean.length < 6) return undefined;
    return this.getClients().find(c => {
      const clientClean = (c.phone || '').replace(/\D/g, '');
      return clientClean.includes(clean) || clean.includes(clientClean);
    });
  }

  public setCurrentClientId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT_ID, id);
    this.notify();
  }

  public createClient(client: ClientProfile): void {
    const clients = this.getClients();
    const updated = [client, ...clients.filter(c => c.id !== client.id)];
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT_ID, client.id);
    this.pushClientToSupabase(client);
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

  public deleteClient(id: string): void {
    const clients = this.getClients().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    this.notify();
    try {
      supabase.from('client_profiles').delete().eq('id', id).then(() => {});
    } catch (err) {
      console.warn('Error deleting client from Supabase:', err);
    }
  }

  public purgeTestClients(): void {
    const testNames = ['Staff Sync System', 'Belcalis Nails', 'Paula Santander', 'Florencia Live', 'Clienta Test'];
    const clients = this.getClients().filter(c =>
      !c.id.startsWith('tenant_') &&
      !testNames.includes(c.name) &&
      !c.name.toLowerCase().includes('test')
    );
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    this.notify();
    try {
      supabase.from('client_profiles').delete().in('name', testNames).then(() => {});
    } catch (err) {
      console.warn('Error purging test clients from Supabase:', err);
    }
  }

  public toggleVitalicia(clientId: string, percentage: number = 15): ClientProfile | null {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === clientId);
    if (idx !== -1) {
      const current = clients[idx];
      const willBeVitalicia = !current.isVitalicia;
      const updated: ClientProfile = {
        ...current,
        isVitalicia: willBeVitalicia,
        vitaliciaDiscountPercentage: willBeVitalicia ? (current.vitaliciaDiscountPercentage || percentage) : undefined,
        vitaliciaAssignedAt: willBeVitalicia ? new Date().toISOString().split('T')[0] : undefined
      };
      clients[idx] = updated;
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      this.updateClientInSupabase(updated);
      this.notify();
      return updated;
    }
    return null;
  }

  public setVitaliciaStatus(clientId: string, isVitalicia: boolean, percentage: number = 15): ClientProfile | null {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === clientId);
    if (idx !== -1) {
      const current = clients[idx];
      const updated: ClientProfile = {
        ...current,
        isVitalicia,
        vitaliciaDiscountPercentage: isVitalicia ? percentage : undefined,
        vitaliciaAssignedAt: isVitalicia ? (current.vitaliciaAssignedAt || new Date().toISOString().split('T')[0]) : undefined
      };
      clients[idx] = updated;
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      this.updateClientInSupabase(updated);
      this.notify();
      return updated;
    }
    return null;
  }

  private async pushClientToSupabase(client: ClientProfile) {
    try {
      await supabase.from('client_profiles').upsert({
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email || '',
        avatar: client.avatar || '',
        nail_plate_condition: client.nailPlateCondition || 'healthy',
        allergies_hema: client.allergiesHema || false,
        lamp_heat_sensitivity: client.lampHeatSensitivity || 'low',
        favorite_colors: client.favoriteColors || [],
        technician_notes: client.technicianNotes || '',
        points_balance: client.pointsBalance || 0,
        tier: client.tier || 'Silver',
        referral_code: client.referralCode,
        referred_by: client.referredBy || null,
        total_visits: client.totalVisits || 0,
        last_visit_date: client.lastVisitDate || new Date().toISOString().split('T')[0],
        is_vitalicia: client.isVitalicia || false,
        vitalicia_discount_percentage: client.vitaliciaDiscountPercentage || 15
      });
    } catch (err) {
      console.warn('Sync client to Supabase fallback:', err);
    }
  }

  private async updateClientInSupabase(updatedClient: ClientProfile) {
    try {
      await supabase.from('client_profiles').update({
        technician_notes: updatedClient.technicianNotes,
        points_balance: updatedClient.pointsBalance,
        tier: updatedClient.tier,
        is_vitalicia: updatedClient.isVitalicia || false,
        vitalicia_discount_percentage: updatedClient.vitaliciaDiscountPercentage || 15
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
    const settings: SalonOperatingSettings = raw ? JSON.parse(raw) : DEFAULT_SALON_SETTINGS;
    if (!settings.scheduleByDay) {
      settings.scheduleByDay = DEFAULT_SALON_SETTINGS.scheduleByDay;
    }
    return settings;
  }

  public saveSalonSettings(settings: SalonOperatingSettings): void {
    localStorage.setItem(STORAGE_KEYS.SALON_SETTINGS, JSON.stringify(settings));
    this.notify();
  }

  // --- Integrations & APIs ---
  public getIntegrations(): SalonIntegrationsConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    if (!raw) return DEFAULT_INTEGRATIONS_CONFIG;
    try {
      const parsed: SalonIntegrationsConfig = JSON.parse(raw);
      // If still having dummy placeholder, upgrade to current default
      if (parsed?.mercadoPago?.accessToken === 'APP_USR-91829102-1829-4819-b291') {
        parsed.mercadoPago.accessToken = DEFAULT_INTEGRATIONS_CONFIG.mercadoPago.accessToken;
        parsed.mercadoPago.publicKey = DEFAULT_INTEGRATIONS_CONFIG.mercadoPago.publicKey;
        localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return DEFAULT_INTEGRATIONS_CONFIG;
    }
  }

  public saveIntegrations(integrations: SalonIntegrationsConfig): void {
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
    this.notify();
  }

  // --- Platform Subscription Tier ---
  public getPlatformTier(): PlatformTier {
    const raw = localStorage.getItem(STORAGE_KEYS.PLATFORM_TIER);
    if (raw === 'bronce' || raw === 'silver' || raw === 'oro') {
      return raw;
    }
    return 'oro'; // Default to full suite for exploration
  }

  public setPlatformTier(tier: PlatformTier): void {
    localStorage.setItem(STORAGE_KEYS.PLATFORM_TIER, tier);
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

export const DEFAULT_SCHEDULE_BY_DAY: ScheduleByDay = {
  monday: {
    enabled: true,
    ranges: [
      { id: 'mon-1', startTime: '09:00', endTime: '12:00' },
      { id: 'mon-2', startTime: '15:00', endTime: '17:00' },
      { id: 'mon-3', startTime: '19:00', endTime: '22:00' }
    ]
  },
  tuesday: {
    enabled: true,
    ranges: [
      { id: 'tue-1', startTime: '09:00', endTime: '13:00' },
      { id: 'tue-2', startTime: '15:00', endTime: '20:00' }
    ]
  },
  wednesday: {
    enabled: true,
    ranges: [
      { id: 'wed-1', startTime: '09:00', endTime: '13:00' },
      { id: 'wed-2', startTime: '15:00', endTime: '20:00' }
    ]
  },
  thursday: {
    enabled: true,
    ranges: [
      { id: 'thu-1', startTime: '09:00', endTime: '13:00' },
      { id: 'thu-2', startTime: '15:00', endTime: '20:00' }
    ]
  },
  friday: {
    enabled: true,
    ranges: [
      { id: 'fri-1', startTime: '09:00', endTime: '13:00' },
      { id: 'fri-2', startTime: '15:00', endTime: '20:00' }
    ]
  },
  saturday: {
    enabled: true,
    ranges: [
      { id: 'sat-1', startTime: '10:00', endTime: '18:00' }
    ]
  },
  sunday: {
    enabled: false,
    ranges: []
  }
};

const DEFAULT_SALON_SETTINGS: SalonOperatingSettings = {
  salonName: 'Atelier Nails',
  assistantName: 'Lucía Altieri',
  branchName: 'Recoleta Flagship',
  address: 'Av. Alvear 1850, Recoleta, CABA',
  googleMapsUrl: 'https://maps.google.com/?q=Av.+Alvear+1850,+CABA',
  phoneWhatsapp: '+54 9 11 5820-9911',
  openingTime: '09:00',
  closingTime: '22:00',
  slotBufferMin: 15,
  openDays: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  },
  scheduleByDay: DEFAULT_SCHEDULE_BY_DAY,
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
    publicKey: 'APP_USR-0b9e047d-fe15-4a97-adb5-803650894421',
    accessToken: 'APP_USR-4181198818152310-100522-e2a4f4cdfab7027996c8ad7fb46d0719-564315812',
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
