import { Button } from '@navikt/ds-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useConfigForm } from 'hooks/FormHook';
import { FormField } from './FormField';

describe('Select', () => {
  const user = userEvent.setup();

  test('at label er synlig', () => {
    render(<SelectForm />);
    const label = screen.getByText('Velg type');
    expect(label).toBeVisible();
  });

  test('at description er synlig hvis den har verdi', () => {
    render(<SelectForm />);
    const description = screen.getByText('Velg en type');
    expect(description).toBeVisible();
  });

  test('at alle valgene ligger i nedtrekkslisten', () => {
    render(<SelectForm />);
    expect(screen.getByRole('combobox', { name: /Velg type/ })).toBeVisible();
    expect(screen.getByRole('option', { name: /Alternativ 1/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Alternativ 2/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Alternativ 3/ })).toBeInTheDocument();
  });

  test('at select ikke har en verdi når default value ikke er satt', () => {
    render(<SelectForm />);
    const select = screen.getByRole('combobox', { name: /Velg type/ });
    expect(select).toHaveValue('');
  });

  test('at select har en verdi når default value er satt', () => {
    render(<SelectForm defaultValue={'Alternativ 3'} />);
    const select = screen.getByRole('combobox', { name: /Velg type/ });
    expect(select).toHaveValue('Alternativ 3');
  });

  test('at feilmelding skal vises når validering ikke er oppfylt', async () => {
    render(<SelectForm />);
    expect(screen.queryByText('Du må velge type')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Send inn/ }));
    expect(screen.getByText('Du må velge type')).toBeVisible();
  });

  test('at feilmelding ikke skal vises når validering er oppfylt', async () => {
    render(<SelectForm />);
    await user.selectOptions(screen.getByRole('combobox', { name: /Velg type/ }), 'Alternativ 2');
    await waitFor(() => user.click(screen.getByRole('button', { name: /Send inn/ })));
    expect(screen.queryByText('Du må velge type')).not.toBeInTheDocument();
  });
});

interface FormFields {
  type: string;
}

interface Props {
  defaultValue?: string;
}

function SelectForm(props: Props) {
  const { formFields, form } = useConfigForm<FormFields>({
    type: {
      type: 'select',
      label: 'Velg type',
      description: 'Velg en type',
      defaultValue: props.defaultValue,
      options: ['', 'Alternativ 1', 'Alternativ 2', 'Alternativ 3'],
      rules: { required: 'Du må velge type' },
    },
  });
  return (
    <form onSubmit={form.handleSubmit(() => jest.fn())}>
      <FormField form={form} formField={formFields.type} />
      <Button variant={'primary'}>Send inn</Button>
    </form>
  );
}
