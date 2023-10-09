import { hentFatteVedtakGrunnlang } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtak';

interface Props {
  behandlingsReferanse: string;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse, getToken(headers()));

  return <ForeslåVedtak behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
