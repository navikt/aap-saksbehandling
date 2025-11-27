import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import { hentManuellInntektGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { isProd } from 'lib/utils/environment';
import { FastsettManuellInntektInfo } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektInfo';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const FastsettManuellInntektMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentManuellInntektGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, !!grunnlag.data.vurdering)) {
    return null;
  }
  if (!isProd()) {
    //  Manglende pensjonsgivende inntekter / EØS inntekter
    return (
      <FastsettManuellInntektInfo
        behandlingsversjon={stegData.behandlingVersjon}
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      />
    );
  }
  return (
    <FastsettManuellInntekt
      behandlingsversjon={stegData.behandlingVersjon}
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
