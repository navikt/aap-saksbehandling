import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FastsettArbeidsevne', () => {
  beforeEach(() => {
    render(<FastsettArbeidsevne behandlingsReferanse={'1234'} readOnly={false} behandlingVersjon={0} />);
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

  it('Skal ha en tabell som viser perioder', async () => {
    await åpneVilkårskort();
    const tabell = screen.getByRole('heading', { name: /regisrerte perioder med arbeidsevne/i });
    expect(tabell).toBeVisible();
  });

  it('Skal ha et form som åpner seg når man trykker på knappen "legg til periode"', async () => {
    await åpneVilkårskort();
    const knapp = screen.getByRole('button', { name: /legg til ny preiode/i });
    await user.click(knapp);

    const formHeading = screen.getByRole('heading', {
      name: /legg til en ny periode med arbeidsevne/i,
    });

    expect(formHeading).toBeVisible();
  });

  async function åpneVilkårskort() {
    const region = screen.getByRole('region', { name: /Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd/i });
    const button = within(region).getByRole('button');
    await user.click(button);
  }
});
