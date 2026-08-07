import {
  hentMellomlagring,
  hentRettighetsperiodeGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData, skalViseSteg } from 'lib/utils/steg';

import { VurderRettighetsperiode } from 'components/behandlinger/rettighetsperiode/vurderrettighetsperiode/VurderRettighetsperiode';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const VurderRettighetsperiodeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const rettighetsperiodeGrunnlag = await hentRettighetsperiodeGrunnlag(behandlingsreferanse);

  if (isError(rettighetsperiodeGrunnlag)) {
    return <ApiException apiResponses={[rettighetsperiodeGrunnlag]} />;
  }

  if (!skalViseSteg(stegData, rettighetsperiodeGrunnlag.data.vurdering != null)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !rettighetsperiodeGrunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_RETTIGHETSPERIODE,
    totalReadOnly,
    stegData.visVentekort
  );

  return (
    <VurderRettighetsperiode
      grunnlag={rettighetsperiodeGrunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
