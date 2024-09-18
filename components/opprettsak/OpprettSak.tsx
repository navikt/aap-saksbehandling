'use client';

import { opprettSak } from 'lib/clientApi';
import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';

import styles from './OpprettSak.module.css';
import { mutate } from 'swr';
import { formaterDatoForBackend } from 'lib/utils/date';
import { OpprettSakBarn } from 'components/opprettsak/OpprettSakBarn';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';

interface Barn {
  fodselsdato: string;
  harRelasjon: string;
}

type Institusjon = 'fengsel' | 'sykehus';

export interface OpprettSakFormFields {
  fødselsdato: Date;
  yrkesskade: string;
  student: string;
  barn?: Barn[];
  institusjon: Institusjon[];
}

export const OpprettSak = () => {
  const { formFields, form } = useConfigForm<OpprettSakFormFields>({
    fødselsdato: {
      type: 'date',
      defaultValue: new Date('2000-01-01'),
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
          barn:
            data.barn?.map((barn) => {
              return {
                fodselsdato: formaterDatoForBackend(new Date(barn.fodselsdato)),
                harRelasjon: barn.harRelasjon === 'folkeregistrertBarn',
              };
            }) || [],
          institusjoner: {
            sykehus: data.institusjon.includes('sykehus'),
            fengsel: data.institusjon.includes('fengsel'),
          },
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
      </div>
      <OpprettSakBarn form={form} />
      <Button className={'fit-content-button'}>Opprett test sak</Button>
    </form>
  );
};
