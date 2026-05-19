import { Box } from '@navikt/ds-react';
import { finnSakerForIdent, hentPersoninformasjon } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError, isSuccess } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Suspense } from 'react';
import { ArenaSakerListe } from 'components/saksoversikt/ArenaSakerListe';
import { unleashService } from 'lib/services/unleash/unleashService';
import { hentArenaSakerForPerson } from 'lib/services/apiinternservice/apiInternService';
import { SakOversiktMedDataFetching } from 'components/saksoversikt/SakOversiktMedDataFetching';

const Page = async (props: { params: Promise<{ personReferanse: string }> }) => {
  const params = await props.params;
  const visArenasakerOversikt = unleashService.isEnabled('VisArenasakerOversikt');
  const personInfo = await hentPersoninformasjon(params.personReferanse);
  if (isError(personInfo)) {
    return <ApiException apiResponses={[personInfo]} />;
  }
  const saker = await finnSakerForIdent(personInfo.data.fnr);
  if (isError(saker)) {
    return <ApiException apiResponses={[saker]} />;
  }
  const arenaSakerRes = visArenasakerOversikt ? await hentArenaSakerForPerson(personInfo.data.fnr) : undefined;
  const arenaSaker = isSuccess(arenaSakerRes) ? arenaSakerRes.data : null;

  return (
    <Box background="neutral-soft">
      {/*<SaksinfoBanner personInformasjon={personInfo.data} sak={{}} />*/}

      <br />

      <Suspense>
        {saker.data.map((sak) => (
          <SakOversiktMedDataFetching key={sak.saksnummer} saksnummer={sak.saksnummer} />
        ))}
      </Suspense>
      {visArenasakerOversikt && arenaSaker && <ArenaSakerListe arenaSaker={arenaSaker} />}
    </Box>
  );
};
export default Page;
