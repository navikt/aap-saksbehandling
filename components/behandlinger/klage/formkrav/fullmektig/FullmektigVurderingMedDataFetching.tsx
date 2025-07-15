import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { TypeBehandling } from 'lib/types/types';
import { hentFullmektigGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { FullmektigVurdering } from 'components/behandlinger/klage/formkrav/fullmektig/FullmektigVurdering';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const FullmektigVurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const grunnlag = await hentFullmektigGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FullmektigVurdering
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      typeBehandling={typeBehandling}
    />
  );
};
