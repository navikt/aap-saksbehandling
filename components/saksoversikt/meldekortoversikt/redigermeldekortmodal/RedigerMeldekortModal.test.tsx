import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mapFormDataTilOppdaterMeldekortRequest,
  RedigerMeldekortModal,
  Årsaker,
} from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';
import { addDays } from 'date-fns';
import { Dato } from 'lib/types/Dato';

vi.mock('lib/clientApi', () => ({
  clientKorrigerMeldekort: vi.fn().mockResolvedValue({}),
}));

const meldekort: MeldeperiodeMedMeldekortDto = {
  tidligereMeldekort: [],
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  periode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
};

const meldekortMedDager: MeldeperiodeMedMeldekortDto = {
  tidligereMeldekort: [],
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  periode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldekort: {
    id: 'meldekort-1',
    meldeDato: '2025-01-20T12:00:00.000Z',
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
    journalpostId: '',
    oppdatertAvSaksbehandler: true,
  },
};

const meldekortMedNullTimer: MeldeperiodeMedMeldekortDto = {
  tidligereMeldekort: [],
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  periode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldekort: {
    id: 'meldekort-2',
    meldeDato: '2025-01-20T12:00:00.000Z',
    dager: [
      { dato: '2025-01-06', timerArbeidet: 0 },
      { dato: '2025-01-07', timerArbeidet: 0 },
      { dato: '2025-01-08', timerArbeidet: 0 },
      { dato: '2025-01-09', timerArbeidet: 0 },
      { dato: '2025-01-10', timerArbeidet: 0 },
      { dato: '2025-01-11', timerArbeidet: 0 },
      { dato: '2025-01-12', timerArbeidet: 0 },
      { dato: '2025-01-13', timerArbeidet: 0 },
      { dato: '2025-01-14', timerArbeidet: 0 },
      { dato: '2025-01-15', timerArbeidet: 0 },
      { dato: '2025-01-16', timerArbeidet: 0 },
      { dato: '2025-01-17', timerArbeidet: 0 },
      { dato: '2025-01-18', timerArbeidet: 0 },
      { dato: '2025-01-19', timerArbeidet: 0 },
    ],
    journalpostId: '',
    oppdatertAvSaksbehandler: false,
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

  describe('Registrere meldedato', () => {
    it('viser alert "Bruker har ikke levert noen timer" når meldekort mangler', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere meldedato');

      expect(
        screen.getByText(
          'Bruker har ikke levert noen timer. Det vil ikke gå noen utbetaling før bruker registrerer timer i meldekortet.'
        )
      ).toBeVisible();
      expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
    });

    it('viser alert "Bruker har ikke levert noen timer" når alle dager har 0 timer', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedNullTimer} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere meldedato');

      expect(
        screen.getByText(
          'Bruker har ikke levert noen timer. Det vil ikke gå noen utbetaling før bruker registrerer timer i meldekortet.'
        )
      ).toBeVisible();
      expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
    });

    it('viser timerkalender når bruker har levert timer', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere meldedato');

      expect(document.getElementById('rapporteringskalender')).toBeInTheDocument();
      expect(screen.queryByText('Bruker har ikke levert noen timer.')).not.toBeInTheDocument();
    });

    it('timer-input er readOnly i kalender når bruker har levert timer og årsak er Registrere meldedato', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere meldedato');

      const kalender = document.getElementById('rapporteringskalender')!;
      const inputs = kalender.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => expect(input).toHaveAttribute('readonly'));
    });
  });

  describe('Lever/endre meldekort for bruker', () => {
    it('timer-input er redigerbare i kalender', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

      const kalender = document.getElementById('rapporteringskalender')!;
      const inputs = kalender.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => expect(input).not.toHaveAttribute('readonly'));
    });

    it('viser ikke alert om ingen timer', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

      expect(screen.queryByText('Bruker har ikke levert noen timer.')).not.toBeInTheDocument();
    });
  });

  describe('Generering av dager i kalender', () => {
    const åpneKalender = async () => {
      const user = userEvent.setup();
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');
    };

    it('genererer 14 input-felt for en standard 14-dagers periode', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await åpneKalender();

      const kalender = document.getElementById('rapporteringskalender')!;
      expect(kalender.querySelectorAll('input')).toHaveLength(14);
    });

    it('genererer korrekt antall input-felt for en kortere periode', async () => {
      const kortMeldekort: MeldeperiodeMedMeldekortDto = {
        tidligereMeldekort: [],
        meldeperiode: { fom: '2025-01-08', tom: '2025-01-14' },
        periode: { fom: '2025-01-08', tom: '2025-01-14' },
      };
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
      await åpneKalender();

      const kalender = document.getElementById('rapporteringskalender')!;
      expect(kalender.querySelectorAll('input')).toHaveLength(7);
    });
  });

  describe('Dager utenfor meldeperioden i kalender', () => {
    // Periode: onsdag 8. jan – tirsdag 14. jan (7 dager, starter midt i uke)
    // Uke 1: mandag 6. jan og tirsdag 7. jan er utenfor perioden
    // Uke 2: onsdag 15. jan – søndag 19. jan er utenfor perioden
    const kortMeldekort: MeldeperiodeMedMeldekortDto = {
      tidligereMeldekort: [],
      meldeperiode: { fom: '2025-01-08', tom: '2025-01-19' },
      periode: { fom: '2025-01-08', tom: '2025-01-19' },
    };

    const åpneKalender = async () => {
      const user = userEvent.setup();
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');
    };

    it('viser dato-tekst for dag utenfor perioden uten input-felt', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
      await åpneKalender();

      expect(screen.getByText('06.01.')).toBeVisible();
      expect(screen.queryByRole('textbox', { name: /arbeid for mandag 6. januar/i })).not.toBeInTheDocument();
    });

    it('viser input-felt for dag innenfor perioden', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
      await åpneKalender();

      expect(screen.getByRole('textbox', { name: /arbeid for onsdag 8. januar/i })).toBeInTheDocument();
    });

    it('viser alle 7 dager i uken selv om bare noen er innenfor perioden', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
      await åpneKalender();

      // Uke 1: ma 06.01., ti 07.01. er utenfor — begge skal vises som tekst
      expect(screen.getByText('06.01.')).toBeVisible();
      expect(screen.getByText('07.01.')).toBeVisible();
    });
  });

  describe('Meldedato validering', () => {
    const fyllUtOgSubmit = async (meldedato: string) => {
      await user.type(screen.getByRole('textbox', { name: /begrunnelse/i }), 'Begrunnelse for endring');
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere meldedato');
      await user.type(screen.getByLabelText(/meldedato/i), meldedato);
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    };

    it('viser feilmelding når meldedato er før meldeperiodens tom-dato', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await fyllUtOgSubmit('18.01.2025');


      expect(screen.getAllByText('Meldedato må være dagen etter meldeperiodens slutt eller senere.')[0]).toBeVisible();
    });

    it('viser feilmelding når meldedato er etter dagens dato', async () => {
      render(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await fyllUtOgSubmit(new Dato(addDays(new Date(), 1)).formaterForFrontend());

      expect(screen.getAllByText('Meldedato kan ikke være i fremtiden.')[0]).toBeVisible();
    });
  });
});

