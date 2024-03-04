'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { løsBehov } from 'lib/api';
import { BehovsType } from 'lib/utils/form';
import { format } from 'date-fns';

interface Props {
  behandlingsReferanse: string;
}

interface FormFields {
  nedsattArbeidsevneDato: Date;
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: Date;
  antattÅrligInntekt: string;
}

interface BeregningVurdering {
  begrunnelse: string;
  nedsattArbeidsevneDato: string;
  ytterligereNedsattArbeidsevneDato: string;
  antattÅrligInntekt?: number;
}

// TODO Hent inn sykdomsgrunnlag for å vise korrekt label på ytterligereNedsattArbeidsevne

export const FastsettBeregning = ({ behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    nedsattArbeidsevneDato: {
      type: 'date',
      label: 'Dato for når arbeidsevnen ble nedsatt med minst x prosent',
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
        onSubmit={form.handleSubmit(async (data) => {
          const beregningVurdering: BeregningVurdering = {
            begrunnelse: data.begrunnelse,
            ytterligereNedsattArbeidsevneDato: format(new Date(data.ytterligereNedsattArbeidsevneDato), 'yyyy-MM-dd'),
            nedsattArbeidsevneDato: format(new Date(data.nedsattArbeidsevneDato), 'yyyy-MM-dd'),
            antattÅrligInntekt: data.antattÅrligInntekt ? Number(data.antattÅrligInntekt) : undefined,
          };

          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.FASTSETT_BEREGNINGSTIDSPUNKT,
              // @ts-ignore Feil generert type i backend
              vurdering: beregningVurdering,
            },
            fastsettBeregningstidspunkt: null,
            sykdomsvurdering: null,
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
