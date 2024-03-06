import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}

export const SykdomsvurderingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentSykdomsGrunnlag(behandlingsReferanse);

  return <Sykdomsvurdering behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
