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
  erIkkePåVent: boolean;
}

export const KlagebehandlingVurderingKontorMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
  erIkkePåVent,
}: Props) => {
  const grunnlag = await hentKlagebehandlingKontorGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_KLAGE_KONTOR,
    totalReadOnly,
    erIkkePåVent
  );

  return (
    <KlagebehandlingVurderingKontor
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      typeBehandling={typeBehandling}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
