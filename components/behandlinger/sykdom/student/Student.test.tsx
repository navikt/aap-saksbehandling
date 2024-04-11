import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Student } from 'components/behandlinger/sykdom/student/Student';

describe('Student', () => {
  const user = userEvent.setup();

  it('skal ha en overskrift', () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const heading = screen.getByText('Student - § 11-14');
    expect(heading).toBeVisible();
  });

  it('Skal ha et begrunnelse felt', () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const textbox = screen.getByRole('textbox', {
      name: /vurder/i,
    });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om søker oppfyller hovedvilkåret', () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const radioGroup = screen.getByRole('group', { name: /Har søker oppfyllt vilkårene i § 11-14?/i });
    expect(radioGroup).toBeVisible();
  });

  it("Radiogruppe for hovedvilkår skal ha to valg, 'Ja' og 'Nei'", () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const oppfyltJa = screen.getByRole('radio', { name: /Ja/i });
    const oppfyltNei = screen.getByRole('radio', { name: /Nei/i });
    expect(oppfyltJa).not.toBeChecked();
    expect(oppfyltNei).not.toBeChecked();
  });

  it('Skal ikke vise datofelt dersom hovedvilkåret ikke er oppfylt', async () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const oppfyltNei = screen.getByRole('radio', { name: /Nei/i });

    await user.click(oppfyltNei);

    expect(oppfyltNei).toBeChecked();

    const datofelt = screen.queryByRole('textbox', { name: 'Første dag med avbrutt studie' });
    expect(datofelt).not.toBeInTheDocument();
  });

  it('Skal vise datofelt dersom hovedvilkåret er oppfylt', async () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const oppfyltJa = screen.getByRole('radio', { name: /Ja/i });

    await user.click(oppfyltJa);

    expect(oppfyltJa).toBeChecked();

    const datofelt = screen.queryByRole('textbox', { name: 'Første dag med avbrutt studie' });
    expect(datofelt).toBeInTheDocument();
  });

  it('Begrunnelse skal ha feilmelding dersom ikke fyllt ut', async () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const button = screen.getByRole('button', { name: /bekreft/i });

    await user.click(button);

    const errorText = await screen.findByText('Du må begrunne');

    expect(errorText).toBeVisible();

    const textField = screen.getByRole('textbox', { name: /vurder/i });
    expect(textField).toBeInvalid();
  });

  it('Hovedvilkåret skal ha feilmelding dersom ikke fyllt ut', async () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const button = screen.getByRole('button', { name: /bekreft/i });

    await user.click(button);

    const errorText = await screen.findByText('Du må svare på om vilkåret er oppfyllt');

    expect(errorText).toBeVisible();
  });

  it('Datofelt skal ha feilmelding dersom hovedvilkår er "Ja", og datofeilt ikke fyllt ut', async () => {
    render(<Student behandlingsReferanse={'123'} erBeslutter={false} />);
    const button = screen.getByRole('button', { name: /bekreft/i });

    const oppfyltJa = screen.getByRole('radio', { name: /Ja/i });
    await user.click(oppfyltJa);

    await user.click(button);

    const errorText = await screen.findByText('Du må svare på når studiet ble avbrutt');

    expect(errorText).toBeVisible();

    const datofelt = screen.queryByRole('textbox', { name: 'Første dag med avbrutt studie' });
    expect(datofelt).toBeInvalid();
  });
});
