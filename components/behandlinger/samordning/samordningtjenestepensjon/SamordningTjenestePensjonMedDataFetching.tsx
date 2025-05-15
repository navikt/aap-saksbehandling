import { SamordningTjenestePensjon } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjon';
import { hentSamordningTjenestePensjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingVersjon: number;
  behandlingreferanse: string;
  readOnly: boolean;
}

export const SamordningTjenestePensjonMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingreferanse,
}: Props) => {
  const grunnlag = await hentSamordningTjenestePensjonGrunnlag(behandlingreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningTjenestePensjon
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
