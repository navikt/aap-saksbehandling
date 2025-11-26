import { TypeBehandling } from 'lib/types/types';
import { hentKlageresultat, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OmgjøringVurdering } from 'components/behandlinger/klage/omgjøring/OmgjøringVurdering';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';

// TODO: Slett dersom vi lander på helautomatisk revurdering for klage
export const OmgjøringMedDataFetching = async ({
  saksnummer,
  behandlingsreferanse,
}: {
  saksnummer: string;
  behandlingsreferanse: string;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}) => {
  const [klageresultat, sak, brukerInformasjon] = await Promise.all([
    hentKlageresultat(behandlingsreferanse),
    hentSak(saksnummer),
    hentBrukerInformasjon(),
  ]);

  if (isError(klageresultat)) {
    return <ApiException apiResponses={[klageresultat]} />;
  }

  return <OmgjøringVurdering sak={sak} klageresultat={klageresultat.data} navIdent={brukerInformasjon.NAVident} />;
};
