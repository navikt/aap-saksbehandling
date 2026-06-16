import { hentTilkjentYtelseMedDiff } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { TilkjentMedDiff } from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent';
interface Props {
  behandlingsreferanse: string;
}

export const TilkjentMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const tilkjentYtelseMedDiff = await hentTilkjentYtelseMedDiff(behandlingsreferanse);
  if (isError(tilkjentYtelseMedDiff)) {
    return <ApiException apiResponses={[tilkjentYtelseMedDiff]} />;
  }
  return <TilkjentMedDiff grunnlagMedDiff={tilkjentYtelseMedDiff.data} />;
};
