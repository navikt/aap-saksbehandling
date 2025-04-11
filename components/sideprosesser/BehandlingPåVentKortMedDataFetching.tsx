import { BehandlingPåVentKort } from 'components/behandlingpåvent/BehandlingPåVentKort';
import { hentBehandlingPåVentInformasjon } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingReferanse: string;
  behandlingVersjon: number;
}

export const BehandlingPåVentKortMedDataFetching = async ({ behandlingVersjon, behandlingReferanse }: Props) => {
  const venteInformasjon = await hentBehandlingPåVentInformasjon(behandlingReferanse);
  if (isError(venteInformasjon)) {
    return <ApiException apiResponses={[venteInformasjon]} />;
  }

  return <BehandlingPåVentKort behandlingVersjon={behandlingVersjon} informasjon={venteInformasjon.data} />;
};
