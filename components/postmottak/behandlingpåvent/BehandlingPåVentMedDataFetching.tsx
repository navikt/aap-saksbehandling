import { BehandlingPåVentKort } from './BehandlingPåVentKort';
import { hentVenteInformasjon } from 'lib/services/dokumentmottakservice/dokumentMottakService';

interface Props {
  behandlingsreferanse: string;
}
export const BehandlingPVentMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const venteInfo = await hentVenteInformasjon(behandlingsreferanse);
  return <BehandlingPåVentKort informasjon={venteInfo} />;
};
