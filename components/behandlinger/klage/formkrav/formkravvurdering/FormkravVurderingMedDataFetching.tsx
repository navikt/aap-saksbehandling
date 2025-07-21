import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { FormkravVurdering } from './FormkravVurdering';
import { TypeBehandling } from 'lib/types/types';
import { hentFormkravGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const FormkravVurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const grunnlag = await hentFormkravGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FormkravVurdering
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      typeBehandling={typeBehandling}
    />
  );
};
