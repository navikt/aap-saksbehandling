'use client';

import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { SykdomsGrunnlag } from 'lib/types/types';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { løsBehov } from 'lib/api';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, Label } from '@navikt/ds-react';
import { VitalsIcon } from '@navikt/aksel-icons';
import { SykdomsvurderingDto } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  dokumentasjonMangler: string[];
  erSkadeSykdomEllerLyteVesentligdel: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  begrunnelse: string;
}

export const Sykdomsvurdering = ({ grunnlag, behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    dokumentasjonMangler: {
      type: 'checkbox',
      label: 'Dokumentasjon mangler',
      options: [{ label: 'Dokumentasjon mangler', value: 'dokumentasjonMangler' }],
    },
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description:
        'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige. Hvorfor vurderes nedsatt arbeidsevne med minst 50%?',
      defaultValue: grunnlag?.sykdomsvurdering?.begrunnelse,
      rules: { required: 'Du må begrunne' },
    },
    erSkadeSykdomEllerLyteVesentligdel: {
      type: 'radio',
      label: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
      defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    erNedsettelseIArbeidsevneHøyereEnnNedreGrense: {
      type: 'radio',
      label: 'Er arbeidsevnen nedsatt med minst 50%?',
      defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om arbeidsevnen er nedsatt med minst 50%' },
    },
  });

  return (
    <VilkårsKort heading={'Nedsatt arbeidsevne - § 11-5'} steg="AVKLAR_SYKDOM" icon={<VitalsIcon />}>
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          const sykdomsVurdering: SykdomsvurderingDto = {
            begrunnelse: data.begrunnelse,
            dokumenterBruktIVurdering: [],
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            nedreGrense: 'FEMTI',
            erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
              ? data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja
              : undefined,
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
        steg={'AVKLAR_SYKDOM'}
      >
        <div>
          <Label as="p">Registrert behandler</Label>
          <BodyShort>Trond Ask</BodyShort>
          <BodyShort>Lillegrensen Legesenter</BodyShort>
          <BodyShort>0123 Legeby, 22 44 66 88</BodyShort>
        </div>
        <FormField form={form} formField={formFields.dokumentasjonMangler} />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} />
        <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense} />
      </Form>
    </VilkårsKort>
  );
};
