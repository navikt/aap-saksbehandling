import { describe, it, expect } from 'vitest';
import {
  harPerioderSomOverlapper,
  perioderOverlapper,
} from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';
import { FritakMeldepliktVurdering, Periode } from 'lib/types/types';

const enPeriode: FritakMeldepliktVurdering = {
  harFritak: true,
  periode: {
    fom: '2024-08-20',
    tom: '2024-08-30',
  },
};

const perioderSomIkkeOverlapper: FritakMeldepliktVurdering[] = [
  {
    harFritak: true,
    periode: {
      fom: '2024-01-01',
      tom: '2024-02-01',
    },
  },
  {
    harFritak: true,
    periode: {
      fom: '2024-03-01',
      tom: '2024-04-01',
    },
  },
  {
    harFritak: true,
    periode: {
      fom: '2024-05-01',
      tom: '2024-06-01',
    },
  },
];

const perioderSomOverlapper: FritakMeldepliktVurdering[] = [
  {
    harFritak: true,
    periode: {
      fom: '2024-01-01',
      tom: '2024-02-01',
    },
  },
  {
    harFritak: true,
    periode: {
      fom: '2024-01-15',
      tom: '2024-01-20',
    },
  },
  {
    harFritak: true,
    periode: {
      fom: '2024-01-21',
      tom: '2024-03-01',
    },
  },
];

describe('Periodevalidering', () => {
  it('returnerer false når det kun finnes en periode', () => {
    expect(perioderOverlapper([enPeriode])).toBeFalsy();
  });

  it('returnerer false når det ikke finnes perioder med overlapp', () => {
    expect(perioderOverlapper(perioderSomIkkeOverlapper)).toBeFalsy();
  });

  it('returnerer true når det finnes perioder som overlapper', () => {
    expect(perioderOverlapper(perioderSomOverlapper)).toBeTruthy();
  });
});

const enPeriodeThomas: Periode = {
  fom: '2024-08-20',
  tom: '2024-08-30',
};

const perioderSomIkkeOverlapperThomas: Periode[] = [
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

const perioderSomOverlapperThomas: Periode[] = [
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
    expect(harPerioderSomOverlapper([enPeriodeThomas])).toBeFalsy();
  });

  it('returnerer false når det ikke finnes perioder med overlapp', () => {
    expect(harPerioderSomOverlapper(perioderSomIkkeOverlapperThomas)).toBeFalsy();
  });

  it('returnerer true når det finnes perioder som overlapper', () => {
    expect(harPerioderSomOverlapper(perioderSomOverlapperThomas)).toBeTruthy();
  });
});
