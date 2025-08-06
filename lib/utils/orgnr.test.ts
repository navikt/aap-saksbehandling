import { describe, expect, test } from 'vitest';
import { erGyldigOrganisasjonsnummer } from 'lib/utils/orgnr';

describe('Test validering av orgnr - med kontrollsiffer', () => {
  test('Sjekk gyldige orgnr', () => {
    expect(erGyldigOrganisasjonsnummer('958935420')).toBeTruthy();
    expect(erGyldigOrganisasjonsnummer('952857991')).toBeTruthy();
    expect(erGyldigOrganisasjonsnummer('627438400')).toBeTruthy();
    expect(erGyldigOrganisasjonsnummer('856776263')).toBeTruthy();
    expect(erGyldigOrganisasjonsnummer('276154117')).toBeTruthy();
    expect(erGyldigOrganisasjonsnummer('050069281')).toBeTruthy();
  });

  test('Sjekk div ugyldige orgnr', () => {
    expect(erGyldigOrganisasjonsnummer('123456789')).toBeFalsy();
    expect(erGyldigOrganisasjonsnummer('000000000')).toBeFalsy();
    expect(erGyldigOrganisasjonsnummer('999888777')).toBeFalsy();
    expect(erGyldigOrganisasjonsnummer('987654321')).toBeFalsy();
    expect(erGyldigOrganisasjonsnummer('98765432a')).toBeFalsy();

    expect(erGyldigOrganisasjonsnummer('gorgon123')).toBeFalsy();
    expect(erGyldigOrganisasjonsnummer('')).toBeFalsy();
  });
});
