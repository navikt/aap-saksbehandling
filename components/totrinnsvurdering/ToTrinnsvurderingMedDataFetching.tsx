import { hentFatteVedtakGrunnlang, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsvurdering } from 'components/totrinnsvurdering/ToTrinnsvurdering';

interface Props {
  behandlingsReferanse: string;
}
export const ToTrinnsvurderingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const fatteVedtakGrunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);

  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <>
      {flyt.visning.visBeslutterKort && (
        <ToTrinnsvurdering
          fatteVedtakGrunnlag={fatteVedtakGrunnlag}
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingVersjon}
          readOnly={flyt.visning.beslutterReadOnly}
        />
      )}
    </>
  );
};
