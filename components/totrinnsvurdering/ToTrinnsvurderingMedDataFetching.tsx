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
  const fatteVedtakGrunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  const kvalitetssikringGrunnlag = await hentKvalitetssikringGrunnlag(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);

  const behandlingVersjon = flyt.behandlingVersjon;
  const visKvalitetssikringKort = flyt.aktivtSteg === 'KVALITETSSIKRING'; //TODO Hente state fra backend for når det skal vises

  return (
    <>
      {flyt.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          grunnlag={fatteVedtakGrunnlag}
          erKvalitetssikring={false}
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.visning.beslutterReadOnly}
        />
      )}
      {visKvalitetssikringKort && (
        <ToTrinnsvurdering
          grunnlag={kvalitetssikringGrunnlag}
          behandlingsReferanse={behandlingsReferanse}
          erKvalitetssikring={true}
          behandlingVersjon={behandlingVersjon}
          readOnly={false} //TODO Hente verdi fra backend
        />
      )}
    </>
  );
};
