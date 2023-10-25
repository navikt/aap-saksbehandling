import { render, screen } from '@testing-library/react';
import { UutnyttetArbeidsevne } from 'components/behandlinger/sykdom/uutnyttetarbeidsevne/UutnyttetArbeidsevne';
import userEvent from '@testing-library/user-event';

describe('Uutnyttet arbeidsevne', () => {
  const user = userEvent.setup();
  beforeEach(() => {
    render(<UutnyttetArbeidsevne />);
  });
  test('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Uutnyttet arbeidsevne - § 11-23' })).toBeVisible();
  });

  test('har et begrunnelsesfelt', () => {
    expect(screen.getByRole('textbox', { name: 'Vurder den uutnyttede arbeidsevnen' })).toBeVisible();
    expect(
      screen.getByText(
        'Hvilken sykdom/skade/lyte. Hva er det mest vesentlige. Hvorfor vurderes det at det finnes en uutnyttet arbeisevne'
      )
    ).toBeVisible();
  });

  test('har felt for å legge inn uutnyttet arbeidsevne', () => {
    expect(screen.getByRole('textbox', { name: 'Hvor stor av arbeidsevnen er uutnyttet?' })).toBeVisible();
  });

  test('viser feilmelding hvis man ikke begrunner svaret', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
    expect(screen.getByRole('textbox', { name: 'Vurder den uutnyttede arbeidsevnen' })).toBeInvalid();
    const feilmelding = await screen.findByText('Du må begrunne avgjørelsen din.');
    expect(feilmelding).toBeVisible();
  });

  test('viser feilmelding hvis man ikke angir uutnyttet arbeidsevne', async () => {
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder den uutnyttede arbeidsevnen' });
    await user.type(begrunnelse, 'En begrunnelse');

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    expect(screen.getByRole('textbox', { name: 'Hvor stor av arbeidsevnen er uutnyttet?' })).toBeInvalid();
    expect(screen.getByText('Du må angi hvor stor grad av arbeidsevnen som er uutnyttet')).toBeVisible();
  });
});
