import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientHentHarRegistrertTimerIMeldeperioden } from 'lib/clientApi';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DigitaliserMeldekort,
  ukestartSisteHalvår,
} from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekort';

vi.mock('lib/clientApi', () => ({
  clientHentHarRegistrertTimerIMeldeperioden: vi.fn(),
}));

const user = userEvent.setup();

const ukestarterSisteHalvår = ukestartSisteHalvår();

const oppgave: Oppgave = {
  id: 123,
  personIdent: '12345678910',
  behandlingRef: 'gasg',
  vurderingsbehov: [],
  avklaringsbehovKode: '',
  behandlingOpprettet: '',
  behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
  enhet: '',
  opprettetAv: '',
  opprettetTidspunkt: '',
  status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
  versjon: 0,
  årsakerTilBehandling: [],
  markeringer: [],
  reservertAv: 'navIdent',
  saksnummer: '12345',
};

describe('Validering av mottatt dato på digitalisert meldekort', () => {
  beforeEach(() => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: false },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} oppgave={oppgave} />);
  });

  async function velgToPåfølgendeUker() {
    const combobox = screen.getByRole('combobox', { name: 'Hvilke uker gjelder meldekortet for?' });
    await user.click(combobox);
    const option1 = screen.getByRole('option', { name: ukestarterSisteHalvår[0].label });
    await user.click(option1);

    await user.click(combobox);
    const option2 = screen.getByRole('option', { name: ukestarterSisteHalvår[1].label });
    await user.click(option2);
  }

  async function trykkPåNeste() {
    await user.click(screen.getByRole('button', { name: 'Neste' }));
  }

  it('viser feilmelding når mottatt dato er satt til før siste dag i valgt meldeperiode', async () => {
    await velgToPåfølgendeUker();

    const innsendtDatoInput = screen.getByRole('textbox', { name: 'Dato bruker oppga opplysninger' });
    await user.type(innsendtDatoInput, '01.01.2020');

    await trykkPåNeste();

    expect(await screen.findByText('Mottatt dato kan ikke være før dagen etter valgt meldeperiode.')).toBeVisible();
  });

  it('viser ikke feilmelding når mottatt dato er satt til langt etter valgt meldeperiode', async () => {
    await velgToPåfølgendeUker();

    const innsendtDatoInput = screen.getByRole('textbox', { name: 'Dato bruker oppga opplysninger' });
    await user.type(innsendtDatoInput, '01.01.2999');

    await trykkPåNeste();

    expect(
      screen.queryByText('Mottatt dato kan ikke være før dagen etter valgt meldeperiode.')
    ).not.toBeInTheDocument();
  });

  it('validerer ikke mottatt dato mot meldeperiode når ingen uker er valgt', async () => {
    const innsendtDatoInput = screen.getByRole('textbox', { name: 'Dato bruker oppga opplysninger' });
    await user.type(innsendtDatoInput, '01.01.2020');

    await trykkPåNeste();

    expect(
      screen.queryByText('Mottatt dato kan ikke være før dagen etter valgt meldeperiode.')
    ).not.toBeInTheDocument();
  });
});

describe('Meldekort allerede registrert i Kelvin', () => {
  async function velgToPåfølgendeUker() {
    const combobox = screen.getByRole('combobox', { name: 'Hvilke uker gjelder meldekortet for?' });
    await user.click(combobox);
    const option1 = screen.getByRole('option', { name: ukestarterSisteHalvår[0].label });
    await user.click(option1);

    await user.click(combobox);
    const option2 = screen.getByRole('option', { name: ukestarterSisteHalvår[1].label });
    await user.click(option2);
  }

  it('viser ikke checkbox for registrering i Kelvin når det ikke finnes timer for meldeperioden', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: false },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} oppgave={oppgave} />);

    await velgToPåfølgendeUker();

    expect(
      screen.queryByRole('checkbox', { name: 'Meldekort er allerede registert i Kelvin' })
    ).not.toBeInTheDocument();
  });

  it('viser checkbox for registrering i Kelvin når det allerede finnes timer for meldeperioden', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: true },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} oppgave={oppgave} />);

    await velgToPåfølgendeUker();

    expect(await screen.findByRole('checkbox', { name: 'Meldekort er allerede registert i Kelvin' })).toBeVisible();
  });

  it('skjuler meldeperioder når checkboxen for Kelvin-registrering krysses av', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: true },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} oppgave={oppgave} />);

    await velgToPåfølgendeUker();

    expect((await screen.findAllByRole('spinbutton', { name: 'Arbeidstimer' })).length).toBeGreaterThan(0);

    const checkbox = await screen.findByRole('checkbox', { name: 'Meldekort er allerede registert i Kelvin' });
    await user.click(checkbox);

    expect(screen.queryByRole('spinbutton', { name: 'Arbeidstimer' })).not.toBeInTheDocument();
  });

  it('viser meldeperioder igjen når checkboxen for Kelvin-registrering fjernes', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: true },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} oppgave={oppgave} />);

    await velgToPåfølgendeUker();

    const checkbox = await screen.findByRole('checkbox', { name: 'Meldekort er allerede registert i Kelvin' });
    await user.click(checkbox);
    expect(screen.queryByRole('spinbutton', { name: 'Arbeidstimer' })).not.toBeInTheDocument();

    await user.click(checkbox);
    expect((await screen.findAllByRole('spinbutton', { name: 'Arbeidstimer' })).length).toBeGreaterThan(0);
  });
});
