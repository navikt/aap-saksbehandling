import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { SykdomsvurderingMedYrkesskade } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedYrkesskade';

interface Props {
  behandlingsReferanse: string;
}

export const SykdomsvurderingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentSykdomsGrunnlag(behandlingsReferanse, getToken(headers()));

  return grunnlag.skalVurdereYrkesskade ? (
    <SykdomsvurderingMedYrkesskade behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />
  ) : (
    <Sykdomsvurdering behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />
  );
};
