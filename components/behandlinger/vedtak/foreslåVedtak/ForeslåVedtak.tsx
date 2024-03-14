'use client';

import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { BehandlingResultat, FatteVedtakGrunnlag } from 'lib/types/types';
import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { handleSubmitWithCallback } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  grunnlag: FatteVedtakGrunnlag;
  behandlingResultat: BehandlingResultat;
}

interface FormFields {
  begrunnelse: string;
}

export const ForeslåVedtak = ({ behandlingsReferanse, grunnlag, behandlingResultat }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Skriv en begrunnelse',
    },
  });

  console.log(behandlingResultat);

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <Form
        steg="FORESLÅ_VEDTAK"
        onSubmit={handleSubmitWithCallback(form, () => {
          console.log(behandlingsReferanse, grunnlag);
        })}
      >
        <Vilkårsoppsummering behandlingResultat={behandlingResultat} />
        <FormField form={form} formField={formFields.begrunnelse} />
      </Form>
    </VilkårsKort>
  );
};
