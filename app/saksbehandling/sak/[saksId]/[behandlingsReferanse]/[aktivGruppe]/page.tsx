import { StegGruppe } from 'lib/types/types';
import { auditlog, hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Suspense } from 'react';
import { Spinner } from 'components/felles/Spinner';
import { ForberedBehandling } from 'components/behandling/ForberedBehandling';
import { BehandlingPage } from 'components/behandling/BehandlingPage';

const Page = async (props: {
  params: Promise<{ behandlingsReferanse: string; aktivGruppe: StegGruppe; saksId: string }>;
}) => {
  const params = await props.params;

  const behandling = await hentBehandling(params.behandlingsReferanse);

  if (isError(behandling)) {
    return <div>Feil i henting av behandling</div>;
  }

  auditlog(params.behandlingsReferanse);

  return behandling.data.skalForberede ? (
    <Suspense fallback={<Spinner size={'xlarge'} label={'Forbereder behandling..'} />}>
      <ForberedBehandling behandlingsReferanse={params.behandlingsReferanse} aktivGruppe={params.aktivGruppe} />
    </Suspense>
  ) : (
    <BehandlingPage behandlingsReferanse={params.behandlingsReferanse} aktivGruppe={params.aktivGruppe as StegGruppe} />
  );
};

export default Page;
