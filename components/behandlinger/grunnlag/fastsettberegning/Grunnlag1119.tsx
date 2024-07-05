import { BodyShort, Label } from '@navikt/ds-react';
import { BeregningsGrunnlag } from 'lib/types/types';

import styles from './Grunnlag1119.module.css';
import { getJaNeiEllerUndefined } from 'lib/utils/form';
import { LabelValuePair } from 'components/labelvaluepair/LabelValuePair';

interface Props {
  grunnlag: BeregningsGrunnlag['grunnlag11_19'];
}

export const Grunnlag1119 = ({ grunnlag }: Props) => {
  return (
    <div className={styles.grunnlagvisning}>
      <LabelValuePair label={'Er 6G begrenset?'} value={getJaNeiEllerUndefined(grunnlag.er6GBegrenset)} />
      <LabelValuePair label={'Er gjennomsnitt?'} value={getJaNeiEllerUndefined(grunnlag.erGjennomsnitt)} />
      <LabelValuePair label={'Grunnlaget'} value={grunnlag.grunnlaget} />

      <div>
        <Label size={'small'}>Inntekter?</Label>
        <div className={styles.inntekter}>
          {Object.keys(grunnlag.inntekter).map((key) => (
            <div key={key}>
              <BodyShort size={'small'}>
                {key} : {grunnlag.inntekter[key]}
              </BodyShort>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
