import { BrevGrunnlagBrev } from 'lib/types/types';
import { clientLoggUmamiEvent } from 'lib/utils/umami/client';
import type { UmamiSteg } from 'lib/utils/umami/steg';
import { useEffect, useState } from 'react';

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
 * Merk: starttidspunktet lagres i `useState` (ikke bare en ref) og oppdateres i en `useEffect`
 * når `visningsModus` endres. Første render setter riktig verdi direkte via
 * `useState(() => Date.now())`, så vi unngår `0`/stale-verdier på selve mount-rendringen. Fordi
 * vi bruker `setTidspunkt` (ikke bare `ref.current = ...`) i effekten, tvinges komponenten til å
 * re-rendre med det oppdaterte tidspunktet — i motsetning til en ren ref-oppdatering, som ikke
 * trigger noen re-rendring og dermed kunne la et etterfølgende `onSubmit` bruke et
 * foreldet/forrige starttidspunkt helt til en *annen*, urelatert re-rendring tilfeldigvis kom
 * innom. `Date.now()` kalles bevisst kun i effekten, aldri direkte i rendering-koden, for å
 * overholde React sin renhets-regel om at komponenter/hooks ikke skal kalle urene funksjoner
 * under rendering.
 */
export function useUmamiStartTidspunkt(visningsModus: string): number {
  const [tidspunkt, setTidspunkt] = useState(() => Date.now());

  useEffect(() => {
    setTidspunkt(Date.now());
  }, [visningsModus]);

  return tidspunkt;
}
