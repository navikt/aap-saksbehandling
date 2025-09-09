import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { OpprettKlage } from 'components/saksoversikt/opprettklage/OpprettKlage';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const [sak, personInfo] = await Promise.all([hentSak(params.saksId), hentSakPersoninfo(params.saksId)]);

  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <Box marginBlock="8">
        <OpprettKlage sak={sak} />
      </Box>
    </AkselPage>
  );
}
