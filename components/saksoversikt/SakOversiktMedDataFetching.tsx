import { hentRettighetsinfo, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  saksnummer: string;
}
export const SakOversiktMedDataFetching = async ({ saksnummer }: Props) => {
  const sakMedBehandlinger = await hentSak(saksnummer);
  const rettighetsInfo = await hentRettighetsinfo(saksnummer);
  if (isError(rettighetsInfo)) {
    return <ApiException apiResponses={[rettighetsInfo]} />;
  }
  return (
    <SakOversiktContainer sak={sakMedBehandlinger} rettighetsinfo={rettighetsInfo.data} arenaSaker={{ saker: [] }} />
  );
};
