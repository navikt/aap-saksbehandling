import { Box, Page as AkselPage } from '@navikt/ds-react';

import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OpprettAktivitetspliktBehandling } from 'components/saksoversikt/opprettAktivitetspliktBehandling/OpprettAktivitetspliktBehandling';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const sak = await hentSak(params.saksnummer);

  return (
    <AkselPage>
      <SaksinfoBanner sak={sak} />
      <Box marginBlock="space-32">
        <OpprettAktivitetspliktBehandling sak={sak} />
      </Box>
    </AkselPage>
  );
}
