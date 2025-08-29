import { SamordningTjenestePensjon } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjon';
import {
  hentMellomlagring,
  hentSamordningTjenestePensjonGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingVersjon: number;
  behandlingreferanse: string;
  readOnly: boolean;
}

export const SamordningTjenestePensjonMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingreferanse,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningTjenestePensjonGrunnlag(behandlingreferanse),
    hentMellomlagring(behandlingreferanse, Behovstype.SAMORDNING_REFUSJONS_KRAV),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningTjenestePensjon
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
