import { hentResultat } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtak';

interface Props {
  behandlingsReferanse: string;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const behandlingsResultat = await hentResultat(behandlingsReferanse);

  return <ForeslåVedtak behandlingResultat={behandlingsResultat} behandlingsReferanse={behandlingsReferanse} />;
};
