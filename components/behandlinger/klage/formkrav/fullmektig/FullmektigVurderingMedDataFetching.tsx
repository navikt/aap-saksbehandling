import { hentFullmektigGrunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { FullmektigVurdering } from 'components/behandlinger/klage/formkrav/fullmektig/FullmektigVurdering';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
  typeBehandling: TypeBehandling;
}

export const FullmektigVurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  visVentekort,
  typeBehandling,
}: Props) => {
  const grunnlag = await hentFullmektigGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_FULLMEKTIG,
    totalReadOnly,
    visVentekort
  );

  return (
    <FullmektigVurdering
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      typeBehandling={typeBehandling}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
