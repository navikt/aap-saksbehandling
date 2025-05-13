'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';
import { UføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/uførevisning/UføreVisning';
import { YrkesskadeVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadevisning/YrkesskadeVisning';
import { YrkesskadeUføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadeuførevisning/YrkesskadeUføreVisning';
import { BeregningsGrunnlag } from 'lib/types/types';
import { SackKronerIcon } from '@navikt/aksel-icons';

interface Props {
  grunnlag: BeregningsGrunnlag;
}

export const VisBeregning = ({ grunnlag }: Props) => {
  const beregningsVisning = grunnlag?.beregningstypeDTO;

  return (
    <>
      <VilkårsKort
        heading={finnHeading(beregningsVisning)}
        // @ts-ignore-line TODO Finne ut hvordan vi skal vise disse kortene
        steg={'VIS_BEREGNING'}
        icon={<SackKronerIcon title="beregning-ikon" fontSize={'inherit'} aria-hidden />}
      >
        {beregningsVisning === 'STANDARD' && (
          <Grunnlag1119Visning grunnlag={grunnlag.grunnlag11_19} gjeldendeGrunnbeløp={grunnlag.gjeldendeGrunnbeløp} />
        )}
        {beregningsVisning === 'UFØRE' && (
          <UføreVisning grunnlag={grunnlag.grunnlagUføre} gjeldendeGrunnbeløp={grunnlag.gjeldendeGrunnbeløp} />
        )}
        {beregningsVisning === 'YRKESSKADE' && (
          <YrkesskadeVisning
            grunnlag={grunnlag.grunnlagYrkesskade}
            gjeldendeGrunnbeløp={grunnlag.gjeldendeGrunnbeløp}
          />
        )}
        {beregningsVisning === 'YRKESSKADE_UFØRE' && (
          <YrkesskadeUføreVisning
            grunnlag={grunnlag.grunnlagYrkesskadeUføre}
            gjeldendeGrunnbeløp={grunnlag.gjeldendeGrunnbeløp}
          />
        )}
      </VilkårsKort>
    </>
  );
};

const finnHeading = (beregningsVisning: string): string => {
  if (beregningsVisning === 'YRKESSKADE') {
    return '§§ 11-19 / 11-22 Grunnlagsberegning ';
  }
  if (beregningsVisning === 'UFØRE') {
    return '§§ 11-19 / 11-28 Grunnlagsberegning ';
  }
  if (beregningsVisning === 'YRKESSKADE_UFØRE') {
    return '§§ 11-19 / 11-28 / 11-22 Grunnlagsberegning';
  }
  return '§ 11-19 Grunnlagsberegning';
};
