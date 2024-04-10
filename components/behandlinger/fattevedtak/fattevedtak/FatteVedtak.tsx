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
import { ToTrinnsKontroll } from 'components/behandlinger/vedtak/totrinsskontroll/ToTrinnsKontroll';

interface Props {
  behandlingsReferanse: string;
  sykdomsGrunnlag: SykdomsGrunnlag;
  studentGrunnlag: StudentGrunnlag;
  bistandsGrunnlag: BistandsGrunnlag;
  sykepengeerstatningGrunnlag: SykepengeerstatningGrunnlag;
  fritakMeldepliktGrunnlag: FritakMeldepliktGrunnlag;
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
}

export const FatteVedtak = ({
  behandlingsReferanse,
  fritakMeldepliktGrunnlag,
  sykepengeerstatningGrunnlag,
  studentGrunnlag,
  sykdomsGrunnlag,
  bistandsGrunnlag,
  fatteVedtakGrunnlag,
}: Props) => {
  console.log('fritakMeldepliktGrunnlag', fritakMeldepliktGrunnlag);
  console.log('sykepengeerstatningGrunnlag', sykepengeerstatningGrunnlag);
  console.log('studentGrunnlag', studentGrunnlag);
  console.log('sykdomsGrunnlag', sykdomsGrunnlag);
  console.log('bistandsGrunnlag', bistandsGrunnlag);
  console.log('fatteVedtakGrunnlag', fatteVedtakGrunnlag);

  return (
    <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      {behandlingsReferanse}

      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {fatteVedtakGrunnlag.vurderinger.map((vurderinger) => (
          <ToTrinnsKontroll definisjon={vurderinger.definisjon} key={vurderinger.definisjon} />
        ))}
      </div>
    </VilkårsKort>
  );
};
