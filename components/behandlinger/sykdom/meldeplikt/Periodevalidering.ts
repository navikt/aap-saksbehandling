import { areIntervalsOverlapping, Interval, interval, parse } from 'date-fns';
import { FritakMeldepliktVurdering } from 'lib/types/types';

const parseDato = (input: string) => parse(input, 'yyyy-MM-dd', new Date());

export const perioderOverlapper = (perioder: FritakMeldepliktVurdering[]) => {
  if (perioder.length === 1) {
    // kun en periode, trenger ikke å sjekke om det overlapper
    return false;
  }
  let harOverlapp = false;

  const intervaller: Interval[] = [];
  perioder.forEach((periode) => {
    if (periode.harFritak) {
      if (periode.periode.tom) {
        intervaller.push(interval(parseDato(periode.periode.fom), parseDato(periode.periode.tom)));
      }
    }
  });

  for (let outer = 0; outer < intervaller.length; outer++) {
    for (let inner = outer + 1; inner < intervaller.length; inner++) {
      if (areIntervalsOverlapping(intervaller[outer], intervaller[inner])) {
        harOverlapp = true;
      }
    }
  }

  return harOverlapp;
};
