'use client';

import { Alert, Box, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { mutate } from 'swr';
import { formaterDatoForBackend } from 'lib/utils/date';
import { OpprettSakBarn } from 'components/opprettsak/barn/OpprettSakBarn';
import { getTrueFalseEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { OpprettInntekter } from 'components/opprettsak/inntekter/OpprettInntekter';
import { useOpprettSak } from 'hooks/FetchHook';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Sykepenger } from 'components/opprettsak/samordning/Sykepenger';
import { parse } from 'date-fns';
import { TestcaseSteg } from 'lib/types/types';
import { AndreYtelser } from 'components/opprettsak/samordning/AndreYtelser';
import { hjemmelMap } from 'lib/utils/hjemmel';

interface Barn {
  fodselsdato: string;
  harRelasjon: string;
  skalFinnesIPDL: string;
}

interface Inntekt {
  år: string;
  beløp: string;
}

interface SamordningSykepenger {
  grad: number;
  periode: {
    fom: string;
    tom: string;
  };
}

type Institusjon = 'fengsel' | 'sykehus';

enum AndreUtbetalingerYtelser {
  ØKONOMISK_SOSIALHJELP = 'ØKONOMISK_SOSIALHJELP',
  OMSORGSSTØNAD = 'OMSORGSSTØNAD',
  INTRODUKSJONSSTØNAD = 'INTRODUKSJONSSTØNAD',
  KVALIFISERINGSSTØNAD = 'KVALIFISERINGSSTØNAD',
  VERV = 'VERV',
  UTLAND = 'UTLAND',
  AFP = 'AFP',
  STIPEND = 'STIPEND',
  LÅN = 'LÅN',
  NEI = 'NEI',
}

export const AndreUtbetalingerYtelserAlternativer = Object.entries(AndreUtbetalingerYtelser).map(([k, v]) => ({
  value: k,
  label: v,
}));

export interface OpprettSakFormFields {
  fødselsdato: Date;
  yrkesskade: JaEllerNei;
  student: JaEllerNei;
  uføre: string;
  barn?: Barn[];
  inntekter?: Inntekt[];
  institusjon?: Institusjon[];
  medlemskap?: JaEllerNei;
  søknadsdato: Date;
  sykepenger?: SamordningSykepenger[];
  tjenestePensjon?: JaEllerNei;
  erArbeidsevnenNedsatt: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei;
  steg?: TestcaseSteg;
  lønn: JaEllerNei;
  afp: string;
  stønad: AndreUtbetalingerYtelser[];
}

export const OpprettSakLocal = () => {
  const { isLoading, opprettSakOgBehandling } = useOpprettSak();
  const { formFields, form } = useConfigForm<OpprettSakFormFields>({
    søknadsdato: {
      type: 'date',
      label: 'Søknadsdato',
      defaultValue: new Date(),
    },
    lønn: {
      type: 'radio',
      defaultValue: JaEllerNei.Nei,
      options: JaEllerNeiOptions,
      label: 'Har du fått eller skal du få ekstra utbetalinger fra arbeidsgiver?',
    },

    afp: {
      type: 'text',
      defaultValue: '',
      label: 'Hvor mottar du AFP fra?',
    },
      stønad: {
        type: 'combobox_multiple',
        label: 'stønad',
        options: AndreUtbetalingerYtelserAlternativer,
      },
      fødselsdato: {
        type: 'date',
        defaultValue: new Date('2000-01-01'),
        toDate: new Date(),
        label: 'Fødselsdato',
      },
      yrkesskade: {
        type: 'radio',
        label: 'Yrkesskade?',
        defaultValue: JaEllerNei.Nei,
        options: JaEllerNeiOptions,
      },
      student: {
        type: 'radio',
        label: 'Student?',
        defaultValue: JaEllerNei.Nei,
        options: JaEllerNeiOptions,
      },
      barn: {
        type: 'fieldArray',
        defaultValue: [],
      },
      inntekter: {
        type: 'fieldArray',
        defaultValue: [{ år: '2024', beløp: '200000' }],
      },
      uføre: {
        type: 'number',
        label: 'Uføregrad (%)',
      },
      institusjon: {
        type: 'checkbox',
        label: 'Institujon',
        options: [
          { label: 'Er innlagt på sykehus', value: 'sykehus' },
          { label: 'Er i fengsel', value: 'fengsel' },
        ],
      },
      medlemskap: {
        type: 'radio',
        label: 'Har medlemskap folketrygden?',
        defaultValue: JaEllerNei.Ja,
        options: JaEllerNeiOptions,
      },
      sykepenger: {
        type: 'fieldArray',
        defaultValue: [{ grad: 50, periode: { fom: '14.03.2025', tom: '31.03.2025' } }],
      },
      tjenestePensjon: {
        type: 'radio',
        label: 'Tjenestepensjon?',
        options: JaEllerNeiOptions,
        defaultValue: JaEllerNei.Nei,
      },
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt?',
        options: JaEllerNeiOptions,
        defaultValue: JaEllerNei.Ja,
      },
      erNedsettelseIArbeidsevneMerEnnHalvparten: {
        type: 'radio',
        label: 'Er nedsettelse i arbeidsevne mer enn halvparten?',
        options: JaEllerNeiOptions,
        defaultValue: JaEllerNei.Ja,
      },
      steg: {
        type: 'combobox',
        label: 'Steg',
        hideLabel: true,
        defaultValue: 'KVALITETSSIKRING',
        options: [
          { value: 'AVKLAR_STUDENT', label: 'Avklar student' },
          { value: 'AVKLAR_SYKDOM', label: 'Avklar sykdom' },
          { value: 'VURDER_BISTANDSBEHOV', label: 'Vurder bistandsbehov' },
          { value: 'REFUSJON_KRAV', label: 'Refusjon krav' },
          { value: 'SYKDOMSVURDERING_BREV', label: 'Sykdomsvurdering brev' },
          { value: 'KVALITETSSIKRING', label: 'Kvalitetssikring' },
          { value: 'VURDER_YRKESSKADE', label: 'Vurder yrkesskade' },
          { value: 'FASTSETT_BEREGNINGSTIDSPUNKT', label: 'Fastsett beregningstidspunkt' },
          { value: 'MANGLENDE_LIGNING', label: 'Fastsett inntekt' },
          { value: 'VURDER_MEDLEMSKAP', label: 'Vurder medlemskap' },
          { value: 'VURDER_OPPHOLDSKRAV', label: 'Vurder oppholdskrav' },
          { value: 'DU_ER_ET_ANNET_STED', label: 'Institusjonsopphold' },
          { value: 'BARNETILLEGG', label: 'Barnetillegg' },
          { value: 'SAMORDNING_GRADERING', label: 'Samordning folketrygdytelser' },
          { value: 'SAMORDNING_ANDRE_STATLIGE_YTELSER', label: 'Samordning andre statlige ytelser' },
          { value: 'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV', label: 'Samordning tjenestepensjon refusjonskrav' },
          { value: 'FORESLÅ_VEDTAK', label: 'Foreslå vedtak' },
          { value: 'FATTE_VEDTAK', label: 'Fatte vedtak' },
          { value: 'BREV', label: 'Brev' },
        ],
      },
    },
  });

  const mapInnhold = (data: OpprettSakFormFields, steg?: TestcaseSteg) => {
    return {
      ...data,
      andreUtbetalinger: {
        afp: data.afp,
        lønn: data.lønn === JaEllerNei.Ja,
        stønad: data.stønad,
      },
      søknadsdato: formaterDatoForBackend(data.søknadsdato),
      fødselsdato: formaterDatoForBackend(data.fødselsdato),
      yrkesskade: data.yrkesskade === JaEllerNei.Ja,
      student: data.student === JaEllerNei.Ja,
      uføre: Number(data.uføre),
      barn:
        data.barn?.map((barn) => ({
          fodselsdato: formaterDatoForBackend(new Date(barn.fodselsdato)),
          harRelasjon: barn.harRelasjon === 'folkeregistrertBarn',
          skalFinnesIPDL: barn.skalFinnesIPDL == 'true',
        })) || [],
      institusjoner: {
        sykehus: data?.institusjon?.includes('sykehus'),
        fengsel: data?.institusjon?.includes('fengsel'),
      },
      medlemskap: data.medlemskap === JaEllerNei.Ja,
      inntekterPerAr:
        data.inntekter?.map((inntekt) => ({
          år: Number(inntekt.år),
          beløp: { verdi: Number(inntekt.beløp) },
        })) || [],
      sykepenger:
        data.sykepenger?.map((samordning) => ({
          grad: samordning.grad,
          periode: {
            fom: formaterDatoForBackend(parse(samordning.periode.fom, 'dd.MM.yyyy', new Date())),
            tom: formaterDatoForBackend(parse(samordning.periode.tom, 'dd.MM.yyyy', new Date())),
          },
        })) || [],
      tjenestePensjon: getTrueFalseEllerUndefined(data.tjenestePensjon),
      erArbeidsevnenNedsatt: data.erArbeidsevnenNedsatt === JaEllerNei.Ja,
      erNedsettelseIArbeidsevneMerEnnHalvparten: data.erNedsettelseIArbeidsevneMerEnnHalvparten === JaEllerNei.Ja,
      steg: steg,
    };
  };

  const opprett = async (steg?: TestcaseSteg) => {
    const innhold = mapInnhold(form.getValues(), steg);
    await opprettSakOgBehandling(innhold);
    await mutate('api/sak/siste/20');
  };

  return (
    <form autoComplete={'off'}>
      <Box
        padding="4"
        marginBlock="4"
        background="bg-default"
        borderWidth="1"
        borderColor="border-subtle"
        borderRadius="medium"
      >
        <HGrid columns={2} gap="4">
          <VStack gap="4">
            <FormField form={form} formField={formFields.søknadsdato} />
            <FormField form={form} formField={formFields.fødselsdato} />
            <FormField form={form} formField={formFields.yrkesskade} horizontalRadio={true} />
            <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} horizontalRadio={true} />
            {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
              <FormField
                form={form}
                formField={formFields.erNedsettelseIArbeidsevneMerEnnHalvparten}
                horizontalRadio={true}
              />
            )}
            <FormField form={form} formField={formFields.student} horizontalRadio={true} />
            <FormField form={form} formField={formFields.medlemskap} horizontalRadio={true} />
            <FormField form={form} formField={formFields.tjenestePensjon} horizontalRadio={true} />
            <FormField form={form} formField={formFields.institusjon} />
            <FormField form={form} formField={formFields.uføre} />
            <FormField form={form} formField={formFields.afp} />
            <FormField form={form} formField={formFields.lønn} />
            <FormField form={form} formField={formFields.stønad} />
          </VStack>
          <VStack gap="4">
            <OpprettSakBarn form={form} />
            <OpprettInntekter form={form} />
            <Sykepenger form={form} />
          </VStack>
        </HGrid>

        <HGrid columns={3} gap="4">
          <Box
            padding="4"
            marginBlock="4"
            background="surface-info-subtle"
            borderWidth="1"
            borderColor="border-subtle"
            borderRadius="medium"
          >
            <Button type="button" size="small" loading={isLoading} onClick={() => opprett('START_BEHANDLING')}>
              Opprett
            </Button>
          </Box>

          <Box
            padding="4"
            marginBlock="4"
            background="surface-success-subtle"
            borderWidth="1"
            borderColor="border-subtle"
            borderRadius="medium"
          >
            <Button type="button" size="small" loading={isLoading} onClick={() => opprett(undefined)}>
              Opprett og iverksett
            </Button>
          </Box>

          <Box
            padding="4"
            marginBlock="4"
            background="surface-alt-1-subtle"
            borderWidth="1"
            borderColor="border-subtle"
            borderRadius="medium"
          >
            <HStack gap="4" align="end" wrap={false}>
              <FormField form={form} formField={formFields.steg} />

              <Button type="button" size="small" loading={isLoading} onClick={() => opprett(form.getValues().steg)}>
                Opprett
              </Button>
            </HStack>
          </Box>
        </HGrid>
      </Box>
    </form>
  );
};
