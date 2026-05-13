import {
  MineOppgaverQueryParams,
  Oppgave,
  OppgavelisteRequest,
  OppgavelisteResponse,
  Paging,
} from 'lib/types/oppgaveTypes';
import useSWRInfinite from 'swr/infinite';
import { hentMineOppgaverClient, hentOppgaverClient } from 'lib/oppgaveClientApi';
import useSWR from 'swr';
import { FetchResponse, isError, isSuccess } from 'lib/utils/api';
import {
  mapSortStateDirectionTilQueryParamEnum,
  mapSortStateTilOppgaveSortering,
  mineOppgaverQueryParams,
} from 'lib/utils/request';
import {
  NoNavAapOppgaveListeOppgaveSorteringSortBy,
  PathsMineOppgaverGetParametersQuerySortby,
} from '@navikt/aap-oppgave-typescript-types';
import { ScopedBackendSortState } from 'hooks/oppgave/BackendSorteringHook';

const PAGE_SIZE = 50;

type UseOppgaverOptions = {
  aktiveEnheter: string[];
  visKunOppgaverSomBrukerErVeilederPå?: boolean;
  type: 'LEDIGE_OPPGAVER' | 'ALLE_OPPGAVER';
  aktivKøId: number;
  kunLedigeOppgaver?: boolean;
  utvidetFilter?: OppgavelisteRequest['utvidetFilter'];
  sortering?: ScopedBackendSortState<NoNavAapOppgaveListeOppgaveSorteringSortBy>;
  hastemarkeringerFørst: boolean;
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

  if (filter?.saksbehandlere?.length) {
    filter.saksbehandlere.forEach((ident) => params.append('saksbehandlere', ident));
  }

  if (filter?.beløpMerEnn != null) {
    params.append('beløpMerEnn', filter.beløpMerEnn.toString());
  }

  if (filter?.beløpMindreEnn != null) {
    params.append('beløpMindreEnn', filter.beløpMindreEnn.toString());
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export function useOppgaver({
  aktiveEnheter,
  visKunOppgaverSomBrukerErVeilederPå = false,
  aktivKøId,
  kunLedigeOppgaver = true,
  type,
  utvidetFilter,
  sortering,
  hastemarkeringerFørst,
}: UseOppgaverOptions): {
  kanLasteInnFlereOppgaver: boolean;
  antallOppgaver: number;
  oppgaver: Oppgave[];
  size: number;
  setSize: (size: number | ((_size: number) => number)) => void;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<unknown>;
  behandlingstyperFilterFraBackend: string[];
} {
  const getKey = (pageIndex: number, previousPageData: FetchResponse<OppgavelisteResponse>) => {
    if (isSuccess(previousPageData) && previousPageData.data.antallGjenstaaende === 0) return null;
    if (!aktivKøId) return null;

    const base = `api/oppgave/oppgaveliste/${aktivKøId}/${aktiveEnheter.join(',')}`;
    const suffix = visKunOppgaverSomBrukerErVeilederPå ? '/veileder/' : '/';
    const typeSuffix = `/${type}`;
    const utvidetFilterSuffix = lagUrlSuffix(utvidetFilter);
    const paging = utvidetFilterSuffix.length > 0 ? `&side=${pageIndex}` : `?side=${pageIndex}`;
    const hasteoppgaveSuffix = `&hasteoppgaver=${hastemarkeringerFørst}`;
    const sortSuffix = sortering?.orderBy ? `&sortby=${sortering.orderBy}&direction=${sortering.direction}` : '';

    return `${base}${suffix}${typeSuffix}${utvidetFilterSuffix}${paging}${sortSuffix}${hasteoppgaveSuffix}`;
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
        hastemarkeringerFørst: hastemarkeringerFørst,
      };

      return hentOppgaverClient(payload);
    },
    { revalidateOnFocus: true, revalidateFirstPage: false, persistSize: true }
  );

  const oppgaveListe = oppgaverValgtKø?.filter(isSuccess) ?? [];
  const førsteListeIOppgaveListen = oppgaveListe[0];

  const oppgaverFlatMap = oppgaveListe.map((res) => ({
    oppgaver: res.data.oppgaver,
    antallGjenståendeOppgaver: res.data.antallGjenstaaende,
  }));

  const antallOppgaver = førsteListeIOppgaveListen?.data?.antallTotalt ?? 0;
  const behandlingstyperFilterFraBackend = førsteListeIOppgaveListen?.data?.sattFilterBehandlingstyper ?? [];

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
    behandlingstyperFilterFraBackend,
  };
}

export function useLedigeOppgaver(
  aktiveEnheter: string[],
  visKunOppgaverSomBrukerErVeilederPå: boolean,
  aktivKøId: number,
  hastemarkeringerFørst: boolean,
  utvidetFilter?: OppgavelisteRequest['utvidetFilter'],
  sortering?: ScopedBackendSortState<NoNavAapOppgaveListeOppgaveSorteringSortBy>
) {
  return useOppgaver({
    aktiveEnheter,
    visKunOppgaverSomBrukerErVeilederPå,
    type: 'LEDIGE_OPPGAVER',
    aktivKøId,
    utvidetFilter,
    sortering,
    hastemarkeringerFørst,
  });
}

export function useAlleOppgaverForEnhet(
  aktiveEnheter: string[],
  aktivKøId: number,
  hastemarkeringerFørst: boolean,
  utvidetFilter?: OppgavelisteRequest['utvidetFilter'],
  sortering?: ScopedBackendSortState<NoNavAapOppgaveListeOppgaveSorteringSortBy>
) {
  return useOppgaver({
    aktiveEnheter,
    aktivKøId,
    visKunOppgaverSomBrukerErVeilederPå: false,
    kunLedigeOppgaver: false,
    type: 'ALLE_OPPGAVER',
    utvidetFilter: utvidetFilter,
    sortering,
    hastemarkeringerFørst,
  });
}

export const useMineOppgaver = (sortering?: ScopedBackendSortState<PathsMineOppgaverGetParametersQuerySortby>) => {
  const sortParams: MineOppgaverQueryParams = {
    sortby: sortering?.orderBy,
    sortorder: sortering?.direction ? mapSortStateDirectionTilQueryParamEnum(sortering.direction) : undefined,
  };
  const query = mineOppgaverQueryParams(sortParams);
  const { data, mutate, isLoading } = useSWR(`api/mine-oppgaver?${query}`, () => hentMineOppgaverClient(sortering));
  const oppgaver = isSuccess(data) ? data?.data?.oppgaver?.flat() : [];

  return { oppgaver, mutate, isLoading, error: isError(data) ? data.apiException.message : undefined };
};
