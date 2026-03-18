import { dagerTilMillisekunder } from 'lib/utils/time';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { ValuePair } from 'components/form/FormField';

const KEY = 'AKTIVE_ENHETER_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

interface LagredeValgteEnheter {
  value: ValuePair[];
  timestamp: number;
  user: string;
}

export function useLagreAktiveEnheter(): {
  lagreAktiveEnheter: (value: ValuePair[]) => void;
  hentLagredeAktiveEnheter: () => ValuePair[] | undefined;
} {
  const bruker = useInnloggetBruker();

  const lagreAktiveEnheter = (value: ValuePair[]) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ value, timestamp: new Date().getTime(), user: bruker.NAVident } as LagredeValgteEnheter)
    );
  };

  const hentLagredeAktiveEnheter = (): ValuePair[] | undefined => {
    try {
      const obj = JSON.parse(localStorage[KEY]) as LagredeValgteEnheter;

      if (obj.user === bruker.NAVident && new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
        return obj.value;
      } else {
        localStorage.removeItem(KEY);
        return undefined;
      }
    } catch {
      return undefined;
    }
  };

  return { lagreAktiveEnheter, hentLagredeAktiveEnheter };
}
