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
  const behandlingVersjon = flyt.behandlingVersjon;

  if (isError(fatteVedtakGrunnlag) || isError(kvalitetssikringGrunnlag)) {
    return <ApiException apiResponses={[fatteVedtakGrunnlag, kvalitetssikringGrunnlag]} />;
  }

  return (
    <>
      {flyt.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          grunnlag={fatteVedtakGrunnlag.data}
          erKvalitetssikring={false}
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.visning.beslutterReadOnly || !fatteVedtakGrunnlag.data.harTilgangTilÅSaksbehandle}
        />
      )}
      {flyt.visning.visKvalitetssikringKort && (
        <ToTrinnsvurdering
          grunnlag={kvalitetssikringGrunnlag.data}
          behandlingsReferanse={behandlingsReferanse}
          erKvalitetssikring={true}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.visning.kvalitetssikringReadOnly || !kvalitetssikringGrunnlag.data.harTilgangTilÅSaksbehandle}
        />
      )}
    </>
  );
};
