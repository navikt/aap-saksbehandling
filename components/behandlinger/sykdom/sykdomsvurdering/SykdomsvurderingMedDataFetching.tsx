import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SykdomsvurderingMedYrkesskade } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedYrkesskade';
import { SykdomsGrunnlag } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
}

export const SykdomsvurderingMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentSykdomsGrunnlag(behandlingsReferanse);

  return grunnlag.skalVurdereYrkesskade ? (
    <SykdomsvurderingMedYrkesskade grunnlag={grunnlag} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />
  ) : (
    <Sykdomsvurdering grunnlag={grunnlag} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />
  );
};
