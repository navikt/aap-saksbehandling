import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RegistrerMeldedatoModal } from 'components/saksoversikt/meldekortoversikt/registrermeldedatomodal/RegistrerMeldedatoModal';
import { customRender } from 'lib/test/CustomRender';
import { addDays, format } from 'date-fns';

const clientRegistrerMeldedato = vi.fn().mockResolvedValue({});

vi.mock('lib/clientApi', () => ({
  clientRegistrerMeldedato: (...args: unknown[]) => clientRegistrerMeldedato(...args),
}));

describe('RegistrerMeldedatoModal', () => {
  it('viser tittel', () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByText('Registrer meldedato')).toBeInTheDocument();
  });

  it('viser begrunnelse- og datofelt', () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByLabelText('Begrunnelse')).toBeInTheDocument();
    expect(screen.getByLabelText('Dato brukeren meldte seg på annet vis')).toBeInTheDocument();
  });

  it('viser Avbryt- og Bekreft-knapper', () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeInTheDocument();
  });

  it('viser feilmelding dersom begrunnelse mangler ved innsending', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() => {
      expect(
        screen.getAllByText('Du må skrive en begrunnelse for hvorfor du registrerer meldedato.').length
      ).toBeGreaterThan(0);
    });
  });

  it('viser feilmelding dersom meldedato mangler ved innsending', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() => {
      expect(
        screen.getAllByText('Du må legge til en dato brukeren meldte seg på annet vis.').length
      ).toBeGreaterThan(0);
    });
  });

  it('viser feilmelding dersom meldedato er i fremtiden', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Begrunnelse'), 'Bruker ringte inn og meldte seg.');
    await userEvent.type(
      screen.getByLabelText('Dato brukeren meldte seg på annet vis'),
      format(addDays(new Date(), 1), 'dd.MM.yyyy')
    );
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() => {
      expect(screen.getAllByText('Meldedato kan ikke være i fremtiden.').length).toBeGreaterThan(0);
    });
  });

  it('sender inn begrunnelse og meldedato ved gyldig utfylling', async () => {
    customRender(<RegistrerMeldedatoModal isOpen={true} setIsOpen={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Begrunnelse'), 'Bruker ringte inn og meldte seg.');
    await userEvent.type(screen.getByLabelText('Dato brukeren meldte seg på annet vis'), '01.01.2025');
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() => {
      expect(clientRegistrerMeldedato).toHaveBeenCalledWith('123', {
        begrunnelse: 'Bruker ringte inn og meldte seg.',
        meldeDato: '2025-01-01',
      });
    });
  });
});
