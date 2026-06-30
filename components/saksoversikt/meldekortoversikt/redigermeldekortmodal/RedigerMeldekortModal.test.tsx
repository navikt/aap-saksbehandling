import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mapFormDataTilOppdaterMeldekortRequest,
  RedigerMeldekortModal,
  Årsaker,
} from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';
import { addDays } from 'date-fns';
import { Dato } from 'lib/types/Dato';
import { customRender } from 'lib/test/CustomRender';

vi.mock('lib/clientApi', () => ({
  clientKorrigerMeldekort: vi.fn().mockResolvedValue({}),
}));

const meldekort: MeldeperiodeMedMeldekortDto = {
  meldepliktStatus: [],
  tidligereMeldekort: [],
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldefrist: '2025-01-21',
  periode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
};

const meldekortMedDager: MeldeperiodeMedMeldekortDto = {
  meldepliktStatus: [],
  tidligereMeldekort: [],
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldefrist: '2025-01-21',
  periode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldekort: {
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
    mottattTidspunkt: '2025-01-20T12:00:00.000Z',
    oppdatertTidspunkt: '2025-01-20T12:00:00.000Z',
  },
};

const meldekortMedNullTimer: MeldeperiodeMedMeldekortDto = {
  meldepliktStatus: [],
  tidligereMeldekort: [],
  meldeperiode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldefrist: '2025-01-21',
  periode: {
    fom: '2025-01-06',
    tom: '2025-01-19',
  },
  meldekort: {
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
    mottattTidspunkt: '2025-01-20T12:00:00.000Z',
    oppdatertTidspunkt: '2025-01-20T12:00:00.000Z',
  },
};

