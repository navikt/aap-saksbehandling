'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BeregningsGrunnlag } from 'lib/types/types';
import { LabelValuePair } from 'components/labelvaluepair/LabelValuePair';
import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';
import { UføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/uførevisning/UføreVisning';
import { YrkesskadeVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadevisning/YrkesskadeVisning';
import { YrkesskadeUføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadeuførevisning/YrkesskadeUføreVisning';

interface Props {
  grunnlag: BeregningsGrunnlag;
}

export const VisBeregning = ({ grunnlag }: Props) => {
  console.log(grunnlag);

  const beregningsVisning = grunnlag.beregningstypeDTO;
  return (
    <>
      {/* @ts-ignore-line TODO: Finne ut hvordan vi skal vise disse kortene */}
      <VilkårsKort heading={'Grunnlagsberegning § 11-19'} steg={'VIS_BEREGNING'}>
        <div className={'flex-column'}>
          <LabelValuePair label={'Grunnlag'} value={grunnlag.grunnlag} />
          {beregningsVisning === 'STANDARD' && <Grunnlag1119Visning grunnlag={grunnlag.grunnlag11_19} />}
          {beregningsVisning === 'UFØRE' && <UføreVisning grunnlag={grunnlag.grunnlagUføre} />}
          {beregningsVisning === 'YRKESSKADE' && <YrkesskadeVisning grunnlag={grunnlag.grunnlagYrkesskade} />}
          {beregningsVisning === 'YRKESSKADE_UFØRE' && (
            <YrkesskadeUføreVisning grunnlag={grunnlag.grunnlagYrkesskadeUføre} />
          )}
        </div>
      </VilkårsKort>
    </>
  );
};
