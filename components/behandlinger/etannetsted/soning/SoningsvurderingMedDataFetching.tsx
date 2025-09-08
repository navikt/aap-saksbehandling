import { Soningsvurdering } from './Soningsvurdering';
import { hentMellomlagring, hentSoningsvurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SoningsvurderingMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSoningsvurdering(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SONINGSFORRHOLD),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.vurderinger.length > 0)) {
    return null;
  }

  return (
    grunnlag.data.soningsforhold.length > 0 && (
      <Soningsvurdering
        behandlingsversjon={stegData.behandlingVersjon}
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
    )
  );
};
