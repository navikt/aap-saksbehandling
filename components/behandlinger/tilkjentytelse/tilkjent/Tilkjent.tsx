import { TilkjentYtelseGrunnlag } from 'lib/types/types';
import { PeriodeViser } from 'components/periodeviser/PeriodeViser';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { PiggybankIcon } from '@navikt/aksel-icons';
import { Detail, Label } from '@navikt/ds-react';
import { Meldeperiode } from 'components/behandlinger/tilkjentytelse/tilkjent/TilkjentMedDatafetching';

interface Props {
  grunnlag: TilkjentYtelseGrunnlag;
  meldeperioder: Meldeperiode[];
}
export const Tilkjent = ({ grunnlag, meldeperioder }: Props) => {
  return (
    <VilkårsKort heading="Tilkent ytelse" icon={<PiggybankIcon aria-hidden />} steg="BEREGN_TILKJENT_YTELSE">
      <Label>Grafen viser tilkjent ytelse for valgt periode</Label>
      <Detail>Tilkjent ytelse frem i tid er et anslag som kan endre seg basert på gradering og andre faktorer</Detail>

      <PeriodeViser tilkjentYtelse={grunnlag} meldeperioder={meldeperioder} />
    </VilkårsKort>
  );
};
