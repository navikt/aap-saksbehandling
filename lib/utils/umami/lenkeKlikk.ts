import { StegType } from 'lib/types/types';
import { clientLoggUmamiEvent } from 'lib/utils/umami/client';

export interface UmamiLenkeKlikkEvent {
  name: 'EKSTERN_LENKE_KLIKK';
  data: {
    lenketekst: string;
    steg?: StegType;
  };
}

export function loggUmamiEksternLenkeKlikk(steg: StegType | undefined, lenketekst: string) {
  clientLoggUmamiEvent('EKSTERN_LENKE_KLIKK', { lenketekst, ...(steg ? { steg } : {}) });
}
