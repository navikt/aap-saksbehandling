import { StegGruppe } from 'lib/types/types';
import { auditlog, hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Suspense } from 'react';
import { Spinner } from 'components/felles/Spinner';
import { ForberedBehandling } from 'components/behandling/ForberedBehandling';
import { BehandlingPage } from 'components/behandling/BehandlingPage';

const Page = async (props: {
  params: Promise<{ behandlingsreferanse: string; saksnummer: string; aktivGruppe: StegGruppe }>;
}) => {
  const params = await props.params;
  const { behandlingsreferanse, aktivGruppe } = params;
  const behandling = await hentBehandling(behandlingsreferanse);

  if (isError(behandling)) {
    return <div>Feil i henting av behandling</div>;
  }

  auditlog(behandlingsreferanse);

  return behandling.data.skalForberede ? (
    <Suspense fallback={<Spinner size={'xlarge'} label={'Forbereder behandling..'} />}>
      <ForberedBehandling behandlingsreferanse={behandlingsreferanse} aktivGruppe={aktivGruppe} />
    </Suspense>
  ) : (
    <BehandlingPage behandlingsreferanse={behandlingsreferanse} aktivGruppe={aktivGruppe as StegGruppe} />
  );
};

export default Page;
