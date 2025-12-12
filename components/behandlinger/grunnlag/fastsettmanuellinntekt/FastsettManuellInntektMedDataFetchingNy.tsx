import {
  hentBeregningstidspunktVurdering,
  hentManuellInntektGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegData } from 'lib/utils/steg';
import { FastsettManuellInntektNy } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektNy';
import { Behovstype } from 'lib/utils/form';

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

  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentManuellInntektGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.FASTSETT_MANUELL_INNTEKT),
  ]);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FastsettManuellInntektNy
      behandlingsversjon={stegData.behandlingVersjon}
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      behandlingErRevurdering={stegData.typeBehandling === 'Revurdering'}
    />
  );
};
