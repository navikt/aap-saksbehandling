import { hentBistandsbehovGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';

interface Props {
  behandlingsReferanse: string;
  erBeslutter: boolean;
}

export const OppfølgingMedDataFetching = async ({ behandlingsReferanse, erBeslutter }: Props) => {
  const grunnlag = await hentBistandsbehovGrunnlag(behandlingsReferanse);

  return <Oppfølging behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} erBeslutter={erBeslutter} />;
};
