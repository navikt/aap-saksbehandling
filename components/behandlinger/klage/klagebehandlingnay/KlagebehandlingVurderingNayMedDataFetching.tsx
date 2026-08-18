import {
  hentKlagebehandlingNayGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

import { KlagebehandlingVurderingNay } from './KlagebehandlingVurderingNay';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
  typeBehandling: TypeBehandling;
}

export const KlagebehandlingVurderingNayMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  visVentekort,
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
    totalReadOnly,
    visVentekort
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
