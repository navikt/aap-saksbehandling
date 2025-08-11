import { Oppgave, OppgavelisteRequest, Paging } from 'lib/types/oppgaveTypes';
import useSWRInfinite from 'swr/infinite';
import { hentMineOppgaverClient, hentOppgaverClient } from 'lib/oppgaveClientApi';
import useSWR from 'swr';
import { isSuccess } from 'lib/utils/api';

const PAGE_SIZE = 25;

type UseOppgaverOptions = {
  aktivEnhet: string[];
  visKunOppgaverSomBrukerErVeilederPå?: boolean;
  type: 'LEDIGE_OPPGAVER' | 'ALLE_OPPGAVER';
  aktivKøId?: number;
  kunLedigeOppgaver?: boolean;
  utvidetFilter?: OppgavelisteRequest['utvidetFilter'];
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

  if (filter?.årsaker?.length) {
    filter.årsaker.forEach((årsak) => params.append('årsaker', årsak));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export function useOppgaver({
  aktivEnhet,
  visKunOppgaverSomBrukerErVeilederPå = false,
  aktivKøId,
  kunLedigeOppgaver = true,
  type,
  utvidetFilter,
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

    const base = `api/oppgave/oppgaveliste/${aktivKøId}/${aktivEnhet.join(',')}`;
    const suffix = visKunOppgaverSomBrukerErVeilederPå ? '/veileder/' : '/';
    const typeSuffix = `/${type}`;
    const utvidetFilterSuffix = lagUrlSuffix(utvidetFilter);
    const paging = utvidetFilterSuffix.length > 0 ? `&side=${pageIndex}` : `?side=${pageIndex}`;
    return `${base}${suffix}${typeSuffix}${utvidetFilterSuffix}${paging}`;
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

      const payload: OppgavelisteRequest = {
        filterId: aktivKøId!,
        enheter: aktivEnhet,
        kunLedigeOppgaver: kunLedigeOppgaver,
        veileder: visKunOppgaverSomBrukerErVeilederPå,
        paging: paging,
        utvidetFilter: utvidetFilter,
      };

      return hentOppgaverClient(payload);
    },
    { revalidateOnFocus: false }
  );

  const oppgaverFlatMap =
    oppgaverValgtKø
      ?.filter((res) => res.type === 'SUCCESS')
      .map((res) => ({
        antallOppgaver: res.data.antallTotalt,
        oppgaver: res.data.oppgaver,
        antallGjenståendeOppgaver: res.data.antallGjenstaaende,
      })) ?? [];

  const antallOppgaver = oppgaverFlatMap.reduce((acc, { antallOppgaver }) => acc + antallOppgaver, 0);
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

export function useLedigeOppgaver(
  aktivEnhet: string[],
  visKunOppgaverSomBrukerErVeilederPå: boolean,
  aktivKøId?: number,
  utvidetFilter?: OppgavelisteRequest['utvidetFilter']
) {
  return useOppgaver({
    aktivEnhet,
    visKunOppgaverSomBrukerErVeilederPå,
    type: 'LEDIGE_OPPGAVER',
    aktivKøId,
    utvidetFilter,
  });
}

export function useAlleOppgaverForEnhet(
  aktivEnhet: string[],
  aktivKøId?: number,
  utvidetFilter?: OppgavelisteRequest['utvidetFilter']
) {
  return useOppgaver({
    aktivEnhet,
    aktivKøId,
    visKunOppgaverSomBrukerErVeilederPå: false,
    kunLedigeOppgaver: false,
    type: 'ALLE_OPPGAVER',
    utvidetFilter: utvidetFilter,
  });
}

export const useMineOppgaver = () => {
  const { data, mutate, isLoading } = useSWR('api/mine-oppgaver', hentMineOppgaverClient);
  const oppgaver = isSuccess(data) ? data?.data?.oppgaver?.flat() : [];

  return { oppgaver, mutate, isLoading, error: data?.type === 'ERROR' ? data.apiException.message : undefined };
};
