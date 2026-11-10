import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GosysOppgave } from 'lib/types/gosysTypes';
import { describe, expect, it } from 'vitest';
import { GosysOppgaverPopOver } from './GosysOppgaverPopOver';

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

describe('GosysOppgaverPopOver', () => {
  it('viser totalt antall treff og åpner og lukker oppgavelisten ved klikk', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaverPopOver oppgaver={[lagOppgave()]} antallTreff={12} saksnummer="123" />);

    const button = screen.getByRole('button', { name: 'Gosys-oppgaver (12)' });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText('Gosysoppgaver (12)')).toBeVisible();
    expect(screen.getByRole('list')).toBeVisible();

    await user.click(button);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('viser formatert opprettelsesdato, lesbar oppgavetype og tildelt enhet', async () => {
    const user = userEvent.setup();
    render(
      <GosysOppgaverPopOver
        oppgaver={[lagOppgave({ opprettetTidspunkt: '2026-03-10T09:00:00+01:00' })]}
        antallTreff={1}
        saksnummer="123"
      />
    );

    await user.click(screen.getByRole('button', { name: 'Gosys-oppgaver (1)' }));

    const oppgave = screen.getByRole('listitem');
    expect(within(oppgave).getByText('10.03.2026')).toBeVisible();
    expect(within(oppgave).getByText('Type')).toBeVisible();
    expect(within(oppgave).getByText('Journalføring')).toBeVisible();
    expect(within(oppgave).getByText('Enhet')).toBeVisible();
    expect(within(oppgave).getByText('0300')).toBeVisible();
  });

  it('viser oppgaver uten opprettelsesdato', async () => {
    const user = userEvent.setup();
    render(
      <GosysOppgaverPopOver oppgaver={[lagOppgave({ oppgavetype: 'KONT_BRUK' })]} antallTreff={1} saksnummer="123" />
    );

    await user.click(screen.getByRole('button', { name: 'Gosys-oppgaver (1)' }));

    const oppgave = screen.getByRole('listitem');
    expect(within(oppgave).getByText('Kontakt bruker')).toBeVisible();
    expect(within(oppgave).getByText('0300')).toBeVisible();
    expect(oppgave).not.toHaveTextContent(/\d{2}\.\d{2}\.\d{4}/);
  });

  it.each([5, 12])('viser høyst de fem første oppgavene ved %i treff', async (antallTreff) => {
    const user = userEvent.setup();
    const oppgaver = Array.from({ length: 6 }, (_, index) =>
      lagOppgave({ id: index + 1, tildeltEnhetsnr: `030${index}` })
    );
    render(
      <GosysOppgaverPopOver oppgaver={oppgaver.slice(0, antallTreff)} antallTreff={antallTreff} saksnummer="123" />
    );

    await user.click(screen.getByRole('button', { name: `Gosys-oppgaver (${antallTreff})` }));

    const visteOppgaver = screen.getAllByRole('listitem');
    expect(visteOppgaver).toHaveLength(5);
    visteOppgaver.forEach((oppgave, index) => {
      expect(within(oppgave).getByText(`030${index}`)).toBeVisible();
    });
    expect(screen.queryByText('0305')).not.toBeInTheDocument();

    if (antallTreff > 5) {
      expect(screen.getByText('Viser 5 av 12 oppgaver. Gå til gosys-oppgaver siden for å se alle.')).toBeVisible();
    } else {
      expect(screen.queryByText(/Viser .* av .* oppgaver/)).not.toBeInTheDocument();
    }
  });

  it('viser faktisk antall oppgaver i forhåndsvisningen når færre enn fem er lastet inn', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaverPopOver oppgaver={[lagOppgave()]} antallTreff={12} saksnummer="123" />);

    await user.click(screen.getByRole('button', { name: 'Gosys-oppgaver (12)' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Viser 1 av 12 oppgaver. Gå til gosys-oppgaver siden for å se alle.')).toBeVisible();
  });

  it('lenker til Gosys-oppgavene på riktig sak i en ny fane', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaverPopOver oppgaver={[lagOppgave()]} antallTreff={1} saksnummer="456" />);

    await user.click(screen.getByRole('button', { name: 'Gosys-oppgaver (1)' }));

    const link = screen.getByRole('link', { name: 'Gå til Gosys-oppgaver' });
    expect(link).toHaveAttribute('href', '/saksbehandling/sak/456?t=GOSYS_OPPGAVER');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
