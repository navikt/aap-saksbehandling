import { hentFatteVedtakGrunnlang, hentResultat } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtak';

interface Props {
  behandlingsReferanse: string;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentFatteVedtakGrunnlang(behandlingsReferanse);
  const behandlingsResultat = await hentResultat(behandlingsReferanse);

  console.log(behandlingsResultat);

  return (
    <ForeslåVedtak
      behandlingResultat={behandlingsResultat}
      behandlingsReferanse={behandlingsReferanse}
      grunnlag={grunnlag}
    />
  );
};
