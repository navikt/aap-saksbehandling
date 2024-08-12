import React from 'react';
import { UføreGrunnlag } from 'lib/types/types';
import { Heading } from '@navikt/ds-react';
import styles from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119.module.css';
import { LabelValuePair } from 'components/labelvaluepair/LabelValuePair';
import { getJaNeiEllerUndefined } from 'lib/utils/form';
import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';

interface Props {
  grunnlag?: UføreGrunnlag;
}

export const UføreVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    return <div>Kunne ikke finne påkrevd grunnlag for uføre</div>;
  }
  // /**
  //  * @param grunnlaget Beregningsgrunnlag, muligens oppjustert etter uføregrad.
  //  * @param type Om uføregrad er oppjustert eller ikke. [Type.STANDARD] betyr at justering etter uføregrad ikke
  //  * ga høyere grunnlag.
  //  * @param grunnlag Originalt beregningsgrunnlag, etter §11-19.
  //  * @param grunnlagYtterligereNedsatt Beregningsgrunnlag, oppjustert etter uføregrad.
  //  * @param uføregrad Uføregrad i prosent.
  //  * @param uføreInntekterFraForegåendeÅr Inntekter de siste 3 år før [uføreYtterligereNedsattArbeidsevneÅr].
  //  * @param uføreInntektIKroner I dag er dette det oppjusterte grunnlaget multiplisert med 10. Så gir lite mening. TODO!
  //  * @param uføreYtterligereNedsattArbeidsevneÅr Hvilket år arbeidsevnen ble ytterligere nedsatt.
  //  * @param er6GBegrenset Om grunnlaget fra [grunnlaget] er 6G-begrenset. // TODO: denne er overflødig, ligger i [grunnlaget]
  //  * @param erGjennomsnitt Om grunnlaget fra [grunnlaget] er et gjennomsnitt. // TODO: også overflødig
  //  *(
  return (
    <div>
      <Heading size={'small'}>Grunnlag uføre</Heading>
      <div className={styles.grunnlagvisning}>
        <LabelValuePair label={'Er 6G begrenset?'} value={getJaNeiEllerUndefined(grunnlag.er6GBegrenset)} />
        <LabelValuePair label={'Er gjennomsnitt?'} value={getJaNeiEllerUndefined(grunnlag.erGjennomsnitt)} />

        <LabelValuePair
          label={'grunnlaget'}
          value={grunnlag.grunnlaget}
          tooltip={'Beregningsgrunnlag, muligens oppjustert etter uføregrad'}
        />
        <LabelValuePair
          label={'type'}
          value={grunnlag.type}
          tooltip={
            'Om uføregrad er oppjustert eller ikke. [Type.STANDARD] betyr at justering etter uføregrad ikke ga høyere grunnlag'
          }
        />
        <LabelValuePair
          label={'Uføre inntekt i kroner?'}
          value={grunnlag.uføreInntektIKroner}
          tooltip={'I dag er dette det oppjusterte grunnlaget multiplisert med 10. Så gir lite mening. TODO!'}
        />
        <LabelValuePair
          label={'Uføre ytterligere nedsatt arbeidsevn år?'}
          value={grunnlag.uføreYtterligereNedsattArbeidsevneÅr}
          tooltip={'Hvilket år arbeidsevnen ble ytterligere nedsatt'}
        />
        <LabelValuePair label={'Uføregrad'} value={grunnlag.uføregrad} tooltip={'Uføregrad i prosent'} />
      </div>
      <Heading size={'small'}>Grunnlag Uføre (11-19)</Heading>
      <Grunnlag1119Visning grunnlag={grunnlag.grunnlag} />
      <Heading size={'small'}>Grunnlag ytterligere nedsatt (11-19)</Heading>
      <Grunnlag1119Visning grunnlag={grunnlag.grunnlagYtterligereNedsatt} />
    </div>
  );
};
