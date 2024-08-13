'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BeregningsGrunnlag, Grunnlag1119, YrkesskadeGrunnlag } from 'lib/types/types';
import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';
import { UføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/uførevisning/UføreVisning';
import { YrkesskadeVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadevisning/YrkesskadeVisning';
import { YrkesskadeUføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadeuførevisning/YrkesskadeUføreVisning';

const yrkesskadeGrunnlag: YrkesskadeGrunnlag = {
  gjennomsnittligInntektSiste3år: 6,
  grunnlag: 6,
  inntektSisteÅr: 6,
  inntekter: [
    { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: true },
    { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: true },
    { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: true },
  ],
  standardBeregning: {
    inntektIG: 6,
    JustertTilMaks6G: true,
    prosentVekting: 50,
  },
  yrkesskadeGrunnlag: 6,
  yrkesskadeInntekt: {
    antattÅrligInntektIGYrkesskadeTidspunktet: 6,
    antattÅrligInntektIKronerYrkesskadeTidspunktet: 1000000,
    justertTilMaks6G: true,
    prosentVekting: 50,
  },
};

const grunnlag1119: Grunnlag1119 = {
  inntekter: [
    { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: true },
    { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: true },
    { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: true },
  ],
  grunnlag: 6,
  gjennomsnittligInntektSiste3år: 6,
  inntektSisteÅr: 6,
};

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
        {beregningsVisning === 'STANDARD' && <Grunnlag1119Visning grunnlag={grunnlag1119} />}
        {beregningsVisning === 'UFØRE' && <UføreVisning grunnlag={grunnlag.grunnlagUføre} />}
        {beregningsVisning === 'YRKESSKADE' && <YrkesskadeVisning grunnlag={yrkesskadeGrunnlag} />}
        {beregningsVisning === 'YRKESSKADE_UFØRE' && (
          <YrkesskadeUføreVisning grunnlag={grunnlag.grunnlagYrkesskadeUføre} />
        )}
      </VilkårsKort>
    </>
  );
};
