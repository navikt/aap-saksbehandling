'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

interface Props {
  behandlingsReferanse: string;
}

export const FatteVedtak = ({ behandlingsReferanse }: Props) => {
  return (
    <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      hello pello fatte vedtak {behandlingsReferanse}
    </VilkårsKort>
  );
};
