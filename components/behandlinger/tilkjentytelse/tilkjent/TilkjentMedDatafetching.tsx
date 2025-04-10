import { hentTilkjentYtelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Tilkjent } from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const TilkjentMedDatafetching = async ({ behandlingsReferanse }: Props) => {
  const tilkjentYtelse = await hentTilkjentYtelse(behandlingsReferanse);
  if (isError(tilkjentYtelse)) {
    return <ApiException apiResponses={[tilkjentYtelse]} />;
  }

  return <Tilkjent grunnlag={tilkjentYtelse.data} />;
};
