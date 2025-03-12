import { describe, test, expect, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfigForm } from '../FormHook';
import React from 'react';
import { FormField } from '../FormField';

describe('DateInputWrapper', () => {
  const user = userEvent.setup();

  test('at label er synlig', () => {
    render(<TestForm />);
    expect(screen.getByRole('textbox', { name: 'Dato' })).toBeVisible();
  });

  test('at description vises hvis den har verdi', () => {
    render(<TestForm />);
    expect(screen.getByText('Datoformat: dd.mm.åååå')).toBeVisible();
  });

  test('at feltet ikke har noen verdi dersom defaultValue ikke er satt', () => {
    render(<TestForm />);
    expect(screen.getByRole('textbox', { name: 'Dato' })).toHaveValue('');
  });

  test('at feltet har verdi dersom defaultValue er satt', () => {
    render(<TestForm defaultValue="02.07.2024" />);
    expect(screen.getByRole('textbox', { name: 'Dato' })).toHaveValue('02.07.2024');
  });

  test('viser feilmelding når regler ikke er oppfylt', async () => {
    render(<TestForm />);
    const textArea = screen.getByRole('textbox', { name: 'Dato' });
    await user.type(textArea, '19.09.20224');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('Ugyldig datoformat')).toBeVisible();
  });

  test('viser ingen feilmelding når regler er oppfylt', async () => {
    render(<TestForm />);
    const textArea = screen.getByRole('textbox', { name: 'Dato' });
    await user.type(textArea, '19.09.2022');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.queryByText('Ugyldig datoformat')).not.toBeInTheDocument();
  });

  test('kan håndtere korte datoer', async () => {
    render(<TestForm />);
    const input = screen.getByRole('textbox', { name: 'Dato' });
    await user.type(input, '120280');
    screen.getByRole('button', { name: 'Send' }).focus();
    expect(input).toHaveValue('12.02.1980');
  });
});

type FormFields = {
  dato: string;
};

type Props = {
  defaultValue?: string;
};

const TestForm = (props: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    dato: {
      type: 'date_input',
      label: 'Dato',
      description: 'Datoformat: dd.mm.åååå',
      defaultValue: props.defaultValue,
      rules: { maxLength: { value: 10, message: 'Ugyldig datoformat' } },
    },
  });
  return (
    <form onSubmit={form.handleSubmit(() => vi.fn())}>
      <FormField form={form} formField={formFields.dato} />
      <button>Send</button>
    </form>
  );
};
