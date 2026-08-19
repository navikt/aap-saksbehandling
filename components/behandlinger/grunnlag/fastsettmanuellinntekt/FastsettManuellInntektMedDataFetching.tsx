import {
  hentBeregningstidspunktVurdering,
  hentManuellInntektGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegData } from 'lib/utils/steg';
import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const FastsettManuellInntektMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const beregningstidspunkt = await hentBeregningstidspunktVurdering(behandlingsreferanse);
  if (isError(beregningstidspunkt)) {
    return <ApiException apiResponses={[beregningstidspunkt]} />;
  }

  const nedsattArbeidsevneDato = beregningstidspunkt.data.vurdering?.nedsattArbeidsevneDato;
  if (!nedsattArbeidsevneDato) {
    return null;
  }

  const grunnlag = await hentManuellInntektGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_MANUELL_INNTEKT,
    totalReadOnly
  );

  return (
    <FastsettManuellInntekt
      behandlingsversjon={stegData.behandlingVersjon}
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      behandlingErRevurdering={stegData.typeBehandling === 'Revurdering'}
    />
  );
};
