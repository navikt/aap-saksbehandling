import { dagerTilMillisekunder } from 'lib/utils/time';
import { useNavIdent } from 'hooks/brukerHook';

const KEY = 'AKTIV_ENHET_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

interface LagretValgtEnhet {
  value: string;
  timestamp: number;
  user: string;
}

export function useLagreAktivEnhet(): {
  lagreAktivEnhet: (value: string) => void;
  hentLagretAktivEnhet: () => string | undefined;
} {
  const navIdent = useNavIdent();

  const lagreAktivEnhet = (value: string) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ value, timestamp: new Date().getTime(), user: navIdent } as LagretValgtEnhet)
    );
  };

  const hentLagretAktivEnhet = (): string | undefined => {
    try {
      const obj = JSON.parse(localStorage[KEY]) as LagretValgtEnhet;

      if (obj.user === navIdent && new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
        return obj.value;
      } else {
        localStorage.removeItem(KEY);
        return undefined;
      }
    } catch {
      return undefined;
    }
  };

  return { lagreAktivEnhet, hentLagretAktivEnhet };
}
