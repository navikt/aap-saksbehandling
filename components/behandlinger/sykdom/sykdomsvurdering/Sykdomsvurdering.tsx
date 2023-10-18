'use client';

import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { stringToDate } from 'lib/utils/date';
import { SykdomsGrunnlag } from 'lib/types/types';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { løsBehov } from 'lib/api';
import { format } from 'date-fns';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, Label } from '@navikt/ds-react';
import { VitalsIcon } from '@navikt/aksel-icons';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  dokumentasjonMangler: string[];
  erSykdom: string;
  arbeidsevneNedsatt: string;
  begrunnelse: string;
  dato: Date;
}

export const Sykdomsvurdering = ({ grunnlag, behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    dokumentasjonMangler: {
      type: 'checkbox',
      label: 'Dokumentasjon mangler',
      options: [{ label: 'Dokumentasjon mangler', value: 'dokumentasjonMangler' }],
    },
    erSykdom: {
      type: 'radio',
      label: 'Er det sykdom, skade eller lyte som fører til nedsatt arbeidsevne?',
      defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    arbeidsevneNedsatt: {
      type: 'radio',
      label: grunnlag?.erÅrsakssammenheng
        ? 'Er arbeidsevnen nedsatt med minst 30%?'
        : 'Er arbeidsevnen nedsatt med minst 50%?',
      defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
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
      defaultValue: grunnlag?.sykdomsvurdering?.begrunnelse,
      rules: { required: 'Du må begrunne' },
    },
    dato: {
      type: 'date',
      label: 'Dato for nedsatt arbeidsevne',
      defaultValue: stringToDate(grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato),
      rules: {
        validate: {
          required: (value, formValues) => {
            if (!value && formValues.arbeidsevneNedsatt === JaEllerNei.Ja) {
              return 'Du må svare på når arbeidsevnen ble nedsatt';
            }
          },
        },
      },
    },
  });

  return (
    <VilkårsKort heading={'Nedsatt arbeidsevne - § 11-5'} steg="AVKLAR_SYKDOM" icon={<VitalsIcon />}>
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.SYKDOMSVURDERING,
              // @ts-ignore Feil generert type i backend
              sykdomsvurdering: {
                // @ts-ignore Feil generert type i backend
                begrunnelse: data.begrunnelse,
                // @ts-ignore Feil generert type i backend
                dokumenterBruktIVurdering: [],
                // @ts-ignore Feil generert type i backend
                erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.arbeidsevneNedsatt === JaEllerNei.Ja,
                // @ts-ignore Feil generert type i backend
                erSkadeSykdomEllerLyteVesentligdel: data.erSykdom === JaEllerNei.Ja,
                // @ts-ignore Feil generert type i backend
                nedreGrense: grunnlag?.erÅrsakssammenheng ? 'TRETTI' : 'FEMTI',
                // @ts-ignore Feil generert type i backend
                nedsattArbeidsevneDato: data.dato ? format(new Date(data.dato), 'yyyy-MM-dd') : undefined,
              },
            },
            referanse: behandlingsReferanse,
          });
        })}
        steg={'AVKLAR_SYKDOM'}
      >
        <div>
          <Label as="p">Registrert behandler</Label>
          <BodyShort>Fast Lege</BodyShort>
          <BodyShort>Lillegrensen Legesenter</BodyShort>
          <BodyShort>0123 Legeby, 815 493 00</BodyShort>
        </div>
        <FormField form={form} formField={formFields.dokumentasjonMangler} />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erSykdom} />
        <FormField form={form} formField={formFields.arbeidsevneNedsatt} />
        {form.watch('arbeidsevneNedsatt') === JaEllerNei.Ja && <FormField form={form} formField={formFields.dato} />}
      </Form>
    </VilkårsKort>
  );
};
