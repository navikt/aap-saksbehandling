import { AvklarSak } from 'components/postmottak/avklarsak/AvklarSak';
import { hentFinnSakGrunnlag, hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
interface Props {
  behandlingsreferanse: string;
}
export const AvklarSakMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const isReadOnly: boolean = !!flyt.visning.readOnly;
  const grunnlag = await hentFinnSakGrunnlag(behandlingsreferanse);
  return (
    <AvklarSak
      behandlingsVersjon={flyt.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag}
      readOnly={isReadOnly}
    />
  );
};
