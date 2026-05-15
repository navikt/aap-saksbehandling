import { Box } from '@navikt/ds-react';
import {
  finnSakerForIdent,
  hentPersoninformasjon,
  hentSak,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { Suspense } from 'react';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';

const Page = async (props: { params: Promise<{ personReferanse: string }> }) => {
  const params = await props.params;
  const personInfo = await hentPersoninformasjon(params.personReferanse);
  if (isError(personInfo)) {
    return <ApiException apiResponses={[personInfo]} />;
  }
  const saker = await finnSakerForIdent(personInfo.data.fnr);
  if (isError(saker)) {
    return <ApiException apiResponses={[saker]} />;
  }
  const sakerMedBehandlinger = await Promise.all(saker.data.map((sak) => hentSak(sak.saksnummer)));

  console.log('sakermedbehandlinger', sakerMedBehandlinger);

  return (
    <Box background="neutral-soft">
      {/*<SaksinfoBanner personInformasjon={personInfo.data} sak={{}} />*/}

      <br />

      <Suspense>
        {sakerMedBehandlinger.map((sak) => (
          <SakOversiktContainer
            sak={sak}
            rettighetsinfo={{ perioderMedRett: [], sisteDagMedRett: '2025-04-01' }}
            arenaSaker={{ saker: [] }}
          />
        ))}
      </Suspense>
    </Box>
  );
};
export default Page;
