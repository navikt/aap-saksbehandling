import { describe, expect, it } from 'vitest';
import { perioderSomOverlapper } from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';
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
