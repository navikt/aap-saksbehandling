import { hentFatteVedtakGrunnlang, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsKontroll } from 'components/totrinsskontroll/ToTrinnsKontroll';

interface Props {
  behandlingsReferanse: string;
}
export const ToTrinnskontrollMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const fatteVedtakGrunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);

  return (
    <ToTrinnsKontroll
      fatteVedtakGrunnlag={fatteVedtakGrunnlag}
      behandlingsReferanse={behandlingsReferanse}
      readOnly={flyt.visning.beslutterReadOnly}
    />
  );
};
