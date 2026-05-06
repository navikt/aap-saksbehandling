import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { OpprettOppfølgingsBehandling } from 'components/saksoversikt/opprettoppfølgingsbehandling/OpprettOppfølgingsbehandling';
import { hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const [sak, personInfo, roller] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentRollerForBruker(),
  ]);

  const brukerharNayTilgang = roller.includes(Roller.SAKSBEHANDLER_NASJONAL) || roller.includes(Roller.BESLUTTER);
  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />
      <Box marginBlock="space-32">
        <OpprettOppfølgingsBehandling saksnummer={sak.saksnummer} brukerHarNayTilgang={brukerharNayTilgang} />
      </Box>
    </AkselPage>
  );
}
