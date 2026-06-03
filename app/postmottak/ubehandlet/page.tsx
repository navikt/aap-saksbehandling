import { hentUbehandledeJournalposter } from 'lib/services/postmottakservice/postmottakservice';
import { Suspense } from 'react';
import { UbehandledeJournalposter } from 'components/postmottak/ubehandlede/UbehandledeJournalposter';
import { isError } from 'lib/utils/api';
import { KelvinAlert } from 'components/alert/KelvinAlert';

/**
 * Grensesnitt for uthenting av Kelvin journalposter som har ligget lenge utbehandlet.
 **/
const Page = async () => {
  const result = await hentUbehandledeJournalposter();

  if (isError(result))
    return <KelvinAlert variant="error">{result.apiException.message || 'En ukjent feil oppsto'}</KelvinAlert>;

  return (
    <Suspense>
      <UbehandledeJournalposter journalposter={result.data} />
    </Suspense>
  );
};

export default Page;
