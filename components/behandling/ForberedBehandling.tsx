import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { forberedBehandlingOgVentPåProsessering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegGruppe } from 'lib/types/types';
import { BehandlingPage } from 'components/behandling/BehandlingPage';
import { logInfo } from 'lib/serverutlis/logger';

interface Props {
  behandlingsreferanse: string;
  aktivGruppe: string;
}

export const ForberedBehandling = async ({ behandlingsreferanse, aktivGruppe }: Props) => {
  const result = await forberedBehandlingOgVentPåProsessering(behandlingsreferanse);

  if (result?.status === 'FEILET') {
    return <FlytProsesseringAlert flytProsessering={result} />;
  }

  if (result?.status === 'JOBBER') {
    logInfo(
      `forberedBehandlingOgVentPåProsessering endte med status ${result?.status} i behandling ${behandlingsreferanse}. Vurder å øke antall forsøk / øke timeout`
    );

    // TODO bør vi vise en "Forsøk på nytt"-knapp i stedet når disse tilfellene oppstår? Nå vil behandlingssiden vises i readonly modus
  }

  return <BehandlingPage behandlingsreferanse={behandlingsreferanse} aktivGruppe={aktivGruppe as StegGruppe} />;
};
