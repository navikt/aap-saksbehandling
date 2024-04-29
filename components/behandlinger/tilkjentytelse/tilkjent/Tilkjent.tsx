import { TilkjentYtelseGrunnlag } from 'lib/types/types';
import { PeriodeViser } from 'components/periodeviser/PeriodeViser';

interface Props {
  grunnlag: TilkjentYtelseGrunnlag;
}
export const Tilkjent = ({ grunnlag }: Props) => {
  return (
    <div>
      <PeriodeViser tilkjentYtelse={grunnlag} />
    </div>
  );
};
