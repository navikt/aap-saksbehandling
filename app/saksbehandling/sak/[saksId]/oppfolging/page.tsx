import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { OpprettOppfølgingsBehandling } from 'components/saksoversikt/opprettoppfølgingsbehandling/OpprettOppfølgingsbehandling';
import { hentBrukerInformasjon } from '../../../../../lib/services/azure/azureUserService';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const sak = await hentSak(params.saksId);
  const personInfo = await hentSakPersoninfo(params.saksId);

  const brukerInformasjon = await hentBrukerInformasjon();

  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <Box marginBlock="8">
        <OpprettOppfølgingsBehandling sak={sak} brukerInformasjon={brukerInformasjon} />
      </Box>
    </AkselPage>
  );
}
