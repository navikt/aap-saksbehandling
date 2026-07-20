import { Box } from '@navikt/ds-react/Box';
import { Page as AkselPage } from '@navikt/ds-react/Page';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { OpprettKlage } from 'components/saksoversikt/opprettklage/OpprettKlage';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const { saksnummer } = await props.params;

  const sak = await hentSak(saksnummer);

  return (
    <AkselPage>
      <SaksinfoBanner sak={sak} />
      <Box marginBlock="space-32">
        <OpprettKlage sak={sak} />
      </Box>
    </AkselPage>
  );
}
