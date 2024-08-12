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
        <LabelValuePair
          label={'Andel som ikke skyldes yrkesskade'}
          value={grunnlag.andelSomIkkeSkyldesYrkesskade}
          tooltip={'Hvor stor del av [grunnlaget] som ikke kommer fra yrkesskade'}
        />
        <LabelValuePair
          label={'Andel som skyldes yrkesskade'}
          value={grunnlag.andelSomSkyldesYrkesskade}
          tooltip={'Hvor stor del av [grunnlaget] som kommer fra yrkesskade'}
        />
        <LabelValuePair label={'Andel yrkesskade?'} value={grunnlag.andelYrkesskade} tooltip={'Yrkesskadeprosent'} />
        <LabelValuePair
          label={'Antatt årlig inntekt yrkesskade tidspunktet?'}
          value={grunnlag.antattÅrligInntektYrkesskadeTidspunktet}
        />
        <LabelValuePair
          label={'benyttet andel for yrkesskaden?'}
          value={grunnlag.benyttetAndelForYrkesskade}
          tooltip={'Yrkesskadeprosent, muligens oppjustert etter [terskelverdiForYrkesskade]'}
        />
        <LabelValuePair
          label={'er 6G begrenset?'}
          value={getJaNeiEllerUndefined(grunnlag.er6GBegrenset)}
          tooltip={'Om inntekten i [beregningsgrunnlag] er 6G-begrenset'}
        />
        <LabelValuePair
          label={'er gjennomsnitt?'}
          value={getJaNeiEllerUndefined(grunnlag.erGjennomsnitt)}
          tooltip={'Om inntekten i [beregningsgrunnlag] er et gjennomsnitt'}
        />
        <LabelValuePair
          label={'Grunnlag etter yrkesskade fordel'}
          value={grunnlag.grunnlagEtterYrkesskadeFordel}
          tooltip={'Samme som [grunnlaget]. // TODO kan fjernes?'}
        />
        <LabelValuePair
          label={'grunnlag for beregning av yrkesskade andel'}
          value={grunnlag.grunnlagForBeregningAvYrkesskadeandel}
          tooltip={'Delen av [grunnlaget] som skyldes yrkesskade'}
        />
        <LabelValuePair
          label={'grunnlaget'}
          value={grunnlag.grunnlaget}
          tooltip={'Det beregnede grunnlaget gitt yrkesskade'}
        />
        <LabelValuePair
          label={'terskelverdi for yrkesskade'}
          value={grunnlag.terskelverdiForYrkesskade}
          tooltip={'Gjeldende terskelverdi for yrkesskade (definert i §11-22)'}
        />
        <LabelValuePair
          label={'yrkesskadetidspunkt'}
          value={grunnlag.yrkesskadeTidspunkt}
          tooltip={'Hvilket år yrkesskaden skjedde'}
        />
        <LabelValuePair
          label={'yrkesskade inntekt i G'}
          value={grunnlag.yrkesskadeinntektIG}
          tooltip={'Inntekt på yrkesskadetidspunktet i G'}
        />
      </div>
      <Heading size={'small'}>grunnlag Yrkesskade (11-19) </Heading>
      <Grunnlag1119Visning grunnlag={grunnlag.beregningsgrunnlag} />
    </>
  );
};
