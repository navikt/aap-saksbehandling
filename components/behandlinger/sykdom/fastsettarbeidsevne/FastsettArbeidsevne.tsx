'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button, Heading } from '@navikt/ds-react';
import { useState } from 'react';
import {
  FastSettArbeidsevnePeriode,
  FastsettArbeidsevnePeriodeForm,
} from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { FastsettArbeidsevnePeriodeTableItem } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTableItem';
import { FastsettArbeidsevnePeriodeTable } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTable';

interface Props {
  behandlingsReferanse: string;
}

export const FastsettArbeidsevne = ({ behandlingsReferanse }: Props) => {
  const [perioder, setPerioder] = useState<FastSettArbeidsevnePeriode[]>([]);

  return (
    <VilkårsKort
      heading={'Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      erNav={true}
      defaultOpen={false}
    >
      <Heading size={'small'} level={'4'}>
        Regisrerte perioder med arbeidsevne
      </Heading>
      <FastsettArbeidsevnePeriodeTable>
        {perioder.map((periode) => (
          <FastsettArbeidsevnePeriodeTableItem key={periode.id} {...periode} />
        ))}
      </FastsettArbeidsevnePeriodeTable>

      <FastsettArbeidsevnePeriodeForm onSave={(periode) => setPerioder([...perioder, periode])} />
      <form onSubmit={() => console.log('bekreft fastsettarbeidsevne', behandlingsReferanse, perioder)}>
        <Button form={'fastsettArbeidsevne'}>Bekreft</Button>
      </form>
    </VilkårsKort>
  );
};
