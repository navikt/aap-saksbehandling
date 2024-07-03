import React from 'react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import Image from 'next/image';
import Medlemskapkatt from '../../../public/medlemskapkatt.jpg';

interface Props {
  behandlingsreferanse: string;
}

export const Medlemskap = async ({ behandlingsreferanse }: Props) => {
  console.log(behandlingsreferanse);

  return (
    <VilkårsKort heading={'Medlemskap'} steg={'VURDER_MEDLEMSKAP'}>
      <Image src={Medlemskapkatt} alt="404" width={500} height={500} />
    </VilkårsKort>
  );
};
