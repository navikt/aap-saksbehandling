import { OpprettBehandling } from 'components/postmottak/test/behandling/OpprettBehandling';
import { Page as AkselPage } from '@navikt/ds-react';
import { BehandlingOversikt } from 'components/postmottak/oversikt/BehandlingOversikt';
import { isProd, isLocal } from 'lib/utils/environment';
import { hentAlleBehandlinger } from 'lib/services/dokumentmottakservice/dokumentMottakService';

const Page = async () => {
  let alleBehandlinger: { id: string; status: string; opprettet: string; steg: string }[] = [];
  if (!isProd()) {
    alleBehandlinger = (await hentAlleBehandlinger()).sort((a, b) => Date.parse(b.opprettet) - Date.parse(a.opprettet));
  }

  return (
    <AkselPage>
      {!isProd() && <BehandlingOversikt behandlinger={alleBehandlinger} />}

      {isLocal() && <OpprettBehandling />}
    </AkselPage>
  );
};

export default Page;
