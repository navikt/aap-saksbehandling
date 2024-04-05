'use client';

import { opprettSak } from 'lib/clientApi';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Button } from '@navikt/ds-react';

import styles from './OpprettSak.module.css';
import { mutate } from 'swr';

interface FormFields {
  ident: string;
  fødselsdato: string;
  yrkesskade: string;
  student: string;
}
export const OpprettSak = () => {
  const { formFields, form } = useConfigForm<FormFields>({
    ident: {
      type: 'text',
      defaultValue: '12345678910',
      label: 'Ident',
    },
    fødselsdato: {
      type: 'text',
      defaultValue: '2020-01-01',
      label: 'Fødselsdato',
    },
    yrkesskade: {
      type: 'radio',
      label: 'Yrkesskade?',
      defaultValue: 'true',
      options: [
        { label: 'Ja', value: 'true' },
        { label: 'Nei', value: 'false' },
      ],
    },
    student: {
      type: 'radio',
      label: 'Student?',
      defaultValue: 'false',
      options: [
        { label: 'Ja', value: 'true' },
        { label: 'Nei', value: 'false' },
      ],
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        await opprettSak({ ...data, yrkesskade: data.yrkesskade === 'true', student: data.student === 'true' });
        await mutate('api/sak/alle');
      })}
      className={styles.form}
    >
      <FormField form={form} formField={formFields.ident} />
      <FormField form={form} formField={formFields.fødselsdato} />
      <FormField form={form} formField={formFields.yrkesskade} />
      <FormField form={form} formField={formFields.student} />
      <Button>Opprett test sak</Button>
    </form>
  );
};
