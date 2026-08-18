import { hentAvslag11_27Grunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { Avslag11_27 } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
  typeBehandling: TypeBehandling;
}

export const AvslagAndreYtelserMedDataFetching = async ({
  behandlingsreferanse,
  readOnly,
  visVentekort,
  behandlingVersjon,
  typeBehandling,
}: Props) => {
  const grunnlag = await hentAvslag11_27Grunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_AVSLAG_11_27,
    totalReadOnly,
    visVentekort
  );

  return (
    <Avslag11_27
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      typeBehandling={typeBehandling}
    />
  );
};
