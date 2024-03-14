'use client';

import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FatteVedtakGrunnlag, FlytGruppe } from 'lib/types/types';
import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { handleSubmitWithCallback } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  grunnlag: FatteVedtakGrunnlag;
  flytGrupper: FlytGruppe[];
}

interface FormFields {
  begrunnelse: string;
}

export const ForeslåVedtak = ({ behandlingsReferanse, grunnlag, flytGrupper }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Skriv en begrunnelse',
    },
  });

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <Vilkårsoppsummering flytGrupper={flytGrupper} />

      <Form
        steg="FORESLÅ_VEDTAK"
        onSubmit={handleSubmitWithCallback(form, () => {
          console.log(behandlingsReferanse, grunnlag);
        })}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
      </Form>
    </VilkårsKort>
  );
};
