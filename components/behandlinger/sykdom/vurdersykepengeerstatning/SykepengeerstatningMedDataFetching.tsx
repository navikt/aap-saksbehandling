import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { hentSykepengerErstatningGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  erBeslutter: boolean;
}

export const SykepengeerstatningMedDataFetching = async ({ behandlingsReferanse, erBeslutter }: Props) => {
  const grunnlag = await hentSykepengerErstatningGrunnlag(behandlingsReferanse);

  return (
    <Sykepengeerstatning behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} erBeslutter={erBeslutter} />
  );
};
