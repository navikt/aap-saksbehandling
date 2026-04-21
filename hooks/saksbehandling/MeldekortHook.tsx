import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';
import { clientHentAlleMeldekort } from 'lib/clientApi';
import useSWR from 'swr';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isError } from 'lib/utils/api';

export function useMeldekort(): {
  alleMeldekort?: MeldeperiodeMedMeldekortDto[];
  refetchMeldekort: () => void;
  isLoading: boolean;
} {
  const { saksnummer } = useParamsMedType();
  const { data, mutate, isLoading } = useSWR(`api/meldekort/${saksnummer}`, () => clientHentAlleMeldekort(saksnummer));

  return {
    alleMeldekort: !isError(data) ? data?.data.meldeperioderMedMeldekort : undefined,
    refetchMeldekort: mutate,
    isLoading,
  };
}
