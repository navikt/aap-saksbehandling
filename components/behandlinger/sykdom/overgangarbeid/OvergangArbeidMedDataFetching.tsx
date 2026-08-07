import {
  hentMellomlagring,
  hentOvergangArbeidGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';

import { OvergangArbeid } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const OvergangArbeidMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentOvergangArbeidGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle || !stegData.skalViseSteg;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.OVERGANG_ARBEID,
    totalReadOnly,
    stegData.visVentekort
  );

  return (
    <OvergangArbeid
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      skalStegVurderes={stegData.skalViseSteg}
    />
  );
};
