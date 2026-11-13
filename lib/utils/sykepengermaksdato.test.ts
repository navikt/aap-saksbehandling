import { describe, expect, test } from 'vitest';
import { utledMaksdatoFraSykepenger } from 'lib/utils/sykepengermaksdato';

describe('utledMaksdatoFraSykepenger', () => {
  test('returnerer undefined når gjenstående sykedager mangler', () => {
    expect(utledMaksdatoFraSykepenger(undefined)).toBeUndefined();
  });

  test('formaterer maksdato når vedtak er i ny løsning', () => {
    expect(utledMaksdatoFraSykepenger({ grunnlag: 'VEDTAK_I_NY_LØSNING', maksdato: '2025-04-01' })).toBe('01.04.2025');
  });

  test('returnerer "SP i Infotrygd" når siste utbetaling er i Infotrygd', () => {
    expect(utledMaksdatoFraSykepenger({ grunnlag: 'SISTE_UTBETALING_I_INFOTRYGD' })).toBe('SP i Infotrygd');
  });

  test('returnerer "SP i Infotrygd" selv om maksdato er satt', () => {
    expect(utledMaksdatoFraSykepenger({ grunnlag: 'SISTE_UTBETALING_I_INFOTRYGD', maksdato: '2025-04-01' })).toBe(
      'SP i Infotrygd'
    );
  });

  test.each(['INGEN_SYKEPENGER_SISTE_26_UKER', 'MAKSDATO_I_INFOTRYGD', 'MANGLER_MAKSDATO_I_INFOTRYGD'] as const)(
    'returnerer undefined for grunnlag %s',
    (grunnlag) => {
      expect(utledMaksdatoFraSykepenger({ grunnlag, maksdato: '2025-04-01' })).toBeUndefined();
    }
  );
});
