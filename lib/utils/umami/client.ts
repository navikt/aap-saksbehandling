import type { UmamiKelvinEvent } from 'lib/utils/umami/kelvinEvent';

/**
 * Behandler hver event-type separat, slik at navn og data hører sammen.
 * Gjør data valgfritt når et tomt objekt er gyldig.
 */
type UmamiEventArguments<TEvent extends UmamiKelvinEvent = UmamiKelvinEvent> = TEvent extends UmamiKelvinEvent
  ? {} extends TEvent['data']
    ? [name: TEvent['name'], data?: TEvent['data']]
    : [name: TEvent['name'], data: TEvent['data']]
  : never;

/**
 * Sender en umami-hendelse til `/api/umami`. Feiler stille (logger til konsoll) i
 * stedet for å kaste.
 */
export async function clientLoggUmamiEvent(...[name, data]: UmamiEventArguments) {
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
