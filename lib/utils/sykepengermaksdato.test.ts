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
    ['MAKSDATO_I_INFOTRYGD', 'Maksdato i Infotrygd'],
    ['SISTE_UTBETALING_I_INFOTRYGD', 'Siste utbetaling i Infotrygd'],
  ] as const)('returnerer tekst for grunnlag %s når maksdato mangler', (grunnlag, forventet) => {
    expect(utledMaksdatoFraSykepenger({ grunnlag })).toBe(forventet);
  });

  test.each(['VEDTAK_I_NY_LØSNING', 'MAKSDATO_I_INFOTRYGD', 'SISTE_UTBETALING_I_INFOTRYGD'] as const)(
    'formaterer maksdato for grunnlag %s',
    (grunnlag) => {
      expect(utledMaksdatoFraSykepenger({ grunnlag, maksdato: '2025-04-01' })).toBe('01.04.2025');
    }
  );

  test.each(['INGEN_SYKEPENGER_SISTE_26_UKER', 'MANGLER_MAKSDATO_I_INFOTRYGD'] as const)(
    'returnerer tom streng for grunnlag %s uten maksdato',
    (grunnlag) => {
      expect(utledMaksdatoFraSykepenger({ grunnlag })).toBe('');
    }
  );

  test.each(['INGEN_SYKEPENGER_SISTE_26_UKER', 'MANGLER_MAKSDATO_I_INFOTRYGD'] as const)(
    'ignorerer maksdato for grunnlag %s',
    (grunnlag) => {
      expect(utledMaksdatoFraSykepenger({ grunnlag, maksdato: '2025-04-01' })).toBe('');
    }
  );
});
