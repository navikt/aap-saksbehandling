import { Periode } from 'lib/types/types';
import { parse } from 'date-fns';

export interface PeriodeMedValgfriTom {
  fom: string;
  tom?: string;
}

interface NumeriskPeriode {
  fom: number;
  tom: number;
  index: number;
}

export function perioderSomOverlapper(perioder: PeriodeMedValgfriTom[]): number[] | undefined {
  const toNumber = (dateStr: string | undefined): number => {
    return dateStr ? parseTilddmmyyyy(dateStr).getTime() : Infinity;
  };

  const parsedPerioder: NumeriskPeriode[] = perioder.map((periode, index) => {
    return {
      tom: toNumber(periode.tom),
      fom: parseTilddmmyyyy(periode.fom).getTime(),
      index,
    };
  });

  let forrigePeriode: NumeriskPeriode | null = null;

  for (let i = 0; i < parsedPerioder.length; i++) {
    const periode = parsedPerioder[i];

    if (forrigePeriode) {
      if (periode.fom < forrigePeriode.tom) {
        return [forrigePeriode.index, periode.index];
      }
    }

    forrigePeriode = periode;
  }

  return undefined;
}

function parseTilddmmyyyy(value: string) {
  return parse(value, 'dd.MM.yyyy', new Date());
}

export const sjekkOmPerioderInkludererDatoer = (datoer: string[], perioder: Periode[]) => {
  for (let i = 0; i < datoer.length; i++) {
    const dato = new Date(datoer[i]);
    const res = perioder.find((periode) => dato >= new Date(periode.fom) && dato <= new Date(periode.tom));
    if (res) {
      return true;
    }
  }
  return false;
};
