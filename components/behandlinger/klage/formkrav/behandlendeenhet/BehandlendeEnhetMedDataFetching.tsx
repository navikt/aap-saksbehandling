import {
  hentBehandlendeEnhetGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

import { BehandlendeEnhet } from './BehandlendeEnhet';

export const BehandlendeEnhetMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  typeBehandling,
  readOnly,
  visVentekort,
}: {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  visVentekort: boolean;
}) => {
  const grunnlag = await hentBehandlendeEnhetGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_BEHANDLENDE_ENHET,
    totalReadOnly,
    visVentekort
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
