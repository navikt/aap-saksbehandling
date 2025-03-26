import { hentAlleBehandlinger } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { OpprettBehandling } from 'components/postmottak/test/behandling/OpprettBehandling';
import { Page as AkselPage } from '@navikt/ds-react';
import { BehandlingOversikt } from 'components/postmottak/oversikt/BehandlingOversikt';
import { isLocal } from '@navikt/aap-felles-utils';

const Page = async () => {
  const alleBehandlinger = (await hentAlleBehandlinger()).sort(
    (a, b) => Date.parse(b.opprettet) - Date.parse(a.opprettet)
  );

  return (
    <AkselPage>
      <BehandlingOversikt behandlinger={alleBehandlinger} />

      {isLocal() && (
        <OpprettBehandling />
      )}
    </AkselPage>
  );
};

export default Page;
