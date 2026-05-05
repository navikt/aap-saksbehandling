import { TypeBehandling } from 'lib/types/types';
import { KlagebehandlingVurderingNay } from './KlagebehandlingVurderingNay';
import {
  hentKlagebehandlingNayGrunnlag,
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

export const KlagebehandlingVurderingNayMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const grunnlag = await hentKlagebehandlingNayGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_KLAGE_NAY,
    totalReadOnly
  );

  return (
    <KlagebehandlingVurderingNay
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      typeBehandling={typeBehandling}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
