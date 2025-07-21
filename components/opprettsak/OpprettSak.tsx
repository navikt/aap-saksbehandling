'use client';

import { Button } from '@navikt/ds-react';

import styles from './OpprettSak.module.css';
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

interface Barn {
  fodselsdato: string;
  harRelasjon: string;
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
}

export const OpprettSak = () => {
  const { isLoading, opprettSak } = useOpprettSak();
  const { formFields, form } = useConfigForm<OpprettSakFormFields>({
    søknadsdato: {
      type: 'date',
      label: 'Søknadsdato',
      defaultValue: new Date(),
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
      defaultValue: [{ fodselsdato: '2015', harRelasjon: 'folkeregistrertBarn' }],
    },
    inntekter: {
      type: 'fieldArray',
      defaultValue: [{ år: '2015', beløp: '200000' }],
    },
    uføre: {
      type: 'number',
      label: 'Uføre?',
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
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        await opprettSak({
          ...data,
          søknadsdato: formaterDatoForBackend(data.søknadsdato),
          fødselsdato: formaterDatoForBackend(data.fødselsdato),
          yrkesskade: data.yrkesskade === JaEllerNei.Ja,
          student: data.student === JaEllerNei.Ja,
          uføre: Number(data.uføre),
          barn:
            data.barn?.map((barn) => {
              return {
                fodselsdato: formaterDatoForBackend(new Date(barn.fodselsdato)),
                harRelasjon: barn.harRelasjon === 'folkeregistrertBarn',
              };
            }) || [],
          institusjoner: {
            sykehus: data?.institusjon?.includes('sykehus'),
            fengsel: data?.institusjon?.includes('fengsel'),
          },
          medlemskap: data.medlemskap === JaEllerNei.Ja,
          inntekterPerAr:
            data.inntekter?.map((inntekt) => {
              return {
                år: Number(inntekt.år),
                beløp: { verdi: Number(inntekt.beløp) },
              };
            }) || [],
          sykepenger:
            data.sykepenger?.map((samordning) => ({
              grad: samordning.grad,
              periode: {
                fom: formaterDatoForBackend(parse(samordning.periode.fom, 'dd.MM.yyyy', new Date())),
                tom: formaterDatoForBackend(parse(samordning.periode.tom, 'dd.MM.yyyy', new Date())),
              },
            })) || [],
          tjenestePensjon: getTrueFalseEllerUndefined(data.tjenestePensjon),
        });
        await mutate('api/sak/alle');
      })}
      className={styles.form}
      autoComplete={'off'}
    >
      <div className={'flex-column'}>
        <FormField form={form} formField={formFields.søknadsdato} />
        <FormField form={form} formField={formFields.fødselsdato} />
        <FormField form={form} formField={formFields.yrkesskade} />
        <FormField form={form} formField={formFields.student} />
        <FormField form={form} formField={formFields.medlemskap} />
        <FormField form={form} formField={formFields.tjenestePensjon} />
        <FormField form={form} formField={formFields.institusjon} />
        <FormField form={form} formField={formFields.uføre} />
      </div>
      <div className={'flex-column'}>
        <OpprettSakBarn form={form} />
        <OpprettInntekter form={form} />
        <Sykepenger form={form} />
      </div>
      <Button className={'fit-content'} loading={isLoading}>
        Opprett testsak
      </Button>
    </form>
  );
};
