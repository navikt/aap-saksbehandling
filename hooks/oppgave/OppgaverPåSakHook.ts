import useSWR from 'swr';
import { isSuccess } from 'lib/utils/api';
import { hentOppgaveClient } from 'lib/oppgaveClientApi';

export function useHentOppgaverForBehandlinger(behandlingsreferanser: string[]): Map<string, OppgaveInfo> {
  const { data: oppgaveData } = useSWR(
    `oppgave-reservasjoner-${behandlingsreferanser.join(',')}`,
    () => utledOppgaveInfo(behandlingsreferanser),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  return oppgaveData ?? new Map<string, OppgaveInfo>();
}

export interface OppgaveInfo {
  reservertAvNavn: string | null;
  reservertAvIdent: string | null;
  id: number | null;
  versjon: number | null;
  feilmelding?: string;
}

async function utledOppgaveInfo(behandlingsreferanser: string[]): Promise<Map<string, OppgaveInfo>> {
  const oppgaveInfoMap = new Map<string, OppgaveInfo>();

  const oppgaver = await Promise.all(
    behandlingsreferanser.map(async (referanse) => {
      const oppgave = await hentOppgaveClient(referanse);
      return [referanse, oppgave] as const;
    })
  );

  oppgaver.forEach(([referanse, oppgave]) => {
    if (isSuccess(oppgave)) {
      oppgaveInfoMap.set(referanse, {
        reservertAvNavn: oppgave.data.reservertAvNavn ?? null,
        reservertAvIdent: oppgave.data.reservertAv ?? null,
        id: oppgave.data.id ?? null,
        versjon: oppgave.data.versjon ?? null,
      });
    } else {
      // trenger ikke krasje hvis oppgave ikke kan hentes
      oppgaveInfoMap.set(referanse, {
        reservertAvNavn: null,
        reservertAvIdent: null,
        id: null,
        versjon: null,
        feilmelding: 'Kunne ikke hente tildeling.',
      });
    }
  });
  return oppgaveInfoMap;
}
