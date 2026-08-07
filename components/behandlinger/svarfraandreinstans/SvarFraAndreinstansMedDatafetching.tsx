import {
  hentMellomlagring,
  hentSvarFraAndreinstansGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { SvarFraAndreinstans } from 'components/behandlinger/svarfraandreinstans/SvarFraAndreinstans';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
}

export const SvarFraAndreinstansMedDatafetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  visVentekort,
}: Props) => {
  const grunnlag = await hentSvarFraAndreinstansGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.HÅNDTER_SVAR_FRA_ANDREINSTANS,
    totalReadOnly,
    visVentekort
  );

  return (
    <SvarFraAndreinstans
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
