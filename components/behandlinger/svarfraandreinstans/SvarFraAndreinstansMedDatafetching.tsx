import {
  hentMellomlagring,
  hentSvarFraAndreinstansGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SvarFraAndreinstans } from 'components/behandlinger/svarfraandreinstans/SvarFraAndreinstans';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const SvarFraAndreinstansMedDatafetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentSvarFraAndreinstansGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.HÅNDTER_SVAR_FRA_ANDREINSTANS,
    totalReadOnly
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
