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
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent, useCallback, useEffect } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Alert, Link } from '@navikt/ds-react';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { CheckboxWrapper } from 'components/input/CheckboxWrapper';
import { DiagnoseSystem } from 'lib/diagnosesøker/DiagnoseSøker';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { isBefore, parse, startOfDay } from 'date-fns';
import { validerDato } from 'lib/validation/dateValidation';
import { DokumentInfo, SykdomsGrunnlag } from 'lib/types/types';
import { TypeBehandling } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { Revurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Revurdering';
import { Førstegangsbehandling } from 'components/behandlinger/sykdom/sykdomsvurdering/Førstegangsbehandling';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { Diagnosesøk } from 'components/behandlinger/sykdom/sykdomsvurdering/Diagnosesøk';

export interface SykdomsvurderingFormFields {
  dokumenterBruktIVurderingen?: string[];
  begrunnelse: string;
  vurderingenGjelderFra: string;
  harSkadeSykdomEllerLyte: string;
  kodeverk?: DiagnoseSystem;
  hoveddiagnose?: ValuePair | null;
  bidiagnose?: ValuePair[] | null;
  erArbeidsevnenNedsatt?: JaEllerNei;
  erSkadeSykdomEllerLyteVesentligdel?: JaEllerNei;
  erNedsettelseIArbeidsevneAvEnVissVarighet?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnHalvparten?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnFørtiProsent?: JaEllerNei;
  yrkesskadeBegrunnelse?: string;
}

interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
  tilknyttedeDokumenter: DokumentInfo[];
  typeBehandling: TypeBehandling;
  søknadstidspunkt: string;
  bidiagnoserDeafultOptions?: ValuePair[];
  hoveddiagnoseDefaultOptions?: ValuePair[];
}

