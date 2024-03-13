'use client';

import { useConfigForm } from 'hooks/FormHook';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { handleSubmitWithCallback } from 'lib/utils/form';
import { FormField } from 'components/input/formfield/FormField';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { ReadMore, ToggleGroup } from '@navikt/ds-react';
import { useState } from 'react';

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
  arbeidsevne: string;
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
      label: 'Vurder om brukeren har arbeidsevne',
      description: 'En beksrivelse av hva som skal gjøres her',
      rules: { required: 'Du må begrunne avgjørelsen din.' },
    },
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevant for vurdering',
      description: 'Tilknytt minst ett dokument til vurdering',
    },
    arbeidsevne: {
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
      heading={'Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd'}
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
        <ReadMore header={'Slik vurderes vilkåret'}>
          ref § ... Her kan vi gi en fin veiledning til hvordan man skal begrunne vilkårsvurderingen hvis de er usikre
        </ReadMore>

        <FormField form={form} formField={formFields.begrunnelse} />

        <ToggleGroup defaultValue="timer" onChange={(value) => setActiveToggle(value)} size={'small'}>
          <ToggleGroup.Item value="timer">Timer</ToggleGroup.Item>
          <ToggleGroup.Item value="prosent">Prosent</ToggleGroup.Item>
        </ToggleGroup>
        <div>
          <div style={{ width: '20%' }}>
            <FormField form={form} formField={formFields.arbeidsevne} />
          </div>
          {activeToggle === 'prosent' && <span>%</span>}
        </div>
        <FormField form={form} formField={formFields.arbeidsevnenGjelderFra} />
      </Form>
    </VilkårsKort>
  );
};
