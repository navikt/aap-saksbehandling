import { hentTilkjentYtelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Tilkjent } from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const TilkjentMedDatafetching = async ({ behandlingsReferanse }: Props) => {
  const tilkjentYtelse = await hentTilkjentYtelse(behandlingsReferanse);
  return <Tilkjent grunnlag={tilkjentYtelse} />;
};
