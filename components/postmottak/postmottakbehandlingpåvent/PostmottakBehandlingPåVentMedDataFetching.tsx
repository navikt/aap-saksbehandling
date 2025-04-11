import { PostmottakBehandlingPVentKort } from 'components/postmottak/postmottakbehandlingpåvent/PostmottakBehandlingPåVentKort';
import { hentVenteInformasjon } from 'lib/services/dokumentmottakservice/dokumentMottakService';

interface Props {
  behandlingsreferanse: string;
}
export const BehandlingPVentMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const venteInfo = await hentVenteInformasjon(behandlingsreferanse);
  return <PostmottakBehandlingPVentKort informasjon={venteInfo} />;
};
