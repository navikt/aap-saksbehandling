'use client';

import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  getStringEllerUndefined,
  getTrueFalseEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { VitalsIcon } from '@navikt/aksel-icons';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent, useEffect } from 'react';
import { SykdomProps } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Alert, Heading, Link } from '@navikt/ds-react';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { CheckboxWrapper } from 'components/input/CheckboxWrapper';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { AsyncComboSearch } from 'components/input/asynccombosearch/AsyncComboSearch';

interface FormFields {
  dokumenterBruktIVurderingen?: string[];
  begrunnelse: string;
  harSkadeSykdomEllerLyte: string;
  kodeverk?: DiagnoseSystem;
  hoveddiagnose?: ValuePair | null;
  bidiagnose?: ValuePair[] | null;
  erArbeidsevnenNedsatt?: JaEllerNei;
  erSkadeSykdomEllerLyteVesentligdel?: JaEllerNei;
  erNedsettelseIArbeidsevneAvEnVissVarighet?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnHalvparten?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense?: JaEllerNei;
  yrkesskadeBegrunnelse?: string;
}

export const Sykdomsvurdering = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  tilknyttedeDokumenter,
  bidiagnoserDeafultOptions,
  hoveddiagnoseDefaultOptions,
}: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter brukt i vurderingen',
        defaultValue: grunnlag.sykdomsvurdering?.dokumenterBruktIVurdering.map((dokument) => dokument.identifikator),
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
      kodeverk: {
        type: 'radio',
        label: 'Velg system for diagnoser',
        options: ['ICPC2', 'ICD10'],
        defaultValue: getStringEllerUndefined(grunnlag.sykdomsvurdering?.kodeverk),
        rules: { required: 'Du må velge et system for diagnoser' },
      },
      hoveddiagnose: {
        type: 'async_combobox',
        defaultValue: hoveddiagnoseDefaultOptions?.find(
          (value) => value.value === grunnlag.sykdomsvurdering?.hoveddiagnose
        ),
      },
      bidiagnose: {
        type: 'async_combobox',
        defaultValue: bidiagnoserDeafultOptions?.filter((option) =>
          grunnlag.sykdomsvurdering?.bidiagnoser?.includes(option.value)
        ),
      },
      erNedsettelseIArbeidsevneAvEnVissVarighet: {
        type: 'radio',
        label: 'Er den nedsatte arbeidsevnen av en viss varighet?',
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erNedsettelseIArbeidsevneAvEnVissVarighet),
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet' },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 30%?',
        defaultValue: getJaNeiEllerUndefined(
          grunnlag.sykdomsvurdering?.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense
        ),
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30%.' },
        options: JaEllerNeiOptions,
      },
      yrkesskadeBegrunnelse: {
        type: 'textarea',
        label: 'Vurdering om arbeidsevne er nedsatt med minst 30% (§11-22)',
        description:
          'Innbygger har yrkesskade, og kan ha rett på AAP med en nedsatt arbeidsevne på minst 30%. Nay vurderer årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne.',
        rules: { required: 'Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30%' },
        defaultValue: getStringEllerUndefined(grunnlag.sykdomsvurdering?.yrkesskadeBegrunnelse),
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
            dokumenterBruktIVurdering:
              data.dokumenterBruktIVurderingen?.map((dokument) => {
                return { identifikator: dokument };
              }) || [],
            begrunnelse: data.begrunnelse,
            harSkadeSykdomEllerLyte: data.harSkadeSykdomEllerLyte === JaEllerNei.Ja,
            kodeverk: data?.kodeverk,
            hoveddiagnose: data?.hoveddiagnose?.value,
            bidiagnoser: data.bidiagnose?.map((diagnose) => diagnose.value),
            erArbeidsevnenNedsatt: getTrueFalseEllerUndefined(data.erArbeidsevnenNedsatt),
            erSkadeSykdomEllerLyteVesentligdel: getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel),
            erNedsettelseIArbeidsevneMerEnnHalvparten: getTrueFalseEllerUndefined(
              data.erNedsettelseIArbeidsevneMerEnnHalvparten
            ),
            erNedsettelseIArbeidsevneAvEnVissVarighet: getTrueFalseEllerUndefined(
              data.erNedsettelseIArbeidsevneAvEnVissVarighet
            ),
            erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: getTrueFalseEllerUndefined(
              data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense
            ),
            yrkesskadeBegrunnelse: data?.yrkesskadeBegrunnelse,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  const kodeverkValue = form.watch('kodeverk');

  useEffect(() => {
    if (kodeverkValue !== grunnlag.sykdomsvurdering?.kodeverk) {
      form.setValue('hoveddiagnose', null);
      form.setValue('bidiagnose', null);
    } else {
      form.resetField('hoveddiagnose');
      form.resetField('bidiagnose');
    }
  }, [kodeverkValue, grunnlag.sykdomsvurdering?.kodeverk, form]);

  const defaultOptionsHoveddiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue!, '');
  const defaultOptionsBidiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue!, '');

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
        {grunnlag.skalVurdereYrkesskade && (
          <Alert variant={'warning'} size={'small'}>
            Det har blitt funnet én eller flere yrkesskader på brukeren
          </Alert>
        )}
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
          readOnly={readOnly}
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
        <TilknyttedeDokumenter
          valgteDokumenter={form
            .watch('dokumenterBruktIVurderingen')
            ?.filter((dokument) => dokument != 'dokumentasjonMangler')}
          tilknyttedeDokumenterPåBehandling={tilknyttedeDokumenter}
        />
        <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} horizontalRadio />

        <FormField form={form} formField={formFields.kodeverk} horizontalRadio />
        {kodeverkValue && (
          <>
            <AsyncComboSearch
              label={'Hoveddiagnose'}
              form={form}
              name={'hoveddiagnose'}
              fetcher={async (value) => diagnoseSøker(kodeverkValue, value)}
              defaultOptions={defaultOptionsHoveddiagnose}
              rules={{ required: 'Du må velge en hoveddiagnose' }}
              readOnly={readOnly}
            />
            <AsyncComboSearch
              label={'Bidiagnoser (valgfritt)'}
              form={form}
              isMulti={true}
              name={'bidiagnose'}
              fetcher={async (value) => diagnoseSøker(kodeverkValue, value)}
              defaultOptions={defaultOptionsBidiagnose}
              readOnly={readOnly}
            />
          </>
        )}

        {form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} horizontalRadio />
        )}

        {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Nei && (
          <Alert variant={'info'} size={'small'} className={'fit-content'}>
            Innbygger vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.
          </Alert>
        )}

        {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneAvEnVissVarighet} horizontalRadio />
          </>
        )}

        {form.watch('erNedsettelseIArbeidsevneAvEnVissVarighet') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnHalvparten} horizontalRadio />
          </>
        )}

        {grunnlag.skalVurdereYrkesskade &&
          form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Nei && (
            <>
              <Heading size={'small'}>Nedsatt arbeidsevne §§ 11-5 / 11-22</Heading>
              <Veiledning />
              <FormField form={form} formField={formFields.yrkesskadeBegrunnelse} className={'begrunnelse'} />
              <FormField
                form={form}
                formField={formFields.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense}
                horizontalRadio
              />
            </>
          )}

        {(form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Ja ||
          (form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Nei &&
            form.watch('erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense') === JaEllerNei.Ja &&
            grunnlag.skalVurdereYrkesskade)) && (
          <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} horizontalRadio />
        )}
      </Form>
    </VilkårsKort>
  );
};
