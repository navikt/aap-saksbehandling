import { Oppgave } from 'lib/types/oppgaveTypes';
import useSWRInfinite from 'swr/infinite';
import { hentOppgaverClient } from 'lib/oppgaveClientApi';

const PAGE_SIZE = 25;

export function useOppgaveKø(
  aktivEnhet: Array<string>,
  visKunOppgaverSomBrukerErVeilederPå: boolean,
  aktivKøId?: number
): {
  antallOppgaver: number;
  oppgaver: Oppgave[];
  size: number;
  setSize: Function;
  isLoading: boolean;
  isValidating: boolean;
} {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.length === 0) return null;

    if (aktivKøId) {
      if (visKunOppgaverSomBrukerErVeilederPå) {
        return `api/oppgave/oppgaveliste/${aktivKøId}/${aktivEnhet}/veileder/?offset=${pageIndex * PAGE_SIZE}&limit=${PAGE_SIZE}`;
      }
      return `api/oppgave/oppgaveliste/${aktivKøId}/${aktivEnhet}/?offset=${pageIndex * PAGE_SIZE}&limit=${PAGE_SIZE}`;
    } else {
      return null;
    }
  };

  const {
    data: oppgaverValgtKø,
    size,
    setSize,
    isLoading,
    isValidating,
  } = useSWRInfinite(
    getKey,
    (key) => {
      const url = new URL(key, window.location.origin);
      const offset = Number(url.searchParams.get('offset'));
      const limit = Number(url.searchParams.get('limit'));

      return hentOppgaverClient(aktivKøId!, aktivEnhet, visKunOppgaverSomBrukerErVeilederPå, offset, limit);
    },
    { revalidateOnFocus: false }
  );

  const oppgaverFlatMap = oppgaverValgtKø
    ?.filter((res) => res.type === 'SUCCESS')
    .map((oppgaver) => {
      return {
        antallOppgaver: oppgaver.data.antallTotalt,
        oppgaver: oppgaver.data.oppgaver,
      };
    })
    .flat();

  const antallOppgaver = oppgaverFlatMap && oppgaverFlatMap[0].antallOppgaver;
  const oppgaver = oppgaverFlatMap?.map((oppgave) => oppgave.oppgaver).flat();

  return { antallOppgaver: antallOppgaver || 0, oppgaver: oppgaver || [], size, setSize, isLoading, isValidating };
}
