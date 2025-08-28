import {
  hentFatteVedtakGrunnlang,
  hentFlyt,
  hentKvalitetssikringGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsvurdering } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

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

  const erKvalitetssikring = flyt.data.visning.visKvalitetssikringKort && !flyt.data.visning.visBeslutterKort;

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsReferanse,
    erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE
  );
  return (
    <>
      {flyt.data.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          grunnlag={fatteVedtakGrunnlag.data}
          erKvalitetssikring={false}
          behandlingsReferanse={behandlingsReferanse}
          readOnly={flyt.data.visning.beslutterReadOnly || !fatteVedtakGrunnlag.data.harTilgangTilÅSaksbehandle}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
        />
      )}
      {flyt.data.visning.visKvalitetssikringKort && (
        <ToTrinnsvurdering
          grunnlag={kvalitetssikringGrunnlag.data}
          behandlingsReferanse={behandlingsReferanse}
          erKvalitetssikring={true}
          readOnly={
            flyt.data.visning.kvalitetssikringReadOnly || !kvalitetssikringGrunnlag.data.harTilgangTilÅSaksbehandle
          }
          initialMellomlagretVurdering={initialMellomlagretVurdering}
        />
      )}
    </>
  );
};
