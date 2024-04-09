'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import {
  BistandsGrunnlag,
  FritakMeldepliktGrunnlag,
  StudentGrunnlag,
  SykdomsGrunnlag,
  SykepengeerstatningGrunnlag,
} from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
  sykdomsGrunnlag: SykdomsGrunnlag;
  studentGrunnlag: StudentGrunnlag;
  bistandsGrunnlag: BistandsGrunnlag;
  sykepengeerstatningGrunnlag: SykepengeerstatningGrunnlag;
  fritakMeldepliktGrunnlag: FritakMeldepliktGrunnlag;
}

export const FatteVedtak = ({
  behandlingsReferanse,
  fritakMeldepliktGrunnlag,
  sykepengeerstatningGrunnlag,
  studentGrunnlag,
  sykdomsGrunnlag,
  bistandsGrunnlag,
}: Props) => {
  console.log(fritakMeldepliktGrunnlag);
  console.log(sykepengeerstatningGrunnlag);
  console.log(studentGrunnlag);
  console.log(sykdomsGrunnlag);
  console.log(bistandsGrunnlag);
  return (
    <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      {behandlingsReferanse}
    </VilkårsKort>
  );
};
