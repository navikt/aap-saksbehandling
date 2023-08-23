import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = {
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
};

export function formaterDatoFødselsdag(dato: string, datoformat?: string): string {
  return format(parseISO(dato), datoformat || DATO_FORMATER.ddMMyyyy, { locale: nb });
}
