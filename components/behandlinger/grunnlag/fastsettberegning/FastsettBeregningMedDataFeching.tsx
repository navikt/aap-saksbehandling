import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { hentBeregningsVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const vurdering = await hentBeregningsVurdering(behandlingsReferanse);

  return <FastsettBeregning readOnly={readOnly} vurdering={vurdering} behandlingVersjon={behandlingVersjon} />;
};
