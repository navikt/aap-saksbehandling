import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { hentBeregningsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, readOnly }: Props) => {
  const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);
  return <FastsettBeregning behandlingsReferanse={behandlingsReferanse} readOnly={readOnly} grunnlag={grunnlag} />;
};
