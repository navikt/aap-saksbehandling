import { hentTilkjentYtelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Tilkjent } from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export interface Meldeperiode {
  fom: string;
  tom: string;
}

export const TilkjentMedDatafetching = async ({ behandlingsReferanse }: Props) => {
  const meldeperioder: Meldeperiode[] = [
    {
      fom: '2024-08-12',
      tom: '2024-08-25',
    },
    {
      fom: '2024-08-26',
      tom: '2024-09-08',
    },
  ];
  const tilkjentYtelse = await hentTilkjentYtelse(behandlingsReferanse);
  return <Tilkjent grunnlag={tilkjentYtelse} meldeperioder={meldeperioder} />;
};
