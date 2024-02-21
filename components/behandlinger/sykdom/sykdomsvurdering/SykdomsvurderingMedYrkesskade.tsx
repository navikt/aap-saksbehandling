'use client';

import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VitalsIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import { SykdomsGrunnlag } from 'lib/types/types';
import { løsBehov } from 'lib/api';
import { format } from 'date-fns';
import { stringToDate } from 'lib/utils/date';
import { SykdomsvurderingDto } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  erSkadeSykdomEllerLyteVesentligdel: string;
  erÅrsakssammenheng: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  skadetidspunkt: Date;
}

export const SykdomsvurderingMedYrkesskade = ({ behandlingsReferanse, grunnlag }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om yrkesskaden er medvirkende årsak til den nedsatte arbeidsevnen',
      description: 'Se eksempel på vilkårsvurderingstekst',
      defaultValue: grunnlag.sykdomsvurdering?.begrunnelse,
      rules: { required: 'Du må begrunne' },
    },
    erSkadeSykdomEllerLyteVesentligdel: {
      type: 'radio',
      label: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
      rules: {
        required: 'Du må svare på om det er sykdom, skade eller lyte som er medvirkende til nedsatt arbeidsevne.',
      },
    },
    erÅrsakssammenheng: {
      type: 'radio',
      label: 'Er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen? (§ 11-22 1.ledd).',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.yrkesskadevurdering?.erÅrsakssammenheng),
      rules: {
        required: 'Du må svare på om yrkesskaden er helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen.',
      },
    },
    erNedsettelseIArbeidsevneHøyereEnnNedreGrense: {
      type: 'radio',
      label: '', // Denne blir satt dynamisk i return metoden.
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
      rules: { required: 'Du må svare på om arbeidsevnen er nedsatt.' },
    },
    skadetidspunkt: {
      type: 'date',
      label: 'Dato for skadetidspunkt for yrkesskaden',
      defaultValue: stringToDate(grunnlag.sykdomsvurdering?.yrkesskadevurdering?.skadetidspunkt),
      rules: {
        required: 'Du må sette en dato for skadetidspunktet',
      },
    },
  });

  return (
    <VilkårsKort
      heading={'Yrkesskade og nedsatt arbeidsevne § 11-22 1.ledd, 11-5'}
      steg={'AVKLAR_SYKDOM'}
      icon={<VitalsIcon />}
    >
      <Form
        steg={'AVKLAR_SYKDOM'}
        onSubmit={form.handleSubmit(async (data) => {
          const sykdomsVurdering: SykdomsvurderingDto = {
            begrunnelse: data.begrunnelse,
            dokumenterBruktIVurdering: [],
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            nedreGrense: data.erÅrsakssammenheng === JaEllerNei.Ja ? 'TRETTI' : 'FEMTI',
            erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
              ? data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja
              : undefined,
            yrkesskadevurdering: {
              erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
              andelAvNedsettelse: 50, // Skal vi lage eget felt for denne?
              skadetidspunkt: data.skadetidspunkt ? format(new Date(data.skadetidspunkt), 'yyyy-MM-dd') : undefined,
            },
          };

          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.SYKDOMSVURDERING,
              // @ts-ignore Feil generert type i backend
              sykdomsvurdering: sykdomsVurdering,
            },
            referanse: behandlingsReferanse,
          });
        })}
      >
        <Alert variant="warning">Vi har funnet en eller flere registrerte yrkesskader</Alert>
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} />
        <FormField form={form} formField={formFields.erÅrsakssammenheng} />
        <FormField
          form={form}
          formField={{
            ...formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense,
            label:
              form.watch('erÅrsakssammenheng') === JaEllerNei.Nei || !form.watch('erÅrsakssammenheng')
                ? 'Er arbeidsevnen nedsatt med minst 50%?'
                : 'Er arbeidsevnen nedsatt med minst 30%?',
          }}
        />
        {form.watch('erÅrsakssammenheng') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.skadetidspunkt} />
        )}
      </Form>
    </VilkårsKort>
  );
};
