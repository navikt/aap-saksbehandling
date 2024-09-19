import { Periode } from 'lib/types/types';
import { parse } from 'date-fns';

interface ParsedPeriode {
  fom: Date;
  tom: Date;
}

export function harPerioderSomOverlapper(perioder: Periode[]): boolean {
  const parsedPerioder: ParsedPeriode[] = perioder.map((periode) => {
    return {
      tom: parseTilddmmyyyy(periode.tom),
      fom: parseTilddmmyyyy(periode.fom),
    };
  });

  const sortertePerioder = parsedPerioder.sort((a, b) => a.fom.getTime() - b.fom.getTime());

  let erOverlappendePerioder = false;
  let forrigePeriode: ParsedPeriode | null = null;

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
