import {
  hentBeregningstidspunktVurdering,
  hentManuellInntektGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegData } from 'lib/utils/steg';
import { FastsettManuellInntektNy } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektNy';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const FastsettManuellInntektMedDataFetchingNy = async ({ behandlingsreferanse, stegData }: Props) => {
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

  return (
    <FastsettManuellInntektNy
      behandlingsversjon={stegData.behandlingVersjon}
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingErRevurdering={stegData.typeBehandling === 'Revurdering'}
    />
  );
};
