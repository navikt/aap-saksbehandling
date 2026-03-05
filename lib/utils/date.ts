import { differenceInBusinessDays, format, isValid, parse } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Dato } from 'lib/types/Dato';

export const DATO_FORMATER = {
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
  ddMMyyyy_HHmmss: 'dd.MM.yyyy HH:mm:ss',
  ddMM: 'dd.MM.',
  dMMMMyyyy: 'd. MMMM yyyy', // 1. februar 2026
};

export const uendeligSluttString = '2999-01-01';
const uendeligSlutt = new Date(uendeligSluttString);

export function erUendeligSlutt(dato: string | Date): boolean {
  return dato === uendeligSluttString || dato === uendeligSlutt;
}

export function formaterDatoForFrontend(dato: Date | string): string {
  if (erUendeligSlutt(dato)) {
    return '';
  }
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}

export function formaterDatoMedTidspunktForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy_HHmm, { locale: nb });
}

export function formaterDatoMedKunDagOgMånedForFrontend(dato: string): string {
  return format(dato, DATO_FORMATER.ddMM, { locale: nb });
}

export function formatDatoMedMånedsnavn(dato: string | Date): string {
  if (dato === uendeligSluttString || dato === uendeligSlutt) {
    return '';
  }

  return format(dato, DATO_FORMATER.dMMMMyyyy, { locale: nb });
}

export const formaterDatoForBackend = (dato: Date) => {
  return format(dato, 'yyyy-MM-dd');
};

export const stringToDate = (value?: string | null, format: string = 'yyyy-MM-dd') => {
  if (!value) {
    return undefined;
  }
  const parsedDate = parse(value, format, new Date());
  return isValid(parsedDate) ? parsedDate : undefined;
};

export function sorterEtterNyesteDato(a: string, b: string) {
  return new Date(b).getTime() - new Date(a).getTime();
}

export function sorterEtterEldsteDato(a: string, b: string) {
  return new Date(a).getTime() - new Date(b).getTime();
}

export const parseDatoFraDatePicker = (value?: string | Date): Date | undefined => {
  if (value instanceof Date) {
    return value;
  }
  return stringToDate(value, 'dd.MM.yyyy');
};

export function formaterPeriode(dato1?: string | null, dato2?: string | null): string {
  if (dato1 && !dato2) {
    return `${formaterDatoForFrontend(dato1)} - `;
  } else if (dato1 && dato2) {
    return `${formaterDatoForFrontend(dato1)} - ${formaterDatoForFrontend(dato2)}`;
  } else {
    return '';
  }
}

export function summerPerioderVarighetIArbeidsdager(perioder: { fom: string; tom: string }[]): number {
  return perioder.reduce((acc, periode) => {
    const start = new Dato(periode.fom).dato;
    const end = new Dato(periode.tom).dato;
    const duration = differenceInBusinessDays(end, start);
    return acc + duration;
  }, 0);
}
