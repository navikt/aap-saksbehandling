'use client';

import { useConfigForm } from 'hooks/FormHook';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  getStringEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VitalsIcon } from '@navikt/aksel-icons';
import { Alert, Label, Link, List } from '@navikt/ds-react';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';

import styles from './SykdomsvurderingMedYrkesskade.module.css';
import { Veiledning } from 'components/veiledning/Veiledning';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { SykdomProps } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { validerÅrstall } from 'lib/utils/validation';

interface FormFields {
  erArbeidsevnenNedsatt: string;
  begrunnelse: string;
  erSkadeSykdomEllerLyteVesentligdel: string;
  erÅrsakssammenheng: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  nedsattArbeidsevneDato: string;
  dokumenterBruktIVurderingen: string[];
}

export const SykdomsvurderingMedYrkesskade = ({ behandlingVersjon, grunnlag, readOnly }: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

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
        type: 'text',
        label: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)',
        defaultValue: getStringEllerUndefined(grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato),
        rules: {
          required: 'Du må sette en dato for når arbeidsevnen ble nedsatt',
          validate: (value) => validerÅrstall(value as string),
        },
      },
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter funnet som er relevant for vurdering av §11-22 1.ledd og §11-5',
        description: 'Tilknytt minst ett dokument til §11-22 1.ledd og §11-5 vurdering',
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const dokumenterBruktIVurderingen = form.watch('dokumenterBruktIVurderingen');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
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
            nedsattArbeidsevneDato: Number(data.nedsattArbeidsevneDato),
            yrkesskadevurdering: {
              erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
            },
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading={'Yrkesskade og nedsatt arbeidsevne §§ 11-22 1.ledd, 11-5'}
      steg={'AVKLAR_SYKDOM'}
      icon={<VitalsIcon />}
      vilkårTilhørerNavKontor={true}
    >
      <Form
        steg={'AVKLAR_SYKDOM'}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
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

        <Veiledning />
        <FormField form={form} formField={formFields.begrunnelse} />
        <TilknyttedeDokumenter dokumenter={dokumenterBruktIVurderingen} />
        <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} />

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
