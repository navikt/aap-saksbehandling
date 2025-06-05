import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { forberedBehandlingOgVentPåProsessering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { DetaljertBehandling, StegGruppe } from 'lib/types/types';
import { BehandlingPage } from 'components/behandling/BehandlingPage';

export const ForberedBehandling = async ({
  behandlingsReferanse,
  behandling,
  aktivGruppe,
  saksId,
}: {
  behandlingsReferanse: string;
  behandling: DetaljertBehandling;
  aktivGruppe: string;
  saksId: string;
}) => {
  const result = await forberedBehandlingOgVentPåProsessering(behandlingsReferanse);

  if (result?.status === 'FEILET') {
    return <FlytProsesseringAlert flytProsessering={result} />;
  }

  return (
    <BehandlingPage
      behandlingsReferanse={behandlingsReferanse}
      behandling={behandling}
      aktivGruppe={aktivGruppe as StegGruppe}
      saksId={saksId}
    />
  );
};
