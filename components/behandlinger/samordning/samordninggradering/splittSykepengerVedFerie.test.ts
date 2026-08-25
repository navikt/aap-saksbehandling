import { describe, expect, test } from 'vitest';
import { splittSykepengerVedFerie } from 'components/behandlinger/samordning/samordninggradering/splittSykepengerVedFerie';
import { SamordningYtelsestype } from 'lib/types/types';

interface Rad {
  ytelseType?: SamordningYtelsestype;
  gradering?: number;
  periode: { fom: string; tom: string };
}

function rad(ytelseType: SamordningYtelsestype, fom: string, tom: string, gradering = 100): Rad {
  return { ytelseType, gradering, periode: { fom, tom } };
}

describe('splittSykepengerVedFerie', () => {
  test('deler sykepengeperioden i to og skyver de resterende dagene til etter ferien', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const resultat = splittSykepengerVedFerie(rader, 1);

    expect(resultat.rader.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '09.03.2025' },
      { fom: '15.03.2025', tom: '05.04.2025' },
      { fom: '10.03.2025', tom: '14.03.2025' },
    ]);
  });

  test('bevarer antall sykepengedager', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const sykepengerader = splittSykepengerVedFerie(rader, 1).rader.filter((r) => r.ytelseType === 'SYKEPENGER');

    expect(antallDager(sykepengerader)).toBe(31);
  });

  test('flytter hele perioden til etter ferien når ferien dekker alt', () => {
    const rader = [
      rad('SYKEPENGER', '10.03.2025', '14.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '01.03.2025', '31.03.2025'),
    ];

    const resultat = splittSykepengerVedFerie(rader, 1);

    expect(resultat.rader.map((r) => r.periode)).toEqual([
      { fom: '01.04.2025', tom: '05.04.2025' },
      { fom: '01.03.2025', tom: '31.03.2025' },
    ]);
  });

  test('gir én rad når ferien starter før sykepengeperioden', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '20.02.2025', '05.03.2025'),
    ];

    const resultat = splittSykepengerVedFerie(rader, 1);

    expect(resultat.rader[0].periode).toEqual({ fom: '06.03.2025', tom: '05.04.2025' });
  });

  test('skyver de resterende dagene når ferien varer ut over sykepengeperioden', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '20.03.2025', '10.04.2025'),
    ];

    const resultat = splittSykepengerVedFerie(rader, 1);

    expect(resultat.rader.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '19.03.2025' },
      { fom: '11.04.2025', tom: '22.04.2025' },
      { fom: '20.03.2025', tom: '10.04.2025' },
    ]);
  });

  test('lar sykepengeperioder uten overlapp være i fred', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '01.05.2025', '10.05.2025'),
    ];

    const resultat = splittSykepengerVedFerie(rader, 1);

    expect(resultat.rader).toEqual(rader);
    expect(resultat.endredeIndekser).toEqual([]);
  });

  test('splitter alle overlappende sykepengeperioder', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('SYKEPENGER', '05.03.2025', '20.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const resultat = splittSykepengerVedFerie(rader, 2);

    expect(resultat.rader).toHaveLength(5);
    expect(resultat.endredeIndekser).toEqual([0, 1, 2, 3]);
  });

  test('rører ikke andre ytelsestyper', () => {
    const rader = [
      rad('FORELDREPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    expect(splittSykepengerVedFerie(rader, 1).rader).toEqual(rader);
  });

  test('gjør ingenting når ferieraden mangler gyldige datoer', () => {
    const rader = [rad('SYKEPENGER', '01.03.2025', '31.03.2025'), rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '')];

    expect(splittSykepengerVedFerie(rader, 1).rader).toEqual(rader);
  });

  test('gjør ingenting når raden som er lagt inn ikke er ferie', () => {
    const rader = [rad('SYKEPENGER', '01.03.2025', '31.03.2025'), rad('PLEIEPENGER', '10.03.2025', '14.03.2025')];

    expect(splittSykepengerVedFerie(rader, 1).rader).toEqual(rader);
  });

  test('beholder samordningsgrad på de splittede radene', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025', 60),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const resultat = splittSykepengerVedFerie(rader, 1);

    expect(resultat.rader[0].gradering).toBe(60);
    expect(resultat.rader[1].gradering).toBe(60);
  });

  test('regner om fra den opprinnelige perioden når feriedatoene rettes', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const førsteSplitt = splittSykepengerVedFerie(rader, 1);
    const medRettetFerie = førsteSplitt.rader.map((r) =>
      r.ytelseType === 'FERIE_I_SYKEPENGEPERIODE' ? rad('FERIE_I_SYKEPENGEPERIODE', '20.03.2025', '21.03.2025') : r
    );

    const andreSplitt = splittSykepengerVedFerie(medRettetFerie, 2);

    expect(andreSplitt.rader.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '19.03.2025' },
      { fom: '22.03.2025', tom: '02.04.2025' },
      { fom: '20.03.2025', tom: '21.03.2025' },
    ]);
  });

  test('gir samme resultat når den samme ferien beregnes på nytt', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const førsteSplitt = splittSykepengerVedFerie(rader, 1);
    const andreSplitt = splittSykepengerVedFerie(førsteSplitt.rader, 2);

    expect(andreSplitt.rader).toEqual(førsteSplitt.rader);
  });

  test('slår sammen igjen til den opprinnelige perioden når ferien ikke lenger overlapper', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const førsteSplitt = splittSykepengerVedFerie(rader, 1);
    const medFlyttetFerie = førsteSplitt.rader.map((r) =>
      r.ytelseType === 'FERIE_I_SYKEPENGEPERIODE' ? rad('FERIE_I_SYKEPENGEPERIODE', '01.06.2025', '10.06.2025') : r
    );

    const andreSplitt = splittSykepengerVedFerie(medFlyttetFerie, 2);

    expect(andreSplitt.rader.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '31.03.2025' },
      { fom: '01.06.2025', tom: '10.06.2025' },
    ]);
    expect(andreSplitt.endredeIndekser).toEqual([]);
  });

  test('slår sammen igjen når ytelsestypen på ferieraden endres', () => {
    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const førsteSplitt = splittSykepengerVedFerie(rader, 1);
    const medEndretType = førsteSplitt.rader.map((r) =>
      r.ytelseType === 'FERIE_I_SYKEPENGEPERIODE' ? rad('PLEIEPENGER', '10.03.2025', '14.03.2025') : r
    );

    const andreSplitt = splittSykepengerVedFerie(medEndretType, 2);

    expect(andreSplitt.rader.map((r) => r.periode)).toEqual([
      { fom: '01.03.2025', tom: '31.03.2025' },
      { fom: '10.03.2025', tom: '14.03.2025' },
    ]);
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
