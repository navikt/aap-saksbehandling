'use client';

import { useConfigForm } from 'hooks/FormHook';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { handleSubmitWithCallback } from 'lib/utils/form';
import { FormField } from 'components/input/formfield/FormField';

interface FormFields {
  begrunnelse: string;
  andelNedsattArbeidsevne: number;
}
interface Props {
  behandlingsReferanse: string;
}
export const FastsettArbeidsevne = ({ behandlingsReferanse }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description:
        'Hvilken sykdom/skade/lyte. Hva er det mest vesentlige. Hvorfor vurderes det at det finnes en nedsatt arbeisevne',
      rules: { required: 'Du må begrunne avgjørelsen din.' },
    },
    andelNedsattArbeidsevne: {
      type: 'text',
      label: 'Hvor stor del av arbeidsevnen er nedsatt?',
      rules: { required: 'Du må angi hvor stor del av arbeidsevnen som er nedsatt' },
    },
  });
  return (
    <VilkårsKort heading={'Nedsatt arbeidsevne - § 11-23 2.ledd (Valgfritt)'} steg={'FASTSETT_ARBEIDSEVNE'}>
      <Form
        onSubmit={handleSubmitWithCallback(form, (data) => {
          console.log('Waddap!', data, behandlingsReferanse);
        })}
        steg={'VURDER_UUTNYTTET_ARBEIDSEVNE'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.andelNedsattArbeidsevne} />
      </Form>
    </VilkårsKort>
  );
};
