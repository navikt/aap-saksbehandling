import { hentRimeligGrunnMeldepliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { IkkeOppfyltMeldeplikt } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeOppfyltMeldeplikt';

interface Props {
  behandlingsreferanse: string;
}

export const IkkeOppfyltMeldepliktMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentRimeligGrunnMeldepliktGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return <IkkeOppfyltMeldeplikt grunnlag={grunnlag.data} />;
};
