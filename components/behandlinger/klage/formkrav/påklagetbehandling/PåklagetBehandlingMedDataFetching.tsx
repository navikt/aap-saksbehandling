import { TypeBehandling } from 'lib/types/types';
import { PåklagetBehandling } from './PåklagetBehandling';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentPåklagetBehandlingGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const PåklagetBehandlingMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  typeBehandling,
  behandlingsreferanse,
}: Props) => {
  const grunnlag = await hentPåklagetBehandlingGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <PåklagetBehandling
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      typeBehandling={typeBehandling}
      grunnlag={grunnlag.data}
    />
  );
};
