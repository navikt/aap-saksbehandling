import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { redirect } from 'next/navigation';

const Page = async (props: { params: Promise<{ saksId: string; behandlingsReferanse: string }> }) => {
  const params = await props.params;
  const [behandling, flyt] = await Promise.all([
    hentBehandling(params.behandlingsReferanse),
    hentFlyt(params.behandlingsReferanse),
  ]);

  if (behandling.type === 'ERROR' || flyt === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  /**
   * vurdertGruppe er første manuelle vurdering som har blitt gjort som skal totrinnsvurderes.
   * F.eks hvis Student steget er første vurdering som er gjort i behandlingen så vil vurdertGruppe være satt til Student når man kommer til besluttersteget
   */
  if (flyt.vurdertGruppe && flyt.vurdertSteg) {
    redirect(
      `/saksbehandling/sak/${params.saksId}/${behandling.data.referanse}/${flyt.vurdertGruppe}/#${flyt.vurdertSteg}`
    );
  } else {
    redirect(`/saksbehandling/sak/${params.saksId}/${behandling.data.referanse}/${flyt.aktivGruppe}`);
  }
};

export default Page;
