import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import { hentManuellInntektGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
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
  const grunnlag = await hentManuellInntektGrunnlag(behandlingsreferanse);

  if (toggles.featureManglendePGIOgEøsInntekter) {
    if (isError(grunnlag)) {
      return null;
    }
    return (
      <FastsettManuellInntektInfo
        behandlingsversjon={stegData.behandlingVersjon}
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      />
    );
  }

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
