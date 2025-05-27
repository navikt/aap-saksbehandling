import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import { hentManuellInntektGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingversjon: number;
  behandlingsreferanse: string;
  readOnly: boolean;
}

export const FastsettManuellInntektMedDataFetching = async ({
  behandlingversjon,
  behandlingsreferanse,
  readOnly,
}: Props) => {
  const grunnlag = await hentManuellInntektGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FastsettManuellInntekt
      behandlingsversjon={behandlingversjon}
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
