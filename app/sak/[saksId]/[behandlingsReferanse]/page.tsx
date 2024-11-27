import { forberedBehandling, hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { redirect } from 'next/navigation';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';

const Page = async ({ params }: { params: { saksId: string; behandlingsReferanse: string } }) => {
  const forberedBehandlingFeiletResponse = await forberedBehandling(params.behandlingsReferanse);

  if (forberedBehandlingFeiletResponse) {
    return <FlytProsesseringAlert flytProsessering={forberedBehandlingFeiletResponse} />;
  }

  const behandling = await hentBehandling(params.behandlingsReferanse);
  const flyt = await hentFlyt(params.behandlingsReferanse);

  if (behandling === undefined || flyt === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  /**
   * vurdertGruppe er første manuelle vurdering som har blitt gjort som skal totrinnsvurderes.
   * F.eks hvis Student steget er første vurdering som er gjort i behandlingen så vil vurdertGruppe være satt til Student når man kommer til besluttersteget
   */
  if (flyt.vurdertGruppe && flyt.vurdertSteg) {
    redirect(`/sak/${params.saksId}/${behandling.referanse}/${flyt.vurdertGruppe}/#${flyt.vurdertSteg}`);
  } else {
    redirect(`/sak/${params.saksId}/${behandling.referanse}/${flyt.aktivGruppe}`);
  }
};

export default Page;
