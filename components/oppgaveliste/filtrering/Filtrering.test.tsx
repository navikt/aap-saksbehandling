import { describe, expect, it } from 'vitest';
import { render } from 'lib/test/CustomRender';
import { Filtrering } from 'components/oppgaveliste/filtrering/Filtrering';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

describe('Filtrering', () => {
  const user = userEvent.setup();

  it('Skal kunne åpne og lukke filtrering', async () => {
    render(<Filtrering />);

    expect(screen.queryByText('her kommer det noe mer')).not.toBeInTheDocument();
    const åpneFiltreringKnapp = screen.getByRole('button', { name: 'Filtrer listen' });
    await user.click(åpneFiltreringKnapp);

    expect(screen.getByText('her kommer det noe mer')).toBeVisible();

    const lukkFiltreringKnapp = screen.getByRole('button', { name: 'Lukk filter' });
    await user.click(lukkFiltreringKnapp);

    expect(screen.queryByText('her kommer det noe mer')).not.toBeInTheDocument();
  });

  it('Skal vise totalt antall oppgaver i listen', () => {
    render(<Filtrering />);
    const antallOppgaver = screen.getByText('Viser 25 av totalt 50 oppgaver.');
    expect(antallOppgaver).toBeVisible();
  });
});
