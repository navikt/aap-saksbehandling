import { hentTilkjentYtelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Tilkjent } from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent';

interface Props {
  behandlingsReferanse: string;
}

export const TilkjentMedDatafetching = async ({ behandlingsReferanse }: Props) => {
  const tilkjentYtelse = await hentTilkjentYtelse(behandlingsReferanse);
  if (isError(tilkjentYtelse)) {
    return <ApiException apiResponses={[tilkjentYtelse]} />;
  }

  console.log(tilkjentYtelse);
  return <Tilkjent grunnlag={tilkjentYtelse.data} />;
};
