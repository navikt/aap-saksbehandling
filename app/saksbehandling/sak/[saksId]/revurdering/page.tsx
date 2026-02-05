import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OpprettRevurdering } from 'components/saksoversikt/opprettrevurdering/OpprettRevurdering';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { erAktivFørstegangsbehandling } from 'lib/utils/behandling';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const [sak, personInfo, brukerInformasjon] = await Promise.all([
    hentSak(params.saksId),
    hentSakPersoninfo(params.saksId),
    hentBrukerInformasjon(),
  ]);

  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <Box marginBlock="8">
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
