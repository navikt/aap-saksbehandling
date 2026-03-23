import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';
import { Suspense } from 'react';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { unleashService } from 'lib/services/unleash/unleashService';
import { NySakOversiktContainer } from 'components/saksoversikt/NySakOversiktContainer';

const Page = async (props: { params: Promise<{ saksId: string }> }) => {
  const params = await props.params;
  const sak = await hentSak(params.saksId);
  const personInfo = await hentSakPersoninfo(params.saksId);
  const innloggetBrukerInfo = await hentBrukerInformasjon();

  const nySaksBehandlingOversiktEnabled = unleashService.isEnabled('NySaksBehandlingOversikt');

  return (
    <div>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <br />

      <Suspense>
        {nySaksBehandlingOversiktEnabled ? (
          <NySakOversiktContainer
            sak={sak}
            innloggetBrukerIdent={innloggetBrukerInfo.NAVident}
            personInfo={personInfo}
          />
        ) : (
          <SakOversiktContainer sak={sak} innloggetBrukerIdent={innloggetBrukerInfo.NAVident} />
        )}
      </Suspense>
    </div>
  );
};

export default Page;
