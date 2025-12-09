import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import {
  hentBeregningstidspunktVurdering,
  hentManuellInntektGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { FastsettManuellInntektInfo } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektInfo';
import { toggles } from 'lib/utils/toggles';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const FastsettManuellInntektMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  // Nytt kort
  if (toggles.featureManglendePGIOgEøsInntekter) {
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
      <FastsettManuellInntektInfo
        behandlingsversjon={stegData.behandlingVersjon}
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      />
    );
  }

  // Eksisterende kort
  const grunnlag = await hentManuellInntektGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, !!grunnlag.data.vurdering)) {
    return null;
  }
  return (
    <FastsettManuellInntekt
      behandlingsversjon={stegData.behandlingVersjon}
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
