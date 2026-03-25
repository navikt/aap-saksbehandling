import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';
import { Suspense } from 'react';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';

const Page = async (props: { params: Promise<{ saksnummer: string }> }) => {
  const params = await props.params;
  const [sak, personInfo, innloggetBrukerInfo] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentBrukerInformasjon(),
  ]);

  return (
    <>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <br />

      <Suspense>
        <SakOversiktContainer sak={sak} innloggetBrukerIdent={innloggetBrukerInfo.NAVident} />
      </Suspense>
    </>
  );
};

export default Page;
