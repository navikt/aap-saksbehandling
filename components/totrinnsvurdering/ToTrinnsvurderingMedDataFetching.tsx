import {
  hentFatteVedtakGrunnlang,
  hentFlyt,
  hentKvalitetssikringGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsvurdering } from 'components/totrinnsvurdering/ToTrinnsvurdering';

interface Props {
  behandlingsReferanse: string;
}

export const ToTrinnsvurderingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const [fatteVedtakGrunnlag, kvalitetssikringGrunnlag, flyt] = await Promise.all([
    hentFatteVedtakGrunnlang(behandlingsReferanse),
    hentKvalitetssikringGrunnlag(behandlingsReferanse),
    hentFlyt(behandlingsReferanse),
  ]);
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <>
      {flyt.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          grunnlag={fatteVedtakGrunnlag}
          erKvalitetssikring={false}
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.visning.beslutterReadOnly || !fatteVedtakGrunnlag.harTilgangTilÅSaksbehandle}
        />
      )}
      {flyt.visning.visKvalitetssikringKort && (
        <ToTrinnsvurdering
          grunnlag={kvalitetssikringGrunnlag}
          behandlingsReferanse={behandlingsReferanse}
          erKvalitetssikring={true}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.visning.kvalitetssikringReadOnly || !kvalitetssikringGrunnlag.harTilgangTilÅSaksbehandle}
        />
      )}
    </>
  );
};
