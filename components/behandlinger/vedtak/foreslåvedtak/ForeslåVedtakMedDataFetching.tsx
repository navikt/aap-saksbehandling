import { hentResultat } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon }: Props) => {
  const behandlingsResultat = await hentResultat(behandlingsReferanse);

  return (
    <ForeslåVedtak
      behandlingResultat={behandlingsResultat}
      behandlingsReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
