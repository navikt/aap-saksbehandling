import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { GosysOppgave } from 'lib/types/gosysTypes';
import { GosysTabell } from './GosysTabell';

function lagOppgave(overrides: Partial<GosysOppgave> = {}): GosysOppgave {
  return {
    id: 1,
    tema: 'AAP',
    oppgavetype: 'JFR',
    tildeltEnhetsnr: '0300',
    status: 'OPPRETTET',
    versjon: 1,
    prioritet: 'NORM',
    aktivDato: '2026-10-29',
    ...overrides,
  };
}

const oppgaver = [
  lagOppgave({
    id: 1,
    beskrivelse: 'Mellomste',
    opprettetTidspunkt: '2026-03-10T09:00:00+01:00',
    fristFerdigstillelse: '2026-11-02',
  }),
  lagOppgave({ id: 2, beskrivelse: 'Uten dato' }),
  lagOppgave({
    id: 3,
    beskrivelse: 'Nyeste',
    opprettetTidspunkt: '2026-10-01T09:00:00+02:00',
    fristFerdigstillelse: '2026-02-20',
  }),
  lagOppgave({
    id: 4,
    beskrivelse: 'Eldste',
    opprettetTidspunkt: '2025-12-31T09:00:00+01:00',
    fristFerdigstillelse: '2026-04-15',
  }),
];

function hentBeskrivelser() {
  const table = screen.getByRole('table', { name: 'Gosys-oppgaver' });
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[4].textContent);
}

describe('GosysTabell', () => {
  it('viser oppgavefeltene med formaterte datoer og håndterer manglende valgfrie felt', () => {
    render(
      <GosysTabell
        oppgaver={[
          lagOppgave({
            opprettetTidspunkt: '2026-03-10T09:00:00+01:00',
            fristFerdigstillelse: '2026-11-02',
            tilordnetRessurs: 'Z000001',
            beskrivelse: 'Brukeren må kontaktes.',
          }),
          lagOppgave({ id: 2 }),
        ]}
      />
    );

    const rows = screen.getAllByRole('row').slice(1);
    expect(within(rows[0]).getByRole('cell', { name: 'JFR' })).toBeVisible();
    expect(within(rows[0]).getByRole('cell', { name: '10.03.2026' })).toBeVisible();
    expect(within(rows[0]).getByRole('cell', { name: '02.11.2026' })).toBeVisible();
    expect(within(rows[0]).getByRole('cell', { name: 'Z000001' })).toBeVisible();
    expect(within(rows[0]).getByRole('cell', { name: 'Brukeren må kontaktes.' })).toBeVisible();
    expect(within(rows[1]).getByRole('cell', { name: 'Ikke tildelt' })).toBeVisible();
    expect(within(rows[1]).getAllByRole('cell')[1]).toBeEmptyDOMElement();
    expect(within(rows[1]).getAllByRole('cell')[2]).toBeEmptyDOMElement();
  });

  it('viser en melding når det ikke finnes oppgaver', () => {
    render(<GosysTabell oppgaver={[]} />);

    expect(screen.getByRole('cell', { name: 'Ingen Gosys-oppgaver funnet.' })).toHaveAttribute('colspan', '6');
  });

  it.each([
    ['Opprettet', ['Eldste', 'Mellomste', 'Nyeste', 'Uten dato'], ['Nyeste', 'Mellomste', 'Eldste', 'Uten dato']],
    ['Frist', ['Nyeste', 'Eldste', 'Mellomste', 'Uten dato'], ['Mellomste', 'Eldste', 'Nyeste', 'Uten dato']],
  ])('sorterer %s stigende, synkende og tilbake til opprinnelig rekkefølge', async (kolonne, stigende, synkende) => {
    const user = userEvent.setup();
    render(<GosysTabell oppgaver={oppgaver} />);
    const originalRekkefølge = ['Mellomste', 'Uten dato', 'Nyeste', 'Eldste'];
    const button = screen.getByRole('button', { name: kolonne });
    const header = screen.getByRole('columnheader', { name: kolonne });

    expect(hentBeskrivelser()).toEqual(originalRekkefølge);
    await user.click(button);
    expect(hentBeskrivelser()).toEqual(stigende);
    expect(header).toHaveAttribute('aria-sort', 'ascending');

    await user.click(button);
    expect(hentBeskrivelser()).toEqual(synkende);
    expect(header).toHaveAttribute('aria-sort', 'descending');

    await user.click(button);
    expect(hentBeskrivelser()).toEqual(originalRekkefølge);
    expect(oppgaver.map((oppgave) => oppgave.beskrivelse)).toEqual(originalRekkefølge);
  });

  it('starter stigende sortering når brukeren bytter sorteringskolonne', async () => {
    const user = userEvent.setup();
    render(<GosysTabell oppgaver={oppgaver} />);

    const opprettet = screen.getByRole('button', { name: 'Opprettet' });
    await user.click(opprettet);
    await user.click(opprettet);
    await user.click(screen.getByRole('button', { name: 'Frist' }));

    expect(hentBeskrivelser()).toEqual(['Nyeste', 'Eldste', 'Mellomste', 'Uten dato']);
    expect(screen.getByRole('columnheader', { name: 'Frist' })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('beholder sorteringen når flere oppgaver lastes inn', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<GosysTabell oppgaver={oppgaver.slice(0, 3)} />);

    await user.click(screen.getByRole('button', { name: 'Opprettet' }));
    rerender(<GosysTabell oppgaver={oppgaver} />);

    expect(hentBeskrivelser()).toEqual(['Eldste', 'Mellomste', 'Nyeste', 'Uten dato']);
  });
});
