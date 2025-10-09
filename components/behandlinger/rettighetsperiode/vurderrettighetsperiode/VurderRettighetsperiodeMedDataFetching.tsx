import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VurderRettighetsperiode } from 'components/behandlinger/rettighetsperiode/vurderrettighetsperiode/VurderRettighetsperiode';
import {
  hentMellomlagring,
  hentRettighetsperiodeGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const VurderRettighetsperiodeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [rettighetsperiodeGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentRettighetsperiodeGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.VURDER_RETTIGHETSPERIODE),
  ]);

  if (isError(rettighetsperiodeGrunnlag)) {
    return <ApiException apiResponses={[rettighetsperiodeGrunnlag]} />;
  }

  if (!skalViseSteg(stegData, rettighetsperiodeGrunnlag.data.vurdering != null)) {
    return null;
  }

  return (
    <VurderRettighetsperiode
      grunnlag={rettighetsperiodeGrunnlag.data}
      readOnly={stegData.readOnly || !rettighetsperiodeGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
