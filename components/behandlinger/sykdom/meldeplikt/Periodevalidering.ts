import { areIntervalsOverlapping, Interval, interval, parse } from 'date-fns';
import { FritakMeldepliktVurdering, Periode } from 'lib/types/types';

const parseDato = (input: string) => parse(input, 'yyyy-MM-dd', new Date());

export const perioderOverlapper = (perioder: FritakMeldepliktVurdering[]) => {
  if (perioder.length === 1) {
    // kun en periode, trenger ikke å sjekke om det overlapper
    return false;
  }

  const intervaller: Interval[] = [];
  perioder.forEach((periode) => {
    if (periode.harFritak) {
      if (periode.periode.tom) {
        intervaller.push(interval(parseDato(periode.periode.fom), parseDato(periode.periode.tom)));
      }
    }
  });

  console.log('intervaller', intervaller);

  for (let outer = 0; outer < intervaller.length; outer++) {
    for (let inner = outer + 1; inner < intervaller.length; inner++) {
      if (areIntervalsOverlapping(intervaller[outer], intervaller[inner])) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Et annet alternativ hvor vi bare bryr oss om et array med tom og fom
 */
export function harPerioderSomOverlapper(perioder: Periode[]): boolean {
  const sortertePerioder = perioder.sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime());

  let erOverlappendePerioder = false;
  let forrigePeriode: Periode | null = null;

  sortertePerioder.forEach((periode) => {
    if (forrigePeriode) {
      if (new Date(periode.fom) < new Date(forrigePeriode.tom)) {
        erOverlappendePerioder = true;
      }
    }

    forrigePeriode = periode;
  });

  return erOverlappendePerioder;
}
