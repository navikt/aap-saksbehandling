import { hentTilkjentYtelseV2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Tilkjent2 } from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent2';

interface Props {
  behandlingsReferanse: string;
}

export const TilkjentMedDatafetchingV2 = async ({ behandlingsReferanse }: Props) => {
  const tilkjentYtelse = await hentTilkjentYtelseV2(behandlingsReferanse);
  if (isError(tilkjentYtelse)) {
    return <ApiException apiResponses={[tilkjentYtelse]} />;
  }

  return <Tilkjent2 grunnlag={tilkjentYtelse.data} />;
};
