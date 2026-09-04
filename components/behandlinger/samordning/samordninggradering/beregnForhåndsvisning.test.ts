import { describe, expect, test } from 'vitest';
import { beregnForhåndsvisning } from 'components/behandlinger/samordning/samordninggradering/beregnForhåndsvisning';
import { SamordningYtelsestype } from 'lib/types/types';

interface Rad {
  ytelseType?: SamordningYtelsestype;
  gradering?: number;
  periode: { fom: string; tom: string };
}

function rad(ytelseType: SamordningYtelsestype, fom: string, tom: string, gradering = 100): Rad {
  return { ytelseType, gradering, periode: { fom, tom } };
}

describe('beregnForhåndsvisning', () => {
  test('deler sykepengeperioden i to og skyver de resterende dagene til etter ferien, sortert kronologisk', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '09.03.2025' },
      { fom: '10.03.2025', tom: '14.03.2025' },
      { fom: '15.03.2025', tom: '05.04.2025' },
    ]);
  });

  test('bevarer antall sykepengedager', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const sykepengerader = beregnForhåndsvisning(rader).filter((r) => r.ytelseType === 'SYKEPENGER');

    expect(antallDager(sykepengerader)).toBe(31);
  });

  test('flytter hele perioden til etter ferien når ferien dekker alt', () => {
    const rader = [
      rad('SYKEPENGER', '10.03.2025', '14.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '01.03.2025', '31.03.2025'),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '31.03.2025' },
      { fom: '01.04.2025', tom: '05.04.2025' },
    ]);
  });

  test('gir én rad når ferien starter før sykepengeperioden', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '20.02.2025', '05.03.2025'),
    ];

    const resultat = beregnForhåndsvisning(rader);
    const sykepengerad = resultat.find((r) => r.ytelseType === 'SYKEPENGER');

    expect(sykepengerad?.periode).toEqual({ fom: '06.03.2025', tom: '05.04.2025' });
  });

  test('skyver de resterende dagene når ferien varer ut over sykepengeperioden', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '20.03.2025', '10.04.2025'),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '19.03.2025' },
      { fom: '20.03.2025', tom: '10.04.2025' },
      { fom: '11.04.2025', tom: '22.04.2025' },
    ]);
  });

  test('lar sykepengeperioder uten overlapp være i fred', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '01.05.2025', '10.05.2025'),
    ];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('splitter alle overlappende sykepengeperioder', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('SYKEPENGER', '05.03.2025', '20.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat).toHaveLength(5);
    expect(resultat.map((r) => r.periode)).toEqual(
      expect.arrayContaining([
        { fom: '01.03.2025', tom: '09.03.2025' },
        { fom: '05.03.2025', tom: '09.03.2025' },
        { fom: '10.03.2025', tom: '14.03.2025' },
        { fom: '15.03.2025', tom: '05.04.2025' },
        { fom: '15.03.2025', tom: '25.03.2025' },
      ])
    );
  });

  test('gir samme resultat med to ferieperioder uansett rekkefølgen de er lagt inn i', () => {
    const enSykepengeperiode = rad('SYKEPENGER', '01.01.2025', '31.01.2025');
    const ferieA = rad('FERIE_I_SYKEPENGEPERIODE', '10.01.2025', '12.01.2025');
    const ferieB = rad('FERIE_I_SYKEPENGEPERIODE', '20.01.2025', '22.01.2025');

    const medAførst = beregnForhåndsvisning([enSykepengeperiode, ferieA, ferieB]);
    const medBførst = beregnForhåndsvisning([enSykepengeperiode, ferieB, ferieA]);

    const forventet = [
      { fom: '01.01.2025', tom: '09.01.2025' },
      { fom: '10.01.2025', tom: '12.01.2025' },
      { fom: '13.01.2025', tom: '19.01.2025' },
      { fom: '20.01.2025', tom: '22.01.2025' },
      { fom: '23.01.2025', tom: '06.02.2025' },
    ];

    expect(medAførst.map((r) => r.periode)).toEqual(forventet);
    expect(medBførst.map((r) => r.periode)).toEqual(forventet);
  });

  test('rører ikke andre ytelsestyper', () => {
    const rader = [
      rad('FORELDREPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('gjør ingenting når ferieraden mangler gyldige datoer', () => {
    const rader = [rad('SYKEPENGER', '01.03.2025', '31.03.2025'), rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '')];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('gjør ingenting når ingen av radene er ferie', () => {
    const rader = [rad('SYKEPENGER', '01.03.2025', '31.03.2025'), rad('PLEIEPENGER', '10.03.2025', '14.03.2025')];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('beholder samordningsgrad på de splittede radene', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025', 60),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const sykepengerader = beregnForhåndsvisning(rader).filter((r) => r.ytelseType === 'SYKEPENGER');

    expect(sykepengerader).toHaveLength(2);
    sykepengerader.forEach((r) => expect(r.gradering).toBe(60));
  });

  test('splitter riktig direkte fra de opprinnelige radene når feriedatoene rettes, uten å måtte bygge på et tidligere resultat', () => {
    const opprinneligeRader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];
    const medRettetFerie = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '20.03.2025', '21.03.2025'),
    ];

    // Forhåndsvisningen beregnes hver gang direkte fra de faktiske radene i skjemaet,
    // så det finnes ingen "forrige splitt" å regne seg tilbake fra.
    expect(beregnForhåndsvisning(opprinneligeRader)).not.toEqual(beregnForhåndsvisning(medRettetFerie));
    expect(beregnForhåndsvisning(medRettetFerie).map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '19.03.2025' },
      { fom: '20.03.2025', tom: '21.03.2025' },
      { fom: '22.03.2025', tom: '02.04.2025' },
    ]);
  });

  test('gir samme resultat om forhåndsvisningen beregnes på nytt fra sitt eget resultat (idempotent)', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const førsteGang = beregnForhåndsvisning(rader);
    const andreGang = beregnForhåndsvisning(førsteGang);

    expect(andreGang).toEqual(førsteGang);
  });
});

function antallDager(rader: Rad[]): number {
  return rader.reduce((sum, r) => {
    const [fomDag, fomMåned, fomÅr] = r.periode.fom.split('.').map(Number);
    const [tomDag, tomMåned, tomÅr] = r.periode.tom.split('.').map(Number);
    const fom = new Date(fomÅr, fomMåned - 1, fomDag);
    const tom = new Date(tomÅr, tomMåned - 1, tomDag);
    return sum + Math.round((tom.getTime() - fom.getTime()) / 86400000) + 1;
  }, 0);
}
