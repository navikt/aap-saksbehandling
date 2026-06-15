import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { hentAvslag11_27Grunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { Avslag11_27 } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const AvslagAndreYtelserMedDataFetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
}: Props) => {
  const grunnlag = await hentAvslag11_27Grunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_AVSLAG_11_27,
    totalReadOnly
  );

  return (
    <Avslag11_27
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
