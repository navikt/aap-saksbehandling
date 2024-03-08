'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { handleSubmitWithCallback } from 'lib/utils/form';

interface FormFields {
  begrunnelse: string;
  uutnyttetArbeidsevne: number;
}

export const UutnyttetArbeidsevne = () => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder den uutnyttede arbeidsevnen',
      description:
        'Hvilken sykdom/skade/lyte. Hva er det mest vesentlige. Hvorfor vurderes det at det finnes en uutnyttet arbeisevne',
      rules: { required: 'Du må begrunne avgjørelsen din.' },
    },
    uutnyttetArbeidsevne: {
      type: 'text',
      label: 'Hvor stor av arbeidsevnen er uutnyttet?',
      rules: { required: 'Du må angi hvor stor grad av arbeidsevnen som er uutnyttet' },
    },
  });
  return (
    <VilkårsKort heading={'Uutnyttet arbeidsevne - § 11-23'} steg={'VURDER_UUTNYTTET_ARBEIDSEVNE'}>
      <Form
        onSubmit={handleSubmitWithCallback(form, (data) => {
          console.log('Waddap!', data);
        })}
        steg={'VURDER_UUTNYTTET_ARBEIDSEVNE'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.uutnyttetArbeidsevne} />
      </Form>
    </VilkårsKort>
  );
};
