import { hentBistandsbehovGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';
import { TypeBehandling } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const BistandsbehovMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const grunnlag = await hentBistandsbehovGrunnlag(behandlingsReferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <Bistandsbehov
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      typeBehandling={typeBehandling}
    />
  );
};
