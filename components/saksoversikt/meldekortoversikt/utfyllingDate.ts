import { eachWeekOfInterval, format, getISOWeek, isValid, parse } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = {
  ddMM: 'dd.MM',
  ddMMyyyy: 'dd.MM.yyyy',
  dMMMM: 'd. MMMM',
  ddMMMyyyy: 'dd. MMM yyyy',
  dMMMMyyyy: 'd. MMMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
  ddMMyyyy_HHmmss: 'dd.MM.yyyy HH:mm:ss',
  EEEEddMMMMyyyy: 'EEEE dd. MMMM yyyy',
};

export function formaterDatoMedÅrForFrontend(dato?: Date | string): string {
  if (!dato) {
    return '';
  }

  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}
export function formaterDatoUtenÅrForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMM, { locale: nb }) + '.';
}

export function formaterDatoMedMånedIBokstaver(dato: Date | string): string {
  return format(dato, DATO_FORMATER.dMMMM, { locale: nb });
}

export function formaterDatoMedMånedIBokstaverOgÅr(dato: Date | string): string {
  return format(dato, DATO_FORMATER.dMMMMyyyy, { locale: nb });
}

export function formaterDatoMedTidspunktForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy_HHmm, { locale: nb });
}

export function formaterDatoMedDagOgMåndedIBokstaver(dato: Date | string): string {
  return format(dato, DATO_FORMATER.EEEEddMMMMyyyy, { locale: nb });
}

export const formaterDatoForBackend = (dato: Date) => {
  return format(dato, 'yyyy-MM-dd');
};

export function fullDag(date: string | Date): string {
  const dato = new Date(date);
  return format(dato, 'EEEE', { locale: nb });
}

export const stringToDate = (value?: string | null, format: string = 'yyyy-MM-dd') => {
  if (!value) {
    return undefined;
  }
  const parsedDate = parse(value, format, new Date());
  return isValid(parsedDate) ? parsedDate : undefined;
};

export function sorterEtterNyesteDatoString(a: string, b: string) {
  return new Date(b).getTime() - new Date(a).getTime();
}

export function sorterEtterEldsteDatoDate(a: Date, b: Date) {
  return a.getTime() - b.getTime();
}

export const parseDatoFraDatePicker = (value?: string | Date): Date | undefined => {
  if (value instanceof Date) {
    return value;
  }
  return stringToDate(value, 'dd.MM.yyyy');
};

export function hentUkeNummerForPeriode(fraDato: Date, tilDato: Date): string {
  const ukenumre = eachWeekOfInterval({ start: fraDato, end: tilDato }, { weekStartsOn: 1 }).map((ukestart) =>
    getISOWeek(ukestart)
  );

  return `${ukenumre.slice(0, -1).join(', ')}${ukenumre.length > 1 ? ' og ' : ''}${ukenumre.slice(-1)}`;
}

export function hentUkeNummerForDato(dato: Date) {
  return getISOWeek(dato);
}

export function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}

function removeDots(input: string): string {
  return input.replace(/\./g, '');
}
