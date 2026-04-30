import { Alert, Box, HStack, Link, Page as AkselPage, VStack } from '@navikt/ds-react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OpprettRevurdering } from 'components/saksoversikt/opprettrevurdering/OpprettRevurdering';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { erAktivFørstegangsbehandling } from 'lib/utils/behandling';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const [sak, personInfo, brukerInformasjon] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentBrukerInformasjon(),
  ]);

  if (sak.søknadErTrukket) {
    return (
      <HStack justify="center">
        <VStack width="600" gap="space-16" margin="space-32" align="center">
          <Alert variant="warning">Søknaden er trukket. Kan ikke opprette ny vurdering eller revurdering.</Alert>

          <Link href={`/saksbehandling/sak/${sak.saksnummer}`}>Gå tilbake</Link>
        </VStack>
      </HStack>
    );
  }

  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />
      <Box marginBlock="space-32">
        <OpprettRevurdering
          sak={sak}
          erFørstegangsbehandling={erAktivFørstegangsbehandling(sak.behandlinger)}
          redirect={true}
          navIdent={brukerInformasjon.NAVident}
        />
      </Box>
    </AkselPage>
  );
}
