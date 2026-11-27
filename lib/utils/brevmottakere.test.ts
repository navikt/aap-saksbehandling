import { Mottaker } from 'lib/types/types';
import { kanLeggeTilFullmektig } from 'lib/utils/brevmottakere';
import { describe, expect, test } from 'vitest';

const mottakerMedNavn = (navn: string): Mottaker => ({
  navnOgAdresse: {
    navn,
    adresse: { adresselinje1: 'Testveien 1', landkode: 'NO' },
  },
});

describe('kanLeggeTilFullmektig', () => {
  test('godtar fullmektig med annen ident når alle mottakerne mangler adresse', () => {
    const fullmektig: Mottaker = { ident: 'fullmektig' };
    const hovedmottaker: Mottaker = { ident: 'hovedmottaker' };
    const kopimottaker: Mottaker = { ident: 'kopimottaker' };

    expect(kanLeggeTilFullmektig(fullmektig, hovedmottaker, kopimottaker)).toBe(true);
  });

  test('avviser fullmektig med samme ident som hovedmottaker når begge mangler adresse', () => {
    const fullmektig: Mottaker = { ident: 'samme-ident' };
    const hovedmottaker: Mottaker = { ident: 'samme-ident' };

    expect(kanLeggeTilFullmektig(fullmektig, hovedmottaker)).toBe(false);
  });

  test('avviser fullmektig med samme ident som kopimottaker når begge mangler adresse', () => {
    const fullmektig: Mottaker = { ident: 'samme-ident' };
    const hovedmottaker: Mottaker = { ident: 'annen-ident' };
    const kopimottaker: Mottaker = { ident: 'samme-ident' };

    expect(kanLeggeTilFullmektig(fullmektig, hovedmottaker, kopimottaker)).toBe(false);
  });

  test('regner ikke manglende ident og navn som et treff', () => {
    expect(kanLeggeTilFullmektig({}, {}, {})).toBe(true);
  });

  test('godtar fullmektig med annet navn når alle mottakerne mangler ident', () => {
    const fullmektig = mottakerMedNavn('Testfullmektig');
    const hovedmottaker = mottakerMedNavn('Testhovedmottaker');
    const kopimottaker = mottakerMedNavn('Testkopimottaker');

    expect(kanLeggeTilFullmektig(fullmektig, hovedmottaker, kopimottaker)).toBe(true);
  });

  test('avviser fullmektig med samme navn som hovedmottaker når begge mangler ident', () => {
    const fullmektig = mottakerMedNavn('Testmottaker');
    const hovedmottaker = mottakerMedNavn('Testmottaker');

    expect(kanLeggeTilFullmektig(fullmektig, hovedmottaker)).toBe(false);
  });

  test('avviser fullmektig med samme navn som kopimottaker når begge mangler ident', () => {
    const fullmektig = mottakerMedNavn('Testmottaker');
    const hovedmottaker = mottakerMedNavn('Testhovedmottaker');
    const kopimottaker = mottakerMedNavn('Testmottaker');

    expect(kanLeggeTilFullmektig(fullmektig, hovedmottaker, kopimottaker)).toBe(false);
  });

  test('godtar fullmektig når bare én av mottakerne har navn og adresse', () => {
    const mottakerUtenAdresse: Mottaker = { ident: 'test-ident' };
    const mottakerMedAdresse = mottakerMedNavn('Testmottaker');

    expect(kanLeggeTilFullmektig(mottakerUtenAdresse, mottakerMedAdresse)).toBe(true);
    expect(kanLeggeTilFullmektig(mottakerMedAdresse, mottakerUtenAdresse)).toBe(true);
  });
});
