import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';

interface Props {
  behandlingsReferanse: string;
  status: 'OPPRETTET' | 'AVSLUTTET';
}

export const SykdomsvurderingMedDataFetching = async ({ behandlingsReferanse, status }: Props) => {
  const grunnlag = await hentSykdomsGrunnlag(behandlingsReferanse, getToken(headers()));

  return <Sykdomsvurdering behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} status={status} />;
};
