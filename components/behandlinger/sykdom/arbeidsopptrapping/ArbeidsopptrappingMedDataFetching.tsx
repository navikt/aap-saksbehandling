import {
  hentArbeidsOpptrappingGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegData } from 'lib/utils/steg';
import { Arbeidsopptrapping } from 'components/behandlinger/sykdom/arbeidsopptrapping/Arbeidsopptrapping';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}
export const ArbeidsopptrappingMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentArbeidsOpptrappingGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.ARBEIDSOPPTRAPPING_KODE,
    totalReadOnly
  );

  return (
    <Arbeidsopptrapping
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
