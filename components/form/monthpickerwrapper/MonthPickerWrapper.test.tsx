import { describe, expect, test, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfigForm } from '../FormHook';
import React from 'react';
import { FormField } from '../FormField';

describe('MonthPickerWrapper', () => {
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
    render(<TestForm defaultValue={new Date('2024-07-02')} />);
    expect(screen.getByRole('textbox', { name: 'Dato' })).toHaveValue('juli 2024');
  });

  test('viser ingen feilmelding når regler er oppfylt', async () => {
    render(<TestForm />);
    const textArea = screen.getByRole('textbox', { name: 'Dato' });
    await user.type(textArea, '1025');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.queryByText('Ugyldig datoformat')).not.toBeInTheDocument();
  });
});

interface FormFields {
  dato: Date;
}

interface Props {
  defaultValue?: Date;
}

const TestForm = (props: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    dato: {
      type: 'date_month_picker',
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
