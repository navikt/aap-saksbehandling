import { StegType } from 'lib/types/types';
import { clientLoggUmamiEvent } from 'lib/utils/umami/client';

export interface UmamiLenkeKlikkEvent {
  type: 'LENKE_KLIKK';
  name: 'EKSTERN_LENKE_KLIKK';
  lenketekst: string;
  steg?: StegType;
}

export function loggUmamiEksternLenkeKlikk(steg: StegType | undefined, lenketekst: string) {
  clientLoggUmamiEvent({ type: 'LENKE_KLIKK', name: 'EKSTERN_LENKE_KLIKK', lenketekst, steg });
}
