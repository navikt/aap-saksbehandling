import type { UmamiKelvinEvent } from 'lib/utils/umami/kelvinEvent';
import { UmamiEventData } from '@umami/node';

export interface UmamiEvent {
  name: UmamiKelvinEvent['name'];
  data?: UmamiEventData;
}

/**
 * Sender en umami-hendelse til `/api/umami`. Feiler stille (logger til konsoll) i
 * stedet for å kaste.
 */
export async function clientLoggUmamiEvent(name: UmamiKelvinEvent['name'], data?: UmamiEvent['data']) {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/umami', {
      method: 'POST',
      body: JSON.stringify({ name, data }),
    });
  } catch (error) {
    console.error(`Umami Failed to track event ${name}:`, error);
  }
}
