'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button, Heading } from '@navikt/ds-react';
import { useState } from 'react';
import {
  FastSettArbeidsevnePeriode,
  FastsettArbeidsevnePeriodeForm,
} from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { FastsettArbeidsevnePeriodeTableRow } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTableRow';
import { FastsettArbeidsevnePeriodeTable } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTable';
import { PlusIcon } from '@navikt/aksel-icons';
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
        <div className={styles.tabell}>
          <Heading size={'small'} level={'4'}>
            Regisrerte perioder med arbeidsevne
          </Heading>
          <FastsettArbeidsevnePeriodeTable>
            {perioder.map((periode) => (
              <FastsettArbeidsevnePeriodeTableRow key={periode.id} {...periode} />
            ))}
          </FastsettArbeidsevnePeriodeTable>
          <Button
            variant={'tertiary'}
            size={'small'}
            icon={<PlusIcon />}
            onClick={() => setSkalLeggeTilNyPeriode(true)}
          >
            Legg til ny preiode
          </Button>
        </div>

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
