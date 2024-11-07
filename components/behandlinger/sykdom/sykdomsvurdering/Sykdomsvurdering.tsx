'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { VitalsIcon } from '@navikt/aksel-icons';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { SykdomProps } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Alert, Link } from '@navikt/ds-react';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { CheckboxWrapper } from 'components/input/CheckboxWrapper';

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  harSkadeSykdomEllerLyte: string;
  begrunnelse: string;
  erArbeidsevnenNedsatt?: string;
  erSkadeSykdomEllerLyteVesentligdel?: string;
  erNedsettelseIArbeidsevneAvEnVissVarighet?: string;
  erNedsettelseIArbeidsevneMerEnnHalvparten?: string;
  erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense?: string;
  yrkesskadeBegrunnelse?: string;
  hoveddiagnose?: string;
  bidiagnose?: string[];
}

export const Sykdomsvurdering = ({ grunnlag, behandlingVersjon, readOnly, tilknyttedeDokumenter }: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      dokumenterBruktIVurderingen: {
        type: 'radio_nested',
        label: 'Dokumenter brukt i vurderingen',
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder den nedsatte arbeidsevnen',
        description: 'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige?',
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
      erNedsettelseIArbeidsevneMerEnnHalvparten: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 50%?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten),
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
      hoveddiagnose: {
        type: 'combobox',
        label: 'Hoveddiagnose',
        options: ['Diagnose 1', 'Diagnose 2', 'Diagnose 3', 'Diagnose 4'],
        rules: { required: 'Du må velge en hoveddiagnose' },
      },
      bidiagnose: {
        type: 'combobox_multiple',
        label: 'Bidiagnoser (valgfritt)',
        options: ['Bidiagnose 1', 'Bidiagnose 2', 'Bidiagnose 3', 'Bidiagnose 4'],
      },
      erNedsettelseIArbeidsevneAvEnVissVarighet: {
        type: 'radio',
        label: 'Er den nedsatte arbeidsevnen av en viss varighet?',
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet' },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 30%?',
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30%.' },
        options: JaEllerNeiOptions,
      },
      yrkesskadeBegrunnelse: {
        type: 'textarea',
        label: 'Vurdering om arbeidsevne er nedsatt med minst 30% (§11-22)',
        description:
          'Innbygger har yrkesskade, og kan ha rett på AAP med en nedsatt arbeidsevne på minst 30%. Nay vurderer årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne.',
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
            dokumenterBruktIVurdering: [],
            begrunnelse: data.begrunnelse,
            harSkadeSykdomEllerLyte: data.harSkadeSykdomEllerLyte === JaEllerNei.Ja,
            erArbeidsevnenNedsatt: data.erArbeidsevnenNedsatt === JaEllerNei.Ja,
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            erNedsettelseIArbeidsevneMerEnnHalvparten: data.erNedsettelseIArbeidsevneMerEnnHalvparten === JaEllerNei.Ja,
            erNedsettelseIArbeidsevneAvEnVissVarighet: data.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Ja,
            erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense:
              data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === JaEllerNei.Ja,
            yrkesskadeBegrunnelse: data?.yrkesskadeBegrunnelse,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

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
        <Veiledning
          tekst={
            <div>
              Folketrygdloven § 11-5 består av fire vilkår som du må ta stilling til og som alle må være oppfylt for at
              § 11-5 skal være oppfylt. Det vil si at hvis du svarer nei på ett av spørsmålene under, vil ikke vilkåret
              være oppfylt.
              <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-5" target="_blank">
                Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5
              </Link>
              <span> </span>
              <Link href="https://lovdata.no" target="_blank">
                (lovdata.no)
              </Link>
            </div>
          }
        />
        <CheckboxWrapper
          name={'dokumenterBruktIVurderingen'}
          control={form.control}
          label={'Dokumenter funnet som er relevant for vurdering av §11-5'}
          description={'Tilknytt minst ett dokument §11-5 vurdering'}
        >
          <DokumentTabell
            dokumenter={tilknyttedeDokumenter.map((d) => ({
              journalpostId: d.journalpostId,
              dokumentId: d.dokumentInfoId,
              tittel: d.tittel,
              erTilknyttet: false,
            }))}
          />
        </CheckboxWrapper>
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />
        <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} horizontalRadio />
        {form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} horizontalRadio />
        )}

        {/*TODO Ta inn når backend er klar - Thomas*/}
        {/*<FormField form={form} formField={formFields.hoveddiagnose} />*/}
        {/*<FormField form={form} formField={formFields.bidiagnose} />*/}
        {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Nei && (
          <Alert variant={'info'} size={'small'} className={'fit-content'}>
            Innbygger vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.
          </Alert>
        )}
        {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneAvEnVissVarighet} horizontalRadio />
            <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnHalvparten} horizontalRadio />
            <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} horizontalRadio />
          </>
        )}

        {grunnlag.skalVurdereYrkesskade &&
          form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Nei && (
            <>
              <Veiledning />
              <FormField form={form} formField={formFields.yrkesskadeBegrunnelse} className={'begrunnelse'} />
              <FormField
                form={form}
                formField={formFields.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense}
                horizontalRadio
              />
            </>
          )}
      </Form>
    </VilkårsKort>
  );
};
