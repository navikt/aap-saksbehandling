import { format, isValid, parse } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = {
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
};

export function formaterDatoForFrontend(dato: Date): string {
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}

export const formaterDatoForBackend = (dato: Date) => {
  return format(dato, 'yyyy-MM-dd');
};

export const stringToDate = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : undefined;
};
