import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { OpprettOppfølgingsBehandling } from 'components/saksoversikt/opprettoppfølgingsbehandling/OpprettOppfølgingsbehandling';
import { hentBrukerInformasjon, hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const [sak, personInfo, brukerInformasjon, roller] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentBrukerInformasjon(),
    hentRollerForBruker(),
  ]);

  const brukerharNayTilgang = roller.includes(Roller.SAKSBEHANDLER_NASJONAL) || roller.includes(Roller.BESLUTTER);
  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <Box marginBlock="8">
        <OpprettOppfølgingsBehandling
          saksnummer={sak.saksnummer}
          brukerInformasjon={brukerInformasjon}
          brukerHarNayTilgang={brukerharNayTilgang}
        />
      </Box>
    </AkselPage>
  );
}