export const Sykdomsvurdering = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  tilknyttedeDokumenter,
  bidiagnoserDeafultOptions,
  hoveddiagnoseDefaultOptions,
  søknadstidspunkt,
  typeBehandling,
}: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const behandlingErRevurdering = typeBehandling === 'Revurdering';
  const behandlingErFørstegangsbehandling = typeBehandling === 'Førstegangsbehandling';
  const diagnosegrunnlag = finnDiagnosegrunnlag(typeBehandling, grunnlag);

  const sykdomsvurdering = grunnlag.sykdomsvurderinger.at(0);

  const { formFields, form } = useConfigForm<SykdomsvurderingFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        description: 'Vekt og vurder opplysningene mot hverandre, og vurder om brukeren oppfyller vilkårene i § 11-5',
        defaultValue: sykdomsvurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Hvilke dokumenter er brukt i vurderingen?',
        defaultValue: sykdomsvurdering?.dokumenterBruktIVurdering.map((dokument) => dokument.identifikator),
      },
      vurderingenGjelderFra: {
        type: 'date_input',
        label: 'Vurderingen gjelder fra',
        defaultValue: sykdomsvurdering?.vurderingenGjelderFra
          ? formaterDatoForFrontend(sykdomsvurdering?.vurderingenGjelderFra)
          : undefined,
        rules: {
          required: 'Du må velge når vurderingen gjelder fra',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
            kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
              const soknadstidspunkt = startOfDay(new Date(søknadstidspunkt));
              const vurderingGjelderFra = stringToDate(v as string, 'dd.MM.yyyy');
              if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), soknadstidspunkt)) {
                return 'Vurderingen kan ikke gjelde fra før søknadstidspunkt';
              }
            },
          },
        },
      },
      harSkadeSykdomEllerLyte: {
        type: 'radio',
        label: 'Har bruker sykdom, skade eller lyte?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.harSkadeSykdomEllerLyte),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om bruker har sykdom, skade eller lyte' },
      },
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: 'Har bruker nedsatt arbeidsevne?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erArbeidsevnenNedsatt),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om bruker har nedsatt arbeidsevne' },
      },
      erNedsettelseIArbeidsevneMerEnnHalvparten: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst halvparten?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt med minst halvparten' },
      },
      erSkadeSykdomEllerLyteVesentligdel: {
        type: 'radio',
        label: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
        },
      },
      kodeverk: {
        type: 'radio',
        label: 'Velg system for diagnoser',
        options: ['ICPC2', 'ICD10'],
        defaultValue: getStringEllerUndefined(diagnosegrunnlag?.kodeverk),
        rules: { required: 'Du må velge et system for diagnoser' },
      },
      hoveddiagnose: {
        type: 'async_combobox',
        defaultValue: hoveddiagnoseDefaultOptions?.find((value) => value.value === diagnosegrunnlag?.hoveddiagnose),
      },
      bidiagnose: {
        type: 'async_combobox',
        defaultValue: bidiagnoserDeafultOptions?.filter((option) =>
          diagnosegrunnlag?.bidiagnoser?.includes(option.value)
        ),
      },
      erNedsettelseIArbeidsevneAvEnVissVarighet: {
        type: 'radio',
        label: 'Er den nedsatte arbeidsevnen av en viss varighet?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erNedsettelseIArbeidsevneAvEnVissVarighet),
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet' },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 30%?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense),
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30%.' },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnFørtiProsent: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 40%?',
        defaultValue: undefined,
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 40%' },
        options: JaEllerNeiOptions,
      },
      yrkesskadeBegrunnelse: {
        type: 'textarea',
        label: 'Vurdering om arbeidsevne er nedsatt med minst 30% (§11-22)',
        description:
          'Bruker har yrkesskade, og kan ha rett på AAP med en nedsatt arbeidsevne på minst 30%. Nay vurderer årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne.',
        rules: { required: 'Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30%' },
        defaultValue: getStringEllerUndefined(sykdomsvurdering?.yrkesskadeBegrunnelse),
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
            vurderingenGjelderFra: data.vurderingenGjelderFra
              ? formaterDatoForBackend(parse(data.vurderingenGjelderFra, 'dd.MM.yyyy', new Date()))
              : undefined,
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
    if (kodeverkValue !== diagnosegrunnlag?.kodeverk) {
      form.setValue('hoveddiagnose', null);
      form.setValue('bidiagnose', null);
    } else if (
      kodeverkValue === diagnosegrunnlag?.kodeverk &&
      Array.isArray(hoveddiagnoseDefaultOptions) &&
      hoveddiagnoseDefaultOptions.length
    ) {
      // kode for å omgå en bug som oppstår under test når man kan kvalitetssikre sin egen vurdering
      // bør kunne slettes når man ikke lengre kan kvalitetssikre sin egen vurdering
      form.resetField('hoveddiagnose', {
        defaultValue: hoveddiagnoseDefaultOptions?.find((value) => value.value === diagnosegrunnlag?.hoveddiagnose),
      });
    } else {
      form.resetField('hoveddiagnose');
      form.resetField('bidiagnose');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tar ikke med form som en dependency da den fører til at useEffect kjøres feil
  }, [kodeverkValue, diagnosegrunnlag?.kodeverk]);

  const vurderingenGjelderFra = form.watch('vurderingenGjelderFra');

  const behandlingErRevurderingAvFørstegangsbehandling = useCallback(() => {
    if (!behandlingErRevurdering) {
      return false;
    }
    const gjelderFra = stringToDate(vurderingenGjelderFra, 'dd.MM.yyyy');
    if (!gjelderFra) {
      return false;
    }
    const søknadsdato = startOfDay(new Date(søknadstidspunkt));
    return søknadsdato.getTime() === startOfDay(gjelderFra).getTime();
  }, [behandlingErRevurdering, søknadstidspunkt, vurderingenGjelderFra]);

  return (
    <VilkårsKort
      heading={'§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng'}
      steg="AVKLAR_SYKDOM"
      icon={<VitalsIcon aria-hidden />}
      vilkårTilhørerNavKontor={true}
    >
      {behandlingErRevurdering && (
        <TidligereVurderinger
          tidligereVurderinger={grunnlag.historikkSykdomsvurderinger.toReversed()}
          søknadstidspunkt={søknadstidspunkt}
        />
      )}
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_SYKDOM'}
        visBekreftKnapp={!readOnly}
        knappTekst={'Bekreft vurdering'}
      >
        {grunnlag.skalVurdereYrkesskade && (
          <Alert variant={'warning'} size={'small'}>
            Det har blitt funnet én eller flere yrkesskader på brukeren
          </Alert>
        )}
        <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-5" target="_blank">
          Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)
        </Link>
        <CheckboxWrapper
          name={'dokumenterBruktIVurderingen'}
          control={form.control}
          label={'Hvilke dokumenter er brukt i vurderingen?'}
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
        {behandlingErRevurdering && <FormField form={form} formField={formFields.vurderingenGjelderFra} />}
        <TilknyttedeDokumenter
          valgteDokumenter={form
            .watch('dokumenterBruktIVurderingen')
            ?.filter((dokument) => dokument != 'dokumentasjonMangler')}
          tilknyttedeDokumenterPåBehandling={tilknyttedeDokumenter}
        />
        {(behandlingErFørstegangsbehandling || behandlingErRevurderingAvFørstegangsbehandling()) && (
          <Førstegangsbehandling
            form={form}
            formFields={formFields}
            skalVurdereYrkesskade={grunnlag.skalVurdereYrkesskade}
            diagnosesøker={
              <Diagnosesøk
                form={form}
                formFields={formFields}
                readOnly={readOnly}
                hoveddiagnoseDefaultOptions={hoveddiagnoseDefaultOptions}
              />
            }
          />
        )}
        {behandlingErRevurdering && !behandlingErRevurderingAvFørstegangsbehandling() && (
          <Revurdering
            form={form}
            formFields={formFields}
            skalVurdereYrkesskade={grunnlag.skalVurdereYrkesskade}
            diagnosesøker={
              <Diagnosesøk
                form={form}
                formFields={formFields}
                readOnly={readOnly}
                hoveddiagnoseDefaultOptions={hoveddiagnoseDefaultOptions}
              />
            }
          />
        )}
      </Form>
    </VilkårsKort>
  );
};
