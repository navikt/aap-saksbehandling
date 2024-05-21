import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { hentBeregningsVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const vurdering = await hentBeregningsVurdering(behandlingsReferanse);
  // const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);

  return (
    <FastsettBeregning
      behandlingsReferanse={behandlingsReferanse}
      readOnly={readOnly}
      vurdering={vurdering}
      behandlingVersjon={behandlingVersjon}
      // grunnlag={grunnlag}
    />
  );
};
