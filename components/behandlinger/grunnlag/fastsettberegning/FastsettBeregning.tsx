'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { løsBehov } from 'lib/clientApi';
import { Behovstype, handleSubmitWithCallback } from 'lib/utils/form';
import { formaterDatoForBackend, stringToDate } from 'lib/utils/date';
import { BeregningsGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag?: BeregningsGrunnlag;
  behandlingsReferanse: string;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: Date;
  antattÅrligInntekt: string;
}

export const FastsettBeregning = ({ grunnlag, behandlingsReferanse, readOnly }: Props) => {
  console.log('beregning grunnlag', grunnlag);
  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'text',
        label: 'Begrunnelse',
        defaultValue: grunnlag?.beregnigsVurdering?.begrunnelse,
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date',
        label: 'Ytterligere nedsatt arbeidsevne dato',
        defaultValue: stringToDate(grunnlag?.beregnigsVurdering?.ytterligereNedsattArbeidsevneDato),
      },
      antattÅrligInntekt: {
        type: 'number',
        label: 'Antatt årlig inntekt',
      },
    },
    { readOnly: readOnly }
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
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
      </Form>
    </VilkårsKort>
  );
};
