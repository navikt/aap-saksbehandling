import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { useConfigForm } from '../FormHook';
import { FormField } from '../FormField';
import { Button } from '@navikt/ds-react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Textfield', () => {
  const user = userEvent.setup();

  test('at label er synlig', () => {
    render(<TextfieldForm />);
    const label = screen.getByText('Begrunnelse');
    expect(label).toBeVisible();
  });

  test('at description er synlig hvis den har verdi', () => {
    render(<TextfieldForm />);
    const description = screen.getByText('Skriv en kort begrunnelse');
    expect(description).toBeVisible();
  });

  test('at textfield ikke har en verdi dersom default value ikke er satt', () => {
    render(<TextfieldForm />);
    const textArea = screen.getByRole('textbox', { name: /Begrunnelse/ });
    expect(textArea).toHaveValue('');
  });

  test('at textfield har en verdi dersom default value er satt', () => {
    render(<TextfieldForm defaultValue={'Min begrunnelse..'} />);
    const textArea = screen.getByRole('textbox', { name: /Begrunnelse/ });
    expect(textArea).toHaveValue('Min begrunnelse..');
  });

  test('at feilmelding skal være synlig når validering ikke er oppfylt', async () => {
    render(<TextfieldForm />);
    const textArea = screen.getByRole('textbox', { name: /Begrunnelse/ });
    await user.type(textArea, 'Denne teksten er for lang!');
    await user.click(screen.getByRole('button', { name: /Send/ }));
    expect(screen.getByText('Teksten er for lang')).toBeVisible();
  });

  test('at feilmelding ikke skal være synlig når validering er oppfylt', async () => {
    render(<TextfieldForm />);
    const textArea = screen.getByRole('textbox', { name: /Begrunnelse/ });
    await user.type(textArea, 'Fire.');
    await user.click(screen.getByRole('button', { name: /Send/ }));
    expect(screen.queryByText('Teksten er for lang')).not.toBeInTheDocument();
  });
});

interface FormFields {
  begrunnelse: string;
}

interface Props {
  defaultValue?: string;
}

function TextfieldForm(props: Props) {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'text',
      label: 'Begrunnelse',
      description: 'Skriv en kort begrunnelse',
      defaultValue: props.defaultValue,
      rules: { maxLength: { value: 10, message: 'Teksten er for lang' } },
    },
  });
  return (
    <form onSubmit={form.handleSubmit(() => vi.fn())}>
      <FormField form={form} formField={formFields.begrunnelse} />
      <Button variant={'primary'}>Send</Button>
    </form>
  );
}
