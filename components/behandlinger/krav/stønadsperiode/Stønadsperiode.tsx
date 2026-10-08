'use client';

import { StønadsperiodeGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { StønadsperiodeTabell } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/StønadsperiodeTabell';

interface Props {
  behandlingVersjon: number;
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
}

export const Stønadsperiode = ({ grunnlag }: Props) => {
  return (
    <VilkårsKort heading={'Forskrift om AAP § 12. Ny stønadsperiode'} steg={'AVKLAR_STØNADSPERIODE'}>
      <StønadsperiodeTabell grunnlag={grunnlag} />
    </VilkårsKort>
  );
};
