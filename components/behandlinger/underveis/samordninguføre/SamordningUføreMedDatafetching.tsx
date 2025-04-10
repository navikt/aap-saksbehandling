import { SamordningUføre } from 'components/behandlinger/underveis/samordninguføre/SamordningUføre';
import { hentSamordningUføreGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from "lib/utils/api";

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningUføreMedDatafetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentSamordningUføreGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningUføre
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
