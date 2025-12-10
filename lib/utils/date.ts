import { format, isValid, parse } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = {
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
  ddMMyyyy_HHmmss: 'dd.MM.yyyy HH:mm:ss',
};

const uendeligSluttString = '2999-01-01';
const uendeligSlutt = new Date(uendeligSluttString);

export function formaterDatoForFrontend(dato: Date | string): string {
  if (dato === uendeligSluttString || dato === uendeligSlutt) {
    return '';
  }
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}

export function formaterDatoMedTidspunktForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy_HHmm, { locale: nb });
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

export class Dato {
  dato: Date;

  constructor(dato: string);
  constructor(dato: Date);
  constructor(dato: string | Date) {
    if (dato instanceof Date) {
      this.dato = dato;
    } else {
      if (dato.match(/\d{2}.\d{2}.\d{4}/)) {
        this.dato = parse(dato, 'dd.MM.yyyy', new Date());
      } else if (dato.match(/\d{4}-\d{2}-\d{2}/)) {
        this.dato = parse(dato, 'yyyy-MM-dd', new Date());
      } else {
        throw Error('Ugyldig dato');
      }
    }
  }

  formaterForFrontend() {
    return format(this.dato, 'dd.MM.yyyy');
  }

  formaterForBackend() {
    return format(this.dato, 'yyyy-MM-dd');
  }
}
