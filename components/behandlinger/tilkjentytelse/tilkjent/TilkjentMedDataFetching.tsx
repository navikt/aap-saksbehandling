import { hentTilkjentYtelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Tilkjent } from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent';

interface Props {
  behandlingsreferanse: string;
}

export const TilkjentMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const tilkjentYtelse = await hentTilkjentYtelse(behandlingsreferanse);
  if (isError(tilkjentYtelse)) {
    return <ApiException apiResponses={[tilkjentYtelse]} />;
  }

  return <Tilkjent grunnlag={tilkjentYtelse.data} />;
};
