import { MineOppgaverQueryParams, Oppgave, OppgavelisteRequest, Paging } from 'lib/types/oppgaveTypes';
import useSWRInfinite from 'swr/infinite';
import { hentMineOppgaverClient, hentOppgaverClient } from 'lib/oppgaveClientApi';
import useSWR from 'swr';
import { isError, isSuccess } from 'lib/utils/api';
import { SortState } from '@navikt/ds-react';
import {
  mapSortStateDirectionTilQueryParamEnum,
  mapSortStateTilOppgaveSortering,
  mineOppgaverQueryParams,
} from 'lib/utils/request';
import { PathsMineOppgaverGetParametersQuerySortby } from '@navikt/aap-oppgave-typescript-types';
import { ScopedBackendSortState } from 'hooks/oppgave/BackendSorteringHook';

const PAGE_SIZE = 50;

type UseOppgaverOptions = {
  aktiveEnheter: string[];
  visKunOppgaverSomBrukerErVeilederPå?: boolean;
  type: 'LEDIGE_OPPGAVER' | 'ALLE_OPPGAVER';
  aktivKøId: number;
  kunLedigeOppgaver?: boolean;
  utvidetFilter?: OppgavelisteRequest['utvidetFilter'];
  sortering?: SortState;
};

function lagUrlSuffix(filter: OppgavelisteRequest['utvidetFilter']): string {
  const params = new URLSearchParams();

  if (filter?.avklaringsbehovKoder?.length) {
    filter.avklaringsbehovKoder.forEach((kode) => params.append('avklaringsbehovKoder', kode));
  }

  if (filter?.behandlingstyper?.length) {
    filter.behandlingstyper.forEach((bt) => params.append('behandlingstyper', bt));
  }

  if (filter?.fom) {
    params.append('fom', filter.fom);
  }

  if (filter?.tom) {
    params.append('tom', filter.tom);
  }

  if (filter?.returStatuser?.length) {
    filter.returStatuser.forEach((status) => params.append('returStatuser', status));
  }

  if (filter?.påVent) {
    params.append('påVent', filter.påVent.toString());
  }

  if (filter?.markertHaster) {
    params.append('markertHaster', filter.markertHaster.toString());
  }

  if (filter?.årsaker?.length) {
    filter.årsaker.forEach((årsak) => params.append('årsaker', årsak));
  }

  if (filter?.ventefristUtløpt) {
    params.append('ventefristUtløpt', filter.ventefristUtløpt.toString());
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export function useOppgaverNy({
  aktiveEnheter,
  visKunOppgaverSomBrukerErVeilederPå = false,
  aktivKøId,
  kunLedigeOppgaver = true,
  type,
  utvidetFilter,
  sortering,
}: UseOppgaverOptions): {
  kanLasteInnFlereOppgaver: boolean;
  antallOppgaver: number;
  oppgaver: Oppgave[];
  size: number;
  setSize: (size: number | ((_size: number) => number)) => void;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<unknown>;
} {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.length === 0) return null;
    if (!aktivKøId) return null;

    const base = `api/oppgave/oppgaveliste/${aktivKøId}/${aktiveEnheter.join(',')}`;
    const suffix = visKunOppgaverSomBrukerErVeilederPå ? '/veileder/' : '/';
    const typeSuffix = `/${type}`;
    const utvidetFilterSuffix = lagUrlSuffix(utvidetFilter);
    const paging = utvidetFilterSuffix.length > 0 ? `&side=${pageIndex}` : `?side=${pageIndex}`;
    const sortSuffix = sortering?.orderBy ? `&sortby=${sortering.orderBy}&direction${sortering.direction}` : '';
    const url = `${base}${suffix}${typeSuffix}${utvidetFilterSuffix}${paging}${sortSuffix}`;

    return url;
  };

  const {
    data: oppgaverValgtKø,
    mutate,
    size,
    setSize,
    isLoading,
    isValidating,
  } = useSWRInfinite(
    getKey,
    (key) => {
      const url = new URL(key, window.location.origin);
      const side = Number(url.searchParams.get('side'));

      const paging: Paging = {
        antallPerSide: PAGE_SIZE,
        side: side + 1,
      };
      const endeligsortering = sortering ? mapSortStateTilOppgaveSortering(sortering) : undefined;

      const payload: OppgavelisteRequest = {
        filterId: aktivKøId!,
        enheter: aktiveEnheter,
        kunLedigeOppgaver: kunLedigeOppgaver,
        veileder: visKunOppgaverSomBrukerErVeilederPå,
        paging: paging,
        utvidetFilter: utvidetFilter,
        sortering: endeligsortering,
      };

      return hentOppgaverClient(payload);
    },
    { revalidateOnFocus: true, refreshInterval: 10000, revalidateAll: true, persistSize: true }
  );

  const oppgaverFlatMap =
    oppgaverValgtKø
      ?.filter((res) => isSuccess(res))
      .map((res) => ({
        oppgaver: res.data.oppgaver,
        antallGjenståendeOppgaver: res.data.antallGjenstaaende,
      })) ?? [];

  const antallOppgaver = oppgaverValgtKø?.filter((res) => isSuccess(res))[0].data.antallTotalt ?? 0;

  const oppgaver = oppgaverFlatMap.flatMap(({ oppgaver }) => oppgaver);
  const sisteKallMotOppgave = oppgaverFlatMap.at(-1);
  const kanLasteInnFlereOppgaver = (sisteKallMotOppgave?.antallGjenståendeOppgaver ?? 0) > 0;

  return {
    antallOppgaver,
    oppgaver: oppgaver || [],
    size,
    setSize,
    isLoading,
    isValidating,
    kanLasteInnFlereOppgaver,
    mutate,
  };
}

export function useLedigeOppgaverNy(
  aktiveEnheter: string[],
  visKunOppgaverSomBrukerErVeilederPå: boolean,
  aktivKøId: number,
  utvidetFilter?: OppgavelisteRequest['utvidetFilter'],
  sortering?: SortState
) {
  return useOppgaverNy({
    aktiveEnheter,
    visKunOppgaverSomBrukerErVeilederPå,
    type: 'LEDIGE_OPPGAVER',
    aktivKøId,
    utvidetFilter,
    sortering,
  });
}

export function useAlleOppgaverForEnhetNy(
  aktiveEnheter: string[],
  aktivKøId: number,
  utvidetFilter?: OppgavelisteRequest['utvidetFilter'],
  sortering?: SortState
) {
  return useOppgaverNy({
    aktiveEnheter,
    aktivKøId,
    visKunOppgaverSomBrukerErVeilederPå: false,
    kunLedigeOppgaver: false,
    type: 'ALLE_OPPGAVER',
    utvidetFilter: utvidetFilter,
    sortering,
  });
}

export const useMineOppgaverNy = (sortering?: ScopedBackendSortState<PathsMineOppgaverGetParametersQuerySortby>) => {
  const sortParams: MineOppgaverQueryParams = {
    sortby: sortering?.orderBy,
    sortorder: sortering?.direction ? mapSortStateDirectionTilQueryParamEnum(sortering.direction) : undefined,
  };
  const query = sortParams ? mineOppgaverQueryParams(sortParams) : '';
  const { data, mutate, isLoading } = useSWR(`api/mine-oppgaver?${query}`, () => hentMineOppgaverClient(sortering));
  const oppgaver = isSuccess(data) ? data?.data?.oppgaver?.flat() : [];

  return { oppgaver, mutate, isLoading, error: isError(data) ? data.apiException.message : undefined };
};
