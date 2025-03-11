import { hentAlleBehandlinger } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { OpprettBehandling } from 'components/postmottak/test/behandling/OpprettBehandling';
import { Page as AkselPage } from '@navikt/ds-react';
import { BehandlingOversikt } from 'components/postmottak/oversikt/BehandlingOversikt';

const Page = async () => {
  const alleBehandlinger = (await hentAlleBehandlinger()).sort(
    (a, b) => Date.parse(b.opprettet) - Date.parse(a.opprettet)
  );

  return (
    <AkselPage>
      <BehandlingOversikt behandlinger={alleBehandlinger} />

      <OpprettBehandling />
    </AkselPage>
  );
};

export default Page;
