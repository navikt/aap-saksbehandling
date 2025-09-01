import { TypeBehandling } from 'lib/types/types';
import { KlagebehandlingVurderingKontor } from './KlagebehandlingVurderingKontor';
import {
  hentKlagebehandlingKontorGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const KlagebehandlingVurderingKontorMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentKlagebehandlingKontorGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.VURDER_KLAGE_KONTOR),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }
  return (
    <KlagebehandlingVurderingKontor
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      typeBehandling={typeBehandling}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
