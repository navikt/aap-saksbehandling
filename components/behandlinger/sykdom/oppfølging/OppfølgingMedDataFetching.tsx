import { hentBistandsbehovGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';

interface Props {
  behandlingsReferanse: string;
}

export const OppfølgingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentBistandsbehovGrunnlag(behandlingsReferanse);

  return <Oppfølging behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
