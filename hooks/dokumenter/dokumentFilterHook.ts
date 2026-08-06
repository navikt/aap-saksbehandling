import { useInnloggetBruker } from 'hooks/BrukerHook';
import { dagerTilMillisekunder } from 'lib/utils/time';
import { useCallback } from 'react';

import { DokumentFilterFormFields } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';

const KEY = 'DOKUMENT_FILTER_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

interface LagretDokumentFilterData {
  data: DokumentFilterFormFields;
  timestamp: number;
  user: string;
}

export function useLagretDokumentFilter(): {
  lagreFilter: (data: DokumentFilterFormFields) => void;
  hentFilter: () => DokumentFilterFormFields | undefined;
} {
  const bruker = useInnloggetBruker();

  const lagreFilter = useCallback(
    (data: DokumentFilterFormFields) => {
      const lagretData: LagretDokumentFilterData = {
        data,
        timestamp: new Date().getTime(),
        user: bruker.NAVident,
      };
      localStorage.setItem(KEY, JSON.stringify(lagretData));
    },
    [bruker.NAVident]
  );

  const hentFilter = useCallback((): DokumentFilterFormFields | undefined => {
    try {
      const obj = JSON.parse(localStorage[KEY]) as LagretDokumentFilterData;
      if (obj.user === bruker.NAVident && new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
        return obj.data;
      } else {
        localStorage.removeItem(KEY);
        return undefined;
      }
    } catch {
      return undefined;
    }
  }, [bruker.NAVident]);

  return { lagreFilter, hentFilter };
}
