import { describe, expect, test } from 'vitest';
import { utledMaksdatoFraSykepenger } from 'lib/utils/sykepengermaksdato';

describe('utledMaksdatoFraSykepenger', () => {
  test('returnerer undefined når gjenstående sykedager mangler', () => {
    expect(utledMaksdatoFraSykepenger(undefined)).toBeUndefined();
  });

  test('formaterer maksdato når vedtak er i ny løsning', () => {
    expect(utledMaksdatoFraSykepenger({ grunnlag: 'VEDTAK_I_NY_LØSNING', maksdato: '2025-04-01' })).toBe('01.04.2025');
  });

  test('returnerer tekst for grunnlaget når vedtak er i ny løsning men maksdato mangler', () => {
    expect(utledMaksdatoFraSykepenger({ grunnlag: 'VEDTAK_I_NY_LØSNING' })).toBe('Vedtak i ny løsning');
  });

  test.each([
    ['INGEN_SYKEPENGER_SISTE_26_UKER', 'Ingen sykepenger siste 26 uker'],
    ['MAKSDATO_I_INFOTRYGD', 'Maksdato i Infotrygd'],
    ['MANGLER_MAKSDATO_I_INFOTRYGD', 'Mangler maksdato i Infotrygd'],
    ['SISTE_UTBETALING_I_INFOTRYGD', 'Siste utbetaling i Infotrygd'],
  ] as const)('returnerer tekst for grunnlag %s', (grunnlag, forventet) => {
    expect(utledMaksdatoFraSykepenger({ grunnlag })).toBe(forventet);
  });

  test('ignorerer maksdato når grunnlaget ikke er vedtak i ny løsning', () => {
    expect(utledMaksdatoFraSykepenger({ grunnlag: 'SISTE_UTBETALING_I_INFOTRYGD', maksdato: '2025-04-01' })).toBe(
      'Siste utbetaling i Infotrygd'
    );
  });
});
