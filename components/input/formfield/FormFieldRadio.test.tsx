import { useConfigForm } from '../../../hooks/FormHook';
import { FormField } from './FormField';
import { Button } from '@navikt/ds-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Radio', () => {
  const user = userEvent.setup();

  test('at label er synlig', () => {
    render(<FormMedRadios />);
    const label = screen.getByText('Er arbeidsevnen nedsatt med minst 50 prosent?');
    expect(label).toBeVisible();
  });

  test('at description er synlig hvis verdien er satt', () => {
    render(<FormMedRadios />);
    const description = screen.getByText('Nedsettelse med minst 50 prosent er et krav.');
    expect(description).toBeVisible();
  });

  test('at valgene er synlig', async () => {
    render(<FormMedRadios />);
    expect(screen.getByRole('radio', { name: /Ja/ })).toBeVisible();
    expect(screen.getByRole('radio', { name: /Nei/ })).toBeVisible();
  });

  test('at ingen radioknapper er valgt når defaultvalues ikke er satt', () => {
    render(<FormMedRadios />);
    screen.getAllByRole('radio').map((e) => expect(e).not.toBeChecked());
  });

  test('at radioknapp skal være valgt når defaultvalue er satt', () => {
    render(<FormMedRadios defaultValue={'true'} />);

    expect(screen.getByRole('radio', { name: /Nei/ })).toBeVisible();
    expect(screen.getByRole('radio', { name: /Nei/ })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /Ja/ })).toBeVisible();
    expect(screen.getByRole('radio', { name: /Ja/ })).toBeChecked();
  });

  test('at det er kun mulig å velge en radioknapp innenfor samme gruppe', async () => {
    render(<FormMedRadios />);
    const jaRadio = screen.getByRole('radio', { name: /Nei/ });
    const neiRadio = screen.getByRole('radio', { name: /Ja/ });

    await user.click(neiRadio);
    expect(jaRadio).not.toBeChecked();
    expect(neiRadio).toBeChecked();

    await user.click(jaRadio);
    expect(jaRadio).toBeChecked();
    expect(neiRadio).not.toBeChecked();
  });

  test('at feilmelding er synlig når validering ikke er oppfylt', async () => {
    render(<FormMedRadios />);
    const sendKnapp = screen.getByRole('button', { name: /Send/ });
    expect(sendKnapp).toBeVisible();
    await user.click(sendKnapp);

    expect(
      await screen.queryByText('Du må ta stilling til om arbeidsevnen er nedsatt med minst 50 prosent')
    ).toBeVisible();
  });

  test('at ingen feilmeldinger er synlig når validering er oppfylt', async () => {
    render(<FormMedRadios />);

    await user.click(screen.getByRole('radio', { name: /Ja/ }));
    const sendKnapp = screen.getByRole('button', { name: /Send/ });

    expect(sendKnapp).toBeVisible();
    await user.click(sendKnapp);

    expect(
      await screen.queryByText('Du må ta stilling til om arbeidsevnen er nedsatt med minst 50 prosent')
    ).not.toBeInTheDocument();
  });
});

interface FormFields {
  størrelse: string;
}

interface Props {
  defaultValue?: string;
}
function FormMedRadios(props: Props) {
  const onSubmitMock = jest.fn();
  const { formFields, form } = useConfigForm<FormFields>({
    størrelse: {
      type: 'radio',
      label: 'Er arbeidsevnen nedsatt med minst 50 prosent?',
      description: 'Nedsettelse med minst 50 prosent er et krav.',
      defaultValue: props.defaultValue,
      rules: { required: 'Du må ta stilling til om arbeidsevnen er nedsatt med minst 50 prosent' },
      options: [
        { label: 'Ja', value: 'true' },
        { label: 'Nei', value: 'false' },
      ],
    },
  });
  return (
    <form onSubmit={form.handleSubmit(() => onSubmitMock())}>
      <FormField form={form} formField={formFields.størrelse} />
      <Button>Send</Button>
    </form>
  );
}
