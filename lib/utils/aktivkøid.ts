import { dagerTilMillisekunder } from "lib/utils/time";

const KEY = 'AKTIV_KØ_ID_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

interface LagretAktivKøId {
  id: number;
  timestamp: number;
}

export const lagreAktivKøId = (id: number) => {
  localStorage.setItem(KEY, JSON.stringify({ id, timestamp: new Date().getTime() } as LagretAktivKøId));
};

export const hentLagretAktivKøId = (): number | undefined => {
  try {
    const obj = JSON.parse(localStorage[KEY]) as LagretAktivKøId;
    if (new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
      return isNaN(obj.id) ? undefined : Number(obj.id);
    } else {
      localStorage.removeItem(KEY);
      return undefined;
    }
  } catch {
    return undefined;
  }
};
