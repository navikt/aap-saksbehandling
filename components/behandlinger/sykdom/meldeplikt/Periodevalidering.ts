import { Periode } from 'lib/types/types';

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
