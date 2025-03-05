import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SakMedBehandlinger } from "components/saksoversikt/SakMedBehandlinger";
import { SaksinfoBanner } from "components/saksinfobanner/SaksinfoBanner";

const Page = async (props: { params: Promise<{ saksId: string }> }) => {
  const params = await props.params;
  const sak = await hentSak(params.saksId);
  const personInfo = await hentSakPersoninfo(params.saksId);

  return (
    <>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />

      <br />

      <SakMedBehandlinger sak={sak} />
    </>
  );
};

export default Page;
