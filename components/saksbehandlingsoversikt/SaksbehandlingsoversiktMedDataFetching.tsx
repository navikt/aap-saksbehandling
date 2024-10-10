import { Saksbehandlingsoversikt } from 'components/saksbehandlingsoversikt/Saksbehandlingsoversikt';
import { hentAlleDokumenterPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from '@navikt/aap-felles-utils';

interface Props {
  saksnummer: string;
}

export const SaksbehandlingsoversiktMedDataFetching = async ({ saksnummer }: Props) => {
  try {
    const dokumenter = await hentAlleDokumenterPåSak(saksnummer);
    return <Saksbehandlingsoversikt dokumenter={dokumenter} />;
  } catch (error) {
    logError('noe gikk galt i innhenting av dokumenter');
  }
};
