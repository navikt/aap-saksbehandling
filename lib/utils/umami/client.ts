import type { UmamiKelvinEvent } from 'lib/utils/umami/kelvinEvent';

/**
 * Sender en umami-hendelse til `/api/umami`. Feiler stille (logger til konsoll) i
 * stedet for å kaste.
 */
export async function clientLoggUmamiEvent(data: UmamiKelvinEvent) {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/umami', { method: 'POST', body: JSON.stringify(data) });
  } catch (error) {
    console.error(`Umami Failed to track event ${data.name}:`, error);
  }
}
