import { Periode } from 'lib/types/types';
import { parse } from 'date-fns';

interface PeriodeMedValgfriTom {
  fom: string;
  tom?: string;
}

interface NumeriskPeriode {
  fom: number;
  tom: number;
}

export function harPerioderSomOverlapper(perioder: PeriodeMedValgfriTom[]): boolean {
  const toNumber = (dateStr: string | undefined): number => {
    return dateStr ? parseTilddmmyyyy(dateStr).getTime() : Infinity;
  };

  const parsedPerioder: NumeriskPeriode[] = perioder.map((periode) => {
    return {
      tom: toNumber(periode.tom),
      fom: parseTilddmmyyyy(periode.fom).getTime(),
    };
  });

  const sortertePerioder = parsedPerioder.sort((a, b) => a.fom - b.fom);

  let erOverlappendePerioder = false;
  let forrigePeriode: NumeriskPeriode | null = null;

  sortertePerioder.forEach((periode) => {
    if (forrigePeriode) {
      if (periode.fom < forrigePeriode.tom) {
        erOverlappendePerioder = true;
      }
    }

    forrigePeriode = periode;
  });

  return erOverlappendePerioder;
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
