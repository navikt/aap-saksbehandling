import { SamordningSosialstønad } from 'components/behandlinger/samordning/samordningsosial/SamordningSosialstønad';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
}

export const SamordningSosialstønadMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentRefusjonGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }
  return <SamordningSosialstønad grunnlag={grunnlag.data} />;
};
