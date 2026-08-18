import {
  hentMellomlagring,
  hentSykepengerErstatningGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData, skalViseSteg } from 'lib/utils/steg';

import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SykepengeerstatningMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentSykepengerErstatningGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (
    !skalViseSteg(
      stegData,
      grunnlag.data.sisteVedtatteVurderinger.length > 0 || grunnlag.data.nyeVurderinger.length > 0
    )
  ) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_SYKEPENGEERSTATNING_KODE,
    totalReadOnly,
    stegData.visVentekort
  );

  return (
    <Sykepengeerstatning
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
