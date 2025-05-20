import { TypeBehandling } from 'lib/types/types';
import { hentKlageresultat, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OmgjøringVurdering } from 'components/behandlinger/klage/omgjøring/OmgjøringVurdering';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

export const OmgjøringMedDataFetching = async ({
  saksnummer,
  behandlingsreferanse,
}: {
  saksnummer: string;
  behandlingsreferanse: string;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  erAktivtSteg: boolean;
  readOnly: boolean;
}) => {
  const klageresultat = await hentKlageresultat(behandlingsreferanse);

  if (isError(klageresultat)) {
    return <ApiException apiResponses={[klageresultat]} />;
  }

  const sak = await hentSak(saksnummer);

  return <OmgjøringVurdering sak={sak} klageresultat={klageresultat.data} />;
};
