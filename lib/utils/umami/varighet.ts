import { BrevGrunnlagBrev } from 'lib/types/types';
import { clientLoggUmamiEvent } from 'lib/utils/umami/client';
import type { UmamiSteg } from 'lib/utils/umami/steg';
import { useRef, useState } from 'react';

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
 *
 * Merk: dette settes bevisst under selve renderingen (ikke i en `useEffect`). Hadde vi satt
 * tidspunktet i en effekt ville verdien blitt lest ett render-steg for sent — første gang
 * komponenten rendres ville `visningsModus`-bytter blitt logget med forrige/manglende
 * starttidspunkt (helt ned til 0) helt til en *annen*, urelatert re-rendring tilfeldigvis
 * oppdaterte den. Ved å sammenligne mot forrige `visningsModus` under rendering og kalle
 * `setState` med en gang, tvinger vi React til å re-rendre med riktig verdi før noe committes.
 */
export function useUmamiStartTidspunkt(visningsModus: string): number {
  const [tidspunkt, setTidspunkt] = useState(() => Date.now());
  const forrigeVisningsModus = useRef(visningsModus);

  if (forrigeVisningsModus.current !== visningsModus) {
    forrigeVisningsModus.current = visningsModus;
    setTidspunkt(Date.now());
  }

  return tidspunkt;
}
