import { BehandlingPåVentKort } from 'components/behandlingpåvent/BehandlingPåVentKort';
import { hentBehandlingPåVentInformasjon } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingReferanse: string;
  behandlingVersjon: number;
}

export const BehandlingPåVentKortMedDataFetching = async ({ behandlingVersjon, behandlingReferanse }: Props) => {
  const venteInformasjon = await hentBehandlingPåVentInformasjon(behandlingReferanse);

  return <BehandlingPåVentKort behandlingVersjon={behandlingVersjon} informasjon={venteInformasjon} />;
};
