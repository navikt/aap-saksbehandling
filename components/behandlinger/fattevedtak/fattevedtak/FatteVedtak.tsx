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

export const FatteVedtak = ({ sykdomsGrunnlag }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();

  return (
    <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      {behandlingsReferanse}
      {JSON.stringify(sykdomsGrunnlag)}
    </VilkårsKort>
  );
};
