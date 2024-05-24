'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import {
  BistandsGrunnlag,
  FatteVedtakGrunnlag,
  FritakMeldepliktGrunnlag,
  StudentGrunnlag,
  SykdomsGrunnlag,
  SykepengeerstatningGrunnlag,
} from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  sykdomsGrunnlag: SykdomsGrunnlag;
  studentGrunnlag: StudentGrunnlag;
  bistandsGrunnlag: BistandsGrunnlag;
  sykepengeerstatningGrunnlag: SykepengeerstatningGrunnlag;
  fritakMeldepliktGrunnlag: FritakMeldepliktGrunnlag;
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
}

export const FatteVedtak = ({
  fritakMeldepliktGrunnlag,
  sykepengeerstatningGrunnlag,
  studentGrunnlag,
  sykdomsGrunnlag,
  bistandsGrunnlag,
  fatteVedtakGrunnlag,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();

  console.log('fritakMeldepliktGrunnlag', fritakMeldepliktGrunnlag);
  console.log('sykepengeerstatningGrunnlag', sykepengeerstatningGrunnlag);
  console.log('studentGrunnlag', studentGrunnlag);
  console.log('sykdomsGrunnlag', sykdomsGrunnlag);
  console.log('bistandsGrunnlag', bistandsGrunnlag);
  console.log('fatteVedtakGrunnlag', fatteVedtakGrunnlag);

  return (
    <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      {behandlingsReferanse}
    </VilkårsKort>
  );
};
