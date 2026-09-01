import { describe, test, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';

describe('useUmamiStartTidspunkt', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('returnerer et starttidspunkt allerede på første rendring, ikke 0', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);

    const { result } = renderHook(() => useUmamiStartTidspunkt('LES'));

    // Regresjonstest: tidligere ble starttidspunktet satt i en useEffect, som først kjører
    // *etter* denne rendringen. Da måtte man lese 0 på selve mount-rendringen, noe som ga en
    // varighet på "nå minus 0" (dvs. hele Unix-epoken i sekunder) hvis komponenten ble sendt
    // inn (submit) uten at noen annen, urelatert rendring rakk å oppdatere verdien først.
    expect(result.current).toBe(1_000_000);
  });

  test('oppdaterer starttidspunktet umiddelbart når visningsModus endres, uten en ekstra urelatert rendring', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);

    const { result, rerender } = renderHook(({ visningsModus }) => useUmamiStartTidspunkt(visningsModus), {
      initialProps: { visningsModus: 'LES' },
    });

    expect(result.current).toBe(1_000_000);

    vi.setSystemTime(1_005_000);
    rerender({ visningsModus: 'REDIGERING' });

    // Regresjonstest: den opprinnelige buggy implementasjonen lagret starttidspunktet i en ren
    // `ref` som ble mutert inni en `useEffect`. En ref-mutasjon trigger ikke noen re-rendring i
    // React, så komponenten fortsatte å vise *forrige* starttidspunkt (1_000_000) helt til en
    // *annen*, urelatert re-rendring tilfeldigvis kom innom og plukket opp den oppdaterte
    // ref-verdien. Det gjorde at varigheten logget for den nye modusen feilaktig inkluderte tiden
    // brukt i forrige modus. Fiksen lagrer i stedet tidspunktet i reaktiv `useState`, slik at
    // `setTidspunkt` i effekten selv trigger en korrigerende re-rendring umiddelbart.
    expect(result.current).toBe(1_005_000);
  });

  test('gjentatte rendringer med samme visningsModus nullstiller ikke starttidspunktet', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);

    const { result, rerender } = renderHook(({ visningsModus }) => useUmamiStartTidspunkt(visningsModus), {
      initialProps: { visningsModus: 'LES' },
    });

    expect(result.current).toBe(1_000_000);

    vi.setSystemTime(1_005_000);
    rerender({ visningsModus: 'LES' });

    expect(result.current).toBe(1_000_000);
  });
});
