import { BehandlendeEnhet } from './BehandlendeEnhet';
import { TypeBehandling } from 'lib/types/types';
import {
  hentBehandlendeEnhetGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

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

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_BEHANDLENDE_ENHET,
    totalReadOnly
  );

  return (
    <BehandlendeEnhet
      grunnlag={grunnlag.data}
      typeBehandling={typeBehandling}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
