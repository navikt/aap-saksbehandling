'use client';

import { dagerTilMillisekunder } from 'lib/utils/time';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { Køtype } from 'lib/types/oppgaveTypes';

const AKTIV_OPPGAVE_KØ_KEY = 'AKTIV_OPPGAVE_KØ_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

export interface AktivKø {
  id: number;
  type?: Køtype;
  timestamp: number;
  user: string | undefined;
}

export function useLagreAktivKø(): {
  lagreAktivKø: (id: number, type: Køtype | undefined) => void;
  hentLagretAktivKø: () => AktivKø | undefined;
} {
  const bruker = useInnloggetBruker();

  const lagreAktivKø = (id: number, type: Køtype | undefined) => {
    const kø: AktivKø = {
      id,
      type,
      timestamp: new Date().getTime(),
      user: bruker.NAVident,
    };
    localStorage.setItem(AKTIV_OPPGAVE_KØ_KEY, JSON.stringify(kø));
  };

  const hentLagretAktivKø = (): AktivKø | undefined => {
    try {
      const aktivKø: AktivKø = JSON.parse(localStorage[AKTIV_OPPGAVE_KØ_KEY]);
      if (aktivKø.user === bruker.NAVident && new Date().getTime() < aktivKø.timestamp + MAKS_LEVETID) {
        return aktivKø;
      } else {
        localStorage.removeItem(AKTIV_OPPGAVE_KØ_KEY);
        return undefined;
      }
    } catch {
      return undefined;
    }
  };

  return { lagreAktivKø, hentLagretAktivKø: hentLagretAktivKø };
}
