'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Beregningsgrunnlag } from 'lib/types/types';
import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';
import { UføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/uførevisning/UføreVisning';
import { YrkesskadeVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadevisning/YrkesskadeVisning';
import { YrkesskadeUføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadeuførevisning/YrkesskadeUføreVisning';

interface Props {
  grunnlag: Beregningsgrunnlag;
}

export const VisBeregning = ({ grunnlag }: Props) => {
  console.log(grunnlag);

  const beregningsVisning = grunnlag.beregningstype;

  return (
    <>
      {/* @ts-ignore-line TODO: Finne ut hvordan vi skal vise disse kortene */}
      <VilkårsKort heading={'Grunnlagsberegning § 11-19'} steg={'VIS_BEREGNING'}>
        {beregningsVisning === 'STANDARD' && <Grunnlag1119Visning grunnlag={grunnlag.grunnlag1119} />}
        {beregningsVisning === 'UFØRE' && <UføreVisning grunnlag={grunnlag.uføreGrunnlag} />}
        {beregningsVisning === 'YRKESSKADE' && <YrkesskadeVisning grunnlag={grunnlag.yrkesskadeGrunnlag} />}
        {beregningsVisning === 'YRKESSKADE_UFØR' && (
          <YrkesskadeUføreVisning grunnlag={grunnlag.yrkesskadeUføreGrunnlag} />
        )}
      </VilkårsKort>
    </>
  );
};
