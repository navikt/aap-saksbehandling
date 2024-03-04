import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';

interface Props {
  behandlingsReferanse: string;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse }: Props) => {
  const sykdomsgrunnlag = await hentSykdomsGrunnlag(behandlingsReferanse, getToken(headers()));
  return <FastsettBeregning behandlingsReferanse={behandlingsReferanse} sykdomsgrunnlag={sykdomsgrunnlag} />;
};
