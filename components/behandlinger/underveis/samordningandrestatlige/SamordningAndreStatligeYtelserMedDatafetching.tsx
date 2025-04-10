import { SamordningAndreStatligeYtelser } from 'components/behandlinger/underveis/samordningandrestatlige/SamordningAndreStatligeYtelser';
import { hentSamordningAndreStatligeYtelseGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningAndreStatligeYtelserMedDatafetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingsreferanse,
}: Props) => {
  const grunnlag = await hentSamordningAndreStatligeYtelseGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningAndreStatligeYtelser
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
