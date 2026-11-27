import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UtviklerverktoyTabs } from 'components/opprettsak/UtviklerverktoyTabs';
import { SimulerJournalpostHendelse } from 'components/opprettsak/SimulerJournalpostHendelse';
import { postmottakSimulerJournalpostHendelseClient } from 'lib/postmottakClientApi';

vi.mock('lib/postmottakClientApi', () => ({
  postmottakSimulerJournalpostHendelseClient: vi.fn(),
}));

const user = userEvent.setup();

describe('UtviklerverktoyTabs', () => {
  it('viser begge fanene, med Opprett sak valgt som standard', () => {
    render(<UtviklerverktoyTabs />);

    expect(screen.getByText('Utviklerverktøy')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Opprett sak' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' })).toHaveAttribute('aria-selected', 'false');

    expect(screen.getByRole('button', { name: 'Opprett og iverksett' })).toBeInTheDocument();
    expect(screen.queryByText('Postmottak må kjøre')).not.toBeInTheDocument();
  });

  describe('Fødselsdato ved simulering av journalpost', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2026, 10, 26, 12));
      vi.mocked(postmottakSimulerJournalpostHendelseClient).mockReset();
      vi.mocked(postmottakSimulerJournalpostHendelseClient).mockResolvedValue({
        type: 'SUCCESS',
        status: 200,
        data: undefined,
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('krever en eksplisitt journalpostID før innsending', async () => {
      render(<SimulerJournalpostHendelse />);

      expect(screen.getByRole('textbox', { name: 'JournalpostID' })).toHaveValue('');
      await user.click(screen.getByRole('button', { name: 'Simuler journalpost-hendelse' }));

      expect(await screen.findByText('Du må skrive inn en journalpostID')).toBeInTheDocument();
      expect(postmottakSimulerJournalpostHendelseClient).not.toHaveBeenCalled();
    });

    it('sender fødselsdato til backend i ISO-format', async () => {
      render(<SimulerJournalpostHendelse />);

      await user.type(screen.getByRole('textbox', { name: 'JournalpostID' }), '1234567890');
      const fødselsdato = screen.getByRole('textbox', { name: 'Fødselsdato' });
      expect(fødselsdato).toHaveValue('01.01.2000');
      expect(screen.getByText('26 år og 10 måneder')).toBeInTheDocument();
      await user.clear(fødselsdato);
      await user.type(fødselsdato, '29.02.2012');
      expect(screen.getByText('14 år og 8 måneder')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Simuler journalpost-hendelse' }));

      expect(
        await screen.findByText('Journalpost 1234567890 sendt som Kafka-hendelse til postmottak')
      ).toBeInTheDocument();
      expect(postmottakSimulerJournalpostHendelseClient).toHaveBeenCalledWith(
        expect.objectContaining({ journalpostId: 1234567890, fødselsdato: '2012-02-29' })
      );
    });

    it.each([
      ['26.02.2009', '17 år og 9 måneder'],
      ['27.02.2009', '17 år og 8 måneder'],
      ['27.11.2008', '17 år og 11 måneder'],
      ['26.11.2008', '18 år og 0 måneder'],
    ])('viser fullførte år og måneder for fødselsdato %s', async (dato, forventetAlder) => {
      render(<SimulerJournalpostHendelse />);
      const fødselsdato = screen.getByRole('textbox', { name: 'Fødselsdato' });
      await user.clear(fødselsdato);
      await user.type(fødselsdato, dato);
      expect(screen.getByText(forventetAlder)).toBeInTheDocument();
    });

    it('lar fødselsdato stå tom', async () => {
      render(<SimulerJournalpostHendelse />);

      await user.type(screen.getByRole('textbox', { name: 'JournalpostID' }), '1234567890');
      await user.clear(screen.getByRole('textbox', { name: 'Fødselsdato' }));
      await user.click(screen.getByRole('button', { name: 'Simuler journalpost-hendelse' }));

      expect(
        await screen.findByText('Journalpost 1234567890 sendt som Kafka-hendelse til postmottak')
      ).toBeInTheDocument();
      expect(postmottakSimulerJournalpostHendelseClient).toHaveBeenCalledWith(
        expect.objectContaining({ fødselsdato: undefined })
      );
    });

    it('viser feil for ugyldig dato og lar brukeren rette den', async () => {
      render(<SimulerJournalpostHendelse />);
      await user.type(screen.getByRole('textbox', { name: 'JournalpostID' }), '1234567890');
      const fødselsdato = screen.getByRole('textbox', { name: 'Fødselsdato' });

      await user.clear(fødselsdato);
      await user.type(fødselsdato, '31.02.2012');
      await user.click(screen.getByRole('button', { name: 'Simuler journalpost-hendelse' }));

      expect(await screen.findByText('Datoen er ikke gyldig')).toBeInTheDocument();
      expect(postmottakSimulerJournalpostHendelseClient).not.toHaveBeenCalled();

      await user.clear(fødselsdato);
      await user.type(fødselsdato, '01.03.2012');
      await user.click(screen.getByRole('button', { name: 'Simuler journalpost-hendelse' }));

      expect(
        await screen.findByText('Journalpost 1234567890 sendt som Kafka-hendelse til postmottak')
      ).toBeInTheDocument();
      expect(postmottakSimulerJournalpostHendelseClient).toHaveBeenCalledWith(
        expect.objectContaining({ fødselsdato: '2012-03-01' })
      );
    });
  });

  it('bytter til Simuler journalpost-hendelse-panelet ved klikk på fanen', async () => {
    render(<UtviklerverktoyTabs />);

    await user.click(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' }));

    expect(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Postmottak må kjøre')).toBeInTheDocument();
    expect(screen.getByText(/start frontend med yarn dev:postmottak eller yarn dev:all/)).toBeInTheDocument();
  });
});
