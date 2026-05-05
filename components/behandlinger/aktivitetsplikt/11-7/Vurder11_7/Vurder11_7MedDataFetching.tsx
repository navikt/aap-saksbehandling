import { Vurder11_7 } from 'components/behandlinger/aktivitetsplikt/11-7/Vurder11_7/Vurder11_7';
import {
  hentAktivitetsplikt11_7Grunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const Vurder11_7MedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentAktivitetsplikt11_7Grunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_BRUDD_11_7_KODE,
    totalReadOnly
  );

  return (
    <Vurder11_7
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
