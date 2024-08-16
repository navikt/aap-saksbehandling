import React from 'react';
import { YrkesskadeUføreGrunnlag } from 'lib/types/types';

import styles from '../Visning.module.css';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { UføreInntektTabell } from 'components/uføreinntekttabell/UføreInntektTabell';

interface Props {
  grunnlag?: YrkesskadeUføreGrunnlag;
}

export const YrkesskadeUføreVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    return <div>Kunne ikke finne påkrevd grunnlag for uføre og yrkesskade</div>;
  }
  console.log('grunnlag yrkesskade og uføre', grunnlag);
  return (
    <div className={styles.visning}>
      <InntektTabell
        label={'Pensjonsgivende inntekt siste 3 år  før arbeidsevne ble nedsatt'}
        inntekter={grunnlag?.yrkesskadeGrunnlag.inntekter}
        gjennomsnittSiste3år={grunnlag?.yrkesskadeGrunnlag.gjennomsnittligInntektSiste3år}
      />
      <UføreInntektTabell
        label={
          'Ufør. Pensjonsgivende inntekt siste 3 år  før arbeidsevne ble ytterligere nedsatt, justert for uføregrad '
        }
        inntekter={grunnlag.uføreGrunnlag.uføreInntekter}
        gjennomsnittSiste3år={grunnlag.uføreGrunnlag.gjennomsnittligInntektSiste3år}
      />
    </div>
  );
};
