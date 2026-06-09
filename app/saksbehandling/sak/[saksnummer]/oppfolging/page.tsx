import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { OpprettOppfølgingsBehandling } from 'components/saksoversikt/opprettoppfølgingsbehandling/OpprettOppfølgingsbehandling';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const sak = await hentSak(params.saksnummer);

  return (
    <AkselPage>
      <SaksinfoBanner sak={sak} />
      <Box marginBlock="space-32">
        <OpprettOppfølgingsBehandling saksnummer={sak.saksnummer} />
      </Box>
    </AkselPage>
  );
}
