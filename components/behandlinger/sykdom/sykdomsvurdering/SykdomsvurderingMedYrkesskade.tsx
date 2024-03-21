'use client';

import { useConfigForm } from 'hooks/FormHook';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  handleSubmitWithCallback,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VitalsIcon } from '@navikt/aksel-icons';
import { Alert, Label, Link, List } from '@navikt/ds-react';
import { SykdomsGrunnlag } from 'lib/types/types';
import { løsBehov } from 'lib/api';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';

import styles from './SykdomsvurderingMedYrkesskade.module.css';
import { Vilkårsveildening } from 'components/vilkårsveiledning/Vilkårsveiledning';
import { formaterDatoForBackend, stringToDate } from 'lib/utils/date';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  erArbeidsevnenNedsatt: string;
  begrunnelse: string;
  erSkadeSykdomEllerLyteVesentligdel: string;
  erÅrsakssammenheng: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  nedsattArbeidsevneDato: Date;
  dokumenterBruktIVurderingen: string[];
}

export const SykdomsvurderingMedYrkesskade = ({ behandlingsReferanse, grunnlag }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>(
    {
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt?',
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erArbeidsevnenNedsatt),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt' },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder den nedsatte arbeidsevnen',
        description: 'Hvilken sykdom/skade/lyte? Hva er det mest vesentlige? Hvis yrkesskade er funnet: vurder mot YS',
        defaultValue: grunnlag.sykdomsvurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      erSkadeSykdomEllerLyteVesentligdel: {
        type: 'radio',
        label: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
        rules: {
          required: 'Du må svare på om det er sykdom, skade eller lyte som er medvirkende til nedsatt arbeidsevne.',
        },
      },
      erÅrsakssammenheng: {
        type: 'radio',
        label: 'Er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen? (§ 11-22 1.ledd).',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.yrkesskadevurdering?.erÅrsakssammenheng),
        rules: {
          required:
            'Du må svare på om yrkesskaden er helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen.',
        },
      },
      erNedsettelseIArbeidsevneHøyereEnnNedreGrense: {
        type: 'radio',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt.' },
      },
      nedsattArbeidsevneDato: {
        type: 'date',
        label: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)',
        defaultValue: stringToDate(grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato),
        rules: {
          required: 'Du må sette en dato for skadetidspunktet',
        },
      },
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter funnet som er relevant for vurdering av §11-22 1.ledd og §11-5',
        description: 'Tilknytt minst ett dokument til §11-22 1.ledd og §11-5 vurdering',
      },
    },
    { shouldUnregister: true }
  );

  const dokumenterBruktIVurderingen = form.watch('dokumenterBruktIVurderingen');
  console.log(form.watch('nedsattArbeidsevneDato'));

  return (
    <VilkårsKort
      heading={'Yrkesskade og nedsatt arbeidsevne §§ 11-22 1.ledd, 11-5'}
      steg={'AVKLAR_SYKDOM'}
      icon={<VitalsIcon />}
      erNav={true}
    >
      <Form
        steg={'AVKLAR_SYKDOM'}
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
                nedreGrense: data.erÅrsakssammenheng === JaEllerNei.Ja ? 'TRETTI' : 'FEMTI',
                erNedsettelseIArbeidsevneHøyereEnnNedreGrense:
                  data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja,
                nedsattArbeidsevneDato: data.nedsattArbeidsevneDato
                  ? formaterDatoForBackend(data.nedsattArbeidsevneDato)
                  : undefined,
                yrkesskadevurdering: {
                  erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
                },
              },
            },
            referanse: behandlingsReferanse,
          });
        })}
      >
        <Alert variant="warning" size={'small'}>
          Vi har funnet en eller flere registrerte yrkesskader
        </Alert>

        <div className={styles.yrkesskader}>
          <Label as="p">Godkjente yrkesskade(r)</Label>
          <List as={'ol'} size={'small'}>
            <List.Item>
              <b>Dato for skadetidspunkt:</b> 03.09.2017
            </List.Item>
            <List.Item>
              <b>Dato for skadetidspunkt:</b> 20.10.2022
            </List.Item>
          </List>
          <Link href={'www.nav.no'}>Yrkesskaderegisteret</Link>
        </div>

        <RegistrertBehandler />

        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>

        <Vilkårsveildening />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} />
        <TilknyttedeDokumenter dokumenter={dokumenterBruktIVurderingen} />

        {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
          <>
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

            {form.watch('erSkadeSykdomEllerLyteVesentligdel') == JaEllerNei.Ja &&
              form.watch('erNedsettelseIArbeidsevneHøyereEnnNedreGrense') == JaEllerNei.Ja && (
                <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />
              )}
          </>
        )}
      </Form>
    </VilkårsKort>
  );
};
