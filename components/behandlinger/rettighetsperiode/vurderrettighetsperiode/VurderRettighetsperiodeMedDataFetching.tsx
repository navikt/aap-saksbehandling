import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VurderRettighetsperiode } from 'components/behandlinger/rettighetsperiode/vurderrettighetsperiode/VurderRettighetsperiode';
import {
  hentMellomlagring,
  hentRettighetsperiodeGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const VurderRettighetsperiodeMedDataFetching = async ({
  readOnly,
  behandlingVersjon,
  behandlingsreferanse,
}: Props) => {
  const [rettighetsperiodeGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentRettighetsperiodeGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.VURDER_RETTIGHETSPERIODE),
  ]);

  if (isError(rettighetsperiodeGrunnlag)) {
    return <ApiException apiResponses={[rettighetsperiodeGrunnlag]} />;
  }

  return (
    <VurderRettighetsperiode
      grunnlag={rettighetsperiodeGrunnlag.data}
      readOnly={readOnly || !rettighetsperiodeGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
