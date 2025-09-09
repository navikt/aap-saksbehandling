import { SamordningSosialstønad } from 'components/behandlinger/samordning/samordningsosial/SamordningSosialstønad';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { skalViseSteg, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SamordningSosialstønadMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentRefusjonGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (
    !skalViseSteg(stegData, grunnlag.data.gjeldendeVurderinger != null && grunnlag.data.gjeldendeVurderinger.length > 0)
  ) {
    return null;
  }

  return <SamordningSosialstønad grunnlag={grunnlag.data} />;
};
