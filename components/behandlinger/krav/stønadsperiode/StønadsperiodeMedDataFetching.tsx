import { hentStønadsperiodeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { StegData } from 'lib/utils/steg';

import { Stønadsperiode } from 'components/behandlinger/krav/stønadsperiode/Stønadsperiode';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const StønadsperiodeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentStønadsperiodeGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const harTidligereVurderinger =
    grunnlag.data.vedtatteVurderinger != null && grunnlag.data.vedtatteVurderinger.length > 0;
  const harNyeVurderinger = grunnlag.data.nyeVurderinger != null && grunnlag.data.nyeVurderinger.length > 0;

  if (!harTidligereVurderinger && !harNyeVurderinger) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  return (
    <Stønadsperiode grunnlag={grunnlag.data} readOnly={totalReadOnly} behandlingVersjon={stegData.behandlingVersjon} />
  );
};
