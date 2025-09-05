'use client';

import { dagerTilMillisekunder } from 'lib/utils/time';
import { useInnloggetBruker } from 'hooks/BrukerHook';

interface LagretAktivTab {
  tab: string;
  timestamp: number;
  user: string;
}

const KEY = 'AKTIV_OPPGAVE_TAB_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

export function useLagreAktivTab(): {
  lagreAktivTab: (tab: String) => void;
  hentAktivTab: () => String | undefined;
} {
  const bruker = useInnloggetBruker();
  const lagreAktivTab = (tab: String) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ tab, timestamp: new Date().getTime(), user: bruker.NAVident } as LagretAktivTab)
    );
  };

  const hentLagretAktivTab = (): String | undefined => {
    try {
      const obj = JSON.parse(localStorage[KEY]) as LagretAktivTab;

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
