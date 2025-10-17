import { OpprettBehandling } from 'components/postmottak/test/behandling/OpprettBehandling';
import { Page as AkselPage } from '@navikt/ds-react';
import { BehandlingOversikt } from 'components/postmottak/oversikt/BehandlingOversikt';
import { isProd, isLocal } from 'lib/utils/environment';
import { hentAlleBehandlinger } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

const visningAvAlleBehandlingerLokaltOgDev = !isProd();
const dummyOpprettBehandlingLokalt = isLocal();

const Page = async () => {
  let alleBehandlinger: { id: string; journalpostId: string; status: string; opprettet: string; steg: string }[] = [];
  if (visningAvAlleBehandlingerLokaltOgDev) {
    const res = await hentAlleBehandlinger();
    if (isError(res)) {
      return <ApiException apiResponses={[res]} />;
    }
    alleBehandlinger = res.data.sort((a, b) => Date.parse(b.opprettet) - Date.parse(a.opprettet));
  }

  return (
    <AkselPage>
      {visningAvAlleBehandlingerLokaltOgDev && <BehandlingOversikt behandlinger={alleBehandlinger} />}

      {dummyOpprettBehandlingLokalt && <OpprettBehandling />}
    </AkselPage>
  );
};

export default Page;
