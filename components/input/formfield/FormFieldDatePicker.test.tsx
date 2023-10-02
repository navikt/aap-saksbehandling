import { useConfigForm } from '../../../hooks/FormHook';
import { FormField } from './FormField';
import { Button } from '@navikt/ds-react';
import { render, screen } from '@testing-library/react';

describe('Datepicker', () => {
  test('at label er synlig', () => {
    render(<FormMedDatePicker />);
    const label = screen.getByText('Dato for virkningstidspunkt');
    expect(label).toBeVisible();
  });

  test('at description er synlig hvis den har verdi', () => {
    render(<FormMedDatePicker />);
    const description = screen.getByText('Som regel legeerklæring eller søknadstidspunkt');
    expect(description).toBeVisible();
  });
});

interface FormFields {
  virkningstidspunkt: Date;
}

interface Props {
  defaultValue?: Date;
}

function FormMedDatePicker(props: Props) {
  const { formFields, form } = useConfigForm<FormFields>({
    virkningstidspunkt: {
      type: 'date',
      label: 'Dato for virkningstidspunkt',
      description: 'Som regel legeerklæring eller søknadstidspunkt',
      defaultValue: props.defaultValue,
      rules: { required: 'Virkningstidspunkt er påkrevd.' },
      fromDate: new Date(),
    },
  });

  return (
    <form onSubmit={form.handleSubmit(() => jest.fn())}>
      <FormField form={form} formField={formFields.virkningstidspunkt} />
      <Button>Send</Button>
    </form>
  );
}
