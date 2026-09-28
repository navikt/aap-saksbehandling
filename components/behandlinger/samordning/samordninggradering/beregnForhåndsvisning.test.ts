import { describe, expect, test } from 'vitest';
import {
  antallVirkedagerMellom,
  beregnForhåndsvisning,
  slåSammenSplittedeSykepengeperioder,
} from 'components/behandlinger/samordning/samordninggradering/beregnForhåndsvisning';
import { SamordningYtelsestype } from 'lib/types/types';
import { parseDatoFraDatePicker } from 'lib/utils/date';

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
    const sykepengeperiodeFom = '01.03.2025';
    const sykepengeperiodeTom = '31.03.2025';
    const feriePeriodeFom = '10.03.2025';
    const feriePeriodeTom = '14.03.2025';
    const forventetSykepengedelFørFerie = { fom: '01.03.2025', tom: '09.03.2025' };
    const forventetFeriePeriode = { fom: feriePeriodeFom, tom: feriePeriodeTom };
    const forventetSykepengedelEtterFerie = { fom: '15.03.2025', tom: '07.04.2025' };

    const rader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([
      forventetSykepengedelFørFerie,
      forventetFeriePeriode,
      forventetSykepengedelEtterFerie,
    ]);
  });

  test('bevarer antall sykepengedager (virkedager)', () => {
    const sykepengeperiodeFom = '01.03.2025';
    const sykepengeperiodeTom = '31.03.2025';
    const feriePeriodeFom = '10.03.2025';
    const feriePeriodeTom = '14.03.2025';
    const forventetAntallVirkedager = 21;

    const rader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const sykepengerader = beregnForhåndsvisning(rader).filter((r) => r.ytelseType === 'SYKEPENGER');

    expect(antallVirkedager(sykepengerader)).toBe(forventetAntallVirkedager);
  });

  test('flytter hele perioden til etter ferien når ferien dekker alt', () => {
    const sykepengeperiodeFom = '10.03.2025';
    const sykepengeperiodeTom = '14.03.2025';
    const feriePeriodeFom = '01.03.2025';
    const feriePeriodeTom = '31.03.2025';
    const forventetFeriePeriode = { fom: feriePeriodeFom, tom: feriePeriodeTom };
    const forventetSykepengedelEtterFerie = { fom: '01.04.2025', tom: '07.04.2025' };

    const rader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([forventetFeriePeriode, forventetSykepengedelEtterFerie]);
  });

  test('hopper over faste norske helligdager i tillegg til helg når resten av perioden skyves', () => {
    const sykepengeperiodeFom = '01.04.2025';
    const sykepengeperiodeTom = '30.04.2025';
    const feriePeriodeFom = '07.04.2025';
    const feriePeriodeTom = '11.04.2025';
    const førsteMai2025ErTorsdagOgTellesIkkeSomVirkedag = { fom: '01.04.2025', tom: '06.04.2025' };
    const forventetFeriePeriode = { fom: feriePeriodeFom, tom: feriePeriodeTom };
    const forventetSykepengedelEtterFerie = { fom: '12.04.2025', tom: '08.05.2025' };

    const rader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([
      førsteMai2025ErTorsdagOgTellesIkkeSomVirkedag,
      forventetFeriePeriode,
      forventetSykepengedelEtterFerie,
    ]);
  });

  test('hopper over bevegelige helligdager (Kristi himmelfartsdag) når resten av perioden skyves', () => {
    const sykepengeperiodeFom = '01.05.2025';
    const sykepengeperiodeTom = '23.05.2025';
    const feriePeriodeFom = '05.05.2025';
    const feriePeriodeTom = '09.05.2025';
    const forventetSykepengedelFørFerie = { fom: '01.05.2025', tom: '04.05.2025' };
    const forventetFeriePeriode = { fom: feriePeriodeFom, tom: feriePeriodeTom };
    const kristiHimmelfartsdag2025ErTorsdag29MaiOgTellesIkkeSomVirkedag = { fom: '10.05.2025', tom: '02.06.2025' };

    const rader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([
      forventetSykepengedelFørFerie,
      forventetFeriePeriode,
      kristiHimmelfartsdag2025ErTorsdag29MaiOgTellesIkkeSomVirkedag,
    ]);
  });

  test('gir én rad når ferien starter før sykepengeperioden', () => {
    const sykepengeperiodeFom = '01.03.2025';
    const sykepengeperiodeTom = '31.03.2025';
    const feriePeriodeFom = '20.02.2025';
    const feriePeriodeTom = '05.03.2025';
    const forventetSykepengeperiode = { fom: '06.03.2025', tom: '03.04.2025' };

    const rader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const resultat = beregnForhåndsvisning(rader);
    const sykepengerad = resultat.find((r) => r.ytelseType === 'SYKEPENGER');

    expect(sykepengerad?.periode).toEqual(forventetSykepengeperiode);
  });

  test('skyver de resterende dagene når ferien varer ut over sykepengeperioden', () => {
    const sykepengeperiodeFom = '01.03.2025';
    const sykepengeperiodeTom = '31.03.2025';
    const feriePeriodeFom = '20.03.2025';
    const feriePeriodeTom = '10.04.2025';
    const forventetSykepengedelFørFerie = { fom: '01.03.2025', tom: '19.03.2025' };
    const forventetFeriePeriode = { fom: feriePeriodeFom, tom: feriePeriodeTom };
    const forventetSykepengedelEtterFerie = { fom: '11.04.2025', tom: '25.04.2025' };

    const rader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat.map((r) => r.periode)).toEqual([
      forventetSykepengedelFørFerie,
      forventetFeriePeriode,
      forventetSykepengedelEtterFerie,
    ]);
  });

  test('lar sykepengeperioder uten overlapp være i fred', () => {
    const sykepengeperiode = rad('SYKEPENGER', '01.03.2025', '31.03.2025');
    const feriePeriodeUtenOverlapp = rad('FERIE_I_SYKEPENGEPERIODE', '01.05.2025', '10.05.2025');
    const rader = [sykepengeperiode, feriePeriodeUtenOverlapp];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('splitter alle overlappende sykepengeperioder', () => {
    const førsteSykepengeperiodeFom = '01.03.2025';
    const førsteSykepengeperiodeTom = '31.03.2025';
    const andreSykepengeperiodeFom = '05.03.2025';
    const andreSykepengeperiodeTom = '20.03.2025';
    const feriePeriodeFom = '10.03.2025';
    const feriePeriodeTom = '14.03.2025';
    const forventetAntallRader = 5;
    const forventetPerioder = [
      { fom: '01.03.2025', tom: '09.03.2025' },
      { fom: '05.03.2025', tom: '09.03.2025' },
      { fom: feriePeriodeFom, tom: feriePeriodeTom },
      { fom: '15.03.2025', tom: '07.04.2025' },
      { fom: '15.03.2025', tom: '27.03.2025' },
    ];

    const rader = [
      rad('SYKEPENGER', førsteSykepengeperiodeFom, førsteSykepengeperiodeTom),
      rad('SYKEPENGER', andreSykepengeperiodeFom, andreSykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeFom, feriePeriodeTom),
    ];

    const resultat = beregnForhåndsvisning(rader);

    expect(resultat).toHaveLength(forventetAntallRader);
    expect(resultat.map((r) => r.periode)).toEqual(expect.arrayContaining(forventetPerioder));
  });

  test('gir samme resultat med to ferieperioder uansett rekkefølgen de er lagt inn i', () => {
    const sykepengeperiodeFom = '01.01.2025';
    const sykepengeperiodeTom = '31.01.2025';
    const feriePeriodeAFom = '10.01.2025';
    const feriePeriodeATom = '12.01.2025';
    const feriePeriodeBFom = '20.01.2025';
    const feriePeriodeBTom = '22.01.2025';

    const enSykepengeperiode = rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom);
    const ferieA = rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeAFom, feriePeriodeATom);
    const ferieB = rad('FERIE_I_SYKEPENGEPERIODE', feriePeriodeBFom, feriePeriodeBTom);

    const medAførst = beregnForhåndsvisning([enSykepengeperiode, ferieA, ferieB]);
    const medBførst = beregnForhåndsvisning([enSykepengeperiode, ferieB, ferieA]);

    const forventet = [
      { fom: '01.01.2025', tom: '09.01.2025' },
      { fom: feriePeriodeAFom, tom: feriePeriodeATom },
      { fom: '13.01.2025', tom: '19.01.2025' },
      { fom: feriePeriodeBFom, tom: feriePeriodeBTom },
      { fom: '23.01.2025', tom: '06.02.2025' },
    ];

    expect(medAførst.map((r) => r.periode)).toEqual(forventet);
    expect(medBførst.map((r) => r.periode)).toEqual(forventet);
  });

  test('rører ikke andre ytelsestyper', () => {
    const annenYtelsePeriode = rad('FORELDREPENGER', '01.03.2025', '31.03.2025');
    const feriePeriode = rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025');
    const rader = [annenYtelsePeriode, feriePeriode];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('gjør ingenting når ferieraden mangler gyldige datoer', () => {
    const sykepengeperiode = rad('SYKEPENGER', '01.03.2025', '31.03.2025');
    const feriePeriodeUtenTomDato = rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '');
    const rader = [sykepengeperiode, feriePeriodeUtenTomDato];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('gjør ingenting når ingen av radene er ferie', () => {
    const sykepengeperiode = rad('SYKEPENGER', '01.03.2025', '31.03.2025');
    const pleiepengerPeriode = rad('PLEIEPENGER', '10.03.2025', '14.03.2025');
    const rader = [sykepengeperiode, pleiepengerPeriode];

    expect(beregnForhåndsvisning(rader)).toEqual(rader);
  });

  test('beholder samordningsgrad på de splittede radene', () => {
    const opprinneligGradering = 60;
    const forventetAntallSykepengerader = 2;

    const rader = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025', opprinneligGradering),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.03.2025', '14.03.2025'),
    ];

    const sykepengerader = beregnForhåndsvisning(rader).filter((r) => r.ytelseType === 'SYKEPENGER');

    expect(sykepengerader).toHaveLength(forventetAntallSykepengerader);
    sykepengerader.forEach((r) => expect(r.gradering).toBe(opprinneligGradering));
  });

  test('splitter riktig direkte fra de opprinnelige radene når feriedatoene rettes, uten å måtte bygge på et tidligere resultat', () => {
    const sykepengeperiodeFom = '01.03.2025';
    const sykepengeperiodeTom = '31.03.2025';
    const opprinneligFeriePeriodeFom = '10.03.2025';
    const opprinneligFeriePeriodeTom = '14.03.2025';
    const rettetFeriePeriodeFom = '20.03.2025';
    const rettetFeriePeriodeTom = '21.03.2025';
    const forventetPerioderEtterRettetFerie = [
      { fom: '01.03.2025', tom: '19.03.2025' },
      { fom: rettetFeriePeriodeFom, tom: rettetFeriePeriodeTom },
      { fom: '22.03.2025', tom: '02.04.2025' },
    ];

    const opprinneligeRader = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', opprinneligFeriePeriodeFom, opprinneligFeriePeriodeTom),
    ];
    const medRettetFerie = [
      rad('SYKEPENGER', sykepengeperiodeFom, sykepengeperiodeTom),
      rad('FERIE_I_SYKEPENGEPERIODE', rettetFeriePeriodeFom, rettetFeriePeriodeTom),
    ];

    // Forhåndsvisningen beregnes hver gang direkte fra de faktiske radene i skjemaet,
    // så det finnes ingen "forrige splitt" å regne seg tilbake fra.
    expect(beregnForhåndsvisning(opprinneligeRader)).not.toEqual(beregnForhåndsvisning(medRettetFerie));
    expect(beregnForhåndsvisning(medRettetFerie).map((r) => r.periode)).toEqual(forventetPerioderEtterRettetFerie);
  });

  test('skyver sykepengeperiodene tilbake når en ferie fjernes, uten å endre antall sykepengedager', () => {
    const førsteFeriePeriodeFom = '10.01.2026';
    const forventetAntallVirkedager = 21;
    const forventetPerioderEtterFjernetFerie = [
      { ytelseType: 'SYKEPENGER', periode: { fom: '01.01.2026', tom: '19.01.2026' } },
      { ytelseType: 'FERIE_I_SYKEPENGEPERIODE', periode: { fom: '20.01.2026', tom: '21.01.2026' } },
      { ytelseType: 'SYKEPENGER', periode: { fom: '22.01.2026', tom: '01.02.2026' } },
      { ytelseType: 'FERIE_I_SYKEPENGEPERIODE', periode: { fom: '02.02.2026', tom: '03.02.2026' } },
      { ytelseType: 'SYKEPENGER', periode: { fom: '04.02.2026', tom: '05.02.2026' } },
    ];

    const lagredeRader = [
      rad('SYKEPENGER', '01.01.2026', '09.01.2026'),
      rad('FERIE_I_SYKEPENGEPERIODE', førsteFeriePeriodeFom, '16.01.2026'),
      rad('SYKEPENGER', '17.01.2026', '19.01.2026'),
      rad('FERIE_I_SYKEPENGEPERIODE', '20.01.2026', '21.01.2026'),
      rad('SYKEPENGER', '22.01.2026', '01.02.2026'),
      rad('FERIE_I_SYKEPENGEPERIODE', '02.02.2026', '03.02.2026'),
      rad('SYKEPENGER', '04.02.2026', '12.02.2026'),
    ];

    const skjemarader = slåSammenSplittedeSykepengeperioder(lagredeRader);
    const utenFørsteFerie = skjemarader.filter((r) => r.periode.fom !== førsteFeriePeriodeFom);

    const resultat = beregnForhåndsvisning(utenFørsteFerie);

    expect(resultat.map((r) => ({ ytelseType: r.ytelseType, periode: r.periode }))).toEqual(
      forventetPerioderEtterFjernetFerie
    );
    expect(antallVirkedager(resultat.filter((r) => r.ytelseType === 'SYKEPENGER'))).toBe(forventetAntallVirkedager);
  });

  test('rekonstruerer den opprinnelige sykepengeperioden fra rader som allerede er splittet', () => {
    const splittedeRader = [
      rad('SYKEPENGER', '01.01.2026', '09.01.2026'),
      rad('FERIE_I_SYKEPENGEPERIODE', '10.01.2026', '16.01.2026'),
      rad('SYKEPENGER', '17.01.2026', '19.01.2026'),
      rad('FERIE_I_SYKEPENGEPERIODE', '20.01.2026', '21.01.2026'),
      rad('SYKEPENGER', '22.01.2026', '01.02.2026'),
      rad('FERIE_I_SYKEPENGEPERIODE', '02.02.2026', '03.02.2026'),
      rad('SYKEPENGER', '04.02.2026', '12.02.2026'),
    ];

    const sykepenger = slåSammenSplittedeSykepengeperioder(splittedeRader).filter((r) => r.ytelseType === 'SYKEPENGER');

    expect(sykepenger.map((r) => r.periode)).toEqual([{ fom: '01.01.2026', tom: '30.01.2026' }]);
  });

  test('slår ikke sammen sykepengeperioder som overlapper hverandre', () => {
    const overlappendeSykepengeperioder = [
      rad('SYKEPENGER', '01.03.2025', '31.03.2025'),
      rad('SYKEPENGER', '05.03.2025', '20.03.2025'),
    ];

    expect(beregnForhåndsvisning(overlappendeSykepengeperioder)).toEqual(overlappendeSykepengeperioder);
  });

  test('slår ikke sammen sykepengeperioder når mellomrommet ikke er dekket av ferie', () => {
    const sykepengeperioderMedUdekketMellomrom = [
      rad('SYKEPENGER', '01.03.2025', '10.03.2025'),
      rad('SYKEPENGER', '01.09.2025', '30.09.2025'),
    ];

    expect(beregnForhåndsvisning(sykepengeperioderMedUdekketMellomrom)).toEqual(sykepengeperioderMedUdekketMellomrom);
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

function antallVirkedager(rader: Rad[]): number {
  return rader.reduce((sum, r) => {
    const fom = parseDatoFraDatePicker(r.periode.fom);
    const tom = parseDatoFraDatePicker(r.periode.tom);
    return sum + (fom && tom ? antallVirkedagerMellom(fom, tom) : 0);
  }, 0);
}
