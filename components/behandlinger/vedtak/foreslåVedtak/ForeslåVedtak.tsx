'use client';

import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FatteVedtakGrunnlag } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
  grunnlag: FatteVedtakGrunnlag;
}

interface FormFields {
  begrunnelse: string;
}

export const ForeslåVedtak = ({ behandlingsReferanse, grunnlag }: Props) => {
  console.log({ behandlingsReferanse, grunnlag });
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Skriv en begrunnelse',
    },
  });
  return (
    <VilkårsKort heading="Foreslå vedtak :)">
      <Form steg="FORESLÅ_VEDTAK" onSubmit={() => {}}>
        <FormField form={form} formField={formFields.begrunnelse} />
      </Form>
    </VilkårsKort>
  );
};
