import { Medlemskap } from 'components/behandlinger/medlemskap/Medlemskap';
import { hentMedlemskapGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}

export const MedlemskapMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentMedlemskapGrunnlag(behandlingsReferanse);

  return <Medlemskap grunnlag={grunnlag} behandlingsReferanse={behandlingsReferanse} />;
};
