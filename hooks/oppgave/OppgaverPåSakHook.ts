import { hentOppgaverPåSakClient } from 'lib/oppgaveClientApi';
import { OppgaverPåSak } from 'lib/types/oppgaveTypes';
import { isSuccess } from 'lib/utils/api';
import useSWR from 'swr';

export function useHentOppgaverForSak(saksnummer: string): OppgaverPåSak {
  const { data: oppgaveData } = useSWR(
    `oppgave-reservasjoner-${saksnummer}`,
    () => hentOppgaverPåSakClient(saksnummer),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );
  if (!isSuccess(oppgaveData)) {
    return {
      oppgaver: [],
    };
  }

  return oppgaveData.data;
}
