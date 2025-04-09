import { SamordningSosialhjelp } from 'components/behandlinger/underveis/samordningsosial/SamordningSosialhjelp';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const SamordningSosialhjelpMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentRefusjonGrunnlag(behandlingsreferanse);
  if (grunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[grunnlag]} />;
  }
  return <SamordningSosialhjelp grunnlag={grunnlag.data} />;
};
