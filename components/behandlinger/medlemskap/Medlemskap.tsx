import React from 'react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import Image from 'next/image';
import Medlemskapkatt from '../../../public/medlemskapkatt.jpg';

interface Props {
  behandlingsReferanse: string;
  grunnlag: any;
}

export const Medlemskap = async ({ behandlingsReferanse, grunnlag }: Props) => {
  console.log('grunnlag medlemskap', { behandlingsReferanse, grunnlag });

  return (
    <VilkårsKort heading={'Medlemskap'} steg={'VURDER_MEDLEMSKAP'}>
      <div>{JSON.stringify(grunnlag)}</div>
      <Image src={Medlemskapkatt} alt="medlemskap-katt" width={500} height={500} />
    </VilkårsKort>
  );
};
