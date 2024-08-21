import { describe, it, expect } from 'vitest';
import { formaterTilG, formaterTilProsent, storForbokstav } from 'lib/utils/string';

describe('storForbokstav', () => {
  it('skal returnere en string med stor forbokstav dersom value er bare uppercase', () => {
    expect(storForbokstav('HELLO PELLO')).toBe('Hello pello');
  });

  it('skal returnere en string med stor forbokstav dersom value er bare lowercase', () => {
    expect(storForbokstav('hello pello')).toBe('Hello pello');
  });
});

describe('formaterTilG', () => {
  it('skal returnere en string med korrekt formatering med 2', () => {
    expect(formaterTilG(2)).toBe('2 G');
  });

  it('skal returnere en string med korrekt formatering med 4.39', () => {
    expect(formaterTilG(4.3949)).toBe('4.39 G');
  });

  it('skal returnere en string med korrekt formatering med 6', () => {
    expect(formaterTilG(6)).toBe('6 G');
  });
});

describe('formaterTilProsent', () => {
  it('skal returnere en string med korrekt formatering med 50', () => {
    expect(formaterTilProsent(50)).toBe('50 %');
  });

  it('skal returnere en string med korrekt formatering med 70', () => {
    expect(formaterTilProsent(70)).toBe('70 %');
  });

  it('skal returnere en string med korrekt formatering med 80', () => {
    expect(formaterTilProsent(80)).toBe('80 %');
  });
});
