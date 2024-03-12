'use client';

import { useConfigForm } from 'hooks/FormHook';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { handleSubmitWithCallback } from 'lib/utils/form';
import { FormField } from 'components/input/formfield/FormField';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { ToggleGroup } from '@navikt/ds-react';
import { useState } from 'react';

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
  arbeidsevne: number;
  hvorStorErArbeidsevnen: string;
  arbeidsevnenGjelderFra: Date;
}
interface Props {
  behandlingsReferanse: string;
}
export const FastsettArbeidsevne = ({ behandlingsReferanse }: Props) => {
  const [activeToggle, setActiveToggle] = useState('');
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description:
        'Hvilken sykdom/skade/lyte. Hva er det mest vesentlige. Hvorfor vurderes det at det finnes en nedsatt arbeisevne',
      rules: { required: 'Du må begrunne avgjørelsen din.' },
    },
    arbeidsevne: {
      type: 'text',
      label: 'Hvor stor del av arbeidsevnen er ikke utnyttet?',
      rules: { required: 'Du må angi hvor stor del av arbeidsevnen som ikke er utnyttet' },
    },
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevant for vurdering',
      description: 'Tilknytt minst ett dokument til vurdering',
    },
    hvorStorErArbeidsevnen: {
      type: 'text',
      label: 'Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer',
    },
    arbeidsevnenGjelderFra: {
      type: 'date',
      label: 'Arbeidsevnen gjelder fra og med',
    },
  });
  return (
    <VilkårsKort
      heading={'Vurder arbeidsevnen som ikke er utnyttet - § 11-23 2.ledd'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      erNav={true}
      defaultOpen={false}
    >
      <Form
        onSubmit={handleSubmitWithCallback(form, (data) => {
          console.log('Waddap!', data, behandlingsReferanse);
        })}
        steg={'VURDER_UUTNYTTET_ARBEIDSEVNE'}
      >
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.arbeidsevne} />

        <ToggleGroup defaultValue="timer" onChange={(value) => setActiveToggle(value)} size={'small'}>
          <ToggleGroup.Item value="timer">Timer</ToggleGroup.Item>
          <ToggleGroup.Item value="prosent">Prosent</ToggleGroup.Item>
        </ToggleGroup>
        <div>
          <FormField form={form} formField={formFields.hvorStorErArbeidsevnen} />
          {activeToggle === 'prosent' && <span>%</span>}
        </div>
        <FormField form={form} formField={formFields.arbeidsevnenGjelderFra} />
      </Form>
    </VilkårsKort>
  );
};
