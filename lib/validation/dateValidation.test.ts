import { describe, expect, it } from 'vitest';
import { validerDato } from './dateValidation';

describe('Dato-validering', () => {
  it('gir feilmelding når dato ikke er fylt ut', () => {
    expect(validerDato('')).toEqual('Du må sette en dato');
  });

  it('gir feilmelding når datoen er ugydlig', () => {
    expect(validerDato('31.02.2024')).toEqual('Dato format er ikke gyldig. Dato må være på formatet dd.mm.åååå');
  });

  it('gir undefined når datoen er gyldig', () => {
    expect(validerDato('12.07.2024')).toBeUndefined();
  });
});
