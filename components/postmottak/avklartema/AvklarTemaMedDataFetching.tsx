import { AvklarTema } from './AvklarTema';
import { hentAvklarTemaGrunnlag, hentFlyt } from 'lib/services/dokumentmottakservice/dokumentMottakService';

interface Props {
  behandlingsreferanse: string;
}
export const AvklarTemaMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const isReadOnly: boolean = !!flyt.visning.readOnly;
  const grunnlag = await hentAvklarTemaGrunnlag(behandlingsreferanse);
  return (
    <AvklarTema
      behandlingsVersjon={flyt.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag}
      readOnly={isReadOnly}
    />
  );
};
