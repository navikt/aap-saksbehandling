import { dagerTilMillisekunder } from "lib/utils/time";

const KEY = 'AKTIV_ENHET_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

interface LagretValgtEnhet {
  value: string;
  timestamp: number;
}

export const lagreAktivEnhet = (value: string) => {
  localStorage.setItem(KEY, JSON.stringify({ value, timestamp: new Date().getTime() } as LagretValgtEnhet));
};

export const hentLagretAktivEnhet = (): string | undefined => {
  try {
    const obj = JSON.parse(localStorage[KEY]) as LagretValgtEnhet;

    if (new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
      return obj.value
    } else {
      localStorage.removeItem(KEY);
      return undefined;
    }
  } catch {
    return undefined;
  }
};
