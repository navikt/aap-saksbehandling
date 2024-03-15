import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FastsettArbeidsevne', () => {
  beforeEach(() => {
    render(<FastsettArbeidsevne behandlingsReferanse={'1234'} />);
  });
  const user = userEvent.setup();

  it('Skal ha riktig heading', () => {
    const heading = screen.getByText('Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd');
    expect(heading).toBeVisible();
  });

  it('Steget skal være default lukket', () => {
    const textbox = screen.queryByRole('textbox', {
      name: /Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer/i,
    });
    expect(textbox).toBeNull();
  });

  it('Skal ha synlig vilkårsveiledning', async () => {
    await åpneVilkårskort();
    const vilkårsveiledning = screen.getByText('Slik vurderes vilkåret');
    expect(vilkårsveiledning).toBeVisible();
  });

  it('Skal ha feltet begrunnelse', async () => {
    await åpneVilkårskort();
    const textbox = screen.getByRole('textbox', { name: /Vurder om brukeren har arbeidsevne/i });
    expect(textbox).toBeVisible();
  });

  async function åpneVilkårskort() {
    const region = screen.getByRole('region', { name: /Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd/i });
    const button = within(region).getByRole('button');
    await user.click(button);
  }
});
