import { Box, Page as AkselPage } from '@navikt/ds-react';

import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OpprettAktivitetspliktBehandling } from 'components/saksoversikt/opprettAktivitetspliktBehandling/OpprettAktivitetspliktBehandling';

export default async function Page(props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const [personInfo, sak] = await Promise.all([hentSakPersoninfo(params.saksnummer), hentSak(params.saksnummer)]);

  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <Box marginBlock="8">
        <OpprettAktivitetspliktBehandling sak={sak} />
      </Box>
    </AkselPage>
  );
}
