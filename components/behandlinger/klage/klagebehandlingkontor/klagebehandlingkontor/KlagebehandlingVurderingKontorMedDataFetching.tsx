import { TypeBehandling } from 'lib/types/types';
import { KlagebehandlingVurderingKontor } from './KlagebehandlingVurderingKontor';
import { hentKlagebehandlingKontorGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  erAktivtSteg: boolean;
}

export const KlagebehandlingVurderingKontorMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
  erAktivtSteg,
}: Props) => {
  const grunnlag = await hentKlagebehandlingKontorGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }
  return (
    <KlagebehandlingVurderingKontor
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      typeBehandling={typeBehandling}
      erAktivtSteg={erAktivtSteg}
    />
  );
};
