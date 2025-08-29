import { Box, Page as AkselPage } from '@navikt/ds-react';

import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OpprettAktivitetsPliktBrudd } from 'components/saksoversikt/opprettAktivitetsPliktBrudd/OpprettAktivitetsPlikt';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const [personInfo, sak] = await Promise.all([hentSakPersoninfo(params.saksId), hentSak(params.saksId)]);

  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <Box marginBlock="8">
        <OpprettAktivitetsPliktBrudd sak={sak} />
      </Box>
    </AkselPage>
  );
}
