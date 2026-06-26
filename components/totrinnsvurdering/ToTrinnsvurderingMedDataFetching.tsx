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
import { hentSisteAktiveMarkeringerForBehandling } from 'lib/services/oppgaveservice/oppgaveservice';
import { MarkeringHaster } from 'lib/types/oppgaveTypes';

interface Props {
  behandlingsreferanse: string;
}

export const ToTrinnsvurderingMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const [fatteVedtakGrunnlag, kvalitetssikringGrunnlag, flyt, markeringer] = await Promise.all([
    hentFatteVedtakGrunnlang(behandlingsreferanse),
    hentKvalitetssikringGrunnlag(behandlingsreferanse),
    hentFlyt(behandlingsreferanse),
    hentSisteAktiveMarkeringerForBehandling(behandlingsreferanse),
  ]);

  if (isError(fatteVedtakGrunnlag) || isError(kvalitetssikringGrunnlag) || isError(flyt) || isError(markeringer)) {
    return <ApiException apiResponses={[fatteVedtakGrunnlag, kvalitetssikringGrunnlag, flyt]} />;
  }

  const erKvalitetssikring = flyt.data.visning.visKvalitetssikringKort && !flyt.data.visning.visBeslutterKort;

  const totalReadOnly = erKvalitetssikring
    ? !kvalitetssikringGrunnlag.data.harTilgangTilÅSaksbehandle || flyt.data.visning.kvalitetssikringReadOnly
    : !fatteVedtakGrunnlag.data.harTilgangTilÅSaksbehandle || flyt.data.visning.beslutterReadOnly;

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE,
    totalReadOnly
  );

  const hastemarkering = markeringer.data.filter((markering) => markering.markeringType === MarkeringHaster)?.at(0);

  return (
    <>
      {flyt.data.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          grunnlag={fatteVedtakGrunnlag.data}
          erKvalitetssikring={false}
          harTilgangTilÅSaksbehandle={fatteVedtakGrunnlag.data.harTilgangTilÅSaksbehandle}
          behandlingsreferanse={behandlingsreferanse}
          readOnly={flyt.data.visning.beslutterReadOnly}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
          behandlingsversjon={flyt.data.behandlingVersjon}
        />
      )}
      {flyt.data.visning.visKvalitetssikringKort && (
        <ToTrinnsvurdering
          grunnlag={kvalitetssikringGrunnlag.data}
          behandlingsreferanse={behandlingsreferanse}
          erKvalitetssikring={true}
          harTilgangTilÅSaksbehandle={kvalitetssikringGrunnlag.data.harTilgangTilÅSaksbehandle}
          readOnly={flyt.data.visning.kvalitetssikringReadOnly}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
          behandlingsversjon={flyt.data.behandlingVersjon}
          hastemarkering={hastemarkering}
        />
      )}
    </>
  );
};
