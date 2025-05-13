import { SamordningSosialhjelp } from 'components/behandlinger/samordning/samordningsosial/SamordningSosialhjelp';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
}

export const SamordningSosialhjelpMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentRefusjonGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }
  return <SamordningSosialhjelp grunnlag={grunnlag.data} />;
};
