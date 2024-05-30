import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import {
  hentBeregningsGrunnlag,
  hentBeregningsGrunnlagMock,
  hentBeregningsVurdering,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const vurdering = await hentBeregningsVurdering(behandlingsReferanse);
  const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);
  const mockGrunnlag = await hentBeregningsGrunnlagMock();

  return (
    <FastsettBeregning
      readOnly={readOnly}
      vurdering={vurdering}
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag}
      mockGrunnlag={mockGrunnlag}
    />
  );
};
