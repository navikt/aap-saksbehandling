import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { redirect } from 'next/navigation';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

const Page = async (props: { params: Promise<{ saksnummer: string; behandlingsreferanse: string }> }) => {
  const { saksnummer, behandlingsreferanse } = await props.params;
  const flyt = await hentFlyt(behandlingsreferanse);

  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  /**
   * vurdertGruppe er første manuelle vurdering som har blitt gjort som skal totrinnsvurderes.
   * F.eks hvis Student steget er første vurdering som er gjort i behandlingen så vil vurdertGruppe være satt til Student når man kommer til besluttersteget
   */
  if (flyt.data.vurdertGruppe && flyt.data.vurdertSteg) {
    redirect(
      `/saksbehandling/sak/${saksnummer}/${behandlingsreferanse}/${flyt.data.vurdertGruppe}/#${flyt.data.vurdertSteg}`
    );
  } else {
    redirect(`/saksbehandling/sak/${saksnummer}/${behandlingsreferanse}/${flyt.data.aktivGruppe}`);
  }
};

export default Page;
