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

  describe('utledning av maksdato fra gjenstående dager', () => {
    test.each(['VEDTAK_I_NY_LØSNING', 'SISTE_UTBETALING_I_INFOTRYGD', 'MAKSDATO_I_INFOTRYGD'] as const)(
      'utleder maksdato for grunnlag %s',
      (grunnlag) => {
        const utled = (gjenståendeDager: number, vurdertTilOgMed: string) =>
          utledMaksdatoFraSykepenger({ grunnlag, gjenståendeDager, vurdertTilOgMed });

        expect(utled(5, '2026-01-01')).toBe('08.01.2026');
        expect(utled(1, '2026-01-03')).toBe('05.01.2026');
        expect(utled(1, '2026-01-04')).toBe('05.01.2026');
        expect(utled(0, '2026-01-04')).toBe('04.01.2026');
        expect(utled(2, '2025-12-31')).toBe('02.01.2026');
      }
    );

    test('bruker maksdato fra backend når den finnes', () => {
      expect(
        utledMaksdatoFraSykepenger({
          grunnlag: 'VEDTAK_I_NY_LØSNING',
          maksdato: '2025-04-01',
          gjenståendeDager: 5,
          vurdertTilOgMed: '2026-01-01',
        })
      ).toBe('01.04.2025');
    });

    test('returnerer grunnlagstekst når gjenstående dager eller dato mangler', () => {
      expect(utledMaksdatoFraSykepenger({ grunnlag: 'VEDTAK_I_NY_LØSNING', vurdertTilOgMed: '2026-01-01' })).toBe(
        'Vedtak i ny løsning'
      );
      expect(utledMaksdatoFraSykepenger({ grunnlag: 'VEDTAK_I_NY_LØSNING', gjenståendeDager: 5 })).toBe(
        'Vedtak i ny løsning'
      );
    });
  });
});
