import React from 'react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { useConfigForm } from '../FormHook';
import { FormField } from '../FormField';
import { Button } from '@navikt/ds-react';
import { render, screen, waitFor, within } from '@testing-library/react';

describe('Combobox', () => {
  const user = userEvent.setup();

  test('at label er synlig', () => {
    render(<MultipleComboboxForm />);
    const label = screen.getByText('Velg type');
    expect(label).toBeVisible();
  });

  test('at description er synlig hvis den har verdi', () => {
    render(<MultipleComboboxForm />);
    const description = screen.getByText('Velg en type');
    expect(description).toBeVisible();
  });

  test('at alle valgene ligger i nedtrekkslisten', () => {
    render(<MultipleComboboxForm />);
    expect(screen.getByRole('combobox', { name: /Velg type/ })).toBeVisible();
    expect(screen.getByText(/Alternativ 1/)).toBeInTheDocument();
    expect(screen.getByText(/Alternativ 2/)).toBeInTheDocument();
    expect(screen.getByText(/Alternativ 3/)).toBeInTheDocument();
  });

  test('at select ikke har en verdi når default value ikke er satt', () => {
    render(<MultipleComboboxForm />);
    const select = screen.getByRole('combobox', { name: /Velg type/ });
    expect(select).toHaveValue('');
  });

  test('at select har en verdi når default value er satt', () => {
    render(<MultipleComboboxForm defaultValue={['Alternativ 3']} />);
    const list = screen.getByRole('list');
    expect(within(list).getByText(/alternativ 3/i)).toBeVisible();
  });

  test('at feilmelding skal vises når validering ikke er oppfylt', async () => {
    render(<MultipleComboboxForm />);
    expect(screen.queryByText('Du må velge type')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Send inn/ }));
    expect(screen.getByText('Du må velge type')).toBeVisible();
  });

  test('at feilmelding ikke skal vises når validering er oppfylt', async () => {
    render(<MultipleComboboxForm />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText(/Alternativ 2/));
    await waitFor(() => user.click(screen.getByRole('button', { name: /Send inn/ })));
    expect(screen.queryByText('Du må velge type')).not.toBeInTheDocument();
  });

  test('at det går an å velge flere alternativ dersom flagget isMultiSelect er satt', async () => {
    render(<MultipleComboboxForm />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText(/Alternativ 1/));
    await user.click(screen.getByText(/Alternativ 2/));

    const list = screen.getByRole('list');
    expect(within(list).getByText(/alternativ 1/i)).toBeVisible();
    expect(within(list).getByText(/alternativ 2/i)).toBeVisible();
  });
});

interface FormFields {
  type: string;
}

interface Props {
  defaultValue?: string[];
}

function MultipleComboboxForm(props: Props) {
  const { formFields, form } = useConfigForm<FormFields>({
    type: {
      type: 'combobox_multiple',
      label: 'Velg type',
      description: 'Velg en type',
      defaultValue: props.defaultValue,
      options: ['Alternativ 1', 'Alternativ 2', 'Alternativ 3'],
      rules: { required: 'Du må velge type' },
    },
  });
  return (
    <form onSubmit={form.handleSubmit(() => vi.fn())}>
      <FormField form={form} formField={formFields.type} />
      <Button variant={'primary'}>Send inn</Button>
    </form>
  );
}
