import { Oppgave, Paging } from 'lib/types/oppgaveTypes';
import useSWRInfinite from 'swr/infinite';
import { hentOppgaverClient } from 'lib/oppgaveClientApi';

const PAGE_SIZE = 25;

export function useLedigeOppgaver(
  aktivEnhet: Array<string>,
  visKunOppgaverSomBrukerErVeilederPå: boolean,
  aktivKøId?: number
): {
  kanLasteInnFlereOppgaver: boolean;
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

      console.log('size', size);
      const paging: Paging = {
        antallPerSide: PAGE_SIZE,
        side: side + 1,
      };

      return hentOppgaverClient(aktivKøId!, aktivEnhet, visKunOppgaverSomBrukerErVeilederPå, paging);
    },
    { revalidateOnFocus: false }
  );

  const oppgaverFlatMap = oppgaverValgtKø
    ?.filter((res) => res.type === 'SUCCESS')
    .map((oppgaver) => {
      return {
        antallOppgaver: oppgaver.data.antallTotalt,
        oppgaver: oppgaver.data.oppgaver,
        antallGjenståendeOppgaver: oppgaver.data.antallGjenstaaende,
      };
    })
    .flat();

  const antallOppgaver = oppgaverFlatMap?.reduce((acc, oppgave) => acc + oppgave.antallOppgaver, 0) || 0;
  const oppgaver = oppgaverFlatMap?.map((oppgave) => oppgave.oppgaver).flat();
  // TODO Denne kommer
  // const sisteKallMotOppgave = oppgaverFlatMap?.at(-1);
  // const kanLasteInnFlereOppgaver = sisteKallMotOppgave !== null && sisteKallMotOppgave?.antallGjenståendeOppgaver! > 0;
  const kanLasteInnFlereOppgaver = true;
  return { antallOppgaver, oppgaver: oppgaver || [], size, setSize, isLoading, isValidating, kanLasteInnFlereOppgaver };
}
