'use client';

import useSWR from 'swr';
import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { clientHentGosysOppgaver } from 'lib/clientApi';
import { isError } from 'lib/utils/api';

export const GosysOppgaver = () => {
  const { data, isLoading, error } = useSWR(
    '/oppgave/api/gosys',
    () => clientHentGosysOppgaver({ tema: ['AAP'], statuskategori: 'AAPEN' }),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return <Spinner label="Henter Gosys-oppgaver" />;
  }

  if (error || isError(data)) {
    return <Alert variant="error">Kunne ikke hente Gosys-oppgaver. {error}</Alert>;
  }

  return <div>Her kommer det gosys oppgaver, totalt så har vi hentet {data?.data.oppgaver?.length}</div>;
};
