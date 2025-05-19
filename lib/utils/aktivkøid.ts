'use client';

import { dagerTilMillisekunder } from 'lib/utils/time';
import { useNavIdent } from 'hooks/brukerHook';

const KEY = 'AKTIV_KØ_ID_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

interface LagretAktivKøId {
  id: number;
  timestamp: number;
  user: string;
}

export function useLagreAktivKøId(): {
  lagreAktivKøId: (id: number) => void;
  hentLagretAktivKøId: () => number | undefined;
} {
  const navIdent = useNavIdent();

  const lagreAktivKøId = (id: number) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        id,
        timestamp: new Date().getTime(),
        user: navIdent,
      } as LagretAktivKøId)
    );
  };

  const hentLagretAktivKøId = (): number | undefined => {
    try {
      const obj = JSON.parse(localStorage[KEY]) as LagretAktivKøId;
      if (obj.user === navIdent && new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
        return isNaN(obj.id) ? undefined : Number(obj.id);
      } else {
        localStorage.removeItem(KEY);
        return undefined;
      }
    } catch {
      return undefined;
    }
  };

  return { lagreAktivKøId, hentLagretAktivKøId };
}
