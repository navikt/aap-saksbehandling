import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OpprettRevurdering } from "components/saksoversikt/opprettrevurdering/OpprettRevurdering";

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const sak = await hentSak(params.saksId);

  return (
    <AkselPage>
      <Box marginBlock="8">
        <OpprettRevurdering sak={sak} />
      </Box>
    </AkselPage>
  );
}
