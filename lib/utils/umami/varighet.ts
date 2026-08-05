import { BrevGrunnlagBrev } from 'lib/types/types';
import { clientLoggUmamiEvent } from 'lib/utils/umami/client';
import type { UmamiSteg } from 'lib/utils/umami/steg';
import { useEffect, useRef } from 'react';

/**
 * `STEG_<KONTEKST>_VARIGHET` — engangs tidsmåling for hvor lenge en saksbehandler bruker på et
 * gitt behandlingssteg. `STEG_`-prefikset er en bevisst kategori-markør som lar alle
 * steg-varighetseventer filtreres/grupperes samlet i Umami.
 */
export type UmamiStegVarighetTag = `STEG_${UmamiSteg}_VARIGHET`;

export interface UmamiVarighetEvent {
  type: 'VARIGHET';
  name: UmamiStegVarighetTag;
  varighet_sekunder: number;
  brevtype?: string;
}

export function loggUmamiBrevVarighet(
  hendelse: UmamiStegVarighetTag,
  start: number,
  stop: number,
  brevtype: BrevGrunnlagBrev['brevtype']
) {
  clientLoggUmamiEvent({
    type: 'VARIGHET',
    name: hendelse,
    varighet_sekunder: Math.floor((stop - start) / 1000),
    brevtype,
  });
}

export function loggUmamiVarighet(hendelse: UmamiStegVarighetTag, start: number, stop: number) {
  clientLoggUmamiEvent({
    type: 'VARIGHET',
    name: hendelse,
    varighet_sekunder: Math.floor((stop - start) / 1000),
  });
}

/**
 * Tidspunktet en visning ble montert/byttet til, brukt som startpunkt for `loggUmamiVarighet`/
 * `loggUmamiBrevVarighet`.
 */
export function useUmamiStartTidspunkt(visningsModus: string): number {
  const umamiStartTidspunkt = useRef<number | null>(null);

  useEffect(() => {
    umamiStartTidspunkt.current = Date.now();
  }, [visningsModus]);

  return umamiStartTidspunkt.current ?? 0;
}
