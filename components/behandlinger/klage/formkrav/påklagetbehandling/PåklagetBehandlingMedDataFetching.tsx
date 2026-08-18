import {
  hentMellomlagring,
  hentPåklagetBehandlingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

import { PåklagetBehandling } from './PåklagetBehandling';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
  typeBehandling: TypeBehandling;
}

export const PåklagetBehandlingMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  visVentekort,
  typeBehandling,
  behandlingsreferanse,
}: Props) => {
  const grunnlag = await hentPåklagetBehandlingGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
    totalReadOnly,
    visVentekort
  );

  return (
    <PåklagetBehandling
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      typeBehandling={typeBehandling}
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