describe('RedigerMeldekortModal', () => {
  const user = userEvent.setup();

  it('viser tittel med riktig ukenummer', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('heading', { name: 'Endre meldekort for uke 2 - 3' })).toBeVisible();
  });

  it('viser datoperioden i dialogen', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByText('06.01.2025 - 19.01.2025')).toBeVisible();
  });

  it('viser begrunnelse-felt', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('textbox', { name: /begrunnelse/i })).toBeVisible();
  });

  it('viser årsak-nedtrekksliste', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('combobox', { name: /årsak/i })).toBeVisible();
  });

  // TODO Ta inn denne igjen når valget er tilbake
  it.skip('inneholder "Registrere at bruker har meldt seg" som årsak-valg', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('option', { name: 'Registrere at bruker har meldt seg' })).toBeInTheDocument();
  });

  it('viser ikke "Meldedato" som label på datofelt – beskrivelse er fjernet', async () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

    expect(screen.queryByText('Meldekortet regnes som levert på denne datoen.')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^meldedato$/i)).not.toBeInTheDocument();
  });

  it('viser Avbryt- og Bekreft-knapper', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeVisible();
  });

  it('viser ikke meldedato eller timer som standard', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    expect(screen.queryByRole('textbox', { name: /meldedato/i })).not.toBeInTheDocument();
    expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
  });

  it('viser meldedato og timerkalender ved årsak "Lever/endre meldekort for bruker"', async () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

    expect(screen.getByLabelText('Dato brukeren meldte opplysningene')).toBeVisible();
    expect(document.getElementById('rapporteringskalender')).toBeInTheDocument();
  });

  // TODO Ta inn denne igjen når valget er tilbake AAP-2320
  it.skip('viser kun meldedato ved årsak "Registrere at bruker har meldt seg"', async () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');

    expect(screen.getByLabelText('Dato brukeren meldte seg for Nav')).toBeVisible();
    expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
  });

  it('viser ikke meldedato eller timerkalender ved årsak "Overstyre bruker"', async () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Overstyre bruker');

    expect(screen.queryByLabelText(/meldedato/i)).not.toBeInTheDocument();
    expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
  });

  it('viser advarsel ved årsak "Overstyre bruker"', async () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Overstyre bruker');

    expect(screen.getByText(/Overstyring av bruker er ikke støttet enda/i)).toBeVisible();
  });

  it('viser feilmelding dersom begrunnelse mangler ved innsending', async () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    const feilmelding = screen.getAllByText('Du må skrive en begrunnelse for hvorfor du gjør endring.')[0];
    expect(feilmelding).toBeVisible();
  });

  it('bruker eksisterende dager fra meldekort dersom de finnes', () => {
    customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
    expect(screen.getByRole('heading', { name: 'Endre meldekort for uke 2 - 3' })).toBeVisible();
  });

  // TODO Ta inn denne igjen når valget er tilbake AAP-2320
  describe.skip('Registrere at bruker har meldt seg', () => {
    it('viser alert "Bruker har ikke levert noen timer" når meldekort mangler', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');

      expect(
        screen.getByText(
          'Bruker har ikke levert noen timer. Det vil ikke gå noen utbetaling før bruker registrerer timer i meldekortet.'
        )
      ).toBeVisible();
      expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
    });

    it('viser alert "Bruker har ikke levert noen timer" når alle dager har 0 timer', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedNullTimer} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');

      expect(
        screen.getByText(
          'Bruker har ikke levert noen timer. Det vil ikke gå noen utbetaling før bruker registrerer timer i meldekortet.'
        )
      ).toBeVisible();
      expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
    });

    it('viser ikke timerkalender selv om bruker har levert timer', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');

      expect(document.getElementById('rapporteringskalender')).not.toBeInTheDocument();
    });

    it('viser ikke alert "Bruker har ikke levert noen timer" når bruker har levert timer', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');

      expect(
        screen.queryByText(
          'Bruker har ikke levert noen timer. Det vil ikke gå noen utbetaling før bruker registrerer timer i meldekortet.'
        )
      ).not.toBeInTheDocument();
    });

    it('viser label "Dato brukeren meldte seg for Nav" på meldedato-feltet', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');

      expect(screen.getByLabelText('Dato brukeren meldte seg for Nav')).toBeVisible();
    });
  });

  describe('Lever/endre meldekort for bruker', () => {
    it('timer-input er redigerbare i kalender', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedDager} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

      const kalender = document.getElementById('rapporteringskalender')!;
      const inputs = kalender.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => expect(input).not.toHaveAttribute('readonly'));
    });

    it('viser label "Dato brukeren meldte opplysningene" på meldedato-feltet', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

      expect(screen.getByLabelText('Dato brukeren meldte opplysningene')).toBeVisible();
    });

    it('viser ikke alert om ingen timer', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

      expect(screen.queryByText('Bruker har ikke levert noen timer.')).not.toBeInTheDocument();
    });
  });

  describe('Validering: meldedato kan ikke være før eksisterende meldekort', () => {
    // mottattTidspunkt = 21.01.2025, som er etter dagenEtterTom (20.01.2025)
    // slik at kun den nye validatoren trigges for datoer mellom 20.01 og 21.01
    const meldekortMedSenereMottattTidspunkt: MeldeperiodeMedMeldekortDto = {
      ...meldekortMedDager,
      meldekort: {
        ...meldekortMedDager.meldekort!,
        mottattTidspunkt: '2025-01-21T12:00:00.000Z',
      },
    };

    const fyllUtOgSubmit = async (meldedato: string) => {
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');
      await user.type(screen.getByLabelText('Dato brukeren meldte opplysningene'), meldedato);
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    };

    it('viser feilmelding når meldedato er før mottattTidspunkt på eksisterende meldekort', async () => {
      customRender(
        <RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedSenereMottattTidspunkt} />
      );
      await fyllUtOgSubmit('20.01.2025'); // etter meldeperiode tom+1, men før mottattTidspunkt

      expect(
        screen.getAllByText('Du har satt en meldedato som er før et eksisterende meldekort for perioden')[0]
      ).toBeVisible();
    });

    it('viser ikke feilmelding når meldedato er lik mottattTidspunkt på eksisterende meldekort', async () => {
      customRender(
        <RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedSenereMottattTidspunkt} />
      );
      await fyllUtOgSubmit('21.01.2025'); // samme dag som mottattTidspunkt

      expect(
        screen.queryByText('Du har satt en meldedato som er før et eksisterende meldekort for perioden')
      ).not.toBeInTheDocument();
    });

    it('viser ikke feilmelding når meldedato er etter mottattTidspunkt på eksisterende meldekort', async () => {
      customRender(
        <RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekortMedSenereMottattTidspunkt} />
      );
      await fyllUtOgSubmit('22.01.2025'); // etter mottattTidspunkt

      expect(
        screen.queryByText('Du har satt en meldedato som er før et eksisterende meldekort for perioden')
      ).not.toBeInTheDocument();
    });

    it('viser ikke feilmelding når det ikke finnes et eksisterende meldekort', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await fyllUtOgSubmit('20.01.2025');

      expect(
        screen.queryByText('Du har satt en meldedato som er før et eksisterende meldekort for perioden')
      ).not.toBeInTheDocument();
    });
  });

  describe('Generering av dager i kalender', () => {
    const åpneKalender = async () => {
      const user = userEvent.setup();
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');
    };

    it('genererer 14 input-felt for en standard 14-dagers periode', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await åpneKalender();

      const kalender = document.getElementById('rapporteringskalender')!;
      expect(kalender.querySelectorAll('input')).toHaveLength(14);
    });

    it('genererer korrekt antall input-felt for en kortere periode', async () => {
      const kortMeldekort: MeldeperiodeMedMeldekortDto = {
        meldefrist: '2025-01-22',
        meldepliktStatus: [],
        tidligereMeldekort: [],
        meldeperiode: { fom: '2025-01-08', tom: '2025-01-14' },
        periode: { fom: '2025-01-08', tom: '2025-01-14' },
      };
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
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
      meldefrist: '2025-01-27',
      meldepliktStatus: [],
      tidligereMeldekort: [],
      meldeperiode: { fom: '2025-01-08', tom: '2025-01-19' },
      periode: { fom: '2025-01-08', tom: '2025-01-19' },
    };

    const åpneKalender = async () => {
      const user = userEvent.setup();
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');
    };

    it('viser dato-tekst for dag utenfor perioden uten input-felt', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
      await åpneKalender();

      expect(screen.getByText('06.01.')).toBeVisible();
      expect(screen.queryByRole('textbox', { name: /arbeid for mandag 6. januar/i })).not.toBeInTheDocument();
    });

    it('viser input-felt for dag innenfor perioden', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
      await åpneKalender();

      expect(screen.getByRole('textbox', { name: /arbeid for onsdag 8. januar/i })).toBeInTheDocument();
    });

    it('viser alle 7 dager i uken selv om bare noen er innenfor perioden', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={kortMeldekort} />);
      await åpneKalender();

      // Uke 1: ma 06.01., ti 07.01. er utenfor — begge skal vises som tekst
      expect(screen.getByText('06.01.')).toBeVisible();
      expect(screen.getByText('07.01.')).toBeVisible();
    });
  });

  // TODO Ta inn denne igjen når valget er tilbake AAP-2320
  describe.skip('Meldedato validering', () => {
    const fyllUtOgSubmit = async (meldedato: string) => {
      await user.type(screen.getByRole('textbox', { name: /begrunnelse/i }), 'Begrunnelse for endring');
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');
      await user.type(screen.getByLabelText('Dato brukeren meldte seg for Nav'), meldedato);
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    };

    it('viser feilmelding når meldedato er før meldeperiodens tom-dato', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await fyllUtOgSubmit('18.01.2025');

      expect(screen.getAllByText('Meldedato må være dagen etter meldeperiodens slutt eller senere.')[0]).toBeVisible();
    });

    it('viser feilmelding når meldedato er etter dagens dato', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await fyllUtOgSubmit(new Dato(addDays(new Date(), 1)).formaterForFrontend());

      expect(screen.getAllByText('Meldedato kan ikke være i fremtiden.')[0]).toBeVisible();
    });
  });

  // TODO Ta inn denne igjen når valget er tilbake AAP-2320
  describe.skip('Advarsel om meldedato etter meldefrist', () => {
    const velgÅrsakOgFyllMeldedato = async (meldedato: string) => {
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');
      await user.type(screen.getByLabelText('Dato brukeren meldte seg for Nav'), meldedato);
    };

    it('viser advarsel når meldedato er etter meldefrist', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await velgÅrsakOgFyllMeldedato('22.01.2025'); // etter meldefrist 2025-01-21

      expect(
        screen.getByText(
          'Du skal kun legge inn faktisk dato brukeren har meldt seg. Hvis det skal vurderes om det er rimelig grunn til at brukeren ikke har meldt seg, så må du opprette revurdering på § 11-10 Overstyr perioder uten oppfylt meldeplikt.'
        )
      ).toBeVisible();
    });

    it('viser ikke advarsel når meldedato er på meldefrist', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await velgÅrsakOgFyllMeldedato('21.01.2025'); // samme dag som meldefrist

      expect(
        screen.queryByText(
          'Du skal kun legge inn faktisk dato brukeren har meldt seg. Hvis det skal vurderes om det er rimelig grunn til at brukeren ikke har meldt seg, så må du opprette revurdering på § 11-10 Overstyr perioder uten oppfylt meldeplikt.'
        )
      ).not.toBeInTheDocument();
    });

    it('viser ikke advarsel når meldedato er før meldefrist', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await velgÅrsakOgFyllMeldedato('20.01.2025'); // før meldefrist 2025-01-21

      expect(
        screen.queryByText(
          'Du skal kun legge inn faktisk dato brukeren har meldt seg. Hvis det skal vurderes om det er rimelig grunn til at brukeren ikke har meldt seg, så må du opprette revurdering på § 11-10 Overstyr perioder uten oppfylt meldeplikt.'
        )
      ).not.toBeInTheDocument();
    });

    it('viser ikke advarsel ved årsak "Lever/endre meldekort for bruker" selv om meldedato er etter meldefrist', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');
      await user.type(screen.getByLabelText('Dato brukeren meldte opplysningene'), '22.01.2025');

      expect(
        screen.queryByText(
          'Du skal kun legge inn faktisk dato brukeren har meldt seg. Hvis det skal vurderes om det er rimelig grunn til at brukeren ikke har meldt seg, så må du opprette revurdering på § 11-10 Overstyr perioder uten oppfylt meldeplikt.'
        )
      ).not.toBeInTheDocument();
    });

    // TODO Ta inn denne igjen når valget er tilbake AAP-2320
    it.skip('viser ikke advarsel når meldedato ikke er fylt inn', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Registrere at bruker har meldt seg');

      expect(
        screen.queryByText(
          'Du skal kun legge inn faktisk dato brukeren har meldt seg. Hvis det skal vurderes om det er rimelig grunn til at brukeren ikke har meldt seg, så må du opprette revurdering på § 11-10 Overstyr perioder uten oppfylt meldeplikt.'
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('skalViseAlertFaktiskMeldedato', () => {
    const alertTekst =
      'Pass på at du legger inn faktisk dato brukeren har meldt opplysningene. Hvis det skal vurderes om det er rimelig grunn til at brukeren ikke har meldt seg, så må du opprette revurdering på § 11-10 Overstyr perioder uten oppfylt meldeplikt.';

    const velgÅrsakOgFyllMeldedato = async (meldedato: string) => {
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');
      await user.type(screen.getByLabelText('Dato brukeren meldte opplysningene'), meldedato);
    };

    it('viser alert når meldedato er før dagens dato', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      const igårDato = new Dato(addDays(new Date(), -1)).formaterForFrontend();
      await velgÅrsakOgFyllMeldedato(igårDato);

      expect(screen.getByText(alertTekst)).toBeVisible();
    });

    it('viser ikke alert når meldedato er dagens dato', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      const dagsDato = new Dato(new Date()).formaterForFrontend();
      await velgÅrsakOgFyllMeldedato(dagsDato);

      expect(screen.queryByText(alertTekst)).not.toBeInTheDocument();
    });

    it('viser ikke alert når meldedato er i fremtiden', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      const morgendagsDato = new Dato(addDays(new Date(), 1)).formaterForFrontend();
      await velgÅrsakOgFyllMeldedato(morgendagsDato);

      expect(screen.queryByText(alertTekst)).not.toBeInTheDocument();
    });

    it('viser ikke alert når meldedato er tomt', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Lever/endre meldekort for bruker');

      expect(screen.queryByText(alertTekst)).not.toBeInTheDocument();
    });

    it('viser ikke alert ved årsak "Overstyre bruker" selv om meldedato er i fortiden', async () => {
      customRender(<RedigerMeldekortModal isOpen={true} setIsOpen={vi.fn()} meldekort={meldekort} />);
      await user.selectOptions(screen.getByRole('combobox', { name: /årsak/i }), 'Overstyre bruker');

      expect(screen.queryByText(alertTekst)).not.toBeInTheDocument();
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
