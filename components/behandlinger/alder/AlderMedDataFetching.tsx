import { hentAlderGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Alder } from 'components/behandlinger/alder/Alder';

interface Props {
  behandlingsReferanse: string;
}

export const AlderMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentAlderGrunnlag(behandlingsReferanse);

  return <Alder grunnlag={grunnlag} />;
};
