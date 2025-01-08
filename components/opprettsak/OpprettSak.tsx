'use client';

import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';

import styles from './OpprettSak.module.css';
import { mutate } from 'swr';
import { formaterDatoForBackend } from 'lib/utils/date';
import { OpprettSakBarn } from 'components/opprettsak/barn/OpprettSakBarn';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { OpprettInntekter } from 'components/opprettsak/inntekter/OpprettInntekter';
import { useOpprettSak } from 'hooks/FetchHook';

interface Barn {
  fodselsdato: string;
  harRelasjon: string;
}

interface Inntekt {
  år: string;
  beløp: string;
}

type Institusjon = 'fengsel' | 'sykehus';

export interface OpprettSakFormFields {
  fødselsdato: Date;
  yrkesskade: string;
  student: string;
  uføre: string;
  barn?: Barn[];
  inntekter?: Inntekt[];
  institusjon?: Institusjon[];
}

export const OpprettSak = () => {
  const { isLoading, opprettSak } = useOpprettSak();
  const { formFields, form } = useConfigForm<OpprettSakFormFields>({
    fødselsdato: {
      type: 'date',
      defaultValue: new Date('2000-01-01'),
      toDate: new Date(),
      label: 'Fødselsdato',
    },
    yrkesskade: {
      type: 'radio',
      label: 'Yrkesskade?',
      defaultValue: JaEllerNei.Ja,
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
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        await opprettSak({
          ...data,
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
          inntekterPerAr:
            data.inntekter?.map((inntekt) => {
              return {
                år: Number(inntekt.år),
                beløp: { verdi: Number(inntekt.beløp) },
              };
            }) || [],
        });
        await mutate('api/sak/alle');
      })}
      className={styles.form}
    >
      <div className={'flex-column'}>
        <FormField form={form} formField={formFields.fødselsdato} />
        <FormField form={form} formField={formFields.yrkesskade} />
        <FormField form={form} formField={formFields.student} />
        <FormField form={form} formField={formFields.institusjon} />
        <FormField form={form} formField={formFields.uføre} />
      </div>
      <div className={'flex-column'}>
        <OpprettSakBarn form={form} />
        <OpprettInntekter form={form} />
      </div>
      <Button className={'fit-content'} loading={isLoading}>
        Opprett test sak
      </Button>
    </form>
  );
};
