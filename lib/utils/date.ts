import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = Object.freeze({
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
});

export function formaterDatoBirthDate(dato: string, datoformat?: string): string {
  return format(parseISO(dato), datoformat || DATO_FORMATER.ddMMyyyy, { locale: nb });
}

export const formatFullDate = (date?: string) => {
  if (!date) return '';

  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: nb });
};

export const formatDate = (date?: string) => {
  if (!date) return '';

  return format(new Date(date), 'd. MMMM yyyy', { locale: nb });
};

export const formatDateWithTime = (date?: string) => {
  if (!date) return '';

  return format(new Date(date), 'd. MMMM yyyy HH:mm', { locale: nb });
};
