import useSWR from 'swr';
import { isSuccess } from 'lib/utils/api';
import { hentOppgaveClient } from 'lib/oppgaveClientApi';

export function useHentOppgaverForBehandlinger(behandlingsreferanser: string[]): Map<string, OppgaveInfo | null> {
  const { data: oppgaveData } = useSWR(
    `oppgave-reservasjoner-${behandlingsreferanser.join(',')}`,
    () => utledOppgaveInfo(behandlingsreferanser),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  return oppgaveData ?? new Map<string, OppgaveInfo | null>();
}

export interface OppgaveInfo {
  reservertAv: string | null;
  id: number | null;
  versjon: number | null;
  feilmelding?: string;
}

async function utledOppgaveInfo(behandlingsreferanser: string[]): Promise<Map<string, OppgaveInfo | null>> {
  const oppgaveInfoMap = new Map<string, OppgaveInfo | null>();

  const oppgaver = await Promise.all(behandlingsreferanser.map((referanse) => hentOppgaveClient(referanse)));
  oppgaver.forEach((oppgave, index) => {
    if (isSuccess(oppgave)) {
      oppgaveInfoMap.set(
        behandlingsreferanser[index],
        {
          // Navn hvis det finnes, ident som fallback
          reservertAv: oppgave.data.reservertAvNavn ?? oppgave.data.reservertAv ?? null,
          id: oppgave.data.id ?? null,
          versjon: oppgave.data.versjon ?? null,
        }
      );
    } else {
      // trenger ikke kræsje hvis oppgave ikke kan hentes
      oppgaveInfoMap.set(behandlingsreferanser[index], {
        reservertAv: null,
        id: null,
        versjon: null,
        feilmelding: 'Kunne ikke hente tildeling.'
      });
    }
  });
  return oppgaveInfoMap;
}
