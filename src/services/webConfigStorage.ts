import { WebCustomizationConfig, DEFAULT_WEB_CONFIG } from '../types/webConfig';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'atelier_web_customization_config';
const EVENT_NAME = 'atelier_web_config_changed';

class WebConfigStorageService {
  private listeners: Set<(config: WebCustomizationConfig) => void> = new Set();
  private currentConfig: WebCustomizationConfig;

  constructor() {
    this.currentConfig = this.loadInitialConfig();
    this.fetchFromSupabase();
  }

  private loadInitialConfig(): WebCustomizationConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_WEB_CONFIG,
          ...parsed,
          showcaseItems: parsed.showcaseItems && Array.isArray(parsed.showcaseItems) && parsed.showcaseItems.length > 0
            ? parsed.showcaseItems
            : DEFAULT_WEB_CONFIG.showcaseItems,
          whyUsFeatures: parsed.whyUsFeatures && Array.isArray(parsed.whyUsFeatures) && parsed.whyUsFeatures.length > 0
            ? parsed.whyUsFeatures
            : DEFAULT_WEB_CONFIG.whyUsFeatures
        };
      }
    } catch (e) {
      console.warn('Error reading web config from localStorage, using default:', e);
    }
    return DEFAULT_WEB_CONFIG;
  }

  public getConfig(): WebCustomizationConfig {
    return { ...this.currentConfig };
  }

  public saveConfig(newConfig: WebCustomizationConfig): void {
    this.currentConfig = { ...newConfig };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentConfig));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.currentConfig }));
    } catch (e) {
      console.warn('Error saving web config to localStorage:', e);
    }
    this.notify();
    this.pushToSupabase(this.currentConfig);
  }

  public resetToDefault(): WebCustomizationConfig {
    this.currentConfig = { ...DEFAULT_WEB_CONFIG };
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.currentConfig }));
    } catch (e) {
      console.warn('Error resetting web config in localStorage:', e);
    }
    this.notify();
    this.pushToSupabase(this.currentConfig);
    return this.currentConfig;
  }

  public subscribe(listener: (config: WebCustomizationConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn(this.currentConfig));
  }

  private async fetchFromSupabase(): Promise<void> {
    try {
      const { data } = await supabase
        .from('client_profiles')
        .select('technician_notes')
        .eq('id', 'tenant_branding_config')
        .maybeSingle();

      if (data && data.technician_notes) {
        const parsed = JSON.parse(data.technician_notes);
        this.currentConfig = {
          ...DEFAULT_WEB_CONFIG,
          ...parsed,
          showcaseItems: parsed.showcaseItems && Array.isArray(parsed.showcaseItems) && parsed.showcaseItems.length > 0
            ? parsed.showcaseItems
            : DEFAULT_WEB_CONFIG.showcaseItems,
          whyUsFeatures: parsed.whyUsFeatures && Array.isArray(parsed.whyUsFeatures) && parsed.whyUsFeatures.length > 0
            ? parsed.whyUsFeatures
            : DEFAULT_WEB_CONFIG.whyUsFeatures
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentConfig));
        this.notify();
      }
    } catch (e) {
      console.warn('Could not fetch tenant branding from Supabase:', e);
    }
  }

  private async pushToSupabase(config: WebCustomizationConfig): Promise<void> {
    try {
      await supabase
        .from('client_profiles')
        .upsert({
          id: 'tenant_branding_config',
          name: config.brandName || 'Belcalis Nails',
          phone: config.whatsapp || '+54 9 11 5820-9911',
          referral_code: 'SYS_BRANDING_' + (config.brandName || 'BELCALIS').replace(/[^a-zA-Z0-9]/g, '_').toUpperCase(),
          technician_notes: JSON.stringify(config)
        }, { onConflict: 'id' });
    } catch (e) {
      console.warn('Could not push tenant branding to Supabase:', e);
    }
  }
}

export const webConfigStorage = new WebConfigStorageService();
