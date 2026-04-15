import {
  hentMellomlagring,
  hentOvergangArbeidGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { OvergangArbeid } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const OvergangArbeidMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentOvergangArbeidGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.OVERGANG_ARBEID),
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
    />
  );
};
