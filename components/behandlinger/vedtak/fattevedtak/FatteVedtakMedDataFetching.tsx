import { FatteVedtak } from 'components/behandlinger/vedtak/fattevedtak/FatteVedtak';
import {
  hentBistandsbehovGrunnlag,
  hentStudentGrunnlag,
  hentSykdomsGrunnlag,
  hentSykepengerErstatningGrunnlag,
  hentUnntakMeldepliktGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}

export const FatteVedtakMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const [sykdomsgrunnlag, studentGrunnlag, bistandsbehovGrunnlag, sykepengeerstatningGrunnlag, meldepliktGrunnlag] =
    await Promise.all([
      hentSykdomsGrunnlag(behandlingsReferanse),
      hentStudentGrunnlag(behandlingsReferanse),
      hentBistandsbehovGrunnlag(behandlingsReferanse),
      hentSykepengerErstatningGrunnlag(behandlingsReferanse),
      hentUnntakMeldepliktGrunnlag(behandlingsReferanse),
    ]);

  return (
    <FatteVedtak
      behandlingsReferanse={behandlingsReferanse}
      sykepengeerstatningGrunnlag={sykepengeerstatningGrunnlag}
      studentGrunnlag={studentGrunnlag}
      sykdomsGrunnlag={sykdomsgrunnlag}
      bistandsGrunnlag={bistandsbehovGrunnlag}
      fritakMeldepliktGrunnlag={meldepliktGrunnlag}
    />
  );
};
