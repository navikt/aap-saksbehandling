import {
  hentMellomlagring,
  hentSamordningTjenestePensjonGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { SamordningTjenestePensjon } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjon';

interface Props {
  behandlingreferanse: string;
  stegData: StegData;
}

export const SamordningTjenestePensjonMedDataFetching = async ({ behandlingreferanse, stegData }: Props) => {
  const grunnlag = await hentSamordningTjenestePensjonGrunnlag(behandlingreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingreferanse,
    Behovstype.SAMORDNING_REFUSJONS_KRAV,
    totalReadOnly
  );

  return (
    <SamordningTjenestePensjon
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
