'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { løsBehov } from 'lib/api';
import { format } from 'date-fns';
import { SykdomsGrunnlag } from 'lib/types/types';
import { handleSubmitWithCallback } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  sykdomsgrunnlag: SykdomsGrunnlag;
}

interface FormFields {
  nedsattArbeidsevneDato: Date;
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: Date;
  antattÅrligInntekt: string;
}

export const FastsettBeregning = ({ behandlingsReferanse, sykdomsgrunnlag }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    nedsattArbeidsevneDato: {
      type: 'date',
      label: sykdomsgrunnlag.sykdomsvurdering?.yrkesskadevurdering?.erÅrsakssammenheng
        ? 'Dato for når arbeidsevnen ble nedsatt med minst 30 prosent'
        : 'Dato for når arbeidsevnen ble nedsatt med minst 50 prosent',
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
      type: 'number',
      label: 'Antatt årlig inntekt',
    },
  });

  return (
    <VilkårsKort heading={'Fastsett beregning'} steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}>
      <Form
        steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
        onSubmit={handleSubmitWithCallback(form, async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            beregningVurdering: {
              begrunnelse: data.begrunnelse,
              ytterligereNedsattArbeidsevneDato: format(new Date(data.ytterligereNedsattArbeidsevneDato), 'yyyy-MM-dd'),
              nedsattArbeidsevneDato: format(new Date(data.nedsattArbeidsevneDato), 'yyyy-MM-dd'),
              // @ts-ignore feil type fra backend
              antattÅrligInntekt: data.antattÅrligInntekt ? Number(data.antattÅrligInntekt) : undefined,
            },
            referanse: behandlingsReferanse,
          });
        })}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
      </Form>
    </VilkårsKort>
  );
};
