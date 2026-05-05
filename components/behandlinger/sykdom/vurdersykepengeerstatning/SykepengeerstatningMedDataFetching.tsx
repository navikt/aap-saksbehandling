import {
  hentMellomlagring,
  hentSykepengerErstatningGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { skalViseSteg, StegData } from 'lib/utils/steg';

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
    totalReadOnly
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
