import { describe, expect, it } from 'vitest';
import { render } from 'lib/test/CustomRender';
import { Filtrering } from 'components/oppgaveliste/filtrering/Filtrering';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

const user = userEvent.setup();

describe('Filtrering', () => {
  it('Skal kunne åpne og lukke filtrering', async () => {
    render(<Filtrering />);

    expect(screen.queryByRole('button', { name: 'Bruk filter' })).not.toBeInTheDocument();
    await åpneFiltrering();

    expect(screen.getByRole('button', { name: 'Bruk filter' })).toBeVisible();

    const lukkFiltreringKnapp = screen.getByRole('button', { name: 'Lukk filter' });
    await user.click(lukkFiltreringKnapp);

    expect(screen.queryByText('her kommer det noe mer')).not.toBeInTheDocument();
  });

  it('Skal vise totalt antall oppgaver i listen', () => {
    render(<Filtrering />);
    const antallOppgaver = screen.getByText('Viser 25 av totalt 50 oppgaver');
    expect(antallOppgaver).toBeVisible();
  });

  it('Skal ha en knapp for å kunne bruke filter', async () => {
    render(<Filtrering />);
    await åpneFiltrering();
    const knapp = screen.getByRole('button', { name: 'Bruk filter' });
    expect(knapp).toBeVisible();
  });

  it('Skal ha en knapp for å kunne nullstille skjema ', async () => {
    render(<Filtrering />);
    await åpneFiltrering();
    const knapp = screen.getByRole('button', { name: 'Nullstill' });
    expect(knapp).toBeVisible();
  });
});

async function åpneFiltrering() {
  const åpneFiltreringKnapp = screen.getByRole('button', { name: 'Filtrer listen' });
  await user.click(åpneFiltreringKnapp);
}
