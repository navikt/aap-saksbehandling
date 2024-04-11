'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { løsBehov } from 'lib/clientApi';
import { Behovstype, handleSubmitWithCallback } from 'lib/utils/form';
import { formaterDatoForBackend } from 'lib/utils/date';

interface Props {
  behandlingsReferanse: string;
  erBeslutter: boolean;
}

interface FormFields {
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: Date;
  antattÅrligInntekt: string;
}

export const FastsettBeregning = ({ behandlingsReferanse, erBeslutter }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'text',
        label: 'Begrunnelse',
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date',
        label: 'Ytterligere nedsatt arbeidsevne dato',
      },
      antattÅrligInntekt: {
        type: 'number',
        label: 'Antatt årlig inntekt',
      },
    },
    { readOnly: erBeslutter }
  );

  return (
    <VilkårsKort heading={'Fastsett beregning'} steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}>
      <Form
        steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
        onSubmit={handleSubmitWithCallback(form, async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
              beregningVurdering: {
                begrunnelse: data.begrunnelse,
                ytterligereNedsattArbeidsevneDato: formaterDatoForBackend(data.ytterligereNedsattArbeidsevneDato),
                // @ts-ignore TODO feil type fra backend
                antattÅrligInntekt: data.antattÅrligInntekt ? Number(data.antattÅrligInntekt) : undefined,
              },
            },
            referanse: behandlingsReferanse,
          });
        })}
        visBekreftKnapp={!erBeslutter}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
      </Form>
    </VilkårsKort>
  );
};
