import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import {
  hentMellomlagring,
  hentSykepengerErstatningGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const SykepengeerstatningMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSykepengerErstatningGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.VURDER_SYKEPENGEERSTATNING_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.vurdering != null)) {
    return null;
  }

  return (
    <Sykepengeerstatning
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
