import useSWRInfinite from 'swr/infinite';
import { clientHentGosysOppgaver } from 'lib/clientApi';
import { FinnGosysOppgaverResponse } from 'lib/types/gosysTypes';
import { isError } from 'lib/utils/api';
import { Oppgavetyper } from 'components/oppgaveliste/gosysoppgaver/GosysOppgaver';

const OPPGAVER_PER_SIDE = 50;

interface GosysOppgaverParams {
  enhet?: string;
  behandlingstype?: string;
  behandlingstema?: string;
  oppgaveTyper?: Oppgavetyper[];
  aktoerId?: string;
}

export function useGosysOppgaver({
  enhet,
  behandlingstype,
  behandlingstema,
  oppgaveTyper,
  aktoerId,
}: GosysOppgaverParams) {
  const { data, isLoading, isValidating, error, size, setSize, mutate } = useSWRInfinite(
    (pageIndex: number, previousPage: FinnGosysOppgaverResponse | null) => {
      if (!enhet && !aktoerId?.trim()) return null;
      if (
        previousPage &&
        (!previousPage.oppgaver?.length ||
          (previousPage.antallTreffTotalt !== undefined &&
            pageIndex * OPPGAVER_PER_SIDE >= previousPage.antallTreffTotalt) ||
          (previousPage.antallTreffTotalt === undefined && previousPage.oppgaver.length < OPPGAVER_PER_SIDE))
      ) {
        return null;
      }
      return [
        '/oppgave/api/gosys',
        pageIndex * OPPGAVER_PER_SIDE,
        enhet,
        behandlingstype,
        behandlingstema,
        oppgaveTyper,
        aktoerId,
      ] as const;
    },
    async ([, offset, enhet, valgtBehandlingstype, valgtBehandlingstema, valgteOppgaveTyper, valgtAktoerId]) => {
      const response = await clientHentGosysOppgaver({
        tema: ['AAP'],
        ...(valgtBehandlingstype !== undefined && { behandlingstype: valgtBehandlingstype }),
        ...(valgtBehandlingstema !== undefined && { behandlingstema: valgtBehandlingstema }),
        ...(valgteOppgaveTyper?.length && { oppgavetype: valgteOppgaveTyper }),
        statuskategori: 'AAPEN',
        ...(enhet !== undefined && { tildeltEnhetsnr: enhet }),
        ...(valgtAktoerId && { aktoerId: [valgtAktoerId] }),
        limit: OPPGAVER_PER_SIDE,
        offset,
      });
      if (isError(response)) {
        throw new Error(response.apiException.message);
      }
      return response.data;
    },
    { revalidateOnFocus: false, revalidateFirstPage: false, persistSize: false, keepPreviousData: false }
  );

  const antallTreff = data?.at(-1)?.antallTreffTotalt || 0;
  const oppgaver = data?.flatMap((page) => page?.oppgaver ?? []) ?? [];
  const sisteSide = data?.at(-1)?.oppgaver ?? [];
  const kanLasteFlere =
    sisteSide.length > 0 &&
    (antallTreff === undefined
      ? sisteSide.length === OPPGAVER_PER_SIDE
      : (data?.length ?? 0) * OPPGAVER_PER_SIDE < antallTreff);

  return {
    oppgaver,
    antallTreff,
    kanLasteFlere,
    isLoading,
    isValidating,
    error,
    harLastetOppgaver: data !== undefined,
    lastInnFlere: () => (error ? mutate() : setSize(size + 1)),
  };
}
