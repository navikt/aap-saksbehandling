import { render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { useConfigForm } from '../../../hooks/FormHook';
import { FormField } from './FormField';
import { Button } from '@navikt/ds-react';
import userEvent from '@testing-library/user-event';

describe('Checkbox', () => {
  const user = userEvent.setup();

  test('at label er synlig', () => {
    render(<FormMedCheckbox />);
    const label = screen.getByText('Er du sikker?');
    expect(label).toBeVisible();
  });

  test('at description er synlig', () => {
    render(<FormMedCheckbox />);
    const description = screen.getByText('Du må velge et av valgene.');
    expect(description).toBeVisible();
  });

  test('at ingen valg er checked når default value ikke er satt', async () => {
    render(<FormMedCheckbox />);
    const jaValg = screen.getByRole('checkbox', { name: /Ja/ });
    const neiValg = screen.getByRole('checkbox', { name: /Nei/ });
    expect(jaValg).toBeVisible();
    expect(jaValg).not.toBeChecked();
    expect(neiValg).toBeVisible();
    expect(neiValg).not.toBeChecked();
  });

  test('at når default value er satt så skal det valget være checked', async () => {
    render(<FormMedCheckbox defaultValue={['Ja']} />);
    const jaValg = screen.getByRole('checkbox', { name: /Ja/ });
    const neiValg = screen.getByRole('checkbox', { name: /Nei/ });
    expect(neiValg).toBeVisible();
    expect(neiValg).not.toBeChecked();
    expect(jaValg).toBeVisible();
    expect(jaValg).toBeChecked();
  });

  test('at flere checkboxer kan velges', async () => {
    render(<FormMedCheckbox />);
    const jaValg = screen.getByRole('checkbox', { name: /Ja/ });
    const vetIkkeValg = screen.getByRole('checkbox', { name: /Vet ikke/ });

    await waitFor(() => user.click(jaValg));
    await waitFor(() => user.click(vetIkkeValg));
    expect(jaValg).toBeChecked();
    expect(vetIkkeValg).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Nei/ })).not.toBeChecked();
  });

  test('at feilmelding skal være synlig når validering av skjema ikke er godkjent', async () => {
    render(<FormMedCheckbox />);
    const sendKnapp = screen.getByRole('button', { name: /Send/ });
    expect(sendKnapp).toBeVisible();
    await user.click(sendKnapp);
    await waitFor(() => expect(screen.queryByText(/Du må foreta et valg!/)).toBeVisible());
  });
});

interface FormFields {
  erDuSikker: string[];
}

interface Props {
  defaultValue?: string[];
}
function FormMedCheckbox(props: Props) {
  const onSubmitMock = jest.fn();
  const form = useForm<FormFields>({ defaultValues: { erDuSikker: props.defaultValue || [] } });
  const { formFields } = useConfigForm<FormFields>({
    erDuSikker: {
      type: 'checkbox',
      label: 'Er du sikker?',
      description: 'Du må velge et av valgene.',
      rules: { required: 'Du må foreta et valg!' },
      options: ['Ja', 'Nei', 'Vet ikke'],
    },
  });
  return (
    <form onSubmit={form.handleSubmit(() => onSubmitMock())}>
      <FormField form={form} formField={formFields.erDuSikker} />
      <Button>Send</Button>
    </form>
  );
}
