'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, stringToDate } from 'lib/utils/date';
import { BeregningsGrunnlag } from 'lib/types/types';
import { numberToString } from 'lib/utils/string';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';

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
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'text',
        label: 'Begrunnelse',
        defaultValue: getStringEllerUndefined(grunnlag?.begrunnelse),
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date',
        label: 'Ytterligere nedsatt arbeidsevne dato',
        defaultValue: stringToDate(grunnlag?.ytterligereNedsattArbeidsevneDato),
      },
      antattÅrligInntekt: {
        type: 'number',
        label: 'Antatt årlig inntekt',
        defaultValue: numberToString(grunnlag?.antattÅrligInntekt),
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: 0,
        behov: {
          behovstype: Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
          beregningVurdering: {
            begrunnelse: data.begrunnelse,
            ytterligereNedsattArbeidsevneDato: formaterDatoForBackend(data.ytterligereNedsattArbeidsevneDato),
            antattÅrligInntekt: data.antattÅrligInntekt ? { verdi: Number(data.antattÅrligInntekt) } : undefined,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Fastsett beregning'} steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}>
      <Form
        steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
      </Form>
    </VilkårsKort>
  );
};
