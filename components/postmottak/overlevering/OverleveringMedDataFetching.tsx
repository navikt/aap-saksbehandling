import { hentFlyt, hentOverleveringGrunnlag } from 'lib/services/postmottakservice/postmottakservice';
import { Overlevering } from './Overlevering';

interface Props {
  behandlingsreferanse: string;
}

export const OverleveringMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const isReadOnly: boolean = !!flyt.visning.readOnly;
  const grunnlag = await hentOverleveringGrunnlag(behandlingsreferanse);
  return (
    <Overlevering
      behandlingsVersjon={flyt.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag}
      readOnly={isReadOnly}
    />
  );
};
