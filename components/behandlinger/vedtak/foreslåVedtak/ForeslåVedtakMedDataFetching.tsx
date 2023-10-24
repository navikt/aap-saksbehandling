import { hentFatteVedtakGrunnlang, hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtak';
import { FlytGruppe } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse, getToken(headers()));
  const flyt = await hentFlyt2(behandlingsReferanse, getToken(headers()));

  const flytGrupper: FlytGruppe[] = flyt.flyt.filter((gruppe) => ['SYKDOM', 'ALDER'].includes(gruppe.stegGruppe));

  return <ForeslåVedtak behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} flytGrupper={flytGrupper} />;
};
