'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
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
import { validerGyldigDato } from 'lib/utils/validation';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface FormFields {
  harSkadeSykdomEllerLyte: string;
  erArbeidsevnenNedsatt: string;
  begrunnelse: string;
  erSkadeSykdomEllerLyteVesentligdel: string;
  erÅrsakssammenheng: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  nedsattArbeidsevneDato: string;
  dokumenterBruktIVurderingen: string[];
}

export const SykdomsvurderingMedYrkesskade = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  tilknyttedeDokumenter,
}: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      harSkadeSykdomEllerLyte: {
        type: 'radio',
        label: 'Har innbygger sykdom, skade eller lyte?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.harSkadeSykdomEllerLyte),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om innbygger har sykdom, skade eller lyte' },
      },
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
        description:
          'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige? Hvis yrkesskade er funnet: vurder mot YS',
        defaultValue: grunnlag.sykdomsvurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      erSkadeSykdomEllerLyteVesentligdel: {
        type: 'radio',
        label: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
        rules: {
          required: 'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
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
        defaultValue: grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato
          ? formaterDatoForVisning(grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato)
          : undefined,
        rules: {
          required: 'Du må sette en dato for når arbeidsevnen ble nedsatt',
          validate: (value) => validerGyldigDato(value as string),
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
            harSkadeSykdomEllerLyte: data.harSkadeSykdomEllerLyte === JaEllerNei.Ja,
            erArbeidsevnenNedsatt: data.erArbeidsevnenNedsatt === JaEllerNei.Ja,
            begrunnelse: data.begrunnelse,
            dokumenterBruktIVurdering: [],
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            nedreGrense: data.erÅrsakssammenheng === JaEllerNei.Ja ? 'TRETTI' : 'FEMTI',
            erNedsettelseIArbeidsevneHøyereEnnNedreGrense:
              data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja,
            nedsattArbeidsevneDato: formaterDatoForBackend(
              parse(data.nedsattArbeidsevneDato, 'dd.MM.yyyy', new Date())
            ),
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
          <DokumentTabell
            dokumenter={tilknyttedeDokumenter.map((d) => ({
              journalpostId: d.journalpostId,
              dokumentId: d.dokumentInfoId,
              tittel: d.tittel,
              erTilknyttet: false,
            }))}
          />
        </FormField>

        <Veiledning />
        <FormField form={form} formField={formFields.begrunnelse} />
        <TilknyttedeDokumenter dokumenter={dokumenterBruktIVurderingen} />
        <section>
          <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} />
          <Veiledning
            header={'Slik vurderes dette'}
            tekst={
              'Sykdom, skade eller lyte er (som hovedregel) en medisinsk tilstand med en vitenskapelig anerkjent diagnose. Sykdomslignende symptomer kan også oppfylle lovens krav til sykdom, så det er ikke alltid et krav at det er stilt en diagnose for at vilkåret skal være oppfylt.'
            }
          />
        </section>
        {form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja && (
          <>
            <section>
              <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} />
              <Veiledning
                header={'Slik vurderes dette'}
                tekst={
                  'Med arbeidsevne menes den enkeltes evne til å møte de krav som stilles i utførelsen av et normal inntektsgivende arbeid. Arbeidsevnen anses som nedsatt når medlemmet helt eller delvis er ute av stand til å utføre arbeidsoppgavene i ulike jobber som han eller hun er kvalifisert til.'
                }
              />
            </section>
            <section>
              <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} />
              <Veiledning
                header={'Slik vurderes dette'}
                tekst={
                  'Det tas utgangspunkt i alminnelig arbeidstid på 37,5 timer per uke for å vurdere om arbeidsevnen er nedsatt med minst halvparten. Hver enkelt sak vurderes konkret ut fra hvordan de faktiske forholdene påvirker medlemmets evne til å utføre arbeid. At inntekten reduseres med mer enn halvparten, er ikke relevant for vurderingen av om arbeidsevnen er nedsatt.'
                }
              />
            </section>
            <section>
              <FormField form={form} formField={formFields.erÅrsakssammenheng} />
              <Veiledning
                header={'Slik vurderes dette'}
                tekst={
                  'Det må være årsakssammenheng mellom sykdom, skade eller lyte og den nedsatte arbeidsevnen. At sykdom, skade eller lyte skal utgjøre en vesentlig medvirkende årsak, betyr at den alene må utgjøre en større del enn andre årsaker. Andre årsaker kan samlet utgjøre en større del, men sykdom, skade eller lyte må likevel være vesentlig medvirkende årsak. Det er ikke tilstrekkelig å ha sykdom, skade eller lyte. Det er først når den reduserte arbeidsevnen forklares med funksjonstap som skyldes sykdom, skade og lyte at årsakssammenhengen anses oppfylt.'
                }
              />
            </section>

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

            {form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja &&
              form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja &&
              form.watch('erSkadeSykdomEllerLyteVesentligdel') == JaEllerNei.Ja &&
              form.watch('erNedsettelseIArbeidsevneHøyereEnnNedreGrense') == JaEllerNei.Ja && (
                <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />
              )}
          </>
        )}
      </Form>
    </VilkårsKort>
  );
};
