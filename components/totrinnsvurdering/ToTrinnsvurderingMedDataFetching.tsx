import {
  hentFatteVedtakGrunnlang,
  hentFlyt,
  hentKvalitetssikringGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsvurdering } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { FetchProxyError } from 'components/fetchproxyerror/FetchProxyError';

interface Props {
  behandlingsReferanse: string;
}

export const ToTrinnsvurderingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const fatteVedtakGrunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  const kvalitetssikringGrunnlag = await hentKvalitetssikringGrunnlag(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);

  if (fatteVedtakGrunnlag.type === 'ERROR') {
    return <FetchProxyError error={fatteVedtakGrunnlag} />;
  }

  if (kvalitetssikringGrunnlag.type === 'ERROR') {
    return <FetchProxyError error={kvalitetssikringGrunnlag} />;
  }

  if (flyt.type === 'ERROR') {
    return <FetchProxyError error={flyt} />;
  }

  const behandlingVersjon = flyt.responseJson.behandlingVersjon;

  return (
    <>
      {flyt.responseJson.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          grunnlag={fatteVedtakGrunnlag.responseJson}
          erKvalitetssikring={false}
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.responseJson.visning.beslutterReadOnly}
        />
      )}
      {flyt.responseJson.visning.visKvalitetssikringKort && (
        <ToTrinnsvurdering
          grunnlag={kvalitetssikringGrunnlag.responseJson}
          behandlingsReferanse={behandlingsReferanse}
          erKvalitetssikring={true}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.responseJson.visning.kvalitetssikringReadOnly}
        />
      )}
    </>
  );
};
