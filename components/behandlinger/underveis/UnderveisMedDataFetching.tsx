import { Underveis } from 'components/behandlinger/underveis/Underveis';
import { hentUnderveisGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
}

export const UnderveisMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentUnderveisGrunnlag(behandlingsreferanse);
  return <Underveis grunnlag={grunnlag} />;
};
