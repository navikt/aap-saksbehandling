import { render, screen } from 'lib/test/setUpTests';
import userEvent from '@testing-library/user-event';
import { Oppfølging } from './Oppfølging';

describe('Oppfølging', () => {
  const user = userEvent.setup();

  it('Skal ha en overskrift', () => {
    render(<Oppfølging d />);

    const heading = screen.getByText('Behov for oppfølging § 11-6');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<Oppfølging />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder om søker har behov for oppfølging' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha beskrivelse på felt for begrunnelse', () => {
    render(<Oppfølging />);
    const beskrivelse = screen.getByText(
      'Beskriv oppfølgingsbehov, behovet for arbeidsrettet oppfølging og vurdering om det er en mulighet for å komme tilbake i arbeid og eventuell annen oppfølging fra nav'
    );
    expect(beskrivelse).toBeVisible();
  });

  it('Skal ha felt for om vilkårene i § 11-6 er oppfylt', () => {
    render(<Oppfølging />);
    const oppfylt116 = screen.getByRole('group', { name: /Er vilkårene i § 11-6 oppfylt\?/i });
    expect(oppfylt116).toBeVisible();
  });

  it('Skal ha felt for grunn hvis § 11-6 er oppfylt', async () => {
    render(<Oppfølging />);
    const oppfyltJa = screen.getByRole('radio', { name: /Ja/i });
    await user.click(oppfyltJa);
    const checkboxGroup = await screen.findByRole('group', { name: 'Velg minst én grunn for at § 11-6 er oppfylt' });
    expect(checkboxGroup).toBeVisible();
  });

  it('Skal ikke vise felt for grunn dersom § 11-6 ikke er besvart', () => {
    render(<Oppfølging />);
    const oppfyltJa = screen.getByRole('radio', { name: /Ja/i });
    const oppfyltNei = screen.getByRole('radio', { name: /Nei/i });
    expect(oppfyltJa).not.toBeChecked();
    expect(oppfyltNei).not.toBeChecked();

    const checkboxGroup = screen.queryByRole('group', { name: 'Velg minst én grunn for at § 11-6 er oppfylt' });
    expect(checkboxGroup).not.toBeInTheDocument();
  });

  it('Skal ikke vise felt for grunn dersom § 11-6 ikke er oppfylt', async () => {
    render(<Oppfølging />);
    const oppfyltNei = screen.getByRole('radio', { name: /Nei/i });

    await user.click(oppfyltNei);

    expect(oppfyltNei).toBeChecked();

    const checkboxGroup = screen.queryByRole('group', { name: 'Velg minst én grunn for at § 11-6 er oppfylt' });
    expect(checkboxGroup).not.toBeInTheDocument();
  });
});
