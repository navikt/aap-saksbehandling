import { render, screen } from '@testing-library/react';
import { Filter } from 'components/oppgavebehandling/oppgavekø/filter/Filter';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('Filter', () => {
  test('har overskrift på nivå 2', () => {
    render(<Filter />);
    expect(screen.getByRole('heading', { level: 2, name: 'Filter' })).toBeVisible();
  });

  test('har en knapp for å legge til filter', () => {
    render(<Filter />);
    expect(screen.getByRole('button', { name: 'Legg til filter' })).toBeVisible();
  });

  test('har en knapp for å gjøre søk', () => {
    render(<Filter />);
    expect(screen.getByRole('button', { name: 'Søk' })).toBeVisible();
  });

  test('filter man kan legge til er skjult som standard', () => {
    render(<Filter />);
    expect(screen.queryByRole('button', { name: 'Innbygger' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Behandlingstype' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Oppgavetype' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Saksbehandler' })).not.toBeInTheDocument();
  });

  test('viser en popover med knapper når man klikker på "Legg til filter"', async () => {
    render(<Filter />);
    const leggTilFilterKnapp = screen.getByRole('button', { name: 'Legg til filter' });
    await user.click(leggTilFilterKnapp);
    expect(screen.getByRole('button', { name: 'Innbygger' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Behandlingstype' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Oppgavetype' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Saksbehandler' })).toBeVisible();
  });
});
