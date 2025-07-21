import { Oppgave, Paging } from 'lib/types/oppgaveTypes';
import useSWRInfinite from 'swr/infinite';
import { hentOppgaverClient } from 'lib/oppgaveClientApi';

const PAGE_SIZE = 25;

type UseOppgaverOptions = {
  aktivEnhet: string[];
  visKunOppgaverSomBrukerErVeilederPå?: boolean;
  type: 'LEDIGE_OPPGAVER' | 'ALLE_OPPGAVER';
  aktivKøId?: number;
  kunLedigeOppgaver?: boolean;
};

export function useOppgaver({
  aktivEnhet,
  visKunOppgaverSomBrukerErVeilederPå = false,
  aktivKøId,
  kunLedigeOppgaver = true,
  type,
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
    return `${base}${suffix}${typeSuffix}?side=${pageIndex}`;
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

      return hentOppgaverClient(aktivKøId!, aktivEnhet, visKunOppgaverSomBrukerErVeilederPå, paging, kunLedigeOppgaver);
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
  aktivKøId?: number
) {
  return useOppgaver({
    aktivEnhet,
    visKunOppgaverSomBrukerErVeilederPå,
    type: 'LEDIGE_OPPGAVER',
    aktivKøId,
  });
}

export function useAlleOppgaverForEnhet(aktivEnhet: string[], aktivKøId?: number) {
  return useOppgaver({
    aktivEnhet,
    aktivKøId,
    visKunOppgaverSomBrukerErVeilederPå: false,
    kunLedigeOppgaver: false,
    type: 'ALLE_OPPGAVER',
  });
}
