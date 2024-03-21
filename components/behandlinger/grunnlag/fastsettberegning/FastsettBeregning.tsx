'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { løsBehov } from 'lib/api';
import { SykdomsGrunnlag } from 'lib/types/types';
import { Behovstype, handleSubmitWithCallback } from 'lib/utils/form';
import { formaterDatoForBackend } from 'lib/utils/date';

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
            behov: {
              behovstype: Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
              beregningVurdering: {
                begrunnelse: data.begrunnelse,
                ytterligereNedsattArbeidsevneDato: formaterDatoForBackend(data.ytterligereNedsattArbeidsevneDato),
                nedsattArbeidsevneDato: formaterDatoForBackend(data.nedsattArbeidsevneDato),
                // @ts-ignore TODO feil type fra backend
                antattÅrligInntekt: data.antattÅrligInntekt ? Number(data.antattÅrligInntekt) : undefined,
              },
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
