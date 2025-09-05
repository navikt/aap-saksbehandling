import { dagerTilMillisekunder } from 'lib/utils/time';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { ComboOption } from 'components/produksjonsstyring/minenhet/MineEnheter';

const KEY = 'AKTIVE_ENHETER_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

interface LagredeValgteEnheter {
  value: ComboOption[];
  timestamp: number;
  user: string;
}

export function useLagreAktiveEnheter(): {
  lagreAktiveEnheter: (value: ComboOption[]) => void;
  hentLagredeAktiveEnheter: () => ComboOption[] | undefined;
} {
  const bruker = useInnloggetBruker();

  const lagreAktiveEnheter = (value: ComboOption[]) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ value, timestamp: new Date().getTime(), user: bruker.NAVident } as LagredeValgteEnheter)
    );
  };

  const hentLagredeAktiveEnheter = (): ComboOption[] | undefined => {
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
