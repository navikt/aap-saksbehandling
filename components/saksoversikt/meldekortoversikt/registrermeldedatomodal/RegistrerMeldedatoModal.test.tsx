import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RegistrerMeldedatoModal } from 'components/saksoversikt/meldekortoversikt/registrermeldedatomodal/RegistrerMeldedatoModal';
import { customRender } from 'lib/test/CustomRender';
import { addDays, format } from 'date-fns';

const clientRegistrerMeldedato = vi.fn().mockResolvedValue({});
const refetchMeldekort = vi.fn();

vi.mock('lib/clientApi', () => ({
  clientRegistrerMeldedato: (...args: unknown[]) => clientRegistrerMeldedato(...args),
}));

vi.mock('hooks/saksbehandling/MeldekortHook', () => ({
  useMeldekort: () => ({
    alleMeldekort: [],
    refetchMeldekort,
    isLoading: false,
  }),
}));

describe('RegistrerMeldedatoModal', () => {
  it('viser tittel', () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    expect(
      screen.getByText('Registrer at brukeren har meldt seg på annet vis enn meldekort')
    ).toBeInTheDocument();
  });

  it('viser begrunnelse- og datofelt', () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByLabelText('Hvordan meldte brukeren seg til Nav?')).toBeInTheDocument();
    expect(screen.getByLabelText('Dato brukeren meldte seg for Nav')).toBeInTheDocument();
  });

  it('viser advarsel om at meldedato ikke kan angres', () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByText(/Meldt dato kan ikke angres etter bekreftelse/)).toBeInTheDocument();
  });

  it('viser Avbryt- og Bekreft-knapper', () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeInTheDocument();
  });

  it('viser feilmelding dersom begrunnelse mangler ved innsending', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(
      await screen.findByText('Du må skrive en begrunnelse for hvorfor du registrerer meldedato.')
    ).toBeInTheDocument();
    expect(clientRegistrerMeldedato).not.toHaveBeenCalled();
  });

  it('viser feilmelding dersom meldedato mangler ved innsending', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(await screen.findByText('Du må legge til en dato brukeren meldte seg på annet vis.')).toBeInTheDocument();
    expect(clientRegistrerMeldedato).not.toHaveBeenCalled();
  });

  it('viser feilmelding dersom meldedato er i fremtiden', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Hvordan meldte brukeren seg til Nav?'), 'Bruker ringte inn.');
    await userEvent.type(
      screen.getByLabelText('Dato brukeren meldte seg for Nav'),
      format(addDays(new Date(), 1), 'dd.MM.yyyy')
    );
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(await screen.findByText('Meldedato kan ikke være i fremtiden.')).toBeInTheDocument();
    expect(clientRegistrerMeldedato).not.toHaveBeenCalled();
  });

  it('sender inn begrunnelse og meldedato ved gyldig utfylling', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Hvordan meldte brukeren seg til Nav?'), 'Bruker ringte inn og meldte seg.');
    await userEvent.type(screen.getByLabelText('Dato brukeren meldte seg for Nav'), '01.01.2025');
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() => {
      expect(clientRegistrerMeldedato).toHaveBeenCalledWith('123', {
        begrunnelse: 'Bruker ringte inn og meldte seg.',
        meldeDato: '2025-01-01',
      });
    });
  });

  it('henter meldekort på nytt etter vellykket innsending', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Hvordan meldte brukeren seg til Nav?'), 'Bruker ringte inn og meldte seg.');
    await userEvent.type(screen.getByLabelText('Dato brukeren meldte seg for Nav'), '01.01.2025');
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() => {
      expect(refetchMeldekort).toHaveBeenCalled();
    });
  });

  it('viser feilmelding fra server dersom innsending feiler', async () => {
    clientRegistrerMeldedato.mockResolvedValueOnce({
      type: 'ERROR',
      status: 500,
      apiException: { code: 'FEIL', message: 'Noe gikk galt på serveren' },
    });

    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Hvordan meldte brukeren seg til Nav?'), 'Bruker ringte inn og meldte seg.');
    await userEvent.type(screen.getByLabelText('Dato brukeren meldte seg for Nav'), '01.01.2025');
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(await screen.findByText('Noe gikk galt ved innsending: Noe gikk galt på serveren')).toBeInTheDocument();
  });
});
