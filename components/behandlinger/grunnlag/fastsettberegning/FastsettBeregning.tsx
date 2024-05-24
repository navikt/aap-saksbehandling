'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, stringToDate } from 'lib/utils/date';
import { BeregningsGrunnlag, BeregningsVurdering } from 'lib/types/types';
import { numberToString } from 'lib/utils/string';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  vurdering?: BeregningsVurdering;
  grunnlag?: BeregningsGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: Date;
  antattÅrligInntekt: string;
}

export const FastsettBeregning = ({ vurdering, grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  console.log('grunnlag', grunnlag);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'text',
        label: 'Begrunnelse',
        defaultValue: getStringEllerUndefined(vurdering?.begrunnelse),
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date',
        label: 'Ytterligere nedsatt arbeidsevne dato',
        defaultValue: stringToDate(vurdering?.ytterligereNedsattArbeidsevneDato),
      },
      antattÅrligInntekt: {
        type: 'number',
        label: 'Antatt årlig inntekt',
        defaultValue: numberToString(vurdering?.antattÅrligInntekt),
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
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
