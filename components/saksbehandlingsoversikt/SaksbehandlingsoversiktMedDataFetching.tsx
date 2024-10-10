import { Saksbehandlingsoversikt } from 'components/saksbehandlingsoversikt/Saksbehandlingsoversikt';
import { hentAlleDokumenterPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  saksnummer: string;
}

export const SaksbehandlingsoversiktMedDataFetching = async ({ saksnummer }: Props) => {
  const dokumenter = await hentAlleDokumenterPåSak(saksnummer);

  return <Saksbehandlingsoversikt dokumenter={dokumenter} />;
};
