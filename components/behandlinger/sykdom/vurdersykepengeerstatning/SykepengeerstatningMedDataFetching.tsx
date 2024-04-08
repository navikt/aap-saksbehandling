import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { hentSykepengerErstatningGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}

export const SykepengeerstatningMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentSykepengerErstatningGrunnlag(behandlingsReferanse);

  return <Sykepengeerstatning behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
