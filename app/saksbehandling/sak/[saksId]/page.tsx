import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';
import { Suspense } from 'react';

const Page = async (props: { params: Promise<{ saksId: string }> }) => {
  const params = await props.params;
  const sak = await hentSak(params.saksId);
  const personInfo = await hentSakPersoninfo(params.saksId);

  return (
    <>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <br />

      <Suspense>
        <SakOversiktContainer sak={sak} />
      </Suspense>
    </>
  );
};

export default Page;
