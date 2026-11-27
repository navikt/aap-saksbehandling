import useSWRInfinite from 'swr/infinite';
import { postmottakHentJournalposterClient } from 'lib/postmottakClientApi';
import { JournalposterRespons } from 'lib/types/postmottakTypes';
import { isError } from 'lib/utils/api';

export function usePostmottakJournalposter(behandlingsreferanse: string) {
  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite(
    (_: number, forrigeSide: JournalposterRespons | null) => {
      if (forrigeSide && !forrigeSide.finnesNesteSide) return null;
      return ['postmottak/journalposter', behandlingsreferanse, forrigeSide?.sluttpeker ?? undefined] as const;
    },
    async ([, referanse, etter]) => {
      const response = await postmottakHentJournalposterClient(referanse, etter);
      if (isError(response)) throw new Error(response.apiException.message);
      if (response.data.finnesNesteSide && (!response.data.sluttpeker || response.data.sluttpeker === etter)) {
        throw new Error('Journalpostlisten mangler en gyldig peker til neste side.');
      }
      return response.data;
    },
    { revalidateOnFocus: false, revalidateFirstPage: false, shouldRetryOnError: false }
  );

  return {
    journalposter: data?.flatMap((side) => side.journalposter) ?? [],
    finnesNesteSide: data?.at(-1)?.finnesNesteSide ?? false,
    isLoading,
    isValidating,
    error,
    lastFlere: () => setSize(size + 1),
    prøvIgjen: () => mutate(),
  };
}
