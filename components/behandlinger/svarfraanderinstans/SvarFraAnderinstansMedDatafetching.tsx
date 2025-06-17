import { hentSvarFraAndreinstansGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SvarFraAndreinstans } from 'components/behandlinger/svarfraanderinstans/SvarFraAndreinstans';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const SvarFraAnderinstansMedDatafetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentSvarFraAndreinstansGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return <SvarFraAndreinstans grunnlag={grunnlag.data} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
