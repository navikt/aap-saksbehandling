'use client';

import { opprettSak } from '../../lib/api';
import { useForm } from 'react-hook-form';
import { useConfigForm } from '../../hooks/FormHook';
import { FormField } from '../input/formfield/FormField';
import { Button } from '@navikt/ds-react';

import styles from './OpprettSak.module.css';

interface FormFields {
  ident: string;
  fødselsdato: string;
  yrkesskade: boolean;
}
export const OpprettSak = () => {
  const form = useForm<FormFields>();
  const { formFields } = useConfigForm<FormFields>({
    ident: {
      type: 'text',
      label: 'Ident',
    },
    fødselsdato: {
      type: 'text',
      label: 'Fødselsdato',
    },
    yrkesskade: {
      type: 'radio',
      label: 'Yrkesskade?',
      options: [
        { label: 'Ja', value: 'true' },
        { label: 'Nei', value: 'false' },
      ],
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        await opprettSak(data);
      })}
      className={styles.form}
    >
      <FormField form={form} formField={formFields.ident} />
      <FormField form={form} formField={formFields.fødselsdato} />
      <FormField form={form} formField={formFields.yrkesskade} />
      <Button>Opprett test sak</Button>
    </form>
  );
};
