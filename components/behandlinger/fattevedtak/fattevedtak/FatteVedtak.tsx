'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

export const FatteVedtak = () => {
  return (
    <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      Fullfør besluttersteget i høyre kolonne.
    </VilkårsKort>
  );
};
