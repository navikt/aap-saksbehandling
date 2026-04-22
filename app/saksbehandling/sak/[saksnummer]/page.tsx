import {
  hentRettighetsinfo,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';
import { Suspense } from 'react';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { isSuccess } from 'lib/utils/api';
import { unleashService } from 'lib/services/unleash/unleashService';
import { NySakOversiktContainer } from 'components/saksoversikt/NySakOversiktContainer';
import { hentArenaSakerForPerson } from 'lib/services/apiinternservice/apiInternService';

const Page = async (props: { params: Promise<{ saksnummer: string }> }) => {
  const params = await props.params;
  const [sak, personInfo, innloggetBrukerInfo, rettihetsinfoRes] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentBrukerInformasjon(),
    hentRettighetsinfo(params.saksnummer),
  ]);
  const rettighetsinfo = isSuccess(rettihetsinfoRes) ? rettihetsinfoRes.data : null;
  const nySaksoversikt = unleashService.isEnabled('NySaksBehandlingOversikt');

  const arenaSakerRes = nySaksoversikt ? await hentArenaSakerForPerson(personInfo.fnr) : null;
  const arenaSaker = arenaSakerRes && isSuccess(arenaSakerRes) ? arenaSakerRes.data : null;

  console.log(personInfo.fnr);
  console.log(arenaSaker);
  return (
    <>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <br />

      <Suspense>
        {nySaksoversikt ? (
          <NySakOversiktContainer
            sak={sak}
            innloggetBrukerIdent={innloggetBrukerInfo.NAVident}
            personInfo={personInfo}
            rettighetsinfo={rettighetsinfo}
            arenaSaker={arenaSaker}
          />
        ) : (
          <SakOversiktContainer
            sak={sak}
            innloggetBrukerIdent={innloggetBrukerInfo.NAVident}
            rettighetsinfo={rettighetsinfo}
          />
        )}
      </Suspense>
    </>
  );
};

export default Page;
