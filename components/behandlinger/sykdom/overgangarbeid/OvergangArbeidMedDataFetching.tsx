import {
  hentMellomlagring,
  hentOvergangArbeidGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { OvergangArbeid } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const OvergangArbeidMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentOvergangArbeidGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.OVERGANG_ARBEID),
  ]);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <OvergangArbeid
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      typeBehandling={stegData.typeBehandling}
    />
  );
};
