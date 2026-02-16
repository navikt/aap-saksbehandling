import { hentUbehandledeJournalposter } from 'lib/services/postmottakservice/postmottakservice';
import { Suspense } from 'react';
import { UbehandledeJournalposter } from 'components/postmottak/ubehandlede/UbehandledeJournalposter';
import { isError } from 'lib/utils/api';
import { Alert } from '@navikt/ds-react';

const Page = async () => {
  const result = await hentUbehandledeJournalposter();

  if (isError(result)) return <Alert variant="error">{result.apiException.message || 'En ukjent feil oppsto'}</Alert>;

  return (
    <Suspense>
      <UbehandledeJournalposter journalposter={result.data} />
    </Suspense>
  );
};

export default Page;
