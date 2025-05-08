import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentUtbetalingOgSimuleringGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { UtbetalingOgSimulering } from './UtbetalingOgSimulering';

interface Props {
  behandlingsreferanse: string;
}

export const UtbetalingOgSimuleringMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const utbetalingOgSimuleringGrunnlag = await hentUtbetalingOgSimuleringGrunnlag(behandlingsreferanse);
  if (isError(utbetalingOgSimuleringGrunnlag)) {
    return <ApiException apiResponses={[utbetalingOgSimuleringGrunnlag]} />;
  }
  return <UtbetalingOgSimulering grunnlag={utbetalingOgSimuleringGrunnlag.data} />;
};
