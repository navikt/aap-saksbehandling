import { Soningsvurdering } from './Soningsvurdering';
import { hentSoningsvurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
  behandlingsversjon: number;
  readOnly: boolean;
}

export const SoningsvurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingsversjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentSoningsvurdering(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    grunnlag.data.soningsforhold.length > 0 && (
      <Soningsvurdering
        behandlingsversjon={behandlingsversjon}
        grunnlag={grunnlag.data}
        readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      />
    )
  );
};
