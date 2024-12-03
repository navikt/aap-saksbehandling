import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import { StegGruppe } from 'lib/types/types';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import {
  forberedBehandlingOgVentPåProsessering,
  hentBehandling,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';

const Page = async (props: {
  params: Promise<{ behandlingsReferanse: string; aktivGruppe: StegGruppe; saksId: string }>;
}) => {
  const params = await props.params;

  const behandling = await hentBehandling(params.behandlingsReferanse);

  if (behandling.skalForberede) {
    const forberedBehandlingResponse = await forberedBehandlingOgVentPåProsessering(params.behandlingsReferanse);

    if (forberedBehandlingResponse && forberedBehandlingResponse.status === 'FEILET') {
      return <FlytProsesseringAlert flytProsessering={forberedBehandlingResponse} />;
    }
  }
  return (
    <OppgaveKolonne
      saksId={params.saksId}
      behandlingsReferanse={params.behandlingsReferanse ?? ''}
      aktivGruppe={decodeURI(params.aktivGruppe) as StegGruppe}
    />
  );
};

export default Page;
