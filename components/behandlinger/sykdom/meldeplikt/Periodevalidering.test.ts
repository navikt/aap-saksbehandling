import { describe, expect, it } from 'vitest';
import {
  harPerioderSomOverlapper,
  sjekkOmPerioderInkludererDatoer,
} from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';
import { Periode } from 'lib/types/types';

const enPeriode: Periode = {
  fom: '2024-08-20',
  tom: '2024-08-30',
};

const perioderSomIkkeOverlapper: Periode[] = [
  {
    fom: '2024-01-01',
    tom: '2024-02-01',
  },

  {
    fom: '2024-03-01',
    tom: '2024-04-01',
  },
  {
    fom: '2024-05-01',
    tom: '2024-06-01',
  },
];

const perioderSomOverlapper: Periode[] = [
  {
    fom: '2024-01-01',
    tom: '2024-02-01',
  },
  {
    fom: '2024-01-15',
    tom: '2024-01-20',
  },
  {
    fom: '2024-01-21',
    tom: '2024-03-01',
  },
];

describe('harPerioderSomOverlapper', () => {
  it('returnerer false når det kun finnes en periode', () => {
    expect(harPerioderSomOverlapper([enPeriode])).toBeFalsy();
  });

  it('returnerer false når det ikke finnes perioder med overlapp', () => {
    expect(harPerioderSomOverlapper(perioderSomIkkeOverlapper)).toBeFalsy();
  });

  it('returnerer true når det finnes perioder som overlapper', () => {
    expect(harPerioderSomOverlapper(perioderSomOverlapper)).toBeTruthy();
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
