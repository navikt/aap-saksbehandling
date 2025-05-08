import { Oppgave, Paging } from 'lib/types/oppgaveTypes';
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
        return `api/oppgave/oppgaveliste/${aktivKøId}/${aktivEnhet}/veileder/?side=${pageIndex}`;
      }
      return `api/oppgave/oppgaveliste/${aktivKøId}/${aktivEnhet}/?side=${pageIndex}`;
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
      const side = Number(url.searchParams.get('side'));

      const paging: Paging = {
        antallPerSide: PAGE_SIZE,
        side: side + 1,
      };

      return hentOppgaverClient(aktivKøId!, aktivEnhet, visKunOppgaverSomBrukerErVeilederPå, 100, paging);
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

  const antallOppgaver = oppgaverFlatMap?.reduce((acc, oppgave) => acc + oppgave.antallOppgaver, 0) || 0;
  const oppgaver = oppgaverFlatMap?.map((oppgave) => oppgave.oppgaver).flat();

  return { antallOppgaver, oppgaver: oppgaver || [], size, setSize, isLoading, isValidating };
}
