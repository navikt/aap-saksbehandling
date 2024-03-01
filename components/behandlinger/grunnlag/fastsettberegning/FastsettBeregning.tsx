'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';

interface FormFields {
  nedsattArbeidsevneDato: Date;
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: Date;
  antattÅrligInntekt: string;
}
export const FastsettBeregning = () => {
  const { formFields, form } = useConfigForm<FormFields>({
    nedsattArbeidsevneDato: {
      type: 'date',
      label: 'Nedsatt arbeidsevne dato',
    },
    begrunnelse: {
      type: 'text',
      label: 'Begrunnelse',
    },
    ytterligereNedsattArbeidsevneDato: {
      type: 'date',
      label: 'Ytterligere nedsatt arbeidsevne dato',
    },
    antattÅrligInntekt: {
      type: 'text',
      label: 'Antatt årlig inntekt',
    },
  });
  return (
    <VilkårsKort heading={'Fastsett beregning'} steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}>
      <Form
        steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
        onSubmit={form.handleSubmit((data) => console.log('fastsett beregningstidspunkt', data))}
      >
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
      </Form>
    </VilkårsKort>
  );
};
