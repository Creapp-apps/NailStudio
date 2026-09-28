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
            : DEFAULT_WEB_CONFIG.showcaseItems
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
        .from('salon_settings')
        .select('setting_value')
        .eq('setting_key', 'web_customization')
        .maybeSingle();

      if (data && data.setting_value) {
        this.currentConfig = { ...DEFAULT_WEB_CONFIG, ...data.setting_value };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentConfig));
        this.notify();
      }
    } catch {
      // Supabase table or entry might not exist yet, fallback to local
    }
  }

  private async pushToSupabase(config: WebCustomizationConfig): Promise<void> {
    try {
      await supabase
        .from('salon_settings')
        .upsert({
          setting_key: 'web_customization',
          setting_value: config,
          updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' });
    } catch {
      // Non-blocking fallback
    }
  }
}

export const webConfigStorage = new WebConfigStorageService();
