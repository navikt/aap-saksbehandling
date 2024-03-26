'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import {
  FastSettArbeidsevnePeriode,
  FastsettArbeidsevnePeriodeForm,
} from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { FastsettArbeidsevnePeriodeTable } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTable';
import { v4 as uuidv4 } from 'uuid';

import styles from './FastsettArbeidsevne.module.css';

interface Props {
  behandlingsReferanse: string;
}

export const FastsettArbeidsevne = ({ behandlingsReferanse }: Props) => {
  const [perioder, setPerioder] = useState<FastSettArbeidsevnePeriode[]>([
    {
      arbeidsevne: '0',
      id: uuidv4(),
      benevning: 'timer',
      begrunnelse: '',
      dokumenterBruktIVurderingen: [],
      fraDato: new Date(),
    },
  ]);

  const [skalLeggeTilNyPeriode, setSkalLeggeTilNyPeriode] = useState(false);

  return (
    <VilkårsKort
      heading={'Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      erNav={true}
      defaultOpen={false}
    >
      <div className={styles.fastsettArbeidsevne}>
        <FastsettArbeidsevnePeriodeTable perioder={perioder} onClick={() => setSkalLeggeTilNyPeriode(true)} />

        {skalLeggeTilNyPeriode && (
          <FastsettArbeidsevnePeriodeForm
            onSave={(periode) => {
              setPerioder([...perioder, periode]);
              setSkalLeggeTilNyPeriode(false);
            }}
            onAvbryt={() => setSkalLeggeTilNyPeriode(false)}
          />
        )}

        <form onSubmit={() => console.log('bekreft fastsettarbeidsevne', behandlingsReferanse, perioder)}>
          <Button form={'fastsettArbeidsevne'}>Bekreft</Button>
        </form>
      </div>
    </VilkårsKort>
  );
};
