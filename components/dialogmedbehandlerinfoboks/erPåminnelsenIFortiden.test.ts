import { describe, expect, it } from 'vitest';
import { erForespørselFør29september2026 } from './DialogMedBehandlerInfoboks';

// Forespørsler gjort før 29. september 2026 skal ikke sende ut automatiske påminnelser
describe('erForespørselFør29september2026', () => {
  it('returnerer true dersom forespørseldatoen er før 29. september 2026', () => {
    // I dette tilfellet er forespørseldatoen 23. september 2026 (22 dager før 15. oktober)
    expect(erForespørselFør29september2026('2026-10-15')).toBe(true);
  });

  it('returnerer false dersom forespørseldatoen er etter eller på 29. september 2026', () => {
    // I dette tilfellet er forespørseldatoen 29. september 2026 (22 dager før 21. oktober)
    expect(erForespørselFør29september2026('2026-10-21')).toBe(false);
  });

  it('returnerer false dersom påminnelsedatoen ikke er i fortiden', () => {
    expect(erForespørselFør29september2026('9999-01-01')).toBe(false);
  });
});
