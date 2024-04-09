'use client';

import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { BehandlingResultat } from 'lib/types/types';
import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { Behovstype, handleSubmitWithCallback } from 'lib/utils/form';
import { løsBehov } from 'lib/clientApi';

interface Props {
  behandlingsReferanse: string;
  behandlingResultat: BehandlingResultat;
}

interface FormFields {
  begrunnelse: string;
}

export const ForeslåVedtak = ({ behandlingsReferanse, behandlingResultat }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Skriv en begrunnelse',
    },
  });

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <Form
        steg="FORESLÅ_VEDTAK"
        onSubmit={handleSubmitWithCallback(form, async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
              foreslåvedtakVurdering: data.begrunnelse,
            },
            referanse: behandlingsReferanse,
          });
        })}
      >
        <Vilkårsoppsummering behandlingResultat={behandlingResultat} />
        <FormField form={form} formField={formFields.begrunnelse} />
      </Form>
    </VilkårsKort>
  );
};
