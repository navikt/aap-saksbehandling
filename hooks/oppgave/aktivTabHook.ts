'use client';

import { useInnloggetBruker } from 'hooks/BrukerHook';
import { dagerTilMillisekunder } from 'lib/utils/time';

interface LagretAktivTab<E> {
  tab: E;
  timestamp: number;
  user: string;
}

const KEY = 'AKTIV_OPPGAVE_TAB_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

export function useLagreAktivTab<E>(): {
  lagreAktivTab: (tab: E) => void;
  hentAktivTab: () => E | undefined;
} {
  const bruker = useInnloggetBruker();
  const lagreAktivTab = (tab: E) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ tab, timestamp: new Date().getTime(), user: bruker.NAVident } satisfies LagretAktivTab<E>)
    );
  };

  const hentLagretAktivTab = (): E | undefined => {
    try {
      const obj = JSON.parse(localStorage[KEY]) as LagretAktivTab<E>;

      if (obj.user === bruker.NAVident && new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
        return obj.tab;
      } else {
        localStorage.removeItem(KEY);
        return undefined;
      }
    } catch {
      return undefined;
    }
  };

  return { lagreAktivTab, hentAktivTab: hentLagretAktivTab };
}
