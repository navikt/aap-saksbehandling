import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = {
  ddMM: 'dd.MM',
  dMMMM: 'd. MMMM',
};

export function formaterDatoUtenÅrForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMM, { locale: nb }) + '.';
}

export function formaterDatoMedMånedIBokstaver(dato: Date | string): string {
  return format(dato, DATO_FORMATER.dMMMM, { locale: nb });
}

export function fullDag(date: string | Date): string {
  const dato = new Date(date);
  return format(dato, 'EEEE', { locale: nb });
}
