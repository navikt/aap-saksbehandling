import { FinnSak } from './FinnSak';
import { hentFinnSakGrunnlag, hentFlyt } from 'lib/services/dokumentmottakservice/dokumentMottakService';
interface Props {
  behandlingsreferanse: string;
}
export const FinnSakMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const isReadOnly: boolean = !!flyt.visning.readOnly;
  const grunnlag = await hentFinnSakGrunnlag(behandlingsreferanse);
  return (
    <FinnSak
      behandlingsVersjon={flyt.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag}
      readOnly={isReadOnly}
    />
  );
};
