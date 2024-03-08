'use client';

import { useConfigForm } from 'hooks/FormHook';
import { getJaNeiEllerUndefined, handleSubmitWithCallback, JaEllerNei } from 'lib/utils/form';
import { SykdomsGrunnlag } from 'lib/types/types';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { løsBehov } from 'lib/api';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { VitalsIcon } from '@navikt/aksel-icons';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { Alert } from '@navikt/ds-react';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  dokumenterBruktIVurderingen: string[];
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
      label: grunnlag.skalVurdereYrkesskade
        ? 'Er arbeidsevnen nedsatt med minst 30%?'
        : 'Er arbeidsevnen nedsatt med minst 50%?',
      defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om arbeidsevnen er nedsatt med minst 50%' },
    },
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevant for vurdering av §11-5',
      description: 'Tilknytt minst ett dokument §11-5 vurdering',
    },
  });

  return (
    <VilkårsKort heading={'Nedsatt arbeidsevne - § 11-5'} steg="AVKLAR_SYKDOM" icon={<VitalsIcon />} erNav={true}>
      <Form
        onSubmit={handleSubmitWithCallback(form, async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            sykdomsvurderingDto: {
              begrunnelse: data.begrunnelse,
              dokumenterBruktIVurdering: [],
              erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
              nedreGrense: 'FEMTI',
              erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
                ? data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja
                : undefined,
            },
            referanse: behandlingsReferanse,
          });
        })}
        steg={'AVKLAR_SYKDOM'}
      >
        <RegistrertBehandler />
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <FormField form={form} formField={formFields.dokumentasjonMangler} />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} />
        <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense} />

        {form.watch('erSkadeSykdomEllerLyteVesentligdel') === JaEllerNei.Nei && (
          <Alert variant={'warning'}>Avslag AAP søknad (Snakk med Therese om bedre tekst her)</Alert>
        )}
      </Form>
    </VilkårsKort>
  );
};
