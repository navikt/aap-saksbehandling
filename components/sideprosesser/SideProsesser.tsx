import { BehandlingPåVentKort } from 'components/behandlingpåvent/BehandlingPåVentKort';
import { hentBehandlingPåVentInformasjon } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  visVenteKort: boolean;
  behandlingReferanse: string;
  behandlingVersjon: number;
}

export const SideProsesser = async ({ visVenteKort, behandlingVersjon, behandlingReferanse }: Props) => {
  const venteInformasjon = await hentBehandlingPåVentInformasjon(behandlingReferanse);

  return (
    <div className={'flex-column'}>
      {visVenteKort && <BehandlingPåVentKort behandlingVersjon={behandlingVersjon} informasjon={venteInformasjon} />}
    </div>
  );
};
