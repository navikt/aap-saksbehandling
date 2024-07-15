import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { hentBeregningsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}

export const VisBeregningMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);

  return <VisBeregning grunnlag={grunnlag} />;
};
