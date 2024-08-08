import React from 'react';
import { YrkesskadeGrunnlag } from 'lib/types/types';
import { Heading } from '@navikt/ds-react';
import styles from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119.module.css';
import { LabelValuePair } from 'components/labelvaluepair/LabelValuePair';
import { getJaNeiEllerUndefined } from 'lib/utils/form';
import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';

interface Props {
  grunnlag?: YrkesskadeGrunnlag;
}

export const YrkesskadeVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    return <div>Kunne ikke finne påkrevd grunnlag for yrkesskade</div>;
  }
  return (
    <>
      <Heading size={'small'}>Grunnlag Yrkesskade</Heading>
      <div className={styles.grunnlagvisning}>
        <LabelValuePair label={'Andel som ikke skyldes yrkesskade'} value={grunnlag.andelSomIkkeSkyldesYrkesskade} />
        <LabelValuePair label={'Andel som skyldes yrkesskade'} value={grunnlag.andelSomSkyldesYrkesskade} />
        <LabelValuePair label={'Andel yrkesskade?'} value={grunnlag.andelYrkesskade} />
        <LabelValuePair
          label={'Antatt årlig inntekt yrkesskade tidspunktet?'}
          value={grunnlag.antattÅrligInntektYrkesskadeTidspunktet}
        />
        <LabelValuePair label={'benyttet andel for yrkesskaden?'} value={grunnlag.benyttetAndelForYrkesskade} />
        <LabelValuePair label={'er 6G begrenset?'} value={getJaNeiEllerUndefined(grunnlag.er6GBegrenset)} />
        <LabelValuePair label={'er gjennomsnitt?'} value={getJaNeiEllerUndefined(grunnlag.er6GBegrenset)} />
        <LabelValuePair label={'Grunnlag etter yrkesskade fordel'} value={grunnlag.grunnlagEtterYrkesskadeFordel} />
        <LabelValuePair
          label={'grunnlag for beregning av yrkesskade andel'}
          value={grunnlag.grunnlagForBeregningAvYrkesskadeandel}
        />
        <LabelValuePair label={'grunnlaget'} value={grunnlag.grunnlaget} />
        <LabelValuePair label={'terskelverdi for yrkesskade'} value={grunnlag.terskelverdiForYrkesskade} />
        <LabelValuePair label={'yrkesskadetidspunkt'} value={grunnlag.yrkesskadeTidspunkt} />
        <LabelValuePair label={'yrkesskade inntekt i G'} value={grunnlag.yrkesskadeinntektIG} />
      </div>
      <Heading size={'small'}>grunnlag Yrkesskade (11-19) </Heading>
      <Grunnlag1119Visning grunnlag={grunnlag.beregningsgrunnlag} />
    </>
  );
};
