import { describe, expect, it } from 'vitest';
import { erIngenTilgangError, ingenTilgang, INGEN_TILGANG_DIGEST } from './ingenTilgang';

describe('erIngenTilgangError', () => {
  it('gjenkjenner feilen som ingenTilgang kaster', () => {
    expect.assertions(2);
    try {
      ingenTilgang();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(erIngenTilgangError(error)).toBe(true);
    }
  });

  it('gjenkjenner et objekt med riktig digest', () => {
    expect(erIngenTilgangError({ digest: INGEN_TILGANG_DIGEST })).toBe(true);
  });

  it.each([
    new Error('Annen feil'),
    {},
    { digest: 'ANNEN_FEIL' },
    { digest: 403 },
    null,
    undefined,
    'INGEN_TILGANG',
    403,
  ])('avviser verdier som ikke er en tilgangsfeil: %j', (error) => {
    expect(erIngenTilgangError(error)).toBe(false);
  });
});
