'use client';

import { dagerTilMillisekunder } from 'lib/utils/time';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';

interface LagretAktivUtvidetFilterData {
  feltData: FormFieldsFilter;
  timestamp: number;
  user: string;
}

const KEY = 'AKTIV_UTVIDET_FILTER_DATA_KEY';
const MAKS_LEVETID = dagerTilMillisekunder(1);

export function fjernLagretUtvidetFilter() {
  localStorage.removeItem(KEY);
}

export function useLagreAktivUtvidetFilter(): {
  lagreAktivUtvidetFilter: (feltData: FormFieldsFilter) => void;
  hentAktivUtvidetFilter: () => FormFieldsFilter | undefined;
} {
  const bruker = useInnloggetBruker();
  const lagreAktivUtvidetFilter = (filterData: FormFieldsFilter) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        feltData: filterData,
        timestamp: new Date().getTime(),
        user: bruker.NAVident,
      } as LagretAktivUtvidetFilterData)
    );
  };

  const hentLagretAktivUtvidetFilter = (): FormFieldsFilter | undefined => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return undefined;

      const obj = JSON.parse(raw) as LagretAktivUtvidetFilterData;
      if (obj.user === bruker.NAVident && new Date().getTime() < obj.timestamp + MAKS_LEVETID) {
        return {
          ...obj.feltData,
          behandlingOpprettetFom: obj.feltData.behandlingOpprettetFom
            ? new Date(obj.feltData.behandlingOpprettetFom)
            : undefined,
          behandlingOpprettetTom: obj.feltData.behandlingOpprettetTom
            ? new Date(obj.feltData.behandlingOpprettetTom)
            : undefined,
        };
      } else {
        localStorage.removeItem(KEY);
        return undefined;
      }
    } catch {
      return undefined;
    }
  };

  return { lagreAktivUtvidetFilter, hentAktivUtvidetFilter: hentLagretAktivUtvidetFilter };
}
