'use client';

import { useConfigForm } from 'hooks/FormHook';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormField } from 'components/input/formfield/FormField';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { Button, ReadMore } from '@navikt/ds-react';
import { useState } from 'react';
import {
  FastSettArbeidsevnePeriode,
  FastsettArbeidsevnePeriodeForm,
} from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { FastsettArbeidsevnePeriodeTableItem } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTableItem';
import { FastsettArbeidsevnePeriodeTable } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTable';

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
}

interface Props {
  behandlingsReferanse: string;
}

export const FastsettArbeidsevne = ({ behandlingsReferanse }: Props) => {
  const [perioder, setPerioder] = useState<FastSettArbeidsevnePeriode[]>([]);
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om brukeren har arbeidsevne',
      description: 'En beksrivelse av hva som skal gjøres her',
      rules: { required: 'Du må begrunne avgjørelsen din.' },
    },
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevant for vurdering',
      description: 'Tilknytt minst ett dokument til vurdering',
    },
  });

  const deletePeriode = (id: string) => {
    const index = perioder.findIndex((periode) => periode.id === id);
    const before = perioder.slice(0, index);
    const after = perioder.slice(index + 1);
    setPerioder([...before, ...after]);
  };
  return (
    <VilkårsKort
      heading={'Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      erNav={true}
      defaultOpen={false}
    >
      <form
        id={'fastsettArbeidsevne'}
        onSubmit={form.handleSubmit((data) => {
          console.log('Waddap!', data, behandlingsReferanse);
        })}
      >
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <ReadMore header={'Slik vurderes vilkåret'}>
          ref § ... Her kan vi gi en fin veiledning til hvordan man skal begrunne vilkårsvurderingen hvis de er usikre
        </ReadMore>

        <FormField form={form} formField={formFields.begrunnelse} />
      </form>
      <FastsettArbeidsevnePeriodeTable>
        {perioder.map((periode) => (
          <FastsettArbeidsevnePeriodeTableItem key={periode.id} onDelete={deletePeriode} {...periode} />
        ))}
      </FastsettArbeidsevnePeriodeTable>

      <FastsettArbeidsevnePeriodeForm onSave={(periode) => setPerioder([...perioder, periode])} />
      <Button form={'fastsettArbeidsevne'}>Bekreft</Button>
    </VilkårsKort>
  );
};
