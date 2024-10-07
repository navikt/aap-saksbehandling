import { Dokument } from 'components/dokument/Dokument';
import { hentAlleDokumenterPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  saksnummer: string;
}

export const DokumentMedDataFetching = async ({ saksnummer }: Props) => {
  const dokumenter = await hentAlleDokumenterPåSak(saksnummer);

  console.log(dokumenter);
  return <Dokument />;
};
