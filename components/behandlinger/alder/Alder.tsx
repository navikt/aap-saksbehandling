import { hentAlderGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandlingsReferanse: string;
}

export const Alder = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentAlderGrunnlag(behandlingsReferanse);

  return <div>{formaterDatoForFrontend(grunnlag.fødselsdato)}</div>;
};
