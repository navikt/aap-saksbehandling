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
  return (
    <div>
      <Heading size={'small'}>Grunnlag uføre</Heading>
      <div className={styles.grunnlagvisning}>
        <LabelValuePair label={'Er 6G begrenset?'} value={getJaNeiEllerUndefined(grunnlag.er6GBegrenset)} />
        <LabelValuePair label={'Er gjennomsnitt?'} value={getJaNeiEllerUndefined(grunnlag.erGjennomsnitt)} />

        <LabelValuePair label={'grunnlaget'} value={grunnlag.grunnlaget} />
        <LabelValuePair label={'type'} value={grunnlag.type} />
        <LabelValuePair label={'Uføre inntekt i kroner?'} value={grunnlag.uføreInntektIKroner} />
        <LabelValuePair
          label={'Uføre ytterligere nedsatt arbeidsevn år?'}
          value={grunnlag.uføreYtterligereNedsattArbeidsevneÅr}
        />
        <LabelValuePair label={'Uføregrad'} value={grunnlag.uføregrad} />
      </div>
      <Heading size={'small'}>Grunnlag Uføre (11-19)</Heading>
      <Grunnlag1119Visning grunnlag={grunnlag.grunnlag} />
      <Heading size={'small'}>Grunnlag ytterligere nedsatt (11-19)</Heading>
      <Grunnlag1119Visning grunnlag={grunnlag.grunnlagYtterligereNedsatt} />
    </div>
  );
};
