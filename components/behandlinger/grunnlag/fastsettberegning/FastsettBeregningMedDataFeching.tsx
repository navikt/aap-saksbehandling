import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { hentBeregningsVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, readOnly }: Props) => {
  const vurdering = await hentBeregningsVurdering(behandlingsReferanse);
  // const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);

  return (
    <FastsettBeregning
      behandlingsReferanse={behandlingsReferanse}
      readOnly={readOnly}
      vurdering={vurdering}
      // grunnlag={grunnlag}
    />
  );
};
