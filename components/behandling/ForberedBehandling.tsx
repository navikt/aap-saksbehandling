import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { forberedBehandlingOgVentPåProsessering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { DetaljertBehandling, StegGruppe } from 'lib/types/types';
import { BehandlingPage } from 'components/behandling/BehandlingPage';
import { logInfo } from 'lib/serverutlis/logger';

interface Props {
  behandlingsReferanse: string;
  behandling: DetaljertBehandling;
  aktivGruppe: string;
  saksId: string;
}

export const ForberedBehandling = async ({ behandlingsReferanse, behandling, aktivGruppe, saksId }: Props) => {
  const result = await forberedBehandlingOgVentPåProsessering(behandlingsReferanse);

  if (result?.status === 'FEILET') {
    return <FlytProsesseringAlert flytProsessering={result} />;
  }

  if (result?.status === 'JOBBER') {
    logInfo(
      `forberedBehandlingOgVentPåProsessering endte med status ${result?.status} i behandling ${behandlingsReferanse}. Vurder å øke antall forsøk / øke timeout`
    );

    // TODO bør vi vise en "Forsøk på nytt"-knapp i stedet når disse tilfellene oppstår? Nå vil behandlingssiden vises i readonly modus
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
