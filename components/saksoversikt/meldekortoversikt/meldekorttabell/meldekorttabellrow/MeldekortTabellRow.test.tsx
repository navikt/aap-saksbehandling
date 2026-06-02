import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from '@navikt/ds-react';
import { MeldekortTabellRow } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/meldekorttabellrow/MeldekortTabellRow';
import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';

const meldekortUtenDager: MeldeperiodeMedMeldekortDto = {
  tidligereMeldekort: [],
  meldeperiode: {
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
  meldekort: {
    id: 'meldekort-1',
    journalpostId: '',
    meldeDato: '2025-01-20',
    oppdatertTidspunkt: '2025-01-21',
    oppdatertAv: 'saksbehandler',
    dager: [
      { dato: '2025-01-06', timerArbeidet: 7.5 },
      { dato: '2025-01-07', timerArbeidet: 7.5 },
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

// Tom-dato i fremtiden — kan ikke redigeres
const meldekortFremtidig: MeldeperiodeMedMeldekortDto = {
  tidligereMeldekort: [],
  meldeperiode: {
    fom: '2099-01-06',
    tom: '2099-01-19',
  },
};

function renderRow(meldekort: MeldeperiodeMedMeldekortDto, setSelectedMeldekort = vi.fn(), setIsOpen = vi.fn()) {
  return render(
    <Table>
      <Table.Body>
        <MeldekortTabellRow meldekort={meldekort} setSelectedMeldekort={setSelectedMeldekort} setIsOpen={setIsOpen} />
      </Table.Body>
    </Table>
  );
}

describe('MeldekortTabellRow', () => {
  describe('Ukenummer og datoperiode', () => {
    it('viser riktig ukenummer for perioden', () => {
      renderRow(meldekortUtenDager);
      expect(screen.getByText('Uke 2 - 3')).toBeVisible();
    });

    it('viser datoperioden formatert for frontend', () => {
      renderRow(meldekortUtenDager);
      expect(screen.getByText('06.01.2025 - 19.01.2025')).toBeVisible();
    });
  });

  describe('Timer arbeidet', () => {
    it('viser totalt antall timer arbeidet når dager finnes', () => {
      renderRow(meldekortMedDager);
      // 10 dager * 7.5 = 75 timer
      expect(screen.getByText('75')).toBeVisible();
    });

    it('viser 0 timer arbeidet når alle dager har 0 timer', () => {
      const meldekortNullTimer: MeldeperiodeMedMeldekortDto = {
        ...meldekortMedDager,
        meldekort: {
          ...meldekortMedDager.meldekort!,
          dager: meldekortMedDager.meldekort!.dager.map((d) => ({ ...d, timerArbeidet: 0 })),
        },
      };
      renderRow(meldekortNullTimer);
      expect(screen.getByText('0')).toBeVisible();
    });
  });

  describe('Prosent arbeidet', () => {
    it('viser beregnet prosent når timer finnes', () => {
      renderRow(meldekortMedDager);
      // 75 / 75 * 100 = 100 %
      expect(screen.getByText('100 %')).toBeVisible();
    });

    it('viser "-" for prosent når meldekort mangler dager', () => {
      renderRow(meldekortUtenDager);
      // Forventer minst én "-" i raden
      expect(screen.getAllByText('-').length).toBeGreaterThan(0);
    });
  });

  describe('Levert dato og sist endret', () => {
    it('viser meldedato formatert for frontend', () => {
      renderRow(meldekortMedDager);
      expect(screen.getByText('20.01.2025')).toBeVisible();
    });

    it('viser oppdatertTidspunkt formatert for frontend', () => {
      renderRow(meldekortMedDager);
      expect(screen.getByText('21.01.2025')).toBeVisible();
    });

    it('viser oppdatertAv', () => {
      renderRow(meldekortMedDager);
      expect(screen.getByText('saksbehandler')).toBeVisible();
    });

    it('viser "-" for meldedato når meldekort mangler', () => {
      renderRow(meldekortUtenDager);
      expect(screen.getAllByText('-').length).toBeGreaterThan(0);
    });
  });

  describe('Redigér-knapp', () => {
    it('viser redigér-knapp når meldeperioden er i fortiden', () => {
      renderRow(meldekortUtenDager);
      expect(screen.getByRole('button', { name: 'rediger meldekort' })).toBeVisible();
    });

    it('viser ikke redigér-knapp når meldeperioden er i fremtiden', () => {
      renderRow(meldekortFremtidig);
      expect(screen.queryByRole('button', { name: 'rediger meldekort' })).not.toBeInTheDocument();
    });

    it('kaller setSelectedMeldekort og setIsOpen(true) når redigér-knapp klikkes', async () => {
      const user = userEvent.setup();
      const setSelectedMeldekort = vi.fn();
      const setIsOpen = vi.fn();

      renderRow(meldekortUtenDager, setSelectedMeldekort, setIsOpen);
      await user.click(screen.getByRole('button', { name: 'rediger meldekort' }));

      expect(setSelectedMeldekort).toHaveBeenCalledWith(meldekortUtenDager);
      expect(setIsOpen).toHaveBeenCalledWith(true);
    });
  });
});
