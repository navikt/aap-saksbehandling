import { BehandlendeEnhet } from './BehandlendeEnhet';
import { TypeBehandling } from 'lib/types/types';
import { hentBehandlendeEnhetGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

export const BehandlendeEnhetMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  typeBehandling,
  readOnly,
}: {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}) => {
  const grunnlag = await hentBehandlendeEnhetGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <BehandlendeEnhet
      grunnlag={grunnlag.data}
      typeBehandling={typeBehandling}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
    />
  );
};
