import { Box, Page as AkselPage } from '@navikt/ds-react';

import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { OpprettUtenlandsoppholdBehandling } from 'components/saksoversikt/opprettutenlandsoppholdbehandling/OpprettUtenlandsoppholdBehandling';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const sak = await hentSak(params.saksnummer);

  return (
    <AkselPage>
      <SaksinfoBanner sak={sak} />
      <Box marginBlock="space-32">
        <OpprettUtenlandsoppholdBehandling saksnummer={sak.saksnummer} />
      </Box>
    </AkselPage>
  );
}