const meldeperiode: MeldeperiodeMedMeldekortDto['meldeperiode'] = {
  fom: '2025-01-06',
  tom: '2025-01-19',
};

describe('mapFormDataTilOppdaterMeldekortRequest', () => {
  it('mapper begrunnelse til request', () => {
    const result = mapFormDataTilOppdaterMeldekortRequest(
      { begrunnelse: 'Min begrunnelse', årsak: '' as Årsaker, meldedato: '20.01.2025', dager: [] },
      meldeperiode
    );
    expect(result.begrunnelse).toBe('Min begrunnelse');
  });

  it('mapper meldedato fra frontend-format (dd.MM.yyyy) til backend-format (yyyy-MM-dd)', () => {
    const result = mapFormDataTilOppdaterMeldekortRequest(
      { begrunnelse: '', årsak: '' as Årsaker, meldedato: '20.01.2025', dager: [] },
      meldeperiode
    );
    expect(result.meldeDato).toBe('2025-01-20');
  });

  it('konverterer komma til punktum i timerArbeidet', () => {
    const result = mapFormDataTilOppdaterMeldekortRequest(
      {
        begrunnelse: '',
        årsak: Årsaker.LEVERE_MELDEKORT_FOR_BRUKER,
        meldedato: '20.01.2025',
        dager: [{ dato: '2025-01-06', timerArbeidet: '7,5' }],
      },
      meldeperiode
    );
    expect(result.dager[0].timerArbeidet).toBe(7.5);
  });

  it('konverterer tom streng i timerArbeidet til 0', () => {
    const result = mapFormDataTilOppdaterMeldekortRequest(
      {
        begrunnelse: '',
        årsak: Årsaker.LEVERE_MELDEKORT_FOR_BRUKER,
        meldedato: '20.01.2025',
        dager: [{ dato: '2025-01-06', timerArbeidet: '' }],
      },
      meldeperiode
    );
    expect(result.dager[0].timerArbeidet).toBe(0);
  });

  it('returnerer dager fra skjema når årsak er "Lever/endre meldekort for bruker"', () => {
    const result = mapFormDataTilOppdaterMeldekortRequest(
      {
        begrunnelse: '',
        årsak: Årsaker.LEVERE_MELDEKORT_FOR_BRUKER,
        meldedato: '20.01.2025',
        dager: [
          { dato: '2025-01-06', timerArbeidet: '7.5' },
          { dato: '2025-01-07', timerArbeidet: '0' },
        ],
      },
      meldeperiode
    );
    expect(result.dager).toHaveLength(2);
    expect(result.dager[0]).toEqual({ dato: '2025-01-06', timerArbeidet: 7.5 });
  });

  it('returnerer tom dager-liste ved årsak "Registrere meldedato"', () => {
    const result = mapFormDataTilOppdaterMeldekortRequest(
      {
        begrunnelse: '',
        årsak: Årsaker.REGISTRERE_MELDEDATO,
        meldedato: '20.01.2025',
        dager: [{ dato: '2025-01-06', timerArbeidet: '7.5' }],
      },
      meldeperiode
    );
    expect(result.dager).toEqual([]);
  });
});
