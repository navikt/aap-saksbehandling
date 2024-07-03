import React from 'react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import Image from 'next/image';

interface Props {
  behandlingsreferanse: string;
}

export const Medlemskap = async ({ behandlingsreferanse }: Props) => {
  console.log(behandlingsreferanse);

  return (
    <VilkårsKort heading={'Medlemskap'} steg={'VURDER_MEDLEMSKAP'}>
      <Image src="/medlemskapkatt.jpg" alt="404" width={500} height={500} />
    </VilkårsKort>
  );
};
