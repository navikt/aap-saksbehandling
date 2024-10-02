import { describe, expect, it } from 'vitest';
import {
  perioderSomOverlapper,
  sjekkOmPerioderInkludererDatoer,
} from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';
import { Periode } from 'lib/types/types';

const enPeriode: Periode = {
  fom: '20.08.2024',
  tom: '30.08.2024',
};

const perioderSomIkkeOverlapper: Periode[] = [
  {
    fom: '01.01.2024',
    tom: '01.02.2024',
  },
  {
    fom: '01.03.2024',
    tom: '01.04.2024',
  },
  {
    fom: '01.05.2024',
    tom: '01.06.2024',
  },
];

const perioderSomOverlapperObjekt: Periode[] = [
  {
    fom: '01.01.2024',
    tom: '01.02.2024',
  },
  {
    fom: '20.01.2024',
    tom: '15.02.2024',
  },
  {
    fom: '21.01.2024',
    tom: '01.03.2024',
  },
];

describe('harPerioderSomOverlapper', () => {
  it('returnerer undefined når det kun finnes en periode', () => {
    expect(perioderSomOverlapper([enPeriode])).toBeUndefined();
  });

  it('returnerer undefined når det ikke finnes perioder med overlapp', () => {
    expect(perioderSomOverlapper(perioderSomIkkeOverlapper)).toBeUndefined();
  });

  it('returnerer array med overlappende periode index når det finnes perioder som overlapper', () => {
    expect(perioderSomOverlapper(perioderSomOverlapperObjekt)).toStrictEqual([0, 1]);
  });
});

describe('sjekkOmPeriodeInkludererDato', () => {
  it('returnerer false når ingen datoer ligger innenfor periodene', () => {
    expect(
      sjekkOmPerioderInkludererDatoer(
        ['2024-01-15', '2024-02-01'],
        [
          { fom: '2024-01-01', tom: '2024-01-14' },
          { fom: '2024-01-16', tom: '2024-01-30' },
        ]
      )
    ).toBeFalsy();
  });

  it('returnerer true når det finnes datoer innenfor en periode', () => {
    expect(sjekkOmPerioderInkludererDatoer(['2024-01-15'], [{ fom: '2024-01-01', tom: '2024-01-16' }])).toBeTruthy();
  });

  it('returnerer true når en periode starter på samme dato', () => {
    expect(sjekkOmPerioderInkludererDatoer(['2024-08-08'], [{ fom: '2024-08-08', tom: '2024-08-30' }])).toBeTruthy();
  });

  it('returnerer true når en periode slutter på samme dato', () => {
    expect(sjekkOmPerioderInkludererDatoer(['2024-08-08'], [{ fom: '2024-07-01', tom: '2024-08-08' }])).toBeTruthy();
  });
});
