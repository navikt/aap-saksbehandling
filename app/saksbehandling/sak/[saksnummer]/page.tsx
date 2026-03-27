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

const Page = async (props: { params: Promise<{ saksnummer: string }> }) => {
  const params = await props.params;
  const [sak, personInfo, innloggetBrukerInfo, rettihetsinfoRes] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentBrukerInformasjon(),
    hentRettighetsinfo(params.saksnummer),
  ]);
  const rettighetsinfo = isSuccess(rettihetsinfoRes) ? rettihetsinfoRes.data : null;

  return (
    <>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <br />

      <Suspense>
        <SakOversiktContainer
          sak={sak}
          innloggetBrukerIdent={innloggetBrukerInfo.NAVident}
          rettighetsinfo={rettighetsinfo}
        />
      </Suspense>
    </>
  );
};

export default Page;
