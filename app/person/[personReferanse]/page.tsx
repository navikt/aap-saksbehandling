import { BodyShort, Box, VStack } from '@navikt/ds-react';
import { finnSakerForIdent, hentPersonIdent, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { Suspense } from 'react';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';

const Page = async (props: { params: Promise<{ personReferanse: string }> }) => {
  const params = await props.params;
  const hentIdent = await hentPersonIdent(params.personReferanse);
  if (isError(hentIdent)) {
    return <ApiException apiResponses={[hentIdent]} />;
  }
  const saker = await finnSakerForIdent(hentIdent.data.ident);
  if (isError(saker)) {
    return <ApiException apiResponses={[saker]} />;
  }
  const sakerMedBehandlinger = await Promise.all(saker.data.map((sak) => hentSak(sak.saksnummer)));

  console.log('sakermedbehandlinger', sakerMedBehandlinger);

  return (
    <Box background="neutral-soft">
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <br />

      <Suspense>
        {sakerMedBehandlinger.map((sak) => (
          <SakOversiktContainer sak={sak} rettighetsinfo={rettighetsinfo} arenaSaker={arenaSaker} />
        ))}
      </Suspense>
    </Box>
  );
};
export default Page;
