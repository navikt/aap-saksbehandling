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
  erBeslutter: boolean;
}

export const FastsettArbeidsevne = ({ behandlingsReferanse, erBeslutter }: Props) => {
  const [skalLeggeTilNyPeriode, setSkalLeggeTilNyPeriode] = useState(false);
  const [perioder, setPerioder] = useState<FastSettArbeidsevnePeriode[]>([
    {
      arbeidsevne: '0',
      id: uuidv4(),
      benevning: 'timer',
      begrunnelse: 'Begrunnelse for hvorfor det finnes arbeidsevne',
      dokumenterBruktIVurderingen: ['Legeerklæring'],
      fraDato: new Date('March 25, 2024'),
    },
  ]);

  return (
    <VilkårsKort
      heading={'Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      erNav={true}
      defaultOpen={false}
    >
      <div className={styles.fastsettArbeidsevne}>
        <FastsettArbeidsevnePeriodeTable
          perioder={perioder}
          onClick={() => setSkalLeggeTilNyPeriode(true)}
          visLeggTilPeriodeKnapp={!erBeslutter}
        />
        {skalLeggeTilNyPeriode && (
          <FastsettArbeidsevnePeriodeForm
            onSave={(periode) => {
              setPerioder([...perioder, periode]);
              setSkalLeggeTilNyPeriode(false);
            }}
            onAvbryt={() => setSkalLeggeTilNyPeriode(false)}
          />
        )}
        {!erBeslutter && (
          <div>
            <Button onClick={() => console.log('bekreft fastsettarbeidsevne', behandlingsReferanse, perioder)}>
              Bekreft
            </Button>
          </div>
        )}
      </div>
    </VilkårsKort>
  );
};
