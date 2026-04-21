import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RedigerMeldekortModal } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';

const meldekort: MeldeperiodeMedMeldekortDto = {
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
};

const meldekortMedDager: MeldeperiodeMedMeldekortDto = {
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldekort: {
    id: 'meldekort-1',
    mottattTidspunkt: '2025-01-20T12:00:00.000Z',
    dager: [
      { dato: '2025-01-06', timerArbeidet: 7.5 },
      { dato: '2025-01-07', timerArbeidet: 0 },
      { dato: '2025-01-08', timerArbeidet: 7.5 },
      { dato: '2025-01-09', timerArbeidet: 7.5 },
      { dato: '2025-01-10', timerArbeidet: 7.5 },
      { dato: '2025-01-11', timerArbeidet: 0 },
      { dato: '2025-01-12', timerArbeidet: 0 },
      { dato: '2025-01-13', timerArbeidet: 7.5 },
      { dato: '2025-01-14', timerArbeidet: 7.5 },
      { dato: '2025-01-15', timerArbeidet: 7.5 },
      { dato: '2025-01-16', timerArbeidet: 7.5 },
      { dato: '2025-01-17', timerArbeidet: 7.5 },
      { dato: '2025-01-18', timerArbeidet: 0 },
      { dato: '2025-01-19', timerArbeidet: 0 },
    ],
  },
};

describe('RedigerMeldekortModal', () => {
  const user = userEvent.setup();

  it('viser tittel med riktig ukenummer', () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('heading', { name: 'Endre meldekort for uke 2 - 3' })).toBeVisible();
  });

  it('viser datoperioden i dialogen', () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByText('06.01.2025 - 19.01.2025')).toBeVisible();
  });

  it('viser begrunnelse-felt', () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('textbox', { name: /begrunnelse/i })).toBeVisible();
  });

  it('viser årsak-nedtrekksliste', () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('combobox', { name: /årsak/i })).toBeVisible();
  });

  it('viser Avbryt- og Bekreft-knapper', () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeVisible();
  });

  it('viser ikke meldedato eller timer som standard', () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.queryByRole('textbox', { name: /meldedato/i })).not.toBeInTheDocument();
    expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
  });

  it('viser meldedato og timerkalender ved årsak "Lever/endre meldekort for bruker"', async () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

    expect(screen.getByLabelText(/meldedato/i)).toBeVisible();
    expect(document.getElementById('rapporteringskalender')).toBeInTheDocument();
  });

  it('viser kun meldedato ved årsak "Registrere meldedato"', async () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere meldedato');

    expect(screen.getByLabelText(/meldedato/i)).toBeVisible();
    expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
  });

  it('viser ikke meldedato eller timerkalender ved årsak "Overstyre bruker"', async () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Overstyre bruker');

    expect(screen.queryByLabelText(/meldedato/i)).not.toBeInTheDocument();
    expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
  });

  it('viser advarsel ved årsak "Overstyre bruker"', async () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Overstyre bruker');

    expect(screen.getByText(/Overstyring av bruker er ikke støttet enda/i)).toBeVisible();
  });

  it('viser feilmelding dersom begrunnelse mangler ved innsending', async () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    const feilmelding = screen.getAllByText('Du må skrive en begrunnelse for hvorfor du gjør endring.')[0];
    expect(feilmelding).toBeVisible();
  });

  it('bruker eksisterende dager fra meldekort dersom de finnes', () => {
    render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
    expect(screen.getByRole('heading', { name: 'Endre meldekort for uke 2 - 3' })).toBeVisible();
  });
});
