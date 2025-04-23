import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { redirect } from 'next/navigation';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

const Page = async (props: { params: Promise<{ saksId: string; behandlingsReferanse: string }> }) => {
  const params = await props.params;
  const [behandling, flyt] = await Promise.all([
    hentBehandling(params.behandlingsReferanse),
    hentFlyt(params.behandlingsReferanse),
  ]);

  if (isError(behandling) || isError(flyt)) {
    return <ApiException apiResponses={[behandling, flyt]} />;
  }

  /**
   * vurdertGruppe er første manuelle vurdering som har blitt gjort som skal totrinnsvurderes.
   * F.eks hvis Student steget er første vurdering som er gjort i behandlingen så vil vurdertGruppe være satt til Student når man kommer til besluttersteget
   */
  if (flyt.data.vurdertGruppe && flyt.data.vurdertSteg) {
    redirect(
      `/saksbehandling/sak/${params.saksId}/${behandling.data.referanse}/${flyt.data.vurdertGruppe}/#${flyt.data.vurdertSteg}`
    );
  } else {
    redirect(
      `/saksbehandling/sak/${params.saksId}/${behandling.data.referanse}/${flyt.data.aktivGruppe}/#${flyt.data.aktivtSteg}`
    );
  }
};

export default Page;
