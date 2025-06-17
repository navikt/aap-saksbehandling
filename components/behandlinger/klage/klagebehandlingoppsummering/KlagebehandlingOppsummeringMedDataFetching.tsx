import { TypeBehandling } from 'lib/types/types';
import {
  hentKlagebehandlingKontorGrunnlag,
  hentKlagebehandlingNayGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { KlagebehandlingOppsummering } from 'components/behandlinger/klage/klagebehandlingoppsummering/KlagebehandlingOppsummering';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const KlagebehandlingOppsummeringMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const grunnlagNay = await hentKlagebehandlingNayGrunnlag(behandlingsreferanse);
  const grunnlagKontor = await hentKlagebehandlingKontorGrunnlag(behandlingsreferanse);

  if (isError(grunnlagNay) || isError(grunnlagKontor)) {
    return <ApiException apiResponses={[grunnlagNay, grunnlagKontor]} />;
  }

  return (
    <KlagebehandlingOppsummering
      grunnlagNay={grunnlagNay.data}
      grunnlagKontor={grunnlagKontor.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      typeBehandling={typeBehandling}
    />
  );
};
