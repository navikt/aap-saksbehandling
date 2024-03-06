import { hentFatteVedtakGrunnlang, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtak';
import { FlytGruppe } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);

  const flytGrupper: FlytGruppe[] = flyt.flyt.filter((gruppe) => ['SYKDOM', 'ALDER'].includes(gruppe.stegGruppe));

  return <ForeslåVedtak behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} flytGrupper={flytGrupper} />;
};
