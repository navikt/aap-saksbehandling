import { describe, it, expect } from 'vitest';
import { validerÅrstall } from 'lib/utils/validation';

describe('validerÅr', () => {
  it('skal returnere korrekt feilmelding hvis det ikke er 4 siffer', () => {
    const resultat = validerÅrstall('202');
    expect(resultat).toBe('Verdien må inneholde 4 siffer');
  });

  it('skal returnere korrekt feilmelding dersom det ikke er et årstall ', () => {
    const resultat = validerÅrstall('hehe');
    expect(resultat).toBe('Verdien er et ugyldig årstall');
  });

  it('skal returnere true dersom det er et årstall', () => {
    const resultat = validerÅrstall('2024');
    expect(resultat).toBeTruthy();
  });
});
