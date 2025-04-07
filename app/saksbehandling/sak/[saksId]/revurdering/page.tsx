import { Box, Page as AkselPage } from '@navikt/ds-react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OpprettRevurdering } from 'components/saksoversikt/opprettrevurdering/OpprettRevurdering';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const sak = await hentSak(params.saksId);
  const personInfo = await hentSakPersoninfo(params.saksId);

  if (sak.type === 'ERROR') {
    return <div>Kunne ikke finne sak.</div>;
  }

  return (
    <AkselPage>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak.data} />

      <Box marginBlock="8">
        <OpprettRevurdering sak={sak.data} />
      </Box>
    </AkselPage>
  );
}
