'use client';

import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { stringToDate } from 'lib/utils/date';
import { SykdomsGrunnlag } from 'lib/types/types';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/behandlinger/Form';
import { løsBehov } from 'lib/api';
import { format } from 'date-fns';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Alert, BodyShort, Label } from '@navikt/ds-react';
import { VitalsIcon } from '@navikt/aksel-icons';

interface Props {
  behandlingsReferanse: string;
  sykdomsgrunnlag?: SykdomsGrunnlag;
}

interface FormFields {
  dokumentasjonMangler: string[];
  erSykdom: string;
  nedsattMinst50: string;
  nedsattMinst30: string;
  begrunnelse: string;
  dato: Date;
}

const harSvartJaPåSykdomsvurdering = (arbeidsevne50?: string, arbeidsevne30?: string) => {
  return arbeidsevne50 === JaEllerNei.Ja || arbeidsevne30 === JaEllerNei.Ja;
};
export const Sykdomsvurdering = ({ sykdomsgrunnlag, behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    dokumentasjonMangler: {
      type: 'checkbox',
      label: 'Dokumentasjon mangler',
      options: [{ label: 'Dokumentasjon mangler', value: 'dokumentasjonMangler' }],
    },
    erSykdom: {
      type: 'radio',
      label: 'Er det sykdom, skade eller lyte som fører til nedsatt arbeidsevne?',
      defaultValue: getJaNeiEllerUndefined(sykdomsgrunnlag?.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    nedsattMinst50: {
      type: 'radio',
      label: 'Er arbeidsevnen nedsatt med minst 50%?',
      defaultValue: getJaNeiEllerUndefined(
        sykdomsgrunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
      ),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
    },
    nedsattMinst30: {
      type: 'radio',
      label: 'Er arbeidsevnen nedsatt med minst 30%?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
    },
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description:
        'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige. Hvorfor vurderes nedsatt arbeidsevne med minst 50%?',
      defaultValue: sykdomsgrunnlag?.sykdomsvurdering?.begrunnelse,
      rules: { required: 'Du må begrunne' },
    },
    dato: {
      type: 'date',
      label: 'Dato for nedsatt arbeidsevne',
      defaultValue: stringToDate(sykdomsgrunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato),
      rules: {
        validate: {
          required: (value, formValues) => {
            if (!value && harSvartJaPåSykdomsvurdering(formValues.nedsattMinst50, formValues.nedsattMinst30)) {
              return 'Du må svare på når arbeidsevnen ble nedsatt';
            }
          },
        },
      },
    },
  });

  return (
    <VilkårsKort heading={'Nedsatt arbeidsevne - § 11-5'} icon={<VitalsIcon />}>
      <Alert variant="warning">Legeerklæring er av gammel dato, vurder å be om en ny fra behandler</Alert>
      <div>
        <Label as="p" spacing>
          Registrert behandler
        </Label>
        <BodyShort>Fast Lege</BodyShort>
        <BodyShort>Lillegrensen Legesenter</BodyShort>
        <BodyShort>0123 Legeby, 815 493 00</BodyShort>
      </div>
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.SYKDOMSVURDERING,
              // @ts-ignore Feil generert type i backend
              begrunnelse: data.begrunnelse,
              // @ts-ignore Feil generert type i backend
              dokumenterBruktIVurdering: [],
              // @ts-ignore Feil generert type i backend
              erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.nedsattMinst50 === JaEllerNei.Ja,
              // @ts-ignore Feil generert type i backend
              erSkadeSykdomEllerLyteVesentligdel: data.erSykdom === JaEllerNei.Ja,
              // @ts-ignore Feil generert type i backend
              nedsattArbeidsevneDato: format(new Date(data.dato), 'yyyy-MM-dd'),
            },
            referanse: behandlingsReferanse,
          });
        })}
      >
        <FormField form={form} formField={formFields.dokumentasjonMangler} />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erSykdom} />
        {sykdomsgrunnlag?.yrkesskadevurdering?.erÅrsakssammenheng && (
          <FormField form={form} formField={formFields.nedsattMinst30} />
        )}
        {!sykdomsgrunnlag?.yrkesskadevurdering?.erÅrsakssammenheng && (
          <FormField form={form} formField={formFields.nedsattMinst50} />
        )}
        {(form.watch('nedsattMinst50') === JaEllerNei.Ja || form.watch('nedsattMinst30') === JaEllerNei.Ja) && (
          <FormField form={form} formField={formFields.dato} />
        )}
      </Form>
    </VilkårsKort>
  );
};
