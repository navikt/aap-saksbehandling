import { PostmottakBehandlingPVentKort } from 'components/postmottak/postmottakbehandlingpåvent/PostmottakBehandlingPåVentKort';
import { hentVenteInformasjon } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}
export const BehandlingPVentMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const venteInfo = await hentVenteInformasjon(behandlingsreferanse);
  if (isError(venteInfo)) {
    return <ApiException apiResponses={[venteInfo]} />;
  }

  return <PostmottakBehandlingPVentKort informasjon={venteInfo.data} />;
};
