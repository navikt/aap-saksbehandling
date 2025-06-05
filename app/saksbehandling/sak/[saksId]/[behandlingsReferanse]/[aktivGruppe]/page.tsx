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
    <Suspense fallback={<Spinner label={'Forbereder behandling..'} />}>
      <ForberedBehandling
        behandlingsReferanse={params.behandlingsReferanse}
        behandling={behandling.data}
        aktivGruppe={params.aktivGruppe}
        saksId={params.saksId}
      />
    </Suspense>
  ) : (
    <BehandlingPage
      behandling={behandling.data}
      behandlingsReferanse={params.behandlingsReferanse}
      aktivGruppe={params.aktivGruppe as StegGruppe}
      saksId={params.saksId}
    />
  );
};

export default Page;
