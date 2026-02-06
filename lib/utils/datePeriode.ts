import { parseISO } from 'date-fns';

export interface DatePeriode {
  fom: Date;
  tom: Date | null;
}

export const parsePeriode = ({ fom, tom }: { fom: string; tom: string }): DatePeriode => {
  return {
    fom: parseISO(fom),
    tom: tom === '2999-01-01' ? null : parseISO(tom),
  };
};
