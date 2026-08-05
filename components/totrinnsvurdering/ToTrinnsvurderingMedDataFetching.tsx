import { hentGjeldendeMarkeringerForBehandling } from 'lib/services/oppgaveservice/oppgaveservice';
import {
  hentFatteVedtakGrunnlang,
  hentFlyt,
  hentKvalitetssikringGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { MarkeringHaster } from 'lib/types/oppgaveTypes';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { ToTrinnsvurdering } from 'components/totrinnsvurdering/ToTrinnsvurdering';

interface Props {
  behandlingsreferanse: string;
}

export const ToTrinnsvurderingMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const [fatteVedtakGrunnlag, kvalitetssikringGrunnlag, flyt, markeringer] = await Promise.all([
    hentFatteVedtakGrunnlang(behandlingsreferanse),
    hentKvalitetssikringGrunnlag(behandlingsreferanse),
    hentFlyt(behandlingsreferanse),
    hentGjeldendeMarkeringerForBehandling(behandlingsreferanse),
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
    totalReadOnly,
    flyt.data.visning.visVentekort
  );

  const hastemarkering = markeringer.data
    .filter((markering) => markering.markeringType === MarkeringHaster && markering.hendelseType != 'FJERNET')
    ?.at(0);

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
