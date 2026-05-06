import { TypeBehandling } from 'lib/types/types';
import { PåklagetBehandling } from './PåklagetBehandling';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import {
  hentMellomlagring,
  hentPåklagetBehandlingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';

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

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
    totalReadOnly
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
