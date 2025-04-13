import {
  hentFatteVedtakGrunnlang,
  hentFlyt,
  hentKvalitetssikringGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsvurdering } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
}

export const ToTrinnsvurderingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const [fatteVedtakGrunnlag, kvalitetssikringGrunnlag, flyt] = await Promise.all([
    hentFatteVedtakGrunnlang(behandlingsReferanse),
    hentKvalitetssikringGrunnlag(behandlingsReferanse),
    hentFlyt(behandlingsReferanse),
  ]);

  if (isError(fatteVedtakGrunnlag) || isError(kvalitetssikringGrunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[fatteVedtakGrunnlag, kvalitetssikringGrunnlag, flyt]} />;
  }
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <>
      {flyt.data.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          grunnlag={fatteVedtakGrunnlag.data}
          erKvalitetssikring={false}
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.data.visning.beslutterReadOnly || !fatteVedtakGrunnlag.data.harTilgangTilÅSaksbehandle}
        />
      )}
      {flyt.data.visning.visKvalitetssikringKort && (
        <ToTrinnsvurdering
          grunnlag={kvalitetssikringGrunnlag.data}
          behandlingsReferanse={behandlingsReferanse}
          erKvalitetssikring={true}
          behandlingVersjon={behandlingVersjon}
          readOnly={
            flyt.data.visning.kvalitetssikringReadOnly || !kvalitetssikringGrunnlag.data.harTilgangTilÅSaksbehandle
          }
        />
      )}
    </>
  );
};
