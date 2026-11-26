import { describe, expect, it } from 'vitest';
import { mapBehovskodeTilBehovstype } from './oversettelser';

describe('mapBehovskodeTilBehovstype', () => {
  it.each([
    ['1344', 'Avklar søknad for bruker under 18 år'],
    ['1345', 'Avklar samtykke for bruker under 18 år'],
    ['1347', 'Vent på samtykke for bruker under 18 år'],
    ['ukjent', 'Ukjent behovstype'],
  ])('oversetter %s til %s', (kode, forventet) => {
    expect(mapBehovskodeTilBehovstype(kode)).toBe(forventet);
  });
});
