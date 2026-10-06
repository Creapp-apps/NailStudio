import { storage } from './storage';
import { Appointment } from '../types/nailStudio';

export interface CreatePreferenceParams {
  appointment: Appointment;
  amount: number;
  title: string;
  client: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface PreferenceResult {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

export const mercadoPagoService = {
  getConfig() {
    const integrations = storage.getIntegrations();
    return integrations?.mercadoPago || {
      enabled: false,
      sandboxMode: false,
      publicKey: '',
      accessToken: '',
      autoDepositCheckout: true
    };
  },

  isConfigured(): boolean {
    const cfg = this.getConfig();
    return Boolean(cfg.enabled && (cfg.accessToken || (typeof process !== 'undefined' && process.env?.MERCADOPAGO_ACCESS_TOKEN)));
  },

  async createPreference(params: CreatePreferenceParams): Promise<PreferenceResult> {
    const cfg = this.getConfig();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const payload = {
      appointmentId: params.appointment.id,
      title: params.title || 'Seña Reserva • Belcalis Nails Studio',
      amount: params.amount,
      client: params.client,
      origin,
      accessToken: cfg.accessToken || undefined,
      sandboxMode: cfg.sandboxMode || false
    };

    const response = await fetch('/api/mercadopago-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Error ${response.status} al generar preferencia en Mercado Pago`);
    }

    const data = await response.json();
    return {
      preferenceId: data.preferenceId,
      initPoint: data.initPoint,
      sandboxInitPoint: data.sandboxInitPoint
    };
  }
};
