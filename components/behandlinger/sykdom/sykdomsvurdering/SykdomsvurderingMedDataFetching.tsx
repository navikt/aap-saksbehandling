import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SykdomsvurderingMedYrkesskade } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedYrkesskade';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const SykdomsvurderingMedDataFetching = async ({ behandlingsReferanse, readOnly }: Props) => {
  const grunnlag = await hentSykdomsGrunnlag(behandlingsReferanse);

  return grunnlag.skalVurdereYrkesskade ? (
    <SykdomsvurderingMedYrkesskade
      behandlingsReferanse={behandlingsReferanse}
      grunnlag={grunnlag}
      readOnly={readOnly}
    />
  ) : (
    <Sykdomsvurdering behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} readOnly={readOnly} />
  );
};
