import { hentFatteVedtakGrunnlang, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsKontroll } from 'components/totrinsskontroll/ToTrinnsKontroll';

interface Props {
  behandlingsReferanse: string;
}
export const ToTrinnskontrollMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const fatteVedtakGrunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);

  const skalViseToTrinnsKontroll = flyt.aktivGruppe === 'FATTE_VEDTAK';

  return (
    <>
      {skalViseToTrinnsKontroll && (
        <ToTrinnsKontroll fatteVedtakGrunnlag={fatteVedtakGrunnlag} behandlingsReferanse={behandlingsReferanse} />
      )}
    </>
  );
};
