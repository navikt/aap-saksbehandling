import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import useSWR from 'swr';
import { isSuccess } from 'lib/utils/api';
import { clientHentAlleDokumenterPåSak } from 'lib/dokumentClientApi';
import { Journalpost } from 'lib/types/journalpost';

export function useAlleDokumenterPåSak(): {
  dokumenter?: Journalpost[];
  refetchDokumenter: () => void;
} {
  const params = useParamsMedType();

  if (!params.saksnummer) {
    throw Error('useAlleDokumenterPåSak må brukes innenfor en sak.');
  }

  const { data, mutate } = useSWR(`api/dokumenter/sak/${params.saksnummer}`, () =>
    clientHentAlleDokumenterPåSak(params.saksnummer)
  );

  return {
    dokumenter: isSuccess(data) ? data?.data : undefined,
    refetchDokumenter: mutate,
  };
}
