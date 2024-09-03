'use client';

import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  getStringEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { VitalsIcon } from '@navikt/aksel-icons';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { SykdomProps } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { validerÅrstall } from 'lib/utils/validation';

interface FormFields {
  harSkadeSykdomEllerLyte: string;
  erArbeidsevnenNedsatt: string;
  dokumenterBruktIVurderingen: string[];
  erSkadeSykdomEllerLyteVesentligdel: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  begrunnelse: string;
  nedsattArbeidsevneDato: string;
}

export const Sykdomsvurdering = ({ grunnlag, behandlingVersjon, readOnly, tilknyttedeDokumenter }: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder den nedsatte arbeidsevnen',
        description:
          'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige? Hvis yrkesskade er funnet: vurder mot YS',
        defaultValue: grunnlag?.sykdomsvurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      harSkadeSykdomEllerLyte: {
        type: 'radio',
        label: 'Har innbygger sykdom, skade eller lyte?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.harSkadeSykdomEllerLyte),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om innbygger har sykdom, skade eller lyte' },
      },
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: 'Har innbygger nedsatt arbeidsevne?',
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erArbeidsevnenNedsatt),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om innbygger har nedsatt arbeidsevne' },
      },
      erNedsettelseIArbeidsevneHøyereEnnNedreGrense: {
        type: 'radio',
        label: grunnlag.skalVurdereYrkesskade
          ? 'Er arbeidsevnen nedsatt med minst 30%?'
          : 'Er arbeidsevnen nedsatt med minst 50%?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt med minst 50%' },
      },
      erSkadeSykdomEllerLyteVesentligdel: {
        type: 'radio',
        label: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
        },
      },
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter funnet som er relevant for vurdering av §11-5',
        description: 'Tilknytt minst ett dokument §11-5 vurdering',
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
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

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
            harSkadeSykdomEllerLyte: data.harSkadeSykdomEllerLyte === JaEllerNei.Ja,
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            nedreGrense: 'FEMTI',
            erNedsettelseIArbeidsevneHøyereEnnNedreGrense:
              data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja,
            nedsattArbeidsevneDato: Number(data.nedsattArbeidsevneDato),
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  const visFeltForNårArbeidsevnenBleNedsatt =
    form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja &&
    form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja &&
    form.watch('erNedsettelseIArbeidsevneHøyereEnnNedreGrense') === JaEllerNei.Ja &&
    form.watch('erSkadeSykdomEllerLyteVesentligdel') === JaEllerNei.Ja;

  return (
    <VilkårsKort
      heading={'Nedsatt arbeidsevne - § 11-5'}
      steg="AVKLAR_SYKDOM"
      icon={<VitalsIcon />}
      vilkårTilhørerNavKontor={true}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_SYKDOM'}
        visBekreftKnapp={!readOnly}
      >
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
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />
        <section>
          <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} />
          <Veiledning
            header={'Slik vurderes dette'}
            defaultOpen={false}
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
                defaultOpen={false}
                tekst={
                  'Med arbeidsevne menes den enkeltes evne til å møte de krav som stilles i utførelsen av et normal inntektsgivende arbeid. Arbeidsevnen anses som nedsatt når medlemmet helt eller delvis er ute av stand til å utføre arbeidsoppgavene i ulike jobber som han eller hun er kvalifisert til.'
                }
              />
            </section>
            <section>
              <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense} />
              <Veiledning
                header={'Slik vurderes dette'}
                defaultOpen={false}
                tekst={
                  'Det tas utgangspunkt i alminnelig arbeidstid på 37,5 timer per uke for å vurdere om arbeidsevnen er nedsatt med minst halvparten. Hver enkelt sak vurderes konkret ut fra hvordan de faktiske forholdene påvirker medlemmets evne til å utføre arbeid. At inntekten reduseres med mer enn halvparten, er ikke relevant for vurderingen av om arbeidsevnen er nedsatt.'
                }
              />
            </section>
            <section>
              <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} />
              <Veiledning
                header={'Slik vurderes dette'}
                defaultOpen={false}
                tekst={
                  'Det må være årsakssammenheng mellom sykdom, skade eller lyte og den nedsatte arbeidsevnen. At sykdom, skade eller lyte skal utgjøre en vesentlig medvirkende årsak, betyr at den alene må utgjøre en større del enn andre årsaker. Andre årsaker kan samlet utgjøre en større del, men sykdom, skade eller lyte må likevel være vesentlig medvirkende årsak. Det er ikke tilstrekkelig å ha sykdom, skade eller lyte. Det er først når den reduserte arbeidsevnen forklares med funksjonstap som skyldes sykdom, skade og lyte at årsakssammenhengen anses oppfylt.'
                }
              />
            </section>
          </>
        )}
        {visFeltForNårArbeidsevnenBleNedsatt && <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />}
      </Form>
    </VilkårsKort>
  );
};
