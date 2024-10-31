'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { BeregningsVurdering } from 'lib/types/types';
import { numberToString } from 'lib/utils/string';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { parse } from 'date-fns';

interface Props {
  vurdering?: BeregningsVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: string;
  antattÅrligInntekt: string;
}

export const FastsettBeregning = ({ vurdering, behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        defaultValue: getStringEllerUndefined(vurdering?.begrunnelse),
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date_input',
        label: 'Ytterligere nedsatt arbeidsevne dato',
        defaultValue: vurdering?.ytterligereNedsattArbeidsevneDato
          ? formaterDatoForFrontend(vurdering.ytterligereNedsattArbeidsevneDato)
          : undefined,
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
            ytterligereNedsattArbeidsevneDato: formaterDatoForBackend(
              parse(data.ytterligereNedsattArbeidsevneDato, 'dd.MM.yyyy', new Date())
            ),
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
        <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      </Form>
    </VilkårsKort>
  );
};
