import { describe, expect, it } from 'vitest';
import { erDatoFoerDato, validerDato, erDatoIFremtiden } from './dateValidation';
import { addDays, format, subDays } from 'date-fns';

describe('Dato-validering', () => {
  describe('gyldighet', () => {
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

  describe('er dato før en referansedato', () => {
    it('returnerer true når datoen er før referansedatoen', () => {
      const referansedato = format(new Date(), 'dd.MM.yyyy');
      const dato = format(subDays(new Date(), 10), 'dd.MM.yyyy');
      expect(erDatoFoerDato(dato, referansedato)).toBeTruthy();
    });

    it('returnerer false når datoen er etter referansedatoen', () => {
      const referansedato = format(new Date(), 'dd.MM.yyyy');
      const dato = format(addDays(new Date(), 10), 'dd.MM.yyyy');
      expect(erDatoFoerDato(dato, referansedato)).toBeFalsy();
    });
  });

  describe('er dato tilbake i tid', () => {
    it('returnerer true når datoen er i fremtiden', () => {
      const dato = format(addDays(new Date(), 2), 'dd.MM.yyyy');
      expect(erDatoIFremtiden(dato)).toBeTruthy();
    });

    it('returnerer false når datoen ikke er i fremtiden', () => {
      const dato = format(subDays(new Date(), 2), 'dd.MM.yyyy');
      expect(erDatoIFremtiden(dato)).toBeFalsy();
    });

    it('returnerer false når datoen er i dag', () => {
      const dato = format(new Date(), 'dd.MM.yyyy');
      expect(erDatoIFremtiden(dato)).toBeFalsy();
    });
  });
});
