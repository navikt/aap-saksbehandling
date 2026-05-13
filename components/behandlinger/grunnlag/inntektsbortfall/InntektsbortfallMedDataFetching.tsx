import {
  hentInntektsBortfallGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { Inntektsbortfall } from './Inntektsbortfall';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const InntektsbortfallMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentInntektsBortfallGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (grunnlag.data.grunnlag.under62ÅrVedSøknadstidspunkt.resultat) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
    totalReadOnly
  );

  return (
    <Inntektsbortfall
      readOnly={totalReadOnly}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
