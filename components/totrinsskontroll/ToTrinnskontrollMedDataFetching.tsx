import { hentFatteVedtakGrunnlang } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ToTrinnsKontroll } from 'components/totrinsskontroll/ToTrinnsKontroll';

interface Props {
  behandlingsReferanse: string;
}
export const ToTrinnskontrollMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const fatteVedtakGrunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  return (
    <>
      {fatteVedtakGrunnlag.vurderinger.map((vurderinger) => (
        <ToTrinnsKontroll definisjon={vurderinger.definisjon} key={vurderinger.definisjon} />
      ))}
    </>
  );
};
