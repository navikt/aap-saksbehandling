import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FastsettArbeidsevne', () => {
  const user = userEvent.setup();
  it('Skal ha riktig heading', () => {
    render(<FastsettArbeidsevne behandlingsReferanse={'1234'} />);
    const heading = screen.getByText('Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd');
    expect(heading).toBeVisible();
  });
  it('Steget skal være default lukket', () => {
    render(<FastsettArbeidsevne behandlingsReferanse={'1234'} />);
    const textbox = screen.queryByRole('textbox', {
      name: /Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer/i,
    });
    expect(textbox).toBeNull();
  });
  it('Skal ha feltet begrunnelse', async () => {
    render(<FastsettArbeidsevne behandlingsReferanse={'1234'} />);
    const region = screen.getByRole('region', { name: /Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd/i });
    const button = within(region).getByRole('button');
    await user.click(button);
    const textbox = screen.getByRole('textbox', { name: /Vurder om brukeren har arbeidsevne/i });
    expect(textbox).toBeVisible();
  });
});
