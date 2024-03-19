'use client';

import { useConfigForm } from 'hooks/FormHook';
import { Behovstype, getJaNeiEllerUndefined, handleSubmitWithCallback, JaEllerNei } from 'lib/utils/form';
import { SykdomsGrunnlag } from 'lib/types/types';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { løsBehov } from 'lib/api';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { VitalsIcon } from '@navikt/aksel-icons';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { stringToDate } from 'lib/utils/date';
import { format } from 'date-fns';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { Vilkårsveildening } from 'components/vilkårsveiledning/Vilkårsveiledning';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  erArbeidsevnenNedsatt: string;
  dokumenterBruktIVurderingen: string[];
  erSkadeSykdomEllerLyteVesentligdel: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  begrunnelse: string;
  nedsattArbeidsevneDato: Date;
}

export const Sykdomsvurdering = ({ grunnlag, behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>(
    {
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt?',
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erArbeidsevnenNedsatt),
        options: [
          { label: 'Ja', value: JaEllerNei.Ja },
          { label: 'Nei', value: JaEllerNei.Nei },
        ],
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt' },
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
      nedsattArbeidsevneDato: {
        type: 'date',
        label: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)',
        defaultValue: stringToDate(grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato),
        rules: {
          required: 'Du må sette en dato for skadetidspunktet',
        },
      },
    },
    { shouldUnregister: true }
  );

  return (
    <VilkårsKort heading={'Nedsatt arbeidsevne - § 11-5'} steg="AVKLAR_SYKDOM" icon={<VitalsIcon />} erNav={true}>
      <Form
        onSubmit={handleSubmitWithCallback(form, async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.AVKLAR_SYKDOM_KODE,
              sykdomsvurdering: {
                erArbeidsevnenNedsatt: data.erArbeidsevnenNedsatt === JaEllerNei.Ja,
                begrunnelse: data.begrunnelse,
                dokumenterBruktIVurdering: [],
                erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
                nedreGrense: 'FEMTI',
                erNedsettelseIArbeidsevneHøyereEnnNedreGrense:
                  data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja,
                nedsattArbeidsevneDato: data.nedsattArbeidsevneDato
                  ? format(new Date(data.nedsattArbeidsevneDato), 'yyyy-MM-dd')
                  : undefined,
              },
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
        <Vilkårsveildening />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} />
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />
        {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} />
            <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense} />
            <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />
          </>
        )}
      </Form>
    </VilkårsKort>
  );
};
